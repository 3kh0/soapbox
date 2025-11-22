DROP TABLE IF EXISTS posts;
CREATE TABLE IF NOT EXISTS posts (
    slug TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    content TEXT,
    created_at INTEGER,
    updated_at INTEGER
);

INSERT INTO posts (slug, title, description, content, created_at, updated_at) VALUES 
(
    'hello-world', 
    'Hello World', 
    'testing testing is this thing on?', 
    '# Hello World

This is the **first** post from D1! 

We also got some pretty epic **rich markdown** support!',
    1732312000, 
    1732312000
),
(
    'jenin',
    'jenin smells like poo poo',
    'jenin smells like poo poo',
    '# Jenin

Gosh he smells so bad! Here are a few examples on why

- Jenin smells like poo poo
- Enough said',
    1732320000,
    1732320000
);

-- Rich markdown example post
INSERT INTO posts (slug, title, description, content, created_at, updated_at) VALUES (
    'quantum-breakthrough',
    'Breakthrough in Quantum Computing Announced',
    'Major milestone demonstrating practical quantum advantage.',
    'Scientists at leading research institutions have unveiled a major milestone in quantum computing, demonstrating a system that achieves practical quantum advantage in solving real-world problems. The breakthrough could reshape computing as we know it.

## Key Points

- The breakthrough is a major milestone in the field of quantum computing.
- The breakthrough could reshape computing as we know it.',
    1763856000,
    1763856000
);

DROP TABLE IF EXISTS updates;
CREATE TABLE IF NOT EXISTS updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    created_at INTEGER
);

INSERT INTO updates (content, created_at) VALUES 
('Something happened', 1763834827), -- 3m ago (relative to base time)
('Something else happened before', 1763833827), -- 23m ago
('This is crazy but its old news', 1763823827), -- 2h ago
('Something way long ago', 1762833827); -- 3d ago
