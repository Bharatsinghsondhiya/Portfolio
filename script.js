console.log("%c Welcome to Bharat's Developer Console! ", "background: #222; color: #06b6d4; font-size: 14px;");

// Global DOM Elements
const telemetryLogEl = document.getElementById('telemetry-log');
const cmdMenuEl = document.getElementById('cmd-menu');
const cmdInputEl = document.getElementById('cmd-input');
const cmdResultsEl = document.getElementById('cmd-results');
const projectDrawerEl = document.getElementById('project-drawer');
const drawerTitleEl = document.getElementById('drawer-project-title');
const drawerContentEl = document.getElementById('drawer-project-content');
const techDetailCard = document.getElementById('tech-detail-card');
const techNameEl = document.getElementById('tech-detail-name');
const techXpEl = document.getElementById('tech-detail-xp');
const techDescEl = document.getElementById('tech-detail-desc');
const toastEl = document.getElementById('toast');
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

// 1. Simulated Telemetry Log (Hero Mock Code Editor Console)
const logMessages = [
    "Listening for routing events... Connected to PostgreSQL pool.",
    "GET /api/v1/telemetry - 200 OK (11ms)",
    "API gateway successfully routed payload to Redis session store.",
    "Running silent verification: token validated successfully.",
    "cron: dispatching daily progress report payload... success.",
    "Warning: MongoDB cursor timeout potential. Optimization recommended.",
    "Socket state synchronized. 4 channels active.",
    "PR approved: @lead-product merged auth controller changes.",
    "Telemetry test loops execution: 100% verified.",
    "Uptime checked. System health: EXCELLENT."
];

let logIndex = 0;
function updateTelemetryLog() {
    if (!telemetryLogEl) return;
    
    const message = logMessages[logIndex];
    const timestamp = new Date().toLocaleTimeString();
    
    // Add warning styling if the log is a warning
    let textClass = 'text-muted';
    if (message.includes('Warning')) {
        textClass = 'text-warning';
    } else if (message.includes('success') || message.includes('verified') || message.includes('200 OK')) {
        textClass = 'text-success';
    }
    
    telemetryLogEl.innerHTML = `<span class="console-prompt">&gt;</span> <span class="console-text ${textClass}">[${timestamp}] ${message}</span>`;
    
    logIndex = (logIndex + 1) % logMessages.length;
}
setInterval(updateTelemetryLog, 4000);
updateTelemetryLog();

// 2. Interactive Stack Registry Inspector
const stackPills = document.querySelectorAll('.stack-pill');
stackPills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
        const name = pill.innerText;
        const details = pill.getAttribute('data-details') || 'No telemetry recorded.';
        const xp = pill.getAttribute('data-xp') || 'Advanced';
        
        techNameEl.innerText = name;
        techXpEl.innerText = xp;
        techDescEl.innerText = details;
        
        techDetailCard.classList.remove('hidden');
        
        stackPills.forEach(p => p.classList.remove('hovered'));
        pill.classList.add('hovered');
    });
});

