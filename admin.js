const API_BASE = 'http://localhost:3000/api';

// --- State ---
let blogs = [];
let portfolio = {};

// --- DOM Elements ---
const navItems = document.querySelectorAll('.nav-item[data-view]');
const viewSections = document.querySelectorAll('.view-section');

const statBlogsCount = document.getElementById('stat-blogs-count');

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
            fetchBlogs()
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
    statBlogsCount.textContent = blogs.length;
    
    renderBlogsList();
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

// Boot
init();
