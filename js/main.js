// 1. Loading Screen
window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.progress-bar-inner');
    if (progressBar) progressBar.style.width = '100%';

    setTimeout(() => {
        if (loader) loader.style.opacity = '0';

        const muteBtn = document.getElementById('hero-mute-toggle');
        if (muteBtn) {
            muteBtn.classList.add('visible');
        }

        setTimeout(() => {
            if (loader) loader.style.display = 'none';
        }, 500);
    }, 2000);
});

// 2. Dark Mode Toggle
const darkToggle = document.getElementById('dark-toggle');
const body = document.body;

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    body.classList.remove('dark-mode');
    darkToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
} else {
    body.classList.add('dark-mode');
    darkToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    if (!currentTheme) localStorage.setItem('theme', 'dark');
}

darkToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        darkToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        localStorage.setItem('theme', 'light');
        darkToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
});

// 3. Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navLinksMenu.classList.toggle('open');
});

navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinksMenu.classList.remove('open');
    });
});

// 4. Scroll Events: Progress Bar, Navbar Background, Active Links
const scrollProgress = document.getElementById('scroll-progress');
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section');
let lastSection = 'home';

window.addEventListener('scroll', () => {
    // Progress Bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) scrollProgress.style.width = scrolled + '%';

    // Navbar Scrolled State
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active Link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    if (current && current !== lastSection) {
        const heroVideo = document.getElementById('hero-video');
        const muteBtn = document.getElementById('hero-mute-toggle');
        if (heroVideo && muteBtn) {
            if (current !== 'home') {
                heroVideo.pause();
                heroVideo.currentTime = heroVideo.currentTime;
                heroVideo.muted = true;
                heroVideo.setAttribute('muted', '');
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                muteBtn.title = 'Unmute Introduction';
                muteBtn.setAttribute('data-state', 'muted');
            } else {
                heroVideo.muted = true;
                heroVideo.setAttribute('muted', '');
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                muteBtn.title = 'Unmute Introduction';
                muteBtn.setAttribute('data-state', 'muted');
            }
        }
        lastSection = current;
    }

    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// 5. Typing Effect
const roles = ["Software Developer", "AI Enthusiast", "Problem Solver", "Cloud Explorer", "React Developer"];
let roleIndex = 0;
let charIndex = 0;
const typingElement = document.getElementById('typing-text');
let isDeleting = false;

function typeEffect() {
    if (!typingElement) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = 80;
    if (isDeleting) typeSpeed = 40;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 1800; // Pause at the end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before typing next
    }

    setTimeout(typeEffect, typeSpeed);
}
typeEffect();

// 6. Scroll Animations (Intersection Observer)
const animateObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animateObserver.observe(el);
});

