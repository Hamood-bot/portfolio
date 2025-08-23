// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Dark/Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Set initial navbar background
    updateNavbarBackground();
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Update navbar background for current scroll position
        updateNavbarBackground();
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    function updateNavbarBackground() {
        const navbar = document.querySelector('.navbar');
        const currentTheme = document.body.getAttribute('data-theme');
        
        if (window.scrollY > 50) {
            if (currentTheme === 'dark') {
                navbar.style.background = 'rgba(31, 41, 55, 0.98)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            }
        } else {
            if (currentTheme === 'dark') {
                navbar.style.background = 'rgba(31, 41, 55, 0.95)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        }
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Create mailto link
            const mailtoLink = `mailto:mohammadRsabra@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showFormMessage('Thank you! Your email client should open now.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        
        // Insert after form
        contactForm.parentNode.insertBefore(messageEl, contactForm.nextSibling);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    // Fix External Links
    initializeExternalLinks();
});

// Function to ensure external links work properly
function initializeExternalLinks() {
    // Get all external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        // Ensure proper attributes
        link.setAttribute('rel', 'noopener noreferrer');
        
        // Add click handler as fallback
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            
            if (url && url.startsWith('http')) {
                // Try to open in new window/tab
                const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
                
                // Fallback if popup blocked
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    // If popup is blocked, try location.href
                    window.location.href = url;
                }
            }
        });
        
        // Add debugging
        link.addEventListener('mouseenter', function() {
            console.log('Hovering over link:', this.href);
        });
    });
    
    // Special handling for social links
    const socialLinks = document.querySelectorAll('.social-link, .contact-link');
    socialLinks.forEach(link => {
        link.style.pointerEvents = 'auto';
        link.style.cursor = 'pointer';
        
        // Debug click events
        link.addEventListener('click', function(e) {
            console.log('Clicked link:', this.href);
        });
    });

    // Initialize GitHub Integration
    initializeGitHubIntegration();
}

// Smooth scrolling for navigation links
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

// Navbar background opacity on scroll
window.addEventListener('scroll', function() {
    updateNavbarBackground();
});

// Enhanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }, index * 100); // Stagger animation
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.project-card, .contact-method, .about-content, .hero-title, .hero-subtitle, .hero-description');
    
    animateElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Add scroll progress indicator
    createScrollProgress();
    
    // Add smooth parallax effect to hero
    addParallaxEffect();
    
    // Add typing animation to hero
    addTypingAnimation();
});

// Scroll Progress Indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', updateScrollProgress);
}

function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

// Parallax Effect
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Enhanced Typing Animation
function addTypingAnimation() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, 50);
        }, 1000);
    }
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    
    // Add floating animation to hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach((btn, index) => {
        setTimeout(() => {
            btn.classList.add('animate-fade-in-up');
        }, 1500 + (index * 200));
    });
});

// Initialize body opacity
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// Enhanced typing effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    element.style.borderRight = '2px solid #fbbf24';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    type();
}

// Add hover effect for project cards
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add click tracking for external links (optional analytics)
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
        const linkText = this.textContent.trim();
        const linkUrl = this.href;
        console.log(`External link clicked: ${linkText} - ${linkUrl}`);
        // You can add analytics tracking here if needed
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Performance optimization: Lazy load images when they come into view
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

// Apply lazy loading to any images with data-src attribute
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// GitHub Integration Functions
async function initializeGitHubIntegration() {
    const username = 'Hamood-bot';
    
    try {
        // Fetch GitHub user data
        await fetchGitHubUserData(username);
        
        // Fetch repositories
        await fetchGitHubRepositories(username);
        
        // Fetch commit count
        await fetchCommitCount(username);
        
    } catch (error) {
        console.log('GitHub API error:', error);
        // Fallback to static content if API fails
        showFallbackContent();
    }
}

async function fetchGitHubUserData(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const userData = await response.json();
        
        // Update profile stats
        document.getElementById('followers-count').textContent = userData.followers || '0';
        document.getElementById('repos-count').textContent = userData.public_repos || '0';
        
    } catch (error) {
        console.log('Error fetching user data:', error);
        // Use fallback numbers
        document.getElementById('followers-count').textContent = '2';
        document.getElementById('repos-count').textContent = '8';
    }
}

async function fetchCommitCount(username) {
    try {
        // Use a simpler approach for commit count
        const commitsElement = document.getElementById('commits-count');
        
        // Get user's events to estimate activity
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
        if (eventsResponse.ok) {
            const events = await eventsResponse.json();
            const pushEvents = events.filter(event => event.type === 'PushEvent');
            let totalCommits = 0;
            
            pushEvents.forEach(event => {
                if (event.payload && event.payload.commits) {
                    totalCommits += event.payload.commits.length;
                }
            });
            
            // This is just recent activity, so we'll estimate total
            const estimatedTotal = Math.max(totalCommits * 3, 50); // Multiply by 3 for estimation
            commitsElement.textContent = estimatedTotal > 100 ? `${Math.floor(estimatedTotal/10)*10}+` : estimatedTotal.toString();
        } else {
            commitsElement.textContent = '150+'; // Reasonable fallback
        }
        
    } catch (error) {
        console.log('Error fetching commit count:', error);
        document.getElementById('commits-count').textContent = '150+';
    }
}

async function fetchGitHubRepositories(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        
        const reposContainer = document.getElementById('repos-container');
        reposContainer.innerHTML = '';
        
        // Show top repositories
        repos.slice(0, 3).forEach(repo => {
            const repoCard = createRepositoryCard(repo);
            reposContainer.appendChild(repoCard);
        });
        
    } catch (error) {
        console.log('Error fetching repositories:', error);
        showFallbackRepositories();
    }
}

function createRepositoryCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    
    // Language colors
    const languageColors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C#': '#239120',
        'C++': '#f34b7d',
        'HTML': '#e34c26',
        'CSS': '#1572B6',
        'TypeScript': '#2b7489',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'PHP': '#4F5D95'
    };
    
    const languageColor = languageColors[repo.language] || '#888888';
    
    card.innerHTML = `
        <div class="repo-header">
            <a href="${repo.html_url}" target="_blank" class="repo-name">
                <i class="fas fa-book"></i>
                ${repo.name}
            </a>
            <span class="repo-visibility ${repo.private ? 'private' : 'public'}">
                ${repo.private ? 'Private' : 'Public'}
            </span>
        </div>
        <p class="repo-description">
            ${repo.description || 'No description available'}
        </p>
        <div class="repo-stats">
            <div class="repo-language">
                ${repo.language ? `<span class="language-dot" style="background-color: ${languageColor}"></span>
                <span>${repo.language}</span>` : ''}
            </div>
            <div class="repo-meta">
                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            </div>
        </div>
    `;
    
    return card;
}

function showFallbackRepositories() {
    const reposContainer = document.getElementById('repos-container');
    reposContainer.innerHTML = `
        <div class="repo-card">
            <div class="repo-header">
                <a href="https://github.com/Hamood-bot/SupermarketInventory" target="_blank" class="repo-name">
                    <i class="fas fa-book"></i>
                    SupermarketInventory
                </a>
                <span class="repo-visibility public">Public</span>
            </div>
            <p class="repo-description">
                A comprehensive inventory management application built with C# and .NET
            </p>
            <div class="repo-stats">
                <div class="repo-language">
                    <span class="language-dot" style="background-color: #239120"></span>
                    <span>C#</span>
                </div>
                <div class="repo-meta">
                    <span><i class="fas fa-star"></i> 2</span>
                    <span><i class="fas fa-code-branch"></i> 1</span>
                </div>
            </div>
        </div>
        <div class="repo-card">
            <div class="repo-header">
                <a href="https://github.com/Hamood-bot/portfolio" target="_blank" class="repo-name">
                    <i class="fas fa-book"></i>
                    portfolio
                </a>
                <span class="repo-visibility public">Public</span>
            </div>
            <p class="repo-description">
                Professional portfolio website showcasing projects and skills
            </p>
            <div class="repo-stats">
                <div class="repo-language">
                    <span class="language-dot" style="background-color: #e34c26"></span>
                    <span>HTML</span>
                </div>
                <div class="repo-meta">
                    <span><i class="fas fa-star"></i> 1</span>
                    <span><i class="fas fa-code-branch"></i> 0</span>
                </div>
            </div>
        </div>
        <div class="repo-card">
            <div class="repo-header">
                <a href="https://github.com/Hamood-bot" target="_blank" class="repo-name">
                    <i class="fas fa-book"></i>
                    Game Projects
                </a>
                <span class="repo-visibility public">Public</span>
            </div>
            <p class="repo-description">
                Collection of game development projects using Godot and Roblox
            </p>
            <div class="repo-stats">
                <div class="repo-language">
                    <span class="language-dot" style="background-color: #f1e05a"></span>
                    <span>GDScript</span>
                </div>
                <div class="repo-meta">
                    <span><i class="fas fa-star"></i> 3</span>
                    <span><i class="fas fa-code-branch"></i> 1</span>
                </div>
            </div>
        </div>
    `;
}

function showFallbackContent() {
    document.getElementById('followers-count').textContent = '10+';
    document.getElementById('repos-count').textContent = '5+';
    showFallbackRepositories();
}