// 3. Project Drawer Injections & Specifications
const projectSpecs = {
    'crewspace': {
        title: 'Crewspace Platform Spec',
        status: 'ACTIVE_DEPLOYMENT',
        statusClass: 'text-success',
        client: 'B2B Multi-Tenant Client',
        tech: 'React, Vite, FastAPI, PostgreSQL, TailwindCSS, CORS Proxy',
        metrics: '99.9% Uptime / 40% state sync cycle optimizations',
        manifest: `// crewspace-deployment-manifest.json
{
  "project_id": "crewspace-production-v2",
  "port_binding": {
    "frontend": 3000,
    "backend": 8080
  },
  "database": {
    "provider": "PostgreSQL",
    "isolation_level": "RowLevelSecurity",
    "connection_limit": 20
  },
  "integrations": [
    "NetlifyRedirectProxy",
    "RailwayDatabaseCluster",
    "CustomRBACEngine"
  ]
}`,
        details: 'Crewspace was designed to replace fragmented task interfaces. Built with a robust FastAPI backend supporting multi-tenant isolation, database pools, and real-time state synchronization via optimized REST endpoints. The UI is keyboard-navigable and optimized for speed.'
    },
    'access-control': {
        title: 'Access Control Engine Spec',
        status: 'IN_PRODUCTION',
        statusClass: 'text-info',
        client: 'Enterprise Workspace Gateway',
        tech: 'TypeScript, Node.js, Express, Redis, JSON Web Tokens',
        metrics: 'Auth token processing lag < 4ms / 0 concurrent session leaks',
        manifest: `// rbac-policy-engine.ts
import { Cache } from 'redis';
import { UserRole } from './enums';

export class RBACEngine {
  private cache = new Cache();
  
  async verifyScope(userId: string, workspaceId: string, requiredRole: UserRole) {
    const key = \`session:\${userId}:\${workspaceId}\`;
    const cachedRole = await this.cache.get(key);
    return cachedRole && cachedRole >= requiredRole;
  }
}`,
        details: 'An enterprise auth solution resolving recursive RBAC rules. Optimized using a high-speed Redis session store mapping token blacklists and custom scope matrices. Prevents credential leakage across workspaces during high concurrent logins.'
    },
    'taskspace': {
        title: 'Taskspace Keyboard Spec',
        status: 'LIVE_SHIPPED',
        statusClass: 'text-success',
        client: 'Developer Productivity Workspace',
        tech: 'React, Express, MongoDB, Node.js, TailwindCSS',
        metrics: '100% keyboard shortcut coverage / automated notification cron',
        manifest: `// taskspace-keyboard-config.js
module.exports = {
  shortcuts: {
    "cmd+k": "trigger_command_palette",
    "g+d": "navigate_dashboard",
    "g+p": "navigate_projects",
    "esc": "close_all_drawers"
  },
  notifications: {
    "provider": "Sendgrid",
    "rate_limit_sec": 3600
  }
}`,
        details: 'Designed for developers who dislike using their mouse. Implementing keyboard shortcuts, dynamic cards navigation, and an intuitive Command Menu. Connects directly to a custom Express notification cluster.'
    },
    'campuscrews': {
        title: 'CampusCrews Academic Spec',
        status: 'LOCAL_STABLE',
        statusClass: 'text-warning',
        client: 'Student Collaboration Portal',
        tech: 'React, Node.js, Express, MongoDB, Socket.io',
        metrics: '40% reduction in socket broadcast loops / automated feedback integration',
        manifest: `// server-socket-routes.js
io.on("connection", (socket) => {
  socket.on("sync-workspace", (data) => {
    // Isolated broadcast prevents infinite looping
    socket.to(data.room).emit("state-update", data.payload);
  });
});`,
        details: 'CampusCrews consolidates academic group activities. It supports multi-party workspace synchronization and features a real-time messaging pipeline engineered via isolated Socket.io rooms, eliminating packet redundancy.'
    }
};

function openProjectSpec(projectId) {
    const spec = projectSpecs[projectId];
    if (!spec) return;
    
    drawerTitleEl.innerText = spec.title;
    
    drawerContentEl.innerHTML = `
        <div class="drawer-section">
            <div class="drawer-sec-title">Telemetry Overview</div>
            <div class="drawer-meta-table">
                <div class="drawer-table-row">
                    <span class="key">Status:</span>
                    <span class="val ${spec.statusClass}">${spec.status}</span>
                </div>
                <div class="drawer-table-row">
                    <span class="key">Target:</span>
                    <span class="val">${spec.client}</span>
                </div>
                <div class="drawer-table-row">
                    <span class="key">Primary Stack:</span>
                    <span class="val">${spec.tech}</span>
                </div>
                <div class="drawer-table-row">
                    <span class="key">Measured Metrics:</span>
                    <span class="val">${spec.metrics}</span>
                </div>
            </div>
        </div>
        
        <div class="drawer-section">
            <div class="drawer-sec-title">Project Specification File</div>
            <div class="drawer-code-block">${escapeHtml(spec.manifest)}</div>
        </div>
        
        <div class="drawer-section">
            <div class="drawer-sec-title">Architectural Rationale</div>
            <p class="drawer-desc">${spec.details}</p>
        </div>
        
        <div class="drawer-links">
            <a href="https://github.com" target="_blank" class="drawer-btn primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Launch Repository
            </a>
            <a href="javascript:void(0)" class="drawer-btn secondary" onclick="showToast('Active demo deployment simulated successfully.')">
                Simulate Live Link
            </a>
        </div>
    `;
    
    projectDrawerEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    projectDrawerEl.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 4. Interactive Command Menu (Cmd+K)
function toggleCmdMenu() {
    cmdMenuEl.classList.toggle('hidden');
    if (!cmdMenuEl.classList.contains('hidden')) {
        cmdInputEl.focus();
        cmdInputEl.value = '';
    }
}

// Global Keyboard Listeners
window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCmdMenu();
    }
    if (e.key === 'Escape') {
        closeDrawer();
        cmdMenuEl.classList.add('hidden');
    }
});

