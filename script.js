// Mobile Menu Toggle (guarded for pages without hamburger/nav-menu)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Netflix-style mobile hamburger (inject only if nf-nav exists and no nf-hamburger present)
(function setupNfMobileHamburger(){
    const nfNav = document.querySelector('.nf-nav');
    const nfContainer = document.querySelector('.nf-nav__container');
    if (!nfNav || !nfContainer) return;
    if (nfContainer.querySelector('.nf-hamburger')) return; // already present

    const btn = document.createElement('button');
    btn.className = 'nf-hamburger';
    btn.setAttribute('aria-label','Open navigation');
    btn.innerHTML = '<span></span><span></span><span></span>';
    // insert near right side
    nfContainer.appendChild(btn);

    btn.addEventListener('click', () => {
        nfNav.classList.toggle('mobile-open');
        // prevent body scroll when menu open
        if (nfNav.classList.contains('mobile-open')) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
    });

    // Close mobile nf-links when clicking a nf-link
    nfContainer.querySelectorAll('.nf-links a').forEach(a => {
        a.addEventListener('click', () => {
            if (nfNav.classList.contains('mobile-open')) {
                nfNav.classList.remove('mobile-open');
                document.body.style.overflow = '';
            }
        });
    });
})();

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
const nfNav = document.querySelector('.nf-nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar?.classList.add('scrolled');
        nfNav?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
        nfNav?.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.project-card, .skill-category, .stat, .timeline-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Skill bars animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                bar.style.animation = 'fillBar 1.5s ease-out forwards';
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Show success message (you can customize this)
        alert('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
        
        // Here you would typically send the form data to a server
        // Example: fetch('/api/contact', { method: 'POST', body: formData })
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 700);
    }
});

// Netflix Intro - Remove intro-playing class after animation
// Attempt to autoplay intro audio and provide tap-to-play fallback
(function setupIntro() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const intro = document.querySelector('.netflix-intro');
    const tapOverlay = document.getElementById('tap-to-play');
    const audio = document.getElementById('intro-audio');
    const whos = document.getElementById('whos-watching');
    let fallbackTimer;
    let autoplayResolved = false;

    if (!intro) return;

    // If reduced motion, shorten/skip animations
    if (prefersReduced) {
        intro.style.animation = 'fadeOut 0.3s ease-in-out 0.7s forwards';
    }

    const endIntro = () => {
        document.body.classList.remove('intro-playing');
        if (intro) intro.style.display = 'none';
        if (!audio?.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    };

    // Skip button ends intro and shows who's watching
    const showWhosWatching = () => {
        if (fallbackTimer) { clearTimeout(fallbackTimer); }
        if (!whos) return endIntro();
        document.body.classList.remove('intro-playing');
        whos.hidden = false;
        if (intro) intro.style.display = 'none';
        if (!audio?.paused) { audio.pause(); audio.currentTime = 0; }
    };

    // Start intro: require a tap; hide overlay immediately
    let introStarted = false;
    const startIntro = async () => {
        if (introStarted) return;
        introStarted = true;
        // Kick off fade animation
        intro?.classList.add('intro-animating');
        // Start audio unmuted from the beginning
        try {
            if (audio) {
                audio.muted = false; audio.currentTime = 0; await audio.play();
                audio.addEventListener('ended', showWhosWatching, { once: true });
            }
        } catch {}
        // Fallback in case ended doesn't fire
        fallbackTimer = setTimeout(showWhosWatching, prefersReduced ? 1200 : 5000);
    };

    // Tap overlay triggers start and then disappears immediately
    const handleTap = async () => {
        if (tapOverlay) {
            // Hide immediately and remove from DOM to prevent lingering
            tapOverlay.setAttribute('hidden', '');
            // Use a microtask to remove after attribute applied
            setTimeout(() => tapOverlay.remove(), 0);
        }
        await startIntro();
    };
    tapOverlay?.addEventListener('click', handleTap);
    tapOverlay?.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleTap(); } });

    // Remove previous autoplay attempts; we intentionally sync on click now

    // Handle Who's Watching selection
    whos?.addEventListener('click', (e) => {
        const target = e.target.closest('.profile');
        if (!target) return;
        // After selecting a profile, hide overlay and reveal site
        whos.hidden = true;
        // Optional: personalize state by dataset profile
        const profile = target.dataset.profile;
        document.documentElement.setAttribute('data-profile', profile);
        // Netflix home mode
        document.body.classList.add('nf-home');
        // Map profile -> display name and avatar
        const profileMap = {
            owner: { name: 'Mohammad', avatar: 'assets/mohammad.png' },
            sonny: { name: 'Sonny', avatar: 'assets/sonny.png' },
            eric: { name: 'Eric', avatar: 'assets/eric.png' },
            // guest avatar (use assets/thumbs/guest.jpg if present)
            guest: { name: 'Guest', avatar: 'assets/thumbs/guest.jpg' }
        };
        const info = profileMap[profile] || profileMap.guest;
        // Populate profile name for Top Picks
        const nameEl = document.getElementById('profile-name');
        if (nameEl) { nameEl.textContent = info.name; }
        // Sync avatar in top nav
        const avatar = document.getElementById('nf-profile-avatar');
        if (avatar) {
            if (info.avatar) {
                avatar.removeAttribute('data-blank');
                avatar.src = info.avatar;
                avatar.style.opacity = '';
            } else {
                // remove src so no image is displayed and mark as blank
                try { avatar.removeAttribute('src'); } catch {}
                avatar.setAttribute('data-blank', 'true');
                // keep element visible but visually blank
                avatar.style.opacity = '1';
            }
        }
    });
})();

