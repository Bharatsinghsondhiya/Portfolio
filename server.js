const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

// Helper to read DB
const readDB = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading db.json', err);
        return { portfolio: {}, blogs: [] };
    }
};

// Helper to write DB
const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing to db.json', err);
    }
};

// GET /api/portfolio
app.get('/api/portfolio', (req, res) => {
    const db = readDB();
    res.json(db.portfolio);
});

// PUT /api/portfolio
app.put('/api/portfolio', (req, res) => {
    const db = readDB();
    db.portfolio = { ...db.portfolio, ...req.body };
    writeDB(db);
    res.json(db.portfolio);
});

// GET /api/blogs
app.get('/api/blogs', (req, res) => {
    const db = readDB();
    res.json(db.blogs);
});

// GET /api/blogs/:id
app.get('/api/blogs/:id', (req, res) => {
    const db = readDB();
    const blog = db.blogs.find(b => b.id === req.params.id);
    if (blog) res.json(blog);
    else res.status(404).json({ message: 'Blog not found' });
});

// POST /api/blogs
app.post('/api/blogs', (req, res) => {
    const db = readDB();
    const newBlog = req.body;
    // Generate simple ID if not provided
    if (!newBlog.id) {
        newBlog.id = newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    db.blogs.unshift(newBlog); // Add to top
    writeDB(db);
    res.status(201).json(newBlog);
});

// PUT /api/blogs/:id
app.put('/api/blogs/:id', (req, res) => {
    const db = readDB();
    const index = db.blogs.findIndex(b => b.id === req.params.id);
    if (index !== -1) {
        db.blogs[index] = { ...db.blogs[index], ...req.body, id: req.params.id };
        writeDB(db);
        res.json(db.blogs[index]);
    } else {
        res.status(404).json({ message: 'Blog not found' });
    }
});

// DELETE /api/blogs/:id
app.delete('/api/blogs/:id', (req, res) => {
    const db = readDB();
    const index = db.blogs.findIndex(b => b.id === req.params.id);
    if (index !== -1) {
        const deleted = db.blogs.splice(index, 1);
        writeDB(db);
        res.json(deleted[0]);
    } else {
        res.status(404).json({ message: 'Blog not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
