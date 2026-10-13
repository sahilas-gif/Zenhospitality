import os
import sqlite3
import subprocess
import sys
import tempfile

import pytest

BACKEND = os.path.dirname(os.path.dirname(__file__))

LEGACY = """
CREATE TABLE users (id INTEGER PRIMARY KEY, username VARCHAR, email VARCHAR, hashed_password VARCHAR,
  is_active BOOLEAN, is_admin BOOLEAN, created_at DATETIME);
CREATE TABLE packages (id INTEGER PRIMARY KEY, title VARCHAR, slug VARCHAR, description TEXT, category VARCHAR,
  destination VARCHAR, duration_days INTEGER, price_from FLOAT, price_to FLOAT, highlights JSON, images JSON,
  is_featured BOOLEAN, created_at DATETIME);
CREATE TABLE enquiries (id INTEGER PRIMARY KEY, package_id INTEGER, custom_itinerary JSON, customer_name VARCHAR,
  customer_phone VARCHAR, travel_date VARCHAR, group_size INTEGER, message TEXT, status VARCHAR, created_at DATETIME);
CREATE TABLE ai_itineraries (id INTEGER PRIMARY KEY, prompt TEXT, destination VARCHAR, duration_days INTEGER,
  budget VARCHAR, itinerary_data JSON, created_at DATETIME);
INSERT INTO enquiries (customer_name, customer_phone, status) VALUES ('Legacy', '999', 'new');
"""


def run(db, *args):
    env = {**os.environ, "DATABASE_URL": f"sqlite+aiosqlite:///{db}"}
    return subprocess.run([sys.executable, "-m", "app.migrations", *args], cwd=BACKEND, env=env,
                          capture_output=True, text=True)


@pytest.fixture
def legacy_db():
    d = tempfile.mkdtemp()
    db = os.path.join(d, "prod.db")
    con = sqlite3.connect(db)
    con.executescript(LEGACY)
    con.close()
    return d, db


def test_refuses_wrong_database(legacy_db):
    d, db = legacy_db
    r = run(db, "--apply", "--expect-db", os.path.join(d, "other.db"))
    assert r.returncode != 0 and "Refusing" in (r.stderr + r.stdout)
    assert run(db, "--apply").returncode != 0


def test_upgrades_legacy_schema_idempotently(legacy_db):
    d, db = legacy_db
    assert "Pending" in run(db, "--check").stdout
    r = run(db, "--apply", "--expect-db", db, "--backup-dir", os.path.join(d, "bk"))
    assert r.returncode == 0, r.stderr
    assert any(f.endswith(".db") for f in os.listdir(os.path.join(d, "bk")))

    con = sqlite3.connect(db)
    cols = {row[1] for row in con.execute("PRAGMA table_info(enquiries)")}
    assert {"hotel_id", "hotel_name", "check_in", "enquiry_type"} <= cols
    assert con.execute("SELECT customer_name FROM enquiries").fetchone()[0] == "Legacy"
    tables = {r[0] for r in con.execute("SELECT name FROM sqlite_master WHERE type='table'")}
    assert {"hotels", "page_contents", "schema_migrations"} <= tables
    con.close()

    again = run(db, "--apply", "--expect-db", db, "--backup-dir", os.path.join(d, "bk"))
    assert again.returncode == 0 and "Up to date" in again.stdout