// 7. Animated Counters
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            let startTime = null;
            const duration = 1500;

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const easeOut = progress * (2 - progress);
                const currentCount = Math.floor(easeOut * target);

                counter.innerText = currentCount + suffix;

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            window.requestAnimationFrame(step);
            observer.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// 8. Particle Background
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = 80;
        // Responsive adjustments
        if (window.innerWidth < 768) numberOfParticles = 40;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 3) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;
            let color = 'rgba(126, 217, 87, 0.6)';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (120 * 120)) {
                    opacityValue = 1 - (distance / 14400);
                    ctx.strokeStyle = `rgba(126, 217, 87, ${opacityValue * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        initParticles();
    });

    initParticles();
    animateParticles();
}
function openPdfModal(pdfUrl) {
    const titleElement = document.getElementById('modal-title-text');
    if (titleElement) {
        const isResume = pdfUrl.toLowerCase().includes('software_engineer') || pdfUrl.toLowerCase().includes('resume');
        const isPatent = pdfUrl.toLowerCase().includes('patent');
        titleElement.textContent = isResume ? 'Resume Preview' : (isPatent ? 'Patent Document Viewer' : 'Document Viewer');
    }
    const isImage = pdfUrl.toLowerCase().endsWith('.png') || pdfUrl.toLowerCase().endsWith('.jpg') || pdfUrl.toLowerCase().endsWith('.jpeg');
    document.getElementById('pdf-modal-iframe').src = isImage ? pdfUrl : (pdfUrl + '#toolbar=1&navpanes=0&scrollbar=1&view=FitH');
    document.getElementById('pdf-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}
function closePdfModal() {
    document.getElementById('pdf-modal').style.display = 'none';
    document.getElementById('pdf-modal-iframe').src = '';
    document.body.style.overflow = 'auto';
}
// Close modal on clicking outside the card
const pdfModal = document.getElementById('pdf-modal');
if (pdfModal) {
    pdfModal.addEventListener('click', function (e) {
        if (e.target === this) {
            closePdfModal();
        }
    });
}

// 9. Video Controls (Clean Rebuild)
const video = document.getElementById('hero-video');
const muteToggleBtn = document.getElementById('hero-mute-toggle');

if (video && muteToggleBtn) {
    muteToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (video.muted) {
            // Unmute
            video.muted = false;
            video.removeAttribute('muted');
            video.volume = 1;

            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.log('Autoplay prevented:', error));
            }

            muteToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            muteToggleBtn.title = 'Mute Introduction';
            muteToggleBtn.setAttribute('data-state', 'unmuted');

            if (video.duration && video.currentTime > video.duration - 0.5) {
                video.currentTime = 0;
            }
        } else {
            // Mute
            video.muted = true;
            video.setAttribute('muted', '');
            muteToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            muteToggleBtn.title = 'Unmute Introduction';
            muteToggleBtn.setAttribute('data-state', 'muted');
        }
    });
}

// 10. Timeline Scroll Effect
const timeline = document.querySelector('.timeline');
if (timeline) {
    window.addEventListener('scroll', () => {
        const rect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
            const scrolled = Math.min(Math.max((windowHeight - rect.top) / (rect.height + windowHeight / 2) * 100, 0), 100);
            timeline.style.setProperty('--scroll-perc', `${scrolled}%`);
        }
    });
}

// 11. 3D Spatial Project Deck Controller
(function initSpatialProjectDeck() {
    const stage = document.getElementById('spatial-deck');
    const cards = document.querySelectorAll('.spatial-card');
    const tabs = document.querySelectorAll('.spatial-tab');
    const dots = document.querySelectorAll('.deck-dot');
    const prevBtn = document.getElementById('deck-prev');
    const nextBtn = document.getElementById('deck-next');

    if (!stage || cards.length === 0) return;

    let activeIndex = 0;
    const totalCards = cards.length;
    let isTicking = false;
    let currentX = 0;
    let currentY = 0;
    let activeCardRect = null;

    function resetTilt(card) {
        if (!card) return;
        card.classList.remove('is-tilting');
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
    }

    function setDeckIndex(newIndex) {
        activeCardRect = null;
        isTicking = false;
        activeIndex = ((newIndex % totalCards) + totalCards) % totalCards;

        cards.forEach((card, i) => {
            resetTilt(card);
            card.classList.remove('card-active', 'card-next', 'card-prev', 'card-back');

            const offset = ((i - activeIndex) % totalCards + totalCards) % totalCards;
            if (offset === 0) {
                card.classList.add('card-active');
                card.setAttribute('aria-hidden', 'false');
            } else if (offset === 1) {
                card.classList.add('card-next');
                card.setAttribute('aria-hidden', 'true');
            } else if (offset === 2) {
                card.classList.add('card-back');
                card.setAttribute('aria-hidden', 'true');
            } else {
                card.classList.add('card-prev');
                card.setAttribute('aria-hidden', 'true');
            }
        });

        tabs.forEach(tab => {
            const tabIdx = parseInt(tab.getAttribute('data-index') || tab.getAttribute('data-tab-index'), 10);
            tab.classList.toggle('active', tabIdx === activeIndex);
        });

        dots.forEach(dot => {
            const dotIdx = parseInt(dot.getAttribute('data-index'), 10);
            dot.classList.toggle('active', dotIdx === activeIndex);
        });
    }

    // Navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            setDeckIndex(activeIndex + 1);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            setDeckIndex(activeIndex - 1);
        });
    }

    // Top Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const idx = parseInt(tab.getAttribute('data-index') || tab.getAttribute('data-tab-index'), 10);
            if (!isNaN(idx)) setDeckIndex(idx);
        });
    });

    // Pagination Dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index'), 10);
            if (!isNaN(idx)) setDeckIndex(idx);
        });
    });

    // Clicking next/prev cards brings them forward
    cards.forEach((card) => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a') || e.target.closest('button')) return;

            if (card.classList.contains('card-next')) {
                setDeckIndex(activeIndex + 1);
            } else if (card.classList.contains('card-prev')) {
                setDeckIndex(activeIndex - 1);
            }
        });
    });

    // Ensure all project action links allow uninhibited navigation
    document.querySelectorAll('.card-actions a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            const url = link.getAttribute('href');
            if (url && url !== '#' && !url.startsWith('javascript:')) {
                window.open(url, '_blank', 'noopener,noreferrer');
                e.preventDefault();
            }
        });
    });

    // Mouse Tracking 3D Tilt for Active Card (Optimized with RAF & cached geometry to prevent lag)
    function getActiveCard() {
        return stage.querySelector('.spatial-card.card-active');
    }

    function updateTilt() {
        const activeCard = getActiveCard();
        if (!activeCard || !activeCardRect) {
            isTicking = false;
            return;
        }

        const x = currentX - activeCardRect.left;
        const y = currentY - activeCardRect.top;

        if (x >= -20 && x <= activeCardRect.width + 20 && y >= -20 && y <= activeCardRect.height + 20) {
            const centerX = activeCardRect.width / 2;
            const centerY = activeCardRect.height / 2;
            const maxTilt = 5.5;

            const rotateY = ((x - centerX) / centerX) * maxTilt;
            const rotateX = -((y - centerY) / centerY) * maxTilt;

            activeCard.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
            activeCard.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
        } else {
            resetTilt(activeCard);
        }

        isTicking = false;
    }

    function handleCardMouseMove(e) {
        currentX = e.clientX;
        currentY = e.clientY;

        if (!activeCardRect) {
            const activeCard = getActiveCard();
            if (activeCard) {
                activeCardRect = activeCard.getBoundingClientRect();
                activeCard.classList.add('is-tilting');
            }
        }

        if (!isTicking) {
            isTicking = true;
            requestAnimationFrame(updateTilt);
        }
    }

    function handleCardMouseLeave() {
        activeCardRect = null;
        isTicking = false;
        const activeCard = getActiveCard();
        if (activeCard) resetTilt(activeCard);
    }

    stage.addEventListener('mousemove', handleCardMouseMove, { passive: true });
    stage.addEventListener('mouseleave', handleCardMouseLeave);

    // Touch Swipe Navigation for Mobile
    let touchStartX = 0;
    let touchStartY = 0;

    stage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
        const diffX = e.changedTouches[0].screenX - touchStartX;
        const diffY = e.changedTouches[0].screenY - touchStartY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
            if (diffX < 0) {
                setDeckIndex(activeIndex + 1);
            } else {
                setDeckIndex(activeIndex - 1);
            }
        }
    }, { passive: true });

    // Keyboard Arrow Navigation
    window.addEventListener('keydown', (e) => {
        const projectsSec = document.getElementById('projects');
        if (!projectsSec) return;
        const rect = projectsSec.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3;
        if (inView) {
            if (e.key === 'ArrowRight') {
                setDeckIndex(activeIndex + 1);
            } else if (e.key === 'ArrowLeft') {
                setDeckIndex(activeIndex - 1);
            }
        }
    });
})();

// 12. 3D Spatial Tilt for Education Cards (RAF-throttled)
(function initEduCardTilt() {
    const eduCards = document.querySelectorAll('.edu-3d-card');
    if (eduCards.length === 0) return;

    eduCards.forEach(card => {
        let isHovered = false;
        let cardRect = null;
        let isTicking = false;
        let curX = 0;
        let curY = 0;

        function updateCardTilt() {
            if (!isHovered || !cardRect) {
                isTicking = false;
                return;
            }
            const x = curX - cardRect.left;
            const y = curY - cardRect.top;
            const centerX = cardRect.width / 2;
            const centerY = cardRect.height / 2;
            const maxTilt = 5.5;

            const rotateY = ((x - centerX) / centerX) * maxTilt;
            const rotateX = -((y - centerY) / centerY) * maxTilt;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale(1.02)`;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            isTicking = false;
        }

        card.addEventListener('mouseenter', () => {
            isHovered = true;
            cardRect = card.getBoundingClientRect();
        });

        card.addEventListener('mousemove', (e) => {
            curX = e.clientX;
            curY = e.clientY;
            if (!cardRect) cardRect = card.getBoundingClientRect();
            if (!isTicking) {
                isTicking = true;
                requestAnimationFrame(updateCardTilt);
            }
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            cardRect = null;
            isTicking = false;
            card.style.transform = '';
            card.style.removeProperty('--mouse-x');
            card.style.removeProperty('--mouse-y');
        });
    });
})();

