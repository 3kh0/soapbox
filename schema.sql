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

-- Rich markdown example post
INSERT INTO posts (slug, title, description, content, created_at, updated_at) VALUES (
    'quantum-breakthrough',
    'Breakthrough in Quantum Computing Announced',
    'Major milestone demonstrating practical quantum advantage.',
    'Scientists at leading research institutions have unveiled a major milestone in quantum computing, demonstrating a system that achieves practical quantum advantage in solving real-world problems. The breakthrough could reshape computing as we know it.\n\n### Key Highlights\n\n* **New quantum processor operates at 500 stable qubits with 99.9% accuracy**\n* **Successfully solved optimization problems 10,000x faster than classical computers**\n* **Potential applications in drug discovery, materials science, and financial modeling**\n* **Commercial availability expected within 18-24 months**\n\n> "This represents a fundamental shift in computing capabilities. We''re not just incrementally faster—we''re solving previously impossible problems."\n>\n> — Dr. Sarah Chen, Lead Researcher\n\nThe implications extend far beyond the laboratory. Industries ranging from pharmaceuticals to climate modeling stand to benefit enormously from this technological leap. However, experts caution that significant challenges remain in scaling the technology and developing practical applications.\n\n### What This Means\n\nThe quantum computing field has experienced several "breakthroughs" in recent years, but this latest achievement stands apart due to its demonstrated practical applications and exceptional stability metrics. The research team''s method for error correction could prove transformative for the entire industry.',
    1763856000,
    1763856000
);