// Typing effect for hero title (optional enhancement)
const nameElement = document.querySelector('.name');
if (nameElement) {
    const text = nameElement.textContent;
    nameElement.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            nameElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Start typing effect after intro animation
    setTimeout(typeWriter, 5500);
}

// Add active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            // Add active class to both header nav types (.nav-link and .nf-link)
            const selectorNav = document.querySelector(`.nav-link[href*="${sectionId}"]`);
            const selectorNf = document.querySelector(`.nf-link[href*="${sectionId}"]`);
            selectorNav?.classList.add('active');
            selectorNf?.classList.add('active');
        } else {
            const selectorNavOff = document.querySelector(`.nav-link[href*="${sectionId}"]`);
            const selectorNfOff = document.querySelector(`.nf-link[href*="${sectionId}"]`);
            selectorNavOff?.classList.remove('active');
            selectorNfOff?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Cursor trail effect (optional Netflix-style enhancement)
const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll('.cursor-circle');

if (circles.length > 0) {
    circles.forEach(function (circle) {
        circle.x = 0;
        circle.y = 0;
    });

    window.addEventListener('mousemove', function(e) {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;
        
        circles.forEach(function (circle, index) {
            circle.style.left = x - 12 + 'px';
            circle.style.top = y - 12 + 'px';
            circle.style.scale = (circles.length - index) / circles.length;
            
            circle.x = x;
            circle.y = y;

            const nextCircle = circles[index + 1] || circles[0];
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        });
        
        requestAnimationFrame(animateCircles);
    }

    animateCircles();
}

// Preloader (optional)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    // Ensure billboard video starts if present
    // Billboard rotating videos
    const vids = [
        'assets/banner.mp4',
        'assets/banner2.mp4',
        'assets/banner3.mp4'
    ];
    const v1 = document.getElementById('billboard-video');
    const v2 = document.getElementById('billboard-video-2');
    let current = 0, active = v1, idle = v2;
    function setSource(video, src){
        video.innerHTML = '';
        const s = document.createElement('source'); s.src = src; s.type = 'video/mp4';
        video.appendChild(s);
        video.load();
    }
    function playVideo(video){
        video.muted = true; // autoplay policy
        video.loop = true;  // keep playing if rotation waits
        video.play().catch(()=>{});
    }
    function rotate(){
        const next = (current + 1) % vids.length;
        const nextSrc = vids[next];
        setSource(idle, nextSrc);
        idle.oncanplay = () => {
            // crossfade
            active.classList.remove('is-active');
            idle.classList.add('is-active');
            playVideo(idle);
            // swap refs
            const tmp = active; active = idle; idle = tmp;
            current = next;
            // schedule next rotation after a duration (e.g., 12s)
            setTimeout(rotate, 12000);
        };
        // start loading
        idle.load();
    }
    if (v1 && v2) {
        current = 0;
        setSource(v1, vids[0]);
        playVideo(v1);
        setSource(v2, vids[1]);
        // wait a bit, then rotate
        setTimeout(rotate, 12000);
        // gesture fallback
        const kick = () => { playVideo(active); playVideo(idle); document.removeEventListener('click', kick); };
        document.addEventListener('click', kick, { once: true });
    }

    // Page enter animation + opening curtains if present
    document.documentElement.classList.add('page-enter');
    const curtain = document.getElementById('route-transition');
    if (curtain) {
        curtain.classList.add('preclose');
        document.documentElement.classList.add('pre-open');
        // slight pause before opening so it feels intentional
        setTimeout(() => curtain.classList.add('open'), 220);
        // remove classes after curtains fully open
        setTimeout(() => {
            curtain.classList.remove('preclose','open');
            document.documentElement.classList.remove('pre-open');
        }, 1500);
    }
    requestAnimationFrame(() => {
        // start content fade after the hold begins, for a gentler reveal
        setTimeout(() => document.documentElement.classList.add('page-enter-active'), 420);
        setTimeout(() => document.documentElement.classList.remove('page-enter', 'page-enter-active'), 1500);
    });

    // Safety: if no modal is open, make sure scrolling is allowed
    const visibleModal = document.querySelector('.modal:not([hidden])');
    if (!visibleModal) { document.body.style.overflow = ''; }
});

