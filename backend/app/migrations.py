"""Additive, idempotent schema migrations.

    python -m app.migrations --check                    # show pending steps, change nothing
    python -m app.migrations --apply --expect-db PATH   # back up, then apply

--expect-db is the SQLite file path (or the PostgreSQL database name) the
connection must point at; anything else aborts before touching data.
Migrations only create tables and add nullable columns, never drop or rewrite.
"""
import argparse
import asyncio
import json
import os
import sqlite3
import sys
from datetime import datetime, timezone

from sqlalchemy import inspect, text
from sqlalchemy.engine import make_url

from app.database import Base, engine
import app.models  # noqa: F401  (registers tables on Base)

ENQUIRY_COLUMNS = {
    "enquiry_type": "VARCHAR",
    "hotel_id": "INTEGER REFERENCES hotels(id) ON DELETE SET NULL",
    "hotel_name": "VARCHAR",
    "hotel_slug": "VARCHAR",
    "hotel_city": "VARCHAR",
    "room_type": "VARCHAR",
    "customer_email": "VARCHAR",
    "check_in": "VARCHAR",
    "check_out": "VARCHAR",
    "adults": "INTEGER",
    "children": "INTEGER",
    "rooms": "INTEGER",
    "itinerary_id": "INTEGER",
    "source_page": "VARCHAR",
}


def _create_missing_tables(sync_conn):
    existing = set(inspect(sync_conn).get_table_names())
    missing = [t for name, t in Base.metadata.tables.items() if name not in existing]
    Base.metadata.create_all(sync_conn, tables=missing)
    return [t.name for t in missing]


def _add_enquiry_columns(sync_conn):
    have = {c["name"] for c in inspect(sync_conn).get_columns("enquiries")}
    added = []
    for name, ddl in ENQUIRY_COLUMNS.items():
        if name not in have:
            sync_conn.execute(text(f"ALTER TABLE enquiries ADD COLUMN {name} {ddl}"))
            added.append(name)
    for idx, col in (("ix_enquiries_enquiry_type", "enquiry_type"), ("ix_enquiries_hotel_id", "hotel_id")):
        sync_conn.execute(text(f"CREATE INDEX IF NOT EXISTS {idx} ON enquiries ({col})"))
    return added


MIGRATIONS = [
    (1, "create missing tables (hotels, page_contents, ...)", _create_missing_tables),
    (2, "enquiry hotel/booking columns", _add_enquiry_columns),
]


def _ensure_ledger(sync_conn):
    sync_conn.execute(text(
        "CREATE TABLE IF NOT EXISTS schema_migrations ("
        "version INTEGER PRIMARY KEY, name VARCHAR NOT NULL, applied_at VARCHAR NOT NULL)"
    ))


def _applied(sync_conn) -> set:
    if "schema_migrations" not in inspect(sync_conn).get_table_names():
        return set()
    return {r[0] for r in sync_conn.execute(text("SELECT version FROM schema_migrations"))}


def db_identity() -> tuple:
    url = make_url(str(engine.url))
    if url.get_backend_name() == "sqlite":
        return "sqlite", os.path.realpath(url.database or "")
    return url.get_backend_name(), url.database


def check_identity(expected: str) -> None:
    kind, ident = db_identity()
    want = os.path.realpath(expected) if kind == "sqlite" else expected
    if ident != want:
        raise SystemExit(f"Refusing to migrate: connected to {kind} '{ident}', expected '{want}'.")
    if kind == "sqlite" and not os.path.isfile(ident):
        raise SystemExit(f"Refusing to migrate: SQLite file '{ident}' does not exist.")


async def backup(dest_dir: str) -> str:
    os.makedirs(dest_dir, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    kind, ident = db_identity()
    if kind == "sqlite":
        dest = os.path.join(dest_dir, f"zenhospitality-{stamp}.db")
        src = sqlite3.connect(ident)
        try:
            out = sqlite3.connect(dest)
            with out:
                src.backup(out)
            out.close()
        finally:
            src.close()
        return dest

    dest = os.path.join(dest_dir, f"zenhospitality-{stamp}.json")
    dump = {}
    async with engine.connect() as conn:
        tables = await conn.run_sync(lambda c: inspect(c).get_table_names())
        for t in tables:
            rows = (await conn.execute(text(f'SELECT * FROM "{t}"'))).mappings().all()
            dump[t] = [dict(r) for r in rows]
    with open(dest, "w", encoding="utf-8") as f:
        json.dump(dump, f, default=str)
    return dest


async def pending() -> list:
    async with engine.connect() as conn:
        done = await conn.run_sync(_applied)
    return [(v, n) for v, n, _ in MIGRATIONS if v not in done]


async def apply() -> list:
    results = []
    async with engine.begin() as conn:
        await conn.run_sync(_ensure_ledger)
        done = await conn.run_sync(_applied)
        for version, name, fn in MIGRATIONS:
            if version in done:
                continue
            detail = await conn.run_sync(fn)
            await conn.execute(
                text("INSERT INTO schema_migrations (version, name, applied_at) VALUES (:v, :n, :t)"),
                {"v": version, "n": name, "t": datetime.now(timezone.utc).isoformat()},
            )
            results.append((version, name, detail))
    return results


async def main(argv=None) -> int:
    p = argparse.ArgumentParser()
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--check", action="store_true")
    g.add_argument("--apply", action="store_true")
    p.add_argument("--expect-db", help="SQLite path or PostgreSQL database name")
    p.add_argument("--backup-dir", default="backups")
    p.add_argument("--no-backup", action="store_true", help="only for throwaway local databases")
    args = p.parse_args(argv)

    kind, ident = db_identity()
    print(f"Database: {kind} {ident}")
    if args.expect_db:
        check_identity(args.expect_db)
    elif args.apply:
        raise SystemExit("--apply requires --expect-db")

    todo = await pending()
    if args.check:
        print("Pending:" if todo else "Up to date.")
        for v, n in todo:
            print(f"  {v}: {n}")
        await engine.dispose()
        return 0

    if todo and not args.no_backup and (kind != "sqlite" or os.path.isfile(ident)):
        print(f"Backup: {await backup(args.backup_dir)}")
    for v, n, detail in await apply():
        print(f"Applied {v}: {n} {detail or ''}")
    if not todo:
        print("Up to date.")
    await engine.dispose()
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