// Close overlays if clicking outside dialogs
window.addEventListener('click', (e) => {
    if (e.target === cmdMenuEl) {
        cmdMenuEl.classList.add('hidden');
    }
    if (e.target === projectDrawerEl) {
        closeDrawer();
    }
});

// Command execution parser
const cmdHelpHtml = `
    <div class="cmd-help-item"><span class="cmd-keyword">help</span><span class="cmd-desc">List all available navigation commands</span></div>
    <div class="cmd-help-item"><span class="cmd-keyword">work</span><span class="cmd-desc">Go to Selected Projects section</span></div>
    <div class="cmd-help-item"><span class="cmd-keyword">stack</span><span class="cmd-desc">Inspect technology stack parameters</span></div>
    <div class="cmd-help-item"><span class="cmd-keyword">log</span><span class="cmd-desc">Review release history and timeline</span></div>
    <div class="cmd-help-item"><span class="cmd-keyword">blog</span><span class="cmd-desc">Read developer articles and technical blogs</span></div>
    <div class="cmd-help-item"><span class="cmd-keyword">contact</span><span class="cmd-desc">Navigate directly to the contact console</span></div>
`;

if (cmdInputEl) {
    cmdInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawVal = cmdInputEl.value.trim().toLowerCase();
            if (!rawVal) return;
            
            cmdResultsEl.innerHTML = '';
            
            const historyLine = document.createElement('div');
            historyLine.className = 'cmd-history-output';
            
            switch (rawVal) {
                case 'help':
                    cmdResultsEl.innerHTML = cmdHelpHtml;
                    break;
                case 'work':
                    historyLine.innerHTML = `<span class="text-success">Executing: Navigate to #work</span><br>Redirecting console view down to Selected Projects...`;
                    cmdResultsEl.appendChild(historyLine);
                    setTimeout(() => {
                        toggleCmdMenu();
                        document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
                    }, 600);
                    break;
                case 'stack':
                    historyLine.innerHTML = `<span class="text-success">Executing: Inspect Stack Matrix</span><br>Stack parameters synchronized. Scroll details into view...`;
                    cmdResultsEl.appendChild(historyLine);
                    setTimeout(() => {
                        toggleCmdMenu();
                        document.getElementById('stack').scrollIntoView({ behavior: 'smooth' });
                    }, 600);
                    break;
                case 'log':
                    historyLine.innerHTML = `<span class="text-success">Fetching logs...</span><br>Last commit: a762d97 (Scale Out Taskspace Multi-Tenant Infrastructure). Scroll timeline into view...`;
                    cmdResultsEl.appendChild(historyLine);
                    setTimeout(() => {
                        toggleCmdMenu();
                        document.getElementById('build-log').scrollIntoView({ behavior: 'smooth' });
                    }, 600);
                    break;
                case 'blog':
                    historyLine.innerHTML = `<span class="text-success">Executing: Navigate to Blogs</span><br>Redirecting console view to Tech Insights...`;
                    cmdResultsEl.appendChild(historyLine);
                    setTimeout(() => {
                        window.location.href = 'blogs.html';
                    }, 600);
                    break;
                case 'contact':
                    historyLine.innerHTML = `<span class="text-success">Loading contact console...</span><br>Email: bharatsingh.dev.in@gmail.com. Scroll inbox into view...`;
                    cmdResultsEl.appendChild(historyLine);
                    setTimeout(() => {
                        toggleCmdMenu();
                        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                    }, 600);
                    break;
                default:
                    historyLine.innerHTML = `<span class="text-error">Command not found: "${rawVal}"</span><br>Type <span class="accent-text font-bold">help</span> to list commands.`;
                    cmdResultsEl.appendChild(historyLine);
            }
            cmdInputEl.value = '';
        }
    });
}

