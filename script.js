
document.addEventListener('DOMContentLoaded', () => {
    // ── Intersection Observer for About Card Reveal ──
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('expanded');
            } else {
                entry.target.classList.remove('expanded');
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.about-section .scroll-reveal');
    scrollElements.forEach(el => observer.observe(el));

    // ── Typing Animation ──
    const typingText = document.getElementById('typing-text');
    const words = ["DEVELOPER", "DESIGNER", "PROGRAMMER", "WRITER", "CODER"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 60;
    const wordPause = 1500;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = wordPause;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    if (typingText) {
        // Wait for preloader to finish before starting the hero animation
        if (document.getElementById('preloader')) {
            window.addEventListener('preloaderComplete', type, { once: true });
        } else {
            type();
        }
    }

    // ── Hardware-Accelerated Custom Cursor (Fine Pointers Only) ──
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (isFinePointer && cursorDot && cursorOutline) {
        let mouseX = -100;
        let mouseY = -100;
        let outlineX = -100;
        let outlineY = -100;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }, { passive: true });

        function renderCursor() {
            outlineX += (mouseX - outlineX) * 0.18;
            outlineY += (mouseY - outlineY) * 0.18;
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);

        const interactables = document.querySelectorAll('a, button, .floating-icon, .filter-btn, .project-btn, .profile-card, .cert-item');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
        });
    }

    // ── Throttled Scroll Listener for Timeline (Eliminates Layout Thrashing) ──
    const timelineSections = document.querySelectorAll('.timeline');
    if (timelineSections.length) {
        let timelineTicking = false;

        function updateTimelines() {
            timelineSections.forEach(timelineSection => {
                const timelineProgress = timelineSection.querySelector('.timeline-progress');
                const timelineDots = timelineSection.querySelectorAll('.timeline-dot');

                if (timelineProgress) {
                    const sectionRect = timelineSection.getBoundingClientRect();
                    const sectionTop = sectionRect.top;
                    const sectionHeight = sectionRect.height;
                    const windowHeight = window.innerHeight;

                    const startOffset = windowHeight / 2;
                    let scrollDistance = startOffset - sectionTop;

                    let progressPercentage = (scrollDistance / sectionHeight) * 100;
                    progressPercentage = Math.max(0, Math.min(100, progressPercentage));

                    timelineProgress.style.height = `${progressPercentage}%`;

                    const lineBottom = timelineProgress.getBoundingClientRect().bottom;
                    timelineDots.forEach(dot => {
                        const dotTop = dot.getBoundingClientRect().top;
                        if (lineBottom > dotTop) {
                            dot.classList.add('active');
                        } else {
                            dot.classList.remove('active');
                        }
                    });
                }
            });
            timelineTicking = false;
        }

        window.addEventListener('scroll', () => {
            if (!timelineTicking) {
                requestAnimationFrame(updateTimelines);
                timelineTicking = true;
            }
        }, { passive: true });
    }

    // ── Experience Card Radial Glow ──
    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }, { passive: true });
    });

    // ── Back to Top Button ──
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
                backToTopBtn.classList.add('bounce');
            } else {
                backToTopBtn.classList.remove('bounce');
            }
        }, { passive: true });
    }

    // ── 3D About Card Tilt ──
    const aboutCard = document.querySelector('.glass-card');
    if (aboutCard && isFinePointer) {
        aboutCard.addEventListener('mousemove', (e) => {
            if (!aboutCard.classList.contains('expanded')) return;

            const rect = aboutCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            const title = aboutCard.querySelector('h2');
            const para = aboutCard.querySelector('p');

            if (title) title.style.transform = `translateZ(40px)`;
            if (para) para.style.transform = `translateZ(20px)`;

            aboutCard.style.transition = 'transform 0.1s ease-out';
            aboutCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        }, { passive: true });

        aboutCard.addEventListener('mouseleave', () => {
            if (!aboutCard.classList.contains('expanded')) return;

            aboutCard.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            aboutCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';

            const title = aboutCard.querySelector('h2');
            const para = aboutCard.querySelector('p');
            if (title) title.style.transform = 'translateZ(0)';
            if (para) para.style.transform = 'translateZ(0)';

            setTimeout(() => {
                aboutCard.style.transition = '';
            }, 600);
        });
    }

    // ── Contact Form Submission Handling ──
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            if (formStatus) {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }

            const formData = new FormData(contactForm);
            const payload = Object.fromEntries(formData);

            fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(async (response) => {
                    let result = await response.json();
                    if (response.status === 200 || response.status === 201) {
                        btn.innerHTML = '<span>Message Delivered!</span> <i class="fa-solid fa-check"></i>';
                        btn.style.background = 'linear-gradient(90deg, #22c55e, #16a34a, #22c55e)';
                        btn.style.borderColor = '#4ade80';
                        if (formStatus) {
                            formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                            formStatus.className = 'form-status success';
                        }
                        contactForm.reset();
                    } else {
                        btn.innerHTML = '<span>Error, Please Retry!</span> <i class="fa-solid fa-triangle-exclamation"></i>';
                        btn.style.background = 'linear-gradient(90deg, #ef4444, #dc2626, #ef4444)';
                        if (formStatus) {
                            formStatus.textContent = result.message || 'Error sending message. Please retry.';
                            formStatus.className = 'form-status error';
                        }
                    }
                })
                .catch(() => {
                    btn.innerHTML = '<span>Error!</span> <i class="fa-solid fa-triangle-exclamation"></i>';
                    btn.style.background = 'linear-gradient(90deg, #ef4444, #dc2626, #ef4444)';
                    if (formStatus) {
                        formStatus.textContent = 'Network error. Please check your connection and try again.';
                        formStatus.className = 'form-status error';
                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.style.borderColor = '';
                        btn.style.opacity = '1';
                        btn.style.pointerEvents = 'all';
                    }, 4000);
                });
        });
    }

    // ── Resume Modal with Keyboard Accessibility ──
    const resumeModal = document.getElementById('resumeModal');
    const openResumeBtn = document.getElementById('openResumeBtn');
    const closeResumeBtn = document.getElementById('closeResumeBtn');
    const footerResumeBtn = document.getElementById('footerResumeBtn');

    if (resumeModal && closeResumeBtn) {
        const openModal = (e) => {
            if (e) e.preventDefault();
            resumeModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            closeResumeBtn.focus();
        };

        const closeModal = () => {
            resumeModal.classList.remove('show');
            document.body.style.overflow = '';
            if (openResumeBtn) openResumeBtn.focus();
        };

        if (openResumeBtn) openResumeBtn.addEventListener('click', openModal);
        if (footerResumeBtn) footerResumeBtn.addEventListener('click', openModal);
        closeResumeBtn.addEventListener('click', closeModal);

        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && resumeModal.classList.contains('show')) {
                closeModal();
            }
        });
    }

    // ── Fast, Non-Blocking Skill Filtering (250ms Snappy Transitions) ──
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card[data-category]');

    if (filterBtns.length && skillCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                skillCards.forEach(card => {
                    const category = card.dataset.category;
                    const shouldShow = filter === 'all' || category === filter;

                    if (shouldShow) {
                        card.classList.remove('d-none');
                        requestAnimationFrame(() => {
                            card.classList.remove('filter-hide');
                        });
                    } else {
                        card.classList.add('filter-hide');
                        setTimeout(() => {
                            if (card.classList.contains('filter-hide')) {
                                card.classList.add('d-none');
                            }
                        }, 250);
                    }
                });
            });
        });
    }
});

