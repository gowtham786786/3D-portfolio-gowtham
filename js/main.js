        // 1. Loading Screen
        window.addEventListener('load', () => {
            const loader = document.getElementById('loading-screen');
            const progressBar = document.querySelector('.progress-bar-inner');
            if(progressBar) progressBar.style.width = '100%';
            
            setTimeout(() => {
                if(loader) loader.style.opacity = '0';
                
                const muteBtn = document.getElementById('hero-mute-toggle');
                if (muteBtn) {
                    muteBtn.classList.add('visible');
                }
                
                setTimeout(() => {
                    if(loader) loader.style.display = 'none';
                }, 500);
            }, 2000);
        });

        // 2. Dark Mode Toggle
        const darkToggle = document.getElementById('dark-toggle');
        const body = document.body;
        
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-mode');
            darkToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            darkToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
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

        window.addEventListener('scroll', () => {
            // Progress Bar
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            if(scrollProgress) scrollProgress.style.width = scrolled + '%';

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
            if(!typingElement) return;
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
        if(canvas) {
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
                if(window.innerWidth < 768) numberOfParticles = 40;

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
            document.getElementById('pdf-modal-iframe').src = pdfUrl + '#toolbar=1&navpanes=0&scrollbar=1&view=FitH';
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
            pdfModal.addEventListener('click', function(e) {
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