// 5. Email Copy Tool
function copyEmailToClipboard() {
    const email = 'bharatsingh.dev.in@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        const copyTextEl = document.getElementById('copy-text');
        copyTextEl.innerText = 'Copied!';
        showToast('Email address copied to clipboard.');
        
        setTimeout(() => {
            copyTextEl.innerText = 'Copy Address';
        }, 2000);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

// 6. Contact Form Transmission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();
        
        if (!name || !email || !message) {
            formFeedback.classList.remove('hidden', 'success');
            formFeedback.classList.add('error');
            formFeedback.innerHTML = `All fields are required.`;
            return;
        }

        formFeedback.classList.remove('hidden', 'success', 'error');
        formFeedback.innerHTML = '<span class="cursor-blink">Transmitting message...</span>';
        
        try {
            toggleGlobalLoader(true);
            const res = await fetch('http://localhost:3000/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            if (res.ok) {
                formFeedback.classList.add('success');
                formFeedback.innerHTML = `✓ Message transmitted successfully!`;
                contactForm.reset();
            } else {
                throw new Error();
            }
        } catch (err) {
            formFeedback.classList.add('error');
            formFeedback.innerHTML = `Failed to send message. Server might be unreachable.`;
        } finally {
            toggleGlobalLoader(false);
        }
    });
}

// 7. Toast Notification Handler
let toastTimeout;
function showToast(message) {
    clearTimeout(toastTimeout);
    toastEl.innerText = message;
    toastEl.classList.remove('hidden');
    
    toastTimeout = setTimeout(() => {
        toastEl.classList.add('hidden');
    }, 3000);
}

// 8. Field Notes Drawer
const noteContent = {
    'prompting': {
        title: 'The Fallacy of Over-Prompting: Building Pure Tool-Use Systems',
        tag: 'LLM_ENG',
        text: `LLMs are deterministic probability matrices masquerading as creative thinkers. When builders construct systems that rely on 2,000-word prompt files, they create fragile pipelines. A tiny shift in model temperature or routing can break the structural output.

The solution is to design **Zero-Shot Validation Interfaces**:
1. Keep prompts down to simple functional intents.
2. Force structural responses using JSON schema maps (JSON Mode).
3. Validate models outputs using strict runtime checkers (TypeScript zod, python pydantic).
4. Run self-correcting retry loops on syntax validation errors rather than rebuilding context.

By treating the LLM as an query router rather than an absolute executor, we build systems that don't fail at production scale.`
    },
    'monolith': {
        title: 'Why I Prefer Single-File Core Architecture for MVP Rollouts',
        tag: 'ARCHITECTURE',
        text: `Modern code patterns encourage aggressive separation of concerns before code-product fit is realized. Organizing small applications into 20 different directories (controllers, repositories, services, types) increases cognitive scatter and slows down deployment cycles.

For rapid development:
- Build the core logic in a single file first.
- Keep dependencies close, utilize inline functions, and inline interfaces.
- Only partition sections of the single-file module once it exceeds 1,500 lines of functional scope.

This constraints directory hunting and keeps developer iteration loop times under 3 seconds, leading to a much faster feedback cadence.`
    },
    'keyboard': {
        title: 'Designing for Keyboard-First Navigation: Frictionless UI Systems',
        tag: 'UX_DESIGN',
        text: `Web layouts should operate at the speed of command line terminals. Mouse clicks require hand-to-eye alignment, creating high latency in repetitive workflows.

Key guidelines:
1. Implement a global command panel (Cmd+K) index that lets users navigate the entire layout in 3 keypresses.
2. Bind letters to rapid actions (e.g. 'C' for copy, 'E' for edit, '/' for search).
3. Visual states should provide instant highlight focus outlines (like focus-visible outlines in CSS) so keyboard navigation feels natural and snappy.
4. Keep overlays and panels non-intrusive. Allow ESC to drop state immediately.

Tools like Linear and Vercel show how critical these principles are to building premium Developer Tools.`
    }
};

