const API_BASE = 'http://localhost:3000/api';
console.log("AdminOS Interface Initialized.");

// --- State ---
let blogs = [];
let projects = [];
let messages = [];
let portfolio = {};

// --- DOM Elements ---
const navItems = document.querySelectorAll('.nav-item[data-view]');
const viewSections = document.querySelectorAll('.view-section');

const statBlogsCount = document.getElementById('stat-blogs-count');
const statProjectsCount = document.getElementById('stat-projects-count');
const statMessagesCount = document.getElementById('stat-messages-count');

// Portfolio Form
const portfolioForm = document.getElementById('portfolio-form');
const portTitle = document.getElementById('port-title');
const portSubtitle = document.getElementById('port-subtitle');
const portHeroTitle = document.getElementById('port-hero-title');
const portHeroDesc = document.getElementById('port-hero-desc');

// Blogs View
const blogsList = document.getElementById('blogs-list');
const btnNewBlog = document.getElementById('btn-new-blog');

// Modal
const blogModal = document.getElementById('blog-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const blogForm = document.getElementById('blog-form');
const modalTitle = document.getElementById('modal-title');

// Blog Form Inputs
const blogIdInput = document.getElementById('blog-id');
const blogTitleInput = document.getElementById('blog-title-input');
const blogDateInput = document.getElementById('blog-date-input');
const blogTagInput = document.getElementById('blog-tag-input');
const blogImgInput = document.getElementById('blog-img-input');
const blogContentInput = document.getElementById('blog-content-input');

// Projects View
const projectsList = document.getElementById('projects-list');
const btnNewProject = document.getElementById('btn-new-project');
const projectModal = document.getElementById('project-modal');
const btnCloseProjectModal = document.getElementById('btn-close-project-modal');
const btnCancelProjectModal = document.getElementById('btn-cancel-project-modal');
const projectForm = document.getElementById('project-form');
const projectModalTitle = document.getElementById('project-modal-title');

// Project Form Inputs
const projIdInput = document.getElementById('proj-id');
const projTitleInput = document.getElementById('proj-title-input');
const projStatusInput = document.getElementById('proj-status-input');
const projStatusClassInput = document.getElementById('proj-statusclass-input');
const projTagsInput = document.getElementById('proj-tags-input');
const projOrderInput = document.getElementById('proj-order-input');
const projDescInput = document.getElementById('proj-desc-input');

// Messages View
const messagesList = document.getElementById('messages-list');

// Toast
const toastEl = document.getElementById('toast');


// --- Navigation ---
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = item.getAttribute('data-view');
        
        // Update active nav
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        // Show view
        viewSections.forEach(s => s.classList.remove('active'));
        document.getElementById(`view-${viewId}`).classList.add('active');
    });
});


// --- Utilities ---
function showToast(message, isError = false) {
    toastEl.textContent = message;
    toastEl.className = 'toast';
    if (isError) toastEl.classList.add('error');
    
    // Trigger reflow
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}


// --- API Calls & Initialization ---
async function init() {
    try {
        await Promise.all([
            fetchPortfolio(),
            fetchBlogs(),
            fetchProjects(),
            fetchMessages()
        ]);
        showToast('System synced successfully');
    } catch (err) {
        showToast('Failed to connect to server. Is it running?', true);
    }
}

async function fetchPortfolio() {
    const res = await fetch(`${API_BASE}/portfolio`);
    if (!res.ok) throw new Error('Failed to fetch portfolio');
    portfolio = await res.json();
    
    // Populate form
    portTitle.value = portfolio.title || '';
    portSubtitle.value = portfolio.subtitle || '';
    portHeroTitle.value = portfolio.hero_title || '';
    portHeroDesc.value = portfolio.hero_desc || '';
}

async function fetchBlogs() {
    const res = await fetch(`${API_BASE}/blogs`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    blogs = await res.json();
    
    // Update dashboard stats
    if(statBlogsCount) statBlogsCount.textContent = blogs.length;
    
    renderBlogsList();
}

async function fetchProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    projects = await res.json();
    
    if(statProjectsCount) statProjectsCount.textContent = projects.length;
    renderProjectsList();
}

