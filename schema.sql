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
    'My first post showing off the new system', 
    '# Hello World\n\nThis is the **first** post from D1! It is working with *markdown* rendering server side.', 
    1732312000, 
    1732312000
),
(
    'features',
    'Features of Soapbox',
    'A list of what Soapbox can do',
    '# Features
    
    Server Side Rendering
    - D1 Database
    - Markdown Support
    - Fast!',
    1732320000,
    1732320000
);