function showNote(noteId) {
    const note = noteContent[noteId];
    if (!note) return;
    
    drawerTitleEl.innerText = note.title;
    
    drawerContentEl.innerHTML = `
        <div class="drawer-section">
            <div class="drawer-sec-title">Field Note Metadata</div>
            <div class="drawer-meta-table">
                <div class="drawer-table-row">
                    <span class="key">Topic:</span>
                    <span class="val text-success">${note.tag}</span>
                </div>
                <div class="drawer-table-row">
                    <span class="key">Author:</span>
                    <span class="val">Bharat Singh</span>
                </div>
                <div class="drawer-table-row">
                    <span class="key">Date Published:</span>
                    <span class="val">2026-05-30</span>
                </div>
            </div>
        </div>
        
        <div class="drawer-section">
            <div class="drawer-sec-title">Article Content</div>
            <p class="drawer-desc" style="white-space: pre-line; line-height: 1.7; font-size: 14px;">${note.text}</p>
        </div>
        
        <div class="drawer-links">
            <a href="javascript:void(0)" class="drawer-btn primary" onclick="showToast('Note bookmark synchronized.')">
                Bookmark Note
            </a>
            <a href="javascript:void(0)" class="drawer-btn secondary" onclick="closeDrawer()">
                Close Drawer
            </a>
        </div>
    `;
    
    projectDrawerEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Utility function to escape HTML inside manifest strings
function escapeHtml(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// 9. Dynamic Viewfinder Timecode Generator (24fps frame steps)
const cameraTcEl = document.getElementById('camera-tc');
if (cameraTcEl) {
    let frame = 0;
    setInterval(() => {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        const frames = String(frame).padStart(2, '0');
        cameraTcEl.innerText = `TC ${hrs}:${mins}:${secs}:${frames}`;
        frame = (frame + 1) % 24; // Loop at 24fps
    }, 41.67); // 1000ms / 24 frames = ~41.67ms per frame
}

// 10. Widescreen Cinematic Gallery Carousel Logic
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.ind-dot');
const timelineFill = document.getElementById('carousel-timeline-fill');
const slideDuration = 6000; // 6 seconds per slide
let slideInterval;
let timelineInterval;
let startTime;

function initCarousel() {
    if (slides.length === 0) return;
    startSlideTimer();
}

function updateSlide(index) {
    if (slides.length === 0) return;
    
    let nextIndex = index;
    if (nextIndex >= slides.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = slides.length - 1;
    
    // Calculate sliding transition direction
    let direction = 'next';
    if (nextIndex < currentSlideIndex) {
        direction = 'prev';
    }
    // Wrap-around edge cases
    if (currentSlideIndex === 0 && nextIndex === slides.length - 1) {
        direction = 'prev';
    } else if (currentSlideIndex === slides.length - 1 && nextIndex === 0) {
        direction = 'next';
    }
    
    const prevIndex = currentSlideIndex;
    currentSlideIndex = nextIndex;
    
    slides.forEach((slide, i) => {
        // Clear previous sliding classes
        slide.classList.remove('active', 'slide-left', 'slide-right');
        
        if (i === currentSlideIndex) {
            slide.classList.add('active');
        } else if (i === prevIndex) {
            slide.classList.add(direction === 'next' ? 'slide-left' : 'slide-right');
        }
    });
    
    indicators.forEach((dot, i) => {
        if (i === currentSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    resetTimeline();
}

function nextSlide() {
    updateSlide(currentSlideIndex + 1);
}

function prevSlide() {
    updateSlide(currentSlideIndex - 1);
}

function goToSlide(index) {
    updateSlide(index);
}

function startSlideTimer() {
    resetTimeline();
}

function resetTimeline() {
    clearInterval(slideInterval);
    clearInterval(timelineInterval);
    
    if (timelineFill) {
        timelineFill.style.width = '0%';
    }
    
    startTime = Date.now();
    timelineInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percentage = Math.min((elapsed / slideDuration) * 100, 100);
        if (timelineFill) {
            timelineFill.style.width = `${percentage}%`;
        }
    }, 50);
    
    slideInterval = setInterval(nextSlide, slideDuration);
}

// Bind to window context so inline HTML handlers resolve
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;

// Initialise on load
initCarousel();

// 11. Mobile Navigation Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const headerNav = document.getElementById('header-nav');

    if (mobileToggle && headerNav) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileToggle.classList.toggle('active');
            headerNav.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = headerNav.querySelectorAll('.header-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                headerNav.classList.remove('active');
            });
        });

        // Close menu if clicking outside
        document.addEventListener('click', (e) => {
            if (!headerNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                headerNav.classList.remove('active');
            }
        });
    }
});