// Route transition curtains
(function setupRouteTransitions(){
    const curtain = document.getElementById('route-transition');
    function navigateWithCurtain(href){
        if (!curtain) { window.location.href = href; return; }
    curtain.classList.add('active');
    setTimeout(() => { window.location.href = href; }, 900);
    }
    document.querySelectorAll('a[data-transition]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (!href) return;
            const isHash = href.startsWith('#') || href.includes('index.html#') || (a.origin === location.origin && a.pathname === location.pathname && href.includes('#'));
            if (isHash) return; // let in-page anchors behave normally
            e.preventDefault();
            navigateWithCurtain(href);
        });
    });
})();

// Skills Tabs interaction
(function setupTabs(){
    const tabContainers = document.querySelectorAll('[data-tabs]');
    tabContainers.forEach(container => {
        const buttons = container.querySelectorAll('.tab-button');
        const panels = container.querySelectorAll('.tab-panel');
        function activate(btn){
            buttons.forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b===btn?'true':'false'); });
            const sel = btn.getAttribute('data-tab-target');
            panels.forEach(p => {
                const isActive = '#' + p.id === sel;
                p.classList.toggle('active', isActive);
                p.hidden = !isActive;
                    if (isActive) {
                        p.querySelectorAll('.skill-square').forEach((sq, i) => {
                            sq.style.opacity = '0'; sq.style.transform = 'translateY(8px)';
                            setTimeout(() => { sq.style.transition = 'opacity .3s var(--ease-out), transform .3s var(--ease-out)'; sq.style.opacity = '1'; sq.style.transform = 'translateY(0)'; }, 40 + i*40);
                        });
                    }
            });
        }
        buttons.forEach(b => b.addEventListener('click', () => activate(b)));
    });
})();

