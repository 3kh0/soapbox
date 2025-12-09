--- in case i forget
--- npx wrangler d1 execute soapbox --local --file=./schema.sql
--- dbs without a orm? yeah im too fucking lazy, lets just hope my backups work

DROP TABLE IF EXISTS posts;
CREATE TABLE IF NOT EXISTS posts (
    slug TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    content TEXT,
    created_at INTEGER,
    updated_at INTEGER,
    published INTEGER DEFAULT 0,
    published_at INTEGER
);

DROP TABLE IF EXISTS updates;
CREATE TABLE IF NOT EXISTS updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    headline TEXT NOT NULL,
    subtext TEXT,
    slack_ts TEXT,
    is_staging INTEGER DEFAULT 0,
    created_at INTEGER
);