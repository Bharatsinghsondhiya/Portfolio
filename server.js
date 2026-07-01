const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Helper to read DB
const readDB = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading db.json', err);
        return { portfolio: {}, blogs: [], projects: [], messages: [] };
    }
};

// Helper to write DB
const writeDB = (data) => {
    try {
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
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
    if (!newBlog.title) {
        return res.status(400).json({ message: 'Title is required for a new blog.' });
    }
    // Generate simple ID if not provided
    if (!newBlog.id) {
        let baseId = newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        let id = baseId;
        let counter = 1;
        while (db.blogs.some(b => b.id === id)) {
            id = `${baseId}-${counter++}`;
        }
        newBlog.id = id;
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

// GET /api/projects
app.get('/api/projects', (req, res) => {
    const db = readDB();
    // sort by order if available
    const projects = db.projects || [];
    res.json(projects.sort((a, b) => (a.order || 0) - (b.order || 0)));
});

// POST /api/projects
app.post('/api/projects', (req, res) => {
    const db = readDB();
    if (!db.projects) db.projects = [];
    const newProj = req.body;
    if (!newProj.title) {
        return res.status(400).json({ message: 'Title is required for a new project.' });
    }
    if (!newProj.id) {
        newProj.id = newProj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    db.projects.push(newProj);
    writeDB(db);
    res.status(201).json(newProj);
});

// PUT /api/projects/:id
app.put('/api/projects/:id', (req, res) => {
    const db = readDB();
    if (!db.projects) db.projects = [];
    const index = db.projects.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        db.projects[index] = { ...db.projects[index], ...req.body, id: req.params.id };
        writeDB(db);
        res.json(db.projects[index]);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

// DELETE /api/projects/:id
app.delete('/api/projects/:id', (req, res) => {
    const db = readDB();
    if (!db.projects) db.projects = [];
    const index = db.projects.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        const deleted = db.projects.splice(index, 1);
        writeDB(db);
        res.json(deleted[0]);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

// GET /api/messages
app.get('/api/messages', (req, res) => {
    const db = readDB();
    res.json(db.messages || []);
});

// POST /api/messages
app.post('/api/messages', (req, res) => {
    const db = readDB();
    if (!db.messages) db.messages = [];
    const newMsg = { ...req.body, id: Date.now().toString(), date: new Date().toISOString() };
    db.messages.unshift(newMsg);
    writeDB(db);
    res.status(201).json(newMsg);
});

// DELETE /api/messages/:id
app.delete('/api/messages/:id', (req, res) => {
    const db = readDB();
    if (!db.messages) db.messages = [];
    const index = db.messages.findIndex(m => m.id === req.params.id);
    if (index !== -1) {
        const deleted = db.messages.splice(index, 1);
        writeDB(db);
        res.json(deleted[0]);
    } else {
        res.status(404).json({ message: 'Message not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