// Add smooth reveal for project cards on hover
// Row navigation and interactions
function setupRows() {
    const containers = document.querySelectorAll('.row-container');
    containers.forEach(container => {
        const row = container.querySelector('.row');
        const prev = container.querySelector('.prev');
        const next = container.querySelector('.next');
        if (!row) return;

        // Check if scrolling is needed
        function updateArrows() {
            const needsScroll = row.scrollWidth > row.clientWidth;
            if (!needsScroll) {
                prev?.classList.add('hidden');
                next?.classList.add('hidden');
            } else {
                prev?.classList.remove('hidden');
                next?.classList.remove('hidden');
            }
        }

        updateArrows();
        window.addEventListener('resize', updateArrows);

        const scrollByAmount = () => Math.max(200, row.clientWidth * 0.85);
        prev?.addEventListener('click', () => row.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' }));
        next?.addEventListener('click', () => row.scrollBy({ left: scrollByAmount(), behavior: 'smooth' }));

        // Keyboard navigation within row
        row.addEventListener('keydown', (e) => {
            const focusable = [...row.querySelectorAll('.tile')];
            let idx = focusable.indexOf(document.activeElement);
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                idx = Math.min(focusable.length - 1, idx + 1);
                focusable[idx]?.focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                idx = Math.max(0, idx - 1);
                focusable[idx]?.focus();
            }
        });

        // Tile actions
        row.querySelectorAll('.tile').forEach(tile => {
            tile.addEventListener('click', () => {
                const link = tile.dataset.link;
                if (link) { window.location.href = link; return; }
                openModalFromTile(tile, false);
            });
        });
    });

    // Book cards, book tiles, and book spines click handler
    // Only bind when global project modal exists on this page
    const hasProjectModal = !!document.getElementById('project-modal');
    if (hasProjectModal) {
        document.querySelectorAll('.book-card, .book-tile, .book-spine').forEach(card => {
            card.addEventListener('click', () => {
                openModalFromTile(card, false);
            });
        });
    }
}

// Modal handling and progress tracking
const modal = document.getElementById('project-modal');
const modalVideo = document.getElementById('modal-video');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const modalDemo = document.getElementById('modal-demo');
const modalGit = document.getElementById('modal-github');