// ══════════════════════════════════════════
//  PRELOADER (Brisk 1.2s Duration, Session Cache & Skip Button)
// ══════════════════════════════════════════
(function () {
    const preloader = document.getElementById('preloader');
    const sleekFill = document.getElementById('preloaderSleekFill');
    const particlesContainer = document.getElementById('preloaderParticles');
    const skipBtn = document.getElementById('preloaderSkipBtn');
    if (!preloader) return;

    // Lock body scroll while preloader is active
    document.body.classList.add('preloader-active');

    const hasVisited = sessionStorage.getItem('devhq_visited');
    const DURATION = hasVisited ? 400 : 1200; // Fast entry for returning visits
    const startTime = performance.now();
    let pageLoaded = false;
    let animationDone = false;
    let dismissed = false;

    // Floating particles
    if (particlesContainer && !hasVisited) {
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.classList.add('preloader-particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.bottom = -(Math.random() * 20) + '%';
            p.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
            p.style.animationDelay = (Math.random() * 0.8) + 's';
            p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
            particlesContainer.appendChild(p);
        }
    }

    function animate(now) {
        if (dismissed) return;
        const elapsed = now - startTime;
        let t = Math.min(elapsed / DURATION, 1);
        let easedT = 1 - Math.pow(1 - t, 3);

        if (sleekFill) {
            sleekFill.style.width = (easedT * 100) + '%';
        }

        if (easedT < 1) {
            requestAnimationFrame(animate);
        } else {
            animationDone = true;
            tryDismiss();
        }
    }

    requestAnimationFrame(animate);

    function tryDismiss() {
        if (dismissed || (!animationDone && !hasVisited)) return;
        dismissed = true;

        sessionStorage.setItem('devhq_visited', 'true');
        preloader.classList.add('loaded');
        document.body.classList.remove('preloader-active');
        document.body.classList.add('page-loaded');

        setTimeout(() => {
            preloader.remove();
            window.dispatchEvent(new Event('preloaderComplete'));
        }, 400);
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            tryDismiss();
        });
    }

    window.addEventListener('load', () => {
        pageLoaded = true;
        if (animationDone) tryDismiss();
    });
})();