// 12. Premium Loading Screen handler
window.addEventListener('load', () => {
    dismissLoadingScreen();
});

// Fallback timeout of 2.5 seconds for slow connections
setTimeout(() => {
    dismissLoadingScreen();
}, 2500);

function dismissLoadingScreen() {
    const loader = document.getElementById('loading-screen');
    if (loader && !loader.classList.contains('fade-out')) {
        loader.classList.add('fade-out');
        document.body.classList.remove('page-loading');
        
        // Completely remove from DOM after transition finishes
        setTimeout(() => {
            loader.remove();
        }, 800);
    }
}

// 13. Dynamic Blog Article Viewer
const blogPosts = {
    'agentic-workflows': {
        title: 'Building Reliable Agentic Workflows',
        date: 'May 28, 2026',
        tag: 'AI & AGENTS',
        readTime: '5 MIN READ',
        content: `
            <p>Agentic workflows represent a paradigm shift in how we integrate Large Language Models into software systems. Instead of single-shot prompts, we build loops where the model acts, observes, and adapts.</p>
            
            <h4>The Loop Architecture</h4>
            <p>A typical reliable agent loop consists of three distinct states:</p>
            <ul>
                <li><strong>Planning:</strong> Breaking down a complex query into sequential tasks.</li>
                <li><strong>Execution:</strong> Invoking specific APIs or tools (e.g. database querying, search, code running).</li>
                <li><strong>Evaluation:</strong> Verifying if the output meets the requirements, and looping back if corrections are needed.</li>
            </ul>

            <h4>Handling Tool Failures</h4>
            <p>The main failure mode of agentic loops is tool hallucinations or API rate limits. To solve this, we implement state machine validations. If a tool call fails, the validation layer catches the exception and feeds the error back into the LLM context, instructing it to self-correct.</p>
            
            <div class="code-block"><code>// Example retry logic in validation layer
try {
    const output = await executeTool(call.name, call.args);
    return validate(output);
} catch (err) {
    return { error: true, message: err.message };
}</code></div>

            <p>By treating LLM tool use as a standard state machine with timeouts and fallbacks, we can build highly stable, autonomous systems.</p>
        `
    },
    'high-throughput-db': {
        title: 'Scaling Postgres for High-Throughput APIs',
        date: 'May 24, 2026',
        tag: 'DATABASE',
        readTime: '8 MIN READ',
        content: `
            <p>Relational databases are often the bottleneck in modern high-throughput web applications. While scaling horizontally is easy for stateless compute, scaling Postgres requires smart connection management and indexing strategies.</p>
            
            <h4>1. Connection Pool Optimization</h4>
            <p>Each connection in Postgres consumes memory. At thousands of concurrent requests, direct connections will crash the server. We place an edge pooler like PgBouncer in transaction mode to pool connections efficiently, keeping target DB connections stable.</p>
            
            <h4>2. Indexing Strategy</h4>
            <p>Composite indexes must match the query filter path. If you filter by tenant_id and sort by created_at, a composite index on <code>(tenant_id, created_at DESC)</code> is critical to prevent sequential database scans.</p>

            <div class="code-block"><code>CREATE INDEX idx_tenant_created
ON applications (tenant_id, created_at DESC);</code></div>
            
            <p>Combining connection pooling with optimized indexing can reduce average API latency from 200ms to under 15ms.</p>
        `
    },
    'state-sync': {
        title: 'Real-time State Synchronization In B2B Apps',
        date: 'May 15, 2026',
        tag: 'SYSTEMS',
        readTime: '6 MIN READ',
        content: `
            <p>Collaborative B2B platforms require real-time state updates to keep multiple clients synchronized. Selecting the right protocol is critical to balance server CPU cycles and client-side complexity.</p>
            
            <h4>WebSockets vs Server-Sent Events (SSE)</h4>
            <p>For bidirectional operations (like chat or live multi-user editing), <strong>WebSockets</strong> are the industry standard. However, for unidirectional push notifications and read-only dashboard updates, <strong>SSE</strong> is much simpler to implement, utilizes HTTP/2 naturally, and handles reconnections automatically.</p>
            
            <h4>State Conflict Resolution</h4>
            <p>When two users edit the same field simultaneously, conflicts occur. We use Operational Transformation (OT) or Conflict-Free Replicated Data Types (CRDTs) to merge client states locally without requiring heavy locking mechanisms on the DB.</p>
        `
    }
};