async function fetchMessages() {
    const res = await fetch(`${API_BASE}/messages`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    messages = await res.json();
    
    if(statMessagesCount) statMessagesCount.textContent = messages.length;
    renderMessagesList();
}


// --- Portfolio Logic ---
portfolioForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updated = {
        title: portTitle.value,
        subtitle: portSubtitle.value,
        hero_title: portHeroTitle.value,
        hero_desc: portHeroDesc.value
    };

    try {
        const res = await fetch(`${API_BASE}/portfolio`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
        if (res.ok) {
            showToast('Portfolio settings saved');
        } else {
            throw new Error();
        }
    } catch (err) {
        showToast('Failed to save settings', true);
    }
});


// --- Blogs Logic ---

function renderBlogsList() {
    blogsList.innerHTML = '';
    
    if (blogs.length === 0) {
        blogsList.innerHTML = '<p style="color: var(--text-muted)">No blogs found.</p>';
        return;
    }

    blogs.forEach(blog => {
        const div = document.createElement('div');
        div.className = 'blog-list-item';
        div.innerHTML = `
            <div class="blog-list-info">
                <h3>${blog.title}</h3>
                <p>${blog.date} &bull; ${blog.tag}</p>
            </div>
            <div class="blog-list-actions">
                <button class="btn btn-secondary btn-edit" data-id="${blog.id}">Edit</button>
                <button class="btn btn-danger btn-delete" data-id="${blog.id}">Delete</button>
            </div>
        `;
        blogsList.appendChild(div);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => openBlogModal(btn.getAttribute('data-id')));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteBlog(btn.getAttribute('data-id')));
    });
}

function openBlogModal(blogId = null) {
    if (blogId) {
        // Edit mode
        modalTitle.textContent = 'Edit Blog Post';
        const blog = blogs.find(b => b.id === blogId);
        blogIdInput.value = blog.id;
        blogTitleInput.value = blog.title;
        blogDateInput.value = blog.date;
        blogTagInput.value = blog.tag;
        blogImgInput.value = blog.img;
        blogContentInput.value = blog.content;
    } else {
        // Create mode
        modalTitle.textContent = 'Create New Post';
        blogForm.reset();
        blogIdInput.value = '';
    }
    blogModal.classList.add('active');
}

function closeBlogModal() {
    blogModal.classList.remove('active');
}

btnNewBlog.addEventListener('click', () => openBlogModal());
btnCloseModal.addEventListener('click', closeBlogModal);
btnCancelModal.addEventListener('click', closeBlogModal);

blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const blogData = {
        title: blogTitleInput.value,
        date: blogDateInput.value,
        tag: blogTagInput.value,
        img: blogImgInput.value,
        content: blogContentInput.value
    };

    const id = blogIdInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/blogs/${id}` : `${API_BASE}/blogs`;

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(blogData)
        });
        
        if (res.ok) {
            showToast(id ? 'Blog updated' : 'Blog created');
            closeBlogModal();
            fetchBlogs(); // Refresh list
        } else {
            throw new Error();
        }
    } catch (err) {
        showToast('Failed to save blog post', true);
    }
});

async function deleteBlog(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
        const res = await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Blog deleted');
            fetchBlogs(); // Refresh list
        } else {
            throw new Error();
        }
    } catch (err) {
        showToast('Failed to delete post', true);
    }
}

// --- Projects Logic ---

function renderProjectsList() {
    if (!projectsList) return;
    projectsList.innerHTML = '';
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<p style="color: var(--text-muted)">No projects found.</p>';
        return;
    }

    projects.forEach(proj => {
        const div = document.createElement('div');
        div.className = 'blog-list-item';
        div.innerHTML = `
            <div class="blog-list-info">
                <h3>${proj.title} <span style="font-size: 12px; color: gray;">(Order: ${proj.order || 0})</span></h3>
                <p>${proj.status} &bull; ${proj.tags ? proj.tags.join(', ') : ''}</p>
            </div>
            <div class="blog-list-actions">
                <button class="btn btn-secondary btn-edit-proj" data-id="${proj.id}">Edit</button>
                <button class="btn btn-danger btn-delete-proj" data-id="${proj.id}">Delete</button>
            </div>
        `;
        projectsList.appendChild(div);
    });

    document.querySelectorAll('.btn-edit-proj').forEach(btn => {
        btn.addEventListener('click', () => openProjectModal(btn.getAttribute('data-id')));
    });
    document.querySelectorAll('.btn-delete-proj').forEach(btn => {
        btn.addEventListener('click', () => deleteProject(btn.getAttribute('data-id')));
    });
}

function openProjectModal(projId = null) {
    if (projId) {
        projectModalTitle.textContent = 'Edit Project';
        const proj = projects.find(p => p.id === projId);
        projIdInput.value = proj.id;
        projTitleInput.value = proj.title;
        projStatusInput.value = proj.status;
        projStatusClassInput.value = proj.statusClass || 'active';
        projTagsInput.value = proj.tags ? proj.tags.join(', ') : '';
        projOrderInput.value = proj.order || 0;
        projDescInput.value = proj.description || '';
    } else {
        projectModalTitle.textContent = 'Create New Project';
        projectForm.reset();
        projIdInput.value = '';
    }
    projectModal.classList.add('active');
}

function closeProjectModal() {
    projectModal.classList.remove('active');
}

if (btnNewProject) btnNewProject.addEventListener('click', () => openProjectModal());
if (btnCloseProjectModal) btnCloseProjectModal.addEventListener('click', closeProjectModal);
if (btnCancelProjectModal) btnCancelProjectModal.addEventListener('click', closeProjectModal);

if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const projData = {
            title: projTitleInput.value,
            status: projStatusInput.value,
            statusClass: projStatusClassInput.value,
            tags: projTagsInput.value.split(',').map(t => t.trim()),
            order: parseInt(projOrderInput.value, 10) || 0,
            description: projDescInput.value
        };

        const id = projIdInput.value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/projects/${id}` : `${API_BASE}/projects`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projData)
            });
            
            if (res.ok) {
                showToast(id ? 'Project updated' : 'Project created');
                closeProjectModal();
                fetchProjects();
            } else {
                throw new Error();
            }
        } catch (err) {
            showToast('Failed to save project', true);
        }
    });
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
        const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Project deleted');
            fetchProjects();
        } else {
            throw new Error();
        }
    } catch (err) {
        showToast('Failed to delete project', true);
    }
}

// --- Messages Logic ---

function renderMessagesList() {
    if (!messagesList) return;
    messagesList.innerHTML = '';
    
    if (messages.length === 0) {
        messagesList.innerHTML = '<p style="color: var(--text-muted)">No messages found.</p>';
        return;
    }

    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'blog-list-item';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'flex-start';
        div.style.gap = '10px';
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <div class="blog-list-info">
                    <h3>${msg.name} <span style="font-size: 14px; font-weight: normal; color: var(--text-muted);">&lt;${msg.email}&gt;</span></h3>
                    <p>${new Date(msg.date).toLocaleString()}</p>
                </div>
                <div class="blog-list-actions">
                    <button class="btn btn-danger btn-delete-msg" data-id="${msg.id}">Delete</button>
                </div>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; width: 100%;">
                <p style="margin: 0;">${msg.message}</p>
            </div>
        `;
        messagesList.appendChild(div);
    });

    document.querySelectorAll('.btn-delete-msg').forEach(btn => {
        btn.addEventListener('click', () => deleteMessage(btn.getAttribute('data-id')));
    });
}

async function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
        const res = await fetch(`${API_BASE}/messages/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Message deleted');
            fetchMessages();
        } else {
            throw new Error();
        }
    } catch (err) {
        showToast('Failed to delete message', true);
    }
}

// Boot
init();