// 13. 3D Spatial Tilt & Glare for Experience, Research, & Certification Cards (RAF-throttled)
(function initExpResearchAndCertTilt() {
    // Only enable on desktop pointer devices to preserve smooth touch scrolling on mobile
    if (window.matchMedia && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        return;
    }

    const interactiveCards = document.querySelectorAll('.exp-card, .research-card, .cert-card, .skill-category, .stat-card, .achieve-card, .contact-card');
    if (interactiveCards.length === 0) return;

    interactiveCards.forEach(card => {
        let isHovered = false;
        let cardRect = null;
        let isTicking = false;
        let curX = 0;
        let curY = 0;

        const isWide = card.classList.contains('exp-card') || card.classList.contains('research-card');
        const maxTilt = isWide ? 3.5 : (card.classList.contains('stat-card') || card.classList.contains('contact-card') ? 6.2 : (card.classList.contains('skill-category') ? 5.0 : 5.8));
        const perspectiveVal = isWide ? '1200px' : '1000px';

        function updateTilt() {
            if (!isHovered || !cardRect) {
                isTicking = false;
                return;
            }
            const x = curX - cardRect.left;
            const y = curY - cardRect.top;
            const centerX = cardRect.width / 2;
            const centerY = cardRect.height / 2;

            const rotateY = ((x - centerX) / centerX) * maxTilt;
            const rotateX = -((y - centerY) / centerY) * maxTilt;

            if (isWide) {
                card.style.transform = `perspective(${perspectiveVal}) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) translateZ(8px)`;
            } else {
                card.style.transform = `perspective(${perspectiveVal}) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale3d(1.015, 1.015, 1.015)`;
            }

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            isTicking = false;
        }

        card.addEventListener('mouseenter', () => {
            isHovered = true;
            cardRect = card.getBoundingClientRect();
            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.35s ease, border-color 0.35s ease';
        });

        card.addEventListener('mousemove', (e) => {
            curX = e.clientX;
            curY = e.clientY;
            if (!cardRect) cardRect = card.getBoundingClientRect();
            if (!isTicking) {
                isTicking = true;
                requestAnimationFrame(updateTilt);
            }
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            cardRect = null;
            isTicking = false;
            card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.35s ease';
            card.style.transform = '';
            card.style.removeProperty('--mouse-x');
            card.style.removeProperty('--mouse-y');
        });
    });
})();