function openBlogPost(blogId) {
    const post = blogPosts[blogId];
    if (!post) return;
    
    drawerTitleEl.innerText = post.title;
    
    drawerContentEl.innerHTML = `
        <div class="drawer-section">
            <div class="drawer-sec-title">Article Metadata</div>
            <div class="drawer-meta-table">
                <div class="drawer-table-row">
                    <span class="key">Topic:</span>
                    <span class="val text-success">${post.tag}</span>
                </div>
                <div class="drawer-table-row">
                    <span class="key">Read Time:</span>
                    <span class="val">${post.readTime}</span>
                </div>
                <div class="drawer-table-row">
                    <span class="key">Date Published:</span>
                    <span class="val">${post.date}</span>
                </div>
                <div class="drawer-table-row">
                    <span class="key">Author:</span>
                    <span class="val">Bharat Singh</span>
                </div>
            </div>
        </div>
        
        <div class="drawer-section">
            <div class="drawer-sec-title">Article Content</div>
            <div class="drawer-desc" style="line-height: 1.7; font-size: 14px; color: rgba(255, 255, 255, 0.8);">
                ${post.content}
            </div>
        </div>
        
        <div class="drawer-links">
            <a href="javascript:void(0)" class="drawer-btn primary" onclick="showToast('Article bookmarked.')">
                Bookmark Article
            </a>
            <a href="javascript:void(0)" class="drawer-btn secondary" onclick="closeDrawer()">
                Close Article
            </a>
        </div>
    `;
    
    projectDrawerEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Bind to window context so inline HTML click events resolve
window.openBlogPost = openBlogPost;

// 14. Fetch Projects Dynamically
async function fetchAndRenderProjects() {
    const container = document.getElementById('featured-projects-container');
    if (!container) return;

    try {
        toggleGlobalLoader(true);
        const res = await fetch('http://localhost:3000/api/projects');
        if (!res.ok) throw new Error();
        const projects = await res.json();
        
        container.innerHTML = '';
        if (projects.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">No projects available.</p>';
            return;
        }

        projects.forEach((proj, idx) => {
            const tagsHtml = proj.tags ? proj.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('') : '';
            const num = (idx + 1).toString().padStart(2, '0');
            const card = document.createElement('div');
            card.className = 'sys-work-card glass-panel tilt-card';
            
            card.innerHTML = `
                <div class="sys-work-header">
                    <span class="status-indicator ${escapeHtml(proj.statusClass || 'active')}"><span class="dot"></span> ${escapeHtml(proj.status || 'Active')}</span>
                    <span class="project-num">${num}</span>
                </div>
                <h3>${escapeHtml(proj.title)}</h3>
                <p class="text-muted">${escapeHtml(proj.description)}</p>
                <div class="sys-work-tags">
                    ${tagsHtml}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center;">Failed to load projects.</p>';
    } finally {
        toggleGlobalLoader(false);
    }
}
document.addEventListener('DOMContentLoaded', fetchAndRenderProjects);

// ─────────────────────────────────────────────
// PREMIUM DYNAMIC ANIMATION CONTROLLER
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Observer Setup
    const observerOptions = {
        root: null,
        rootMargin: '0px -20px -30px 0px',
        threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-slide-left, .reveal-slide-right, .reveal-scale-up').forEach(el => {
        revealObserver.observe(el);
    });

    // Auto stagger child nodes within revealed groups with premium varied directions
    document.querySelectorAll('.reveal-group').forEach(group => {
        const children = group.children;
        Array.from(children).forEach((child, index) => {
            // Apply varied animation types for premium feel
            if (index % 3 === 0) {
                child.classList.add('reveal-slide-left');
            } else if (index % 3 === 1) {
                child.classList.add('reveal-scale-up');
            } else {
                child.classList.add('reveal-slide-right');
            }
            child.style.transitionDelay = `${index * 100}ms`;
            revealObserver.observe(child);
        });
    });

    // 1b. Scroll Progress & Active Sidebar Dot Nav Handler
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const sections = document.querySelectorAll('section[id]');
    const dotLinks = document.querySelectorAll('.sidebar-dot-nav .dot-link');

    function handleScroll() {
        // Update Scroll Progress Bar
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
            const scrollPercentage = (window.scrollY / scrollHeight) * 100;
            if (scrollProgressBar) {
                scrollProgressBar.style.width = scrollPercentage + '%';
            }
        }

        // Active Dot State Tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 180;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            dotLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === currentSectionId) {
                    link.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 1c. Interactive Particle Canvas System
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                this.vx = (Math.random() * 0.4) - 0.2;
                this.vy = (Math.random() * 0.4) - 0.2;
            }

            draw() {
                ctx.fillStyle = 'rgba(99, 102, 241, 0.45)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                // Regular floating movement
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Mouse interaction (gravity attraction)
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        this.x += (dx / distance) * force * 1.5;
                        this.y += (dy / distance) * force * 1.5;
                    }
                }
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(65, Math.floor((canvas.width * canvas.height) / 18000));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            // Connect nearby particles with custom thin translucent gradient line segments
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 110) {
                        const alpha = (110 - dist) / 110 * 0.12;
                        ctx.strokeStyle = `rgba(240, 90, 40, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateParticles();
    }

    // 2. Interactive 3D Card Hover & Glowing Cursor Tracking
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        if (!card.querySelector('.tilt-card-glow')) {
            const glow = document.createElement('div');
            glow.className = 'tilt-card-glow';
            card.appendChild(glow);
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit 3D tilt deflection angles to preserve readability
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // 3. Dynamic Typewriter Phrase Cycler
    const typewriterWords = ["intelligent web", "scalable backends", "AI agent workflows", "high-performance APIs"];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeletingWord = false;
    const typeSpeed = 90;
    const eraseSpeed = 40;
    const pauseBeforeErase = 2000;
    const typewriterNode = document.getElementById('typewriter-text');

    function runTypewriter() {
        if (!typewriterNode) return;
        const currentWord = typewriterWords[wordIdx];
        
        if (isDeletingWord) {
            typewriterNode.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typewriterNode.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }

        let scheduleDelay = isDeletingWord ? eraseSpeed : typeSpeed;

        if (!isDeletingWord && charIdx === currentWord.length) {
            isDeletingWord = true;
            scheduleDelay = pauseBeforeErase;
        } else if (isDeletingWord && charIdx === 0) {
            isDeletingWord = false;
            wordIdx = (wordIdx + 1) % typewriterWords.length;
            scheduleDelay = 300;
        }

        setTimeout(runTypewriter, scheduleDelay);
    }

    if (typewriterNode) {
        typewriterNode.textContent = '';
        setTimeout(runTypewriter, 400);
    }
});

// ─────────────────────────────────────────────
// GLOBAL LOADER AND BACK TO TOP LOGIC
// ─────────────────────────────────────────────

function toggleGlobalLoader(show) {
    const loader = document.getElementById('global-loader');
    if (loader) {
        if (show) loader.classList.remove('hidden');
        else loader.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