function openModalFromTile(tile, autoplay) {
    if (!modal) { document.body.style.overflow = ''; return; }
    const title = tile.dataset.title;
    const desc = tile.dataset.desc || tile.dataset.description; // Support both desc and description
    const tags = (tile.dataset.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    const tech = tile.dataset.tech;
    const demo = tile.dataset.demo;
    const git = tile.dataset.github;
    const videoSrc = tile.dataset.video;
    const poster = tile.dataset.poster;
    const id = tile.dataset.projectId;
    const author = tile.dataset.author; // For books
    const bookImage = tile.dataset.image; // For book cover images
    const isBook = tile.classList.contains('book-tile') || tile.classList.contains('book-spine');

    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    
    // Handle author for books
    const modalAuthor = document.getElementById('modalBookAuthor');
    if (modalAuthor) {
        if (author && isBook) {
            modalAuthor.textContent = `by ${author}`;
            modalAuthor.style.display = 'block';
        } else {
            modalAuthor.style.display = 'none';
        }
    }
    
    modalTags.innerHTML = '';
    tags.forEach(t => {
        const span = document.createElement('span');
        span.textContent = t;
        modalTags.appendChild(span);
    });
    
    // Demo/GitHub visibility for items without links (e.g., books)
    if (modalDemo) {
        if (demo && demo !== '#') {
            modalDemo.href = demo;
            modalDemo.style.display = '';
        } else {
            modalDemo.style.display = 'none';
        }
    }
    
    if (modalGit) {
        if (git && git !== '#') {
            modalGit.href = git;
            modalGit.style.display = '';
        } else {
            modalGit.style.display = 'none';
        }
    }

    // Setup video or book cover
    const modalVideoBanner = document.getElementById('modal-video');
    const modalBookCover = document.getElementById('modalBookCover');
    const banner = document.querySelector('.modal-banner');
    
    if (isBook && modalBookCover) {
        // Show book cover for books
        if (modalVideoBanner) modalVideoBanner.style.display = 'none';
        if (banner) banner.style.display = 'none';
        
        // Get book cover image from data-image or book-cover div
        let coverSrc = bookImage;
        if (!coverSrc) {
            const bookCoverDiv = tile.querySelector('.book-cover');
            if (bookCoverDiv) {
                const bgStyle = bookCoverDiv.style.background || bookCoverDiv.style.backgroundImage;
                const urlMatch = bgStyle.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (urlMatch) {
                    coverSrc = urlMatch[1];
                }
            }
        }
        
        if (coverSrc) {
            modalBookCover.src = coverSrc;
            modalBookCover.style.display = 'block';
        } else {
            // Use gradient as fallback
            modalBookCover.style.display = 'none';
        }
    } else if (videoSrc && modalVideoBanner) {
        // Show video for projects
        if (modalBookCover) modalBookCover.style.display = 'none';
        modalVideoBanner.style.display = 'block';
        // Ensure previous sources are removed so the correct video loads
        try {
            while (modalVideo.firstChild) modalVideo.removeChild(modalVideo.firstChild);
        } catch {}
        const source = document.createElement('source');
        source.src = videoSrc;
        source.type = 'video/mp4';
        modalVideo.appendChild(source);
        // reset playback state
        try { modalVideo.pause(); modalVideo.currentTime = 0; } catch {}
        modalVideo.load();
        if (poster) { modalVideo.setAttribute('poster', poster); }
        modalVideo.currentTime = getSavedTime(id);
        if (autoplay) {
            modalVideo.play().catch(()=>{});
        }
        if (banner) banner.style.display = '';
    } else {
        // No video — hide banner area
        if (banner) banner.style.display = 'none';
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Track time updates
    const onTimeUpdate = () => {
        saveTime(id, modalVideo.currentTime, modalVideo.duration);
        updateTileProgress(id);
    };
    modalVideo.addEventListener('timeupdate', onTimeUpdate);

    // Close handlers
    const close = () => {
        modal.hidden = true;
        document.body.style.overflow = '';
        try { modalVideo.pause(); } catch {}
        modalVideo?.removeEventListener('timeupdate', onTimeUpdate);
    };
    modal.querySelector('.modal-close')?.addEventListener('click', close, { once: true });
    modal.querySelector('.modal-backdrop')?.addEventListener('click', close, { once: true });
    window.addEventListener('keydown', function esc(e){ if(e.key==='Escape'){ close(); window.removeEventListener('keydown', esc); } });
}

function saveTime(id, time, duration) {
    if (!id) return;
    const key = `proj:${id}`;
    const payload = { t: Math.floor(time), d: Math.floor(duration || 0) };
    localStorage.setItem(key, JSON.stringify(payload));
}

function getSavedTime(id) {
    try {
        const key = `proj:${id}`;
        const raw = localStorage.getItem(key);
        if (!raw) return 0;
        const { t } = JSON.parse(raw);
        return t || 0;
    } catch { return 0; }
}

function getProgress(id) {
    try {
        const key = `proj:${id}`;
        const raw = localStorage.getItem(key);
        if (!raw) return 0;
        const { t, d } = JSON.parse(raw);
        if (!d) return 0;
        return Math.min(100, Math.floor((t / d) * 100));
    } catch { return 0; }
}

function updateTileProgress(id) {
    document.querySelectorAll(`.tile[data-project-id="${id}"] .progress`).forEach(bar => {
        const pct = getProgress(id);
        if (pct > 0) {
            bar.hidden = false;
            bar.style.setProperty('--progress', pct + '%');
            bar.style.position = 'absolute';
        } else {
            bar.hidden = true;
        }
        // apply width via inline style for ::after replacement
        bar.style.setProperty('--w', pct + '%');
        bar.innerHTML = `<span style="display:block; height:100%; width:${pct}%; background: var(--netflix-red);"></span>`;
    });
}

function populateContinueWatching() {
    const cont = document.getElementById('continue-row');
    if (!cont) return;
    const row = cont.querySelector('.row');
    row.innerHTML = '';
    const ids = ['spex','audiocraft','picotat'];
    let hasAny = false;
    ids.forEach(id => {
        const pct = getProgress(id);
        if (pct > 0) {
            const tile = document.querySelector(`.tile[data-project-id="${id}"]`);
            if (tile) {
                const clone = tile.cloneNode(true);
                row.appendChild(clone);
                hasAny = true;
            }
        }
    });
    cont.hidden = !hasAny;
}

// Books: use provided covers and explanations (run now or on DOM ready)
function enhanceBooks() {
    // Only apply on pages where book tiles exist
    const hasBookTiles = document.querySelector('.tile[data-project-id^="book-"]');
    if (!hasBookTiles) return;
    const coverMap = {
        'book-yellow-book': 'assets/C#.png',
        'book-pro-csharp': 'assets/andrew.jpg',
        'book-king-in-yellow': 'assets/yellow.png'
    };
    Object.entries(coverMap).forEach(([id, src]) => {
        document.querySelectorAll(`.tile[data-project-id="${id}"]`).forEach(tile => {
            tile.classList.remove('gradient-1','gradient-2','gradient-3','gradient-4');
            const safeSrc = src.replace(/#/g, '%23');
            tile.style.background = `url('${safeSrc}') center/cover no-repeat`;
        });
    });
    const descMap = {
        'book-yellow-book': "The C# Programming Yellow Book by Rob Miles — taught me clear fundamentals and how to think in C#. Great for grounding syntax, types, and core patterns.",
        'book-pro-csharp': "Pro C# (Andrew Troelsen) — leveled up my .NET knowledge: language features, CLR internals, and robust patterns for building serious apps.",
        'book-king-in-yellow': "The King in Yellow inspired me in a weird, abstract way. It’s not about coding at all, but the way it plays with mystery, forbidden knowledge, and hidden connections made me think differently about how I build things. The book is written as separate stories that secretly tie together — kind of like how code modules or systems link behind the scenes."
    };
    document.querySelectorAll('.tile').forEach(tile => {
        const id = tile.dataset.projectId;
        if (descMap[id]) {
            tile.dataset.desc = descMap[id];
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceBooks);
} else {
    enhanceBooks();
}

setupRows();
// Only populate continue watching if the container exists on this page
if (document.getElementById('continue-row')) {
    populateContinueWatching();
}

// Generate thumbnails from video first frame for select tiles
(function generateVideoThumbnails(){
    const targets = ['spex','audiocraft','picotat'];
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const tile = entry.target;
            const src = tile.dataset.video;
            // Skip book tiles (static covers only)
            if (!src || tile.dataset.projectId?.startsWith('book-') || tile.querySelector('.tile-video')) return;
            const vid = document.createElement('video');
            vid.className = 'tile-video';
            vid.muted = true; vid.autoplay = true; vid.loop = true; vid.playsInline = true;
            const s = document.createElement('source'); s.src = src; s.type = 'video/mp4';
            vid.appendChild(s);
            // Fallback poster capture on load
            vid.addEventListener('loadeddata', () => {
                try {
                    const canvas = document.createElement('canvas');
                    const w = vid.videoWidth || 1280; const h = vid.videoHeight || 720;
                    canvas.width = w; canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(vid, 0, 0, w, h);
                    const url = canvas.toDataURL('image/jpeg');
                    tile.dataset.poster = url;
                } catch {}
            }, { once: true });
            tile.prepend(vid);
            vid.play().catch(()=>{});
            io.unobserve(tile);
        });
    }, { rootMargin: '0px 0px -20% 0px', threshold: 0.2 });
    targets.forEach(id => { document.querySelectorAll(`.tile[data-project-id="${id}"]`).forEach(tile => io.observe(tile)); });
})();

// Fetch GitHub repos and populate Top Picks row
(function populateTopPicksFromGitHub(){
    const GITHUB_USER = 'Hamood-bot';
    const mapping = {
        'spex': 'spex',
        'picotat': 'picotat',
        'audiocraft': 'audiocraft'
    };

    const container = document.querySelector('[data-row="top-picks"] .row');
    if (!container) return;

    // If row already has meaningful tiles (non-empty), we will still attempt to enhance them in-place
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`)
        .then(res => {
            if (!res.ok) throw new Error('GitHub API error');
            return res.json();
        })
        .then(repos => {
            // index by lowercase name
            const idx = {};
            repos.forEach(r => { idx[r.name.toLowerCase()] = r; });

            // For each mapped project id, try to find the repo and create/upgrade tile
            Object.entries(mapping).forEach(([projId, repoName]) => {
                const repo = idx[repoName.toLowerCase()];
                const existing = container.querySelector(`.tile[data-project-id="${projId}"]`);
                const title = repo ? repo.name : (existing?.dataset.title || repoName);
                const desc = repo ? (repo.description || existing?.dataset.desc || '') : (existing?.dataset.desc || '');
                const link = repo ? repo.html_url : existing?.dataset.demo || existing?.dataset.link || '#';

                const tile = existing || document.createElement('div');
                tile.classList.add('tile');
                tile.setAttribute('tabindex', '0');
                tile.dataset.projectId = projId;
                tile.dataset.title = title;
                tile.dataset.desc = desc;
                tile.dataset.demo = link;

                // Ensure visual content: prefer existing background, otherwise use owner's avatar as a simple cover
                if (!existing) {
                    tile.style.background = `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('${repo?.owner?.avatar_url || 'assets/default-thumb.jpg'}') center/cover no-repeat`;
                    const overlay = document.createElement('div'); overlay.className = 'tile-overlay'; tile.appendChild(overlay);
                    const titleEl = document.createElement('div'); titleEl.className = 'tile-title'; titleEl.textContent = title; tile.appendChild(titleEl);
                    container.appendChild(tile);
                } else {
                    // update title/desc if we found repo
                    const titleEl = existing.querySelector('.tile-title');
                    if (titleEl) titleEl.textContent = title;
                }

                // Click behavior: navigate to demo or repo
                tile.addEventListener('click', () => {
                    if (link && link !== '#') window.open(link, '_blank', 'noopener');
                });
            });
        })
        .catch(() => {
            // silently fail — keep existing static content
            console.warn('Could not fetch GitHub repos for Top Picks, falling back to static tiles.');
        });
})();

// Stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat h3');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const increment = target / 50;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 30);
            } else {
                stat.textContent = target + '+';
            }
        };
        
        // Start animation when stat is visible
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    statObserver.unobserve(entry.target);
                }
            });
        });
        
        statObserver.observe(stat);
    });
}

animateStats();

console.log('%c🎬 Netflix-Style Portfolio Loaded! ', 'background: #e50914; color: white; font-size: 20px; padding: 10px;');

// Projects page: featured carousel
(function setupProjectsCarousel(){
    const featured = document.querySelector('[data-row="featured"]');
    if (!featured) return;
    const dataRow = featured.querySelector('.project-data');
    const prev = featured.querySelector('.row-nav.prev');
    const next = featured.querySelector('.row-nav.next');
    const video = document.getElementById('stage-video');
    const title = document.getElementById('stage-title');
    const desc = document.getElementById('stage-desc');
    const tagsEl = document.getElementById('stage-tags');
    const demo = document.getElementById('stage-demo');
    const git = document.getElementById('stage-github');
    if (!dataRow || !video || !title || !desc) return;

    let index = 0;
    let isAnimating = false;

    function getItems(){
        const list = Array.from(dataRow.querySelectorAll('.tile'));
        return list;
    }

    console.log('Projects carousel initialized. current tiles:', getItems().map(i=>i.dataset.projectId));

    // Create debug overlay + dots (visible helper for testing and quick jump)
    const debugOverlay = document.createElement('div');
    debugOverlay.className = 'proj-debug';
    debugOverlay.innerHTML = `<div id="proj-debug-text">Projects: <span id="proj-count">0</span></div><div class="proj-dots" id="proj-dots"></div>`;
    document.body.appendChild(debugOverlay);
    const dotsContainer = document.getElementById('proj-dots');
    const projCountEl = document.getElementById('proj-count');

    function updateDots(){
        const items = getItems();
        projCountEl.textContent = items.length;
        dotsContainer.innerHTML = '';
        items.forEach((it, idx) => {
            const d = document.createElement('div'); d.className = 'proj-dot';
            if (idx === index) d.classList.add('active');
            d.title = it.dataset.projectId || it.dataset.title || idx;
            d.addEventListener('click', () => { animateTo(idx, idx>index ? 'next' : 'prev'); });
            dotsContainer.appendChild(d);
        });
    }

    const stageMedia = featured.querySelector('.stage-media');
    const stageInfo = featured.querySelector('.stage-info');

    function setVideoSource(src){
        video.classList.remove('is-active');
        video.innerHTML = '';
        // Set attributes for better mobile behavior and quick start
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('preload', 'metadata');
        const s = document.createElement('source'); s.type = 'video/mp4'; s.src = src;
        video.appendChild(s);
        video.load();
        const play = () => { video.play().catch(()=>{}); video.classList.add('is-active'); };
        video.oncanplay = () => play();
        // small fallback if oncanplay is late
        setTimeout(play, 400);
    }

    function render(i){
        const items = getItems();
        if (!items || items.length === 0) { console.warn('No project tiles found in dataRow'); return; }
        if (i < 0) i = 0;
        if (i >= items.length) i = 0;
        const item = items[i]; if (!item) return;
        console.log('rendering project', i, item.dataset.projectId || item.dataset.title);
        title.textContent = item.dataset.title || '';
        desc.textContent = item.dataset.desc || '';
        tagsEl.innerHTML = '';
        (item.dataset.tags || '').split(',').map(t=>t.trim()).filter(Boolean).forEach(t => {
            const span = document.createElement('span'); span.className = 'tag'; span.textContent = t; tagsEl.appendChild(span);
        });
        if (demo) { const href = item.dataset.demo; if (href && href !== '#') { demo.href = href; demo.style.display=''; } else { demo.style.display='none'; } }
        if (git) { const href = item.dataset.github; if (href && href !== '#') { git.href = href; git.style.display=''; } else { git.style.display='none'; } }
        if (item.dataset.video) setVideoSource(item.dataset.video);
        // update dots active state
        updateDots();
        // Tiny zoom tweak for Picotat
        try {
            const pid = (item.dataset.projectId || '').toLowerCase();
            if (pid === 'picotat') {
                video.classList.add('stage-video-zoom');
            } else {
                video.classList.remove('stage-video-zoom');
            }
        } catch (e) { /* ignore */ }
    }

    function nextIdx(){ const items = getItems(); return items.length>0 ? (index + 1) % items.length : index; }
    function prevIdx(){ const items = getItems(); return items.length>0 ? (index - 1 + items.length) % items.length : index; }

    // init
    render(index);

    function animateTo(newIndex, direction){
        if (isAnimating) return;
        const items = getItems();
        if (!items || items.length < 2) { console.warn('Not enough projects to navigate:', items.length); return; }
        console.log('animateTo called', { newIndex, direction, currentIndex: index });
        isAnimating = true;
        prev?.classList.add('is-disabled');
        next?.classList.add('is-disabled');

        // animate out current
        if (stageMedia && stageInfo) {
            stageMedia.classList.remove('in-left-start','in-right-start');
            stageInfo.classList.remove('in-left-start','in-right-start');
            stageMedia.classList.add(direction === 'next' ? 'out-left' : 'out-right');
            stageInfo.classList.add(direction === 'next' ? 'out-left' : 'out-right');
        }

        // after out transition, swap content and animate in
        setTimeout(() => {
            // reset out classes
            stageMedia?.classList.remove('out-left','out-right');
            stageInfo?.classList.remove('out-left','out-right');

            // prepare entering side
            stageMedia?.classList.add(direction === 'next' ? 'in-right-start' : 'in-left-start');
            stageInfo?.classList.add(direction === 'next' ? 'in-right-start' : 'in-left-start');

            // update content
            index = newIndex;
            render(index);

            // allow browser to apply start transform then transition to normal
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    stageMedia?.classList.remove('in-right-start','in-left-start');
                    stageInfo?.classList.remove('in-right-start','in-left-start');
                });
            });

            // re-enable after transition
            setTimeout(() => { 
                isAnimating = false; 
                prev?.classList.remove('is-disabled');
                next?.classList.remove('is-disabled');
            }, 480);
        }, 200);
    }

    next?.addEventListener('click', () => { animateTo(nextIdx(), 'next'); });
    prev?.addEventListener('click', () => { animateTo(prevIdx(), 'prev'); });

    // keyboard
    featured.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); next?.click(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev?.click(); }
    });
})();
