// ===== PRELOADER =====
class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        if (!this.preloader) return;
        this.percentEl = document.getElementById('loaderPercent');
        this.progressEl = document.getElementById('loaderProgress');
        this.progress = 0;
        this.init();
    }

    init() {
        // Simulate loading progress
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hide(), 500);
            }
            this.updateProgress(this.progress);
        }, 200);

        // Fallback: force hide after 5 seconds max
        setTimeout(() => {
            if (this.preloader && this.preloader.style.display !== 'none') {
                this.updateProgress(100);
                this.hide();
            }
        }, 5000);
    }

    updateProgress(value) {
        if (!this.percentEl || !this.progressEl) return;
        const rounded = Math.round(value);
        this.percentEl.textContent = `${rounded}%`;
        this.progressEl.style.width = `${rounded}%`;
        
        // Update ARIA attributes
        const progressbar = document.querySelector('.loader-bar');
        if (progressbar) {
            progressbar.setAttribute('aria-valuenow', rounded);
        }
    }

    hide() {
        if (!this.preloader) return;
        this.preloader.classList.add('hide');
        setTimeout(() => {
            this.preloader.style.display = 'none';
            // Remove scroll lock
            document.body.classList.remove('preloading');
            // Mark as loaded
            document.body.classList.add('loaded');
            // Dispatch custom event for other scripts to listen
            window.dispatchEvent(new Event('preloaderComplete'));
        }, 500);
    }
}

// ===== PARTICLE SYSTEM BACKGROUND =====
class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, click: false };
        this.clickParticles = [];
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 12000);
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle(x = null, y = null) {
        return {
            x: x !== null ? x : Math.random() * this.canvas.width,
            y: y !== null ? y : Math.random() * this.canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8,
            opacity: Math.random() * 0.6 + 0.4,
            life: 1,
            color: Math.random() > 0.5 ? '#ff0033' : '#c41e3a'
        };
    }

    createClickParticle(x, y) {
        for (let i = 0; i < 15; i++) {
            const angle = (Math.PI * 2 * i) / 15;
            const speed = Math.random() * 3 + 2;
            this.clickParticles.push({
                x: x,
                y: y,
                size: Math.random() * 3 + 1,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                opacity: 1,
                life: 1,
                color: '#ff0033'
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mousedown', (e) => {
            this.createClickParticle(e.clientX, e.clientY);
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 0, 51, ${0.15 * (1 - distance / 120)})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            // Mouse attraction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 200) {
                    particle.x += dx * 0.005;
                    particle.y += dy * 0.005;
                }
            }
        });
    }

    updateClickParticles() {
        this.clickParticles = this.clickParticles.filter(p => p.life > 0);
        this.clickParticles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= 0.02;
            p.speedX *= 0.98;
            p.speedY *= 0.98;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 0, 51, ${particle.opacity})`;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = '#ff0033';
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    drawClickParticles() {
        this.clickParticles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 0, 51, ${particle.opacity * particle.life})`;
            this.ctx.shadowBlur = 10 * particle.life;
            this.ctx.shadowColor = '#ff0033';
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.connectParticles();
        this.updateParticles();
        this.updateClickParticles();
        this.drawParticles();
        this.drawClickParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// ===== 3D TILT EFFECT FOR CARDS =====
class Card3DTilt {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .skill-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    }

    handleMouseLeave(e, card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    }
}