// ══════════════════════════════════════════
//  SCROLL PROGRESS BAR
// ══════════════════════════════════════════
(function () {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
})();

// ══════════════════════════════════════════
//  FLOATING NAVBAR — Active Section Tracking
// ══════════════════════════════════════════
(function () {
    const nav = document.getElementById('siteNav');
    const indicator = document.getElementById('navIndicator');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    if (!nav || !indicator || !navLinks.length) return;

    const sectionIds = Array.from(navLinks).map(link => link.dataset.section);
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

    let currentActive = 'home';
    let navShown = false;

    function updateIndicator(activeLink) {
        if (!activeLink) return;
        const pill = nav.querySelector('.nav-pill');
        if (!pill) return;

        const pillRect = pill.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        const left = linkRect.left - pillRect.left;
        const width = linkRect.width;

        indicator.style.left = left + 'px';
        indicator.style.width = width + 'px';
    }

    function setActive(sectionId) {
        if (sectionId === currentActive) return;
        currentActive = sectionId;

        navLinks.forEach(link => {
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
                updateIndicator(link);
            } else {
                link.classList.remove('active');
            }
        });
    }

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    const heroSection = document.getElementById('home');
    let heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

    function checkNavVisibility() {
        const scrollY = window.scrollY;

        if (scrollY > heroHeight * 0.4 && !navShown) {
            nav.classList.add('nav-visible');
            navShown = true;
            requestAnimationFrame(() => {
                const activeLink = nav.querySelector('.nav-link.active');
                updateIndicator(activeLink);
            });
        } else if (scrollY <= heroHeight * 0.25 && navShown) {
            nav.classList.remove('nav-visible');
            navShown = false;
        }
    }

    window.addEventListener('scroll', checkNavVisibility, { passive: true });

    window.addEventListener('resize', () => {
        heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
        const activeLink = nav.querySelector('.nav-link.active');
        updateIndicator(activeLink);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.section;
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    checkNavVisibility();
})();
