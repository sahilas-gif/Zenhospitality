#!/usr/bin/env python3
"""Apply a Zen backend zip on cPanel without nesting app/app.

Run from the Python app root (the folder that contains passenger_wsgi.py),
normally /home/zenhospi/test_api:

    python cpanel_update.py --check  backend_update.zip
    python cpanel_update.py --apply  backend_update.zip
    python cpanel_update.py --rollback

--apply copies the current tree aside, extracts the zip, runs migrations
against the SQLite file named below, seeds partner hotels, then touches
tmp/restart.txt. --rollback restores the newest backup directory.
"""
import argparse
import os
import shutil
import sqlite3
import subprocess
import sys
import zipfile
from datetime import datetime

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.environ.get("ZEN_DB", os.path.join(APP_ROOT, "zenhospitality.db"))
BACKUP_ROOT = os.path.join(APP_ROOT, "zen-backups")


def refuse_nested():
    if os.path.basename(APP_ROOT) == "app" and os.path.isdir(os.path.join(APP_ROOT, "app")):
        raise SystemExit("Refusing to run inside a nested app/app directory.")


def check_zip(path):
    with zipfile.ZipFile(path) as zf:
        names = zf.namelist()
    if any(n.startswith("app/app/") or n.startswith("/") for n in names):
        raise SystemExit("Zip would create a nested app/app or absolute paths. Aborting.")
    if "passenger_wsgi.py" not in names or "app/main.py" not in names:
        raise SystemExit("Zip is missing passenger_wsgi.py or app/main.py.")
    print(f"Zip ok: {len(names)} files")


def snapshot():
    os.makedirs(BACKUP_ROOT, exist_ok=True)
    dest = os.path.join(BACKUP_ROOT, datetime.now().strftime("code-%Y%m%d-%H%M%S"))
    os.makedirs(dest)
    for name in ("app", "passenger_wsgi.py", "seed_data.py", "seed_hotels.py"):
        src = os.path.join(APP_ROOT, name)
        if os.path.exists(src):
            target = os.path.join(dest, name)
            if os.path.isdir(src):
                shutil.copytree(src, target)
            else:
                shutil.copy2(src, target)
    if os.path.isfile(DB_PATH):
        shutil.copy2(DB_PATH, os.path.join(dest, "zenhospitality.db"))
    print(f"Backup: {dest}")
    return dest


def apply(zip_path):
    refuse_nested()
    check_zip(zip_path)
    if not os.path.isfile(DB_PATH):
        raise SystemExit(f"SQLite database not found at {DB_PATH}")
    sqlite3.connect(DB_PATH).execute("SELECT 1")
    snapshot()
    with zipfile.ZipFile(zip_path) as zf:
        zf.extractall(APP_ROOT)
    env = os.environ.copy()
    subprocess.check_call([sys.executable, "-m", "app.migrations", "--apply", "--expect-db", DB_PATH], cwd=APP_ROOT, env=env)
    subprocess.check_call([sys.executable, "seed_hotels.py"], cwd=APP_ROOT, env=env)
    restart = os.path.join(APP_ROOT, "tmp", "restart.txt")
    os.makedirs(os.path.dirname(restart), exist_ok=True)
    open(restart, "a").close()
    os.utime(restart, None)
    print("Applied. Passenger restart touched.")


def rollback():
    refuse_nested()
    backups = sorted(d for d in os.listdir(BACKUP_ROOT) if d.startswith("code-")) if os.path.isdir(BACKUP_ROOT) else []
    if not backups:
        raise SystemExit("No backup to roll back.")
    src = os.path.join(BACKUP_ROOT, backups[-1])
    for name in ("app", "passenger_wsgi.py", "seed_data.py", "seed_hotels.py"):
        backed = os.path.join(src, name)
        live = os.path.join(APP_ROOT, name)
        if not os.path.exists(backed):
            continue
        if os.path.isdir(live):
            shutil.rmtree(live)
        elif os.path.exists(live):
            os.remove(live)
        if os.path.isdir(backed):
            shutil.copytree(backed, live)
        else:
            shutil.copy2(backed, live)
    db = os.path.join(src, "zenhospitality.db")
    if os.path.isfile(db):
        shutil.copy2(db, DB_PATH)
    print(f"Restored {src}")


def main():
    # cPanel's "Run Script" box executes the file and drops extra arguments,
    # so a bare run applies the zip sitting next to this script.
    if len(sys.argv) == 1:
        apply(os.path.join(APP_ROOT, "backend_update.zip"))
        return
    p = argparse.ArgumentParser()
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--check")
    g.add_argument("--apply")
    g.add_argument("--rollback", action="store_true")
    args = p.parse_args()
    if args.check:
        check_zip(args.check)
    elif args.apply:
        apply(args.apply)
    else:
        rollback()


if __name__ == "__main__":
    main()