// ===== MOUSE-TRACKING PARALLAX =====
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.holographic-frame, .about-photo, .skill-card');
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 20;
            this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 20;
            this.updateElements();
        });
    }

    updateElements() {
        this.elements.forEach((el, index) => {
            const speed = (index + 1) * 0.5;
            const x = this.mouse.x * speed;
            const y = this.mouse.y * speed;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// ===== GLITCH EFFECT =====
class GlitchEffect {
    constructor() {
        this.glitchElements = document.querySelectorAll('.glitch-text, .btn-primary');
        this.init();
    }

    init() {
        setInterval(() => {
            this.glitchElements.forEach(el => this.applyGlitch(el));
        }, 2000);
    }

    applyGlitch(element) {
        element.style.transform = `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px) skewX(${Math.random() * 2 - 1}deg)`;
        setTimeout(() => {
            element.style.transform = 'none';
        }, 50);
    }
}

// ===== DECODING TEXT EFFECT =====
class TextDecoder {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            const originalText = el.textContent;
            el.dataset.text = originalText;
            el.textContent = this.generateRandomString(originalText.length);
            el.addEventListener('mouseenter', () => this.decode(el, originalText));
        });
    }

    generateRandomString(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        return result;
    }

    decode(element, targetText) {
        let iterations = 0;
        const interval = setInterval(() => {
            element.textContent = targetText
                .split('')
                .map((char, index) => {
                    if (index < iterations) return targetText[index];
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join('');

            if (iterations >= targetText.length) clearInterval(interval);
            iterations += 1 / 2;
        }, 30);
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }
}

// ===== NAVBAR SCROLL EFFECT =====
class NavbarScroll {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.scrollThreshold = 50;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > this.scrollThreshold) {
                this.navbar.style.background = 'rgba(5, 5, 5, 0.95)';
                this.navbar.style.boxShadow = '0 5px 30px rgba(255, 0, 51, 0.3)';
            } else {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.9)';
                this.navbar.style.boxShadow = 'none';
            }
        });
    }
}

// ===== TYPING EFFECT =====
class TypingEffect {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            const text = el.textContent;
            el.textContent = '';
            this.typeWriter(el, text, 0);
        });
    }

    typeWriter(element, text, index) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => this.typeWriter(element, text, index + 1), 50);
        }
    }
}

// ===== UPTIME COUNTER =====
class UptimeCounter {
    constructor() {
        this.element = document.getElementById('uptime');
        if (this.element) this.start();
    }

    start() {
        let seconds = 0;
        setInterval(() => {
            seconds++;
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            this.element.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }, 1000);
    }
}

// ===== DATA STREAM ANIMATION =====
class DataStream {
    constructor() {
        this.container = document.querySelector('.data-stream');
        if (this.container) this.init();
    }

    init() {
        setInterval(() => {
            const spans = this.container.querySelectorAll('span');
            spans.forEach(span => {
                const binary = this.generateBinary();
                span.textContent = binary;
                span.style.opacity = Math.random() * 0.5 + 0.5;
            });
        }, 200);
    }

    generateBinary() {
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += Math.random() > 0.5 ? '1' : '0';
        }
        return result;
    }
}

// ===== FORM HANDLING =====
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (this.form) this.init();
    }

    init() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.querySelector('.btn-text').textContent;

            try {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));

                this.showNotification('Message transmitted successfully. Await response.', 'success');
                this.form.reset();
            } catch (error) {
                this.showNotification('Transmission failed. Retry.', 'error');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    showNotification(message, type) {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '✗'}</span>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// ===== CUSTOM CURSOR =====
class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursorDot = document.createElement('div');
        this.init();
    }

    init() {
        this.cursor.className = 'custom-cursor';
        this.cursorDot.className = 'cursor-dot';
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorDot);

        this.addStyles();
        this.setupEventListeners();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                width: 40px;
                height: 40px;
                border: 2px solid #ff0033;
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 99999;
                transition: transform 0.1s ease, border-color 0.2s ease;
                mix-blend-mode: difference;
            }
            .cursor-dot {
                width: 8px;
                height: 8px;
                background: #ff0033;
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 99999;
                transform: translate(-50%, -50%);
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 20 + 'px';
            this.cursor.style.top = e.clientY - 20 + 'px';
            this.cursorDot.style.left = e.clientX + 'px';
            this.cursorDot.style.top = e.clientY + 'px';
        });

        const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, .skill-card, .project-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.borderColor = '#ff0033';
                this.cursor.style.transform = 'scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.style.borderColor = '#ff0033';
                this.cursor.style.transform = 'scale(1)';
            });
        });
    }
}

