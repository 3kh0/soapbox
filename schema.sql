DROP TABLE IF EXISTS posts;
CREATE TABLE IF NOT EXISTS posts (
    slug TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    created_at INTEGER
);
INSERT INTO posts (slug, title, content, created_at) VALUES ('hello-world', 'Hello World', 'This is the first post from D1! It is working.', 1732312000);
