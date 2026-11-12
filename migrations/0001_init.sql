PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS site_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  settings_json TEXT NOT NULL,
  stock_json TEXT NOT NULL,
  ledger_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
  phone TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('owner', 'customer')),
  name TEXT NOT NULL,
  pin_salt TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  addresses_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS one_owner_account
  ON accounts(role) WHERE role = 'owner';

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  phone TEXT NOT NULL REFERENCES accounts(phone) ON DELETE CASCADE ON UPDATE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  delivery_date TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  data_json TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS orders_delivery ON orders(delivery_date, status);
CREATE INDEX IF NOT EXISTS orders_phone_created ON orders(phone, created_at DESC);

CREATE TABLE IF NOT EXISTS media (
  media_key TEXT PRIMARY KEY,
  data_url TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_attempts (
  attempt_key TEXT PRIMARY KEY,
  window_started INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  locked_until INTEGER NOT NULL DEFAULT 0
);