// ===== MOUSE GLOW EFFECT =====
class MouseGlow {
    constructor() {
        this.glow = document.createElement('div');
        this.glow.className = 'mouse-glow';
        this.init();
    }

    init() {
        document.body.appendChild(this.glow);
        this.addStyles();
        this.setupEventListeners();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .mouse-glow {
                position: fixed;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(255, 0, 51, 0.15) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                transform: translate(-50%, -50%);
                transition: opacity 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.glow.style.left = e.clientX + 'px';
            this.glow.style.top = e.clientY + 'px';
        });
    }
}

// ===== RAINBOW GRADIENT TEXT =====
class RainbowText {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mouseenter', () => this.animateGradient(el));
        });
    }

    animateGradient(element) {
        let hue = 0;
        const interval = setInterval(() => {
            hue = (hue + 1) % 360;
            element.style.color = `hsl(${hue}, 100%, 50%)`;
            element.style.textShadow = `0 0 20px hsl(${hue}, 100%, 50%)`;
        }, 50);

        element.addEventListener('mouseleave', () => {
            clearInterval(interval);
            element.style.color = '#ff0033';
            element.style.textShadow = '0 0 10px #ff0033';
        }, { once: true });
    }
}

// ===== RANDOM GLITCH ON HOVER =====
class RandomGlitch {
    constructor() {
        this.images = document.querySelectorAll('.project-img, .about-photo');
        this.init();
    }

    init() {
        this.images.forEach(img => {
            img.addEventListener('mouseenter', () => this.glitch(img));
        });
    }

    glitch(element) {
        const originalSrc = element.innerHTML;
        const glitchSVG = `
            <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="rgba(0,0,0,0.8)"/>
                <text x="200" y="120" font-family="monospace" fill="#ff0033" text-anchor="middle" font-size="30">ACCESSING...</text>
                <line x1="50" y1="150" x2="350" y2="150" stroke="#ff0033" stroke-width="2">
                    <animate attributeName="x1" values="50;350;50" dur="0.5s" repeatCount="indefinite"/>
                    <animate attributeName="x2" values="350;50;350" dur="0.5s" repeatCount="indefinite"/>
                </line>
            </svg>
        `;
        element.innerHTML = glitchSVG;

        setTimeout(() => {
            element.innerHTML = originalSrc;
        }, 500);
    }
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize preloader first
    new Preloader();

    // Initialize particle background
    new ParticleNetwork();

    // Initialize 3D tilt
    new Card3DTilt();

    // Initialize parallax
    new ParallaxEffect();

    // Initialize glitch effects
    new GlitchEffect();

    // Initialize typing effect for subtitle (only the text span)
    new TypingEffect('.typing-text');

    // Initialize text decoding effect (only on elements with plain text, no children)
    new TextDecoder('.project-content h3, .home-description p, .about-text p, .stat-number, .footer-tagline');

    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize navbar scroll
    new NavbarScroll();

    // Initialize uptime counter
    new UptimeCounter();

    // Initialize data stream
    new DataStream();

    // Initialize form handler
    new FormHandler();

    // Initialize custom cursor (uncomment if desired)
    // new CustomCursor();

    // Initialize mouse glow
    new MouseGlow();

    // Initialize rainbow text
    new RainbowText('.home-title .highlight, .btn-primary, .nav-logo');

    // Initialize random glitch
    new RandomGlitch();
});

// ===== ADDITIONAL UTILITIES =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Log system initialization
console.log('%c NEON_PORTFOLIO_v2.077 INITIALIZED ', 'background: #ff0033; color: #000; font-weight: bold; padding: 10px;');
console.log('%c System Status: ONLINE ', 'color: #00ff00; font-weight: bold;');
