
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries, observer) => {
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

    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    const interactables = document.querySelectorAll('a, button, .floating-icon');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });

    const timelineSections = document.querySelectorAll('.timeline');

    timelineSections.forEach(timelineSection => {
        const timelineProgress = timelineSection.querySelector('.timeline-progress');
        const timelineDots = timelineSection.querySelectorAll('.timeline-dot');

        if (timelineProgress) {
            window.addEventListener('scroll', () => {
                const sectionRect = timelineSection.getBoundingClientRect();
                const sectionTop = sectionRect.top;
                const sectionHeight = sectionRect.height;
                const windowHeight = window.innerHeight;

                const startOffset = windowHeight / 2;
                let scrollDistance = startOffset - sectionTop;

                let progressPercentage = (scrollDistance / sectionHeight) * 100;
                progressPercentage = Math.max(0, Math.min(100, progressPercentage));

                timelineProgress.style.height = `${progressPercentage}%`;

                timelineDots.forEach(dot => {
                    const dotRect = dot.getBoundingClientRect();
                    const dotTop = dotRect.top;
                    const lineBottom = timelineProgress.getBoundingClientRect().bottom;

                    if (lineBottom > dotTop) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            });
        }
    });

    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

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
        });
    }

    const aboutCard = document.querySelector('.glass-card');
    if (aboutCard) {
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
        });

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

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);

            const json = JSON.stringify(object);

            fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {

                        btn.innerHTML = '<span>Message Delivered!</span> <i class="fa-solid fa-check"></i>';
                        btn.style.background = 'linear-gradient(90deg, #22c55e, #16a34a, #22c55e)';
                        btn.style.borderColor = '#4ade80';
                        contactForm.reset();
                        if (window.soundSystem) window.soundSystem.playSuccess();
                    } else {

                        btn.innerHTML = '<span>Error, Please Retry!</span> <i class="fa-solid fa-triangle-exclamation"></i>';
                        btn.style.background = 'linear-gradient(90deg, #ef4444, #dc2626, #ef4444)';
                        if (window.soundSystem) window.soundSystem.playError();
                    }
                })
                .catch(error => {

                    btn.innerHTML = '<span>Error!</span> <i class="fa-solid fa-triangle-exclamation"></i>';
                    btn.style.background = 'linear-gradient(90deg, #ef4444, #dc2626, #ef4444)';
                    if (window.soundSystem) window.soundSystem.playError();
                })
                .finally(() => {

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.style.borderColor = '';
                        btn.style.opacity = '1';
                        btn.style.pointerEvents = 'all';
                    }, 3000);
                });
        });
    }

    const resumeModal = document.getElementById('resumeModal');
    const openResumeBtn = document.getElementById('openResumeBtn');
    const closeResumeBtn = document.getElementById('closeResumeBtn');
    const footerResumeBtn = document.getElementById('footerResumeBtn');

    if (resumeModal && closeResumeBtn) {
        const openModal = (e) => {
            if (e) e.preventDefault();
            resumeModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            resumeModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        };

        if (openResumeBtn) openResumeBtn.addEventListener('click', openModal);
        if (footerResumeBtn) footerResumeBtn.addEventListener('click', openModal);
        closeResumeBtn.addEventListener('click', closeModal);

        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                closeModal();
            }
        });
    }

    // ── Interactive Skill Filtering ──
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card[data-category]');
    let isFiltering = false;

    if (filterBtns.length && skillCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (isFiltering) return;
                isFiltering = true;

                // Play click sound
                if (window.soundSystem) window.soundSystem.playClick();

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                // 1. Sequentially hide all currently visible cards
                const visibleCards = Array.from(skillCards).filter(card => !card.classList.contains('d-none'));

                visibleCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('filter-hide');
                    }, index * 30); // staggered fade out
                });

                // Wait for hide sequence to finish plus a little padding
                const hideDuration = visibleCards.length * 30 + 300;

                setTimeout(() => {
                    // 2. Change layout (display:none vs display:flex) while invisible
                    let cardsToShow = [];
                    skillCards.forEach(card => {
                        const category = card.dataset.category;
                        const shouldShow = filter === 'all' || category === filter;

                        // Force transition off for instant layout update
                        card.style.transition = 'none';

                        if (shouldShow) {
                            card.classList.remove('d-none');
                            card.classList.add('filter-hide'); // stay invisible
                            cardsToShow.push(card);
                        } else {
                            card.classList.add('d-none');
                        }
                    });

                    // Force reflow
                    skillCards.forEach(card => void card.offsetWidth);

                    // Restore transitions
                    skillCards.forEach(card => card.style.transition = '');

                    // 3. Sequentially show new cards
                    cardsToShow.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.remove('filter-hide');
                        }, index * 60); // slightly slower staggered fade in
                    });

                    // 4. Release filtering lock
                    const showDuration = cardsToShow.length * 60 + 400;
                    setTimeout(() => {
                        isFiltering = false;
                    }, showDuration);

                }, hideDuration);
            });
        });
    }

});

// ══════════════════════════════════════════
//  PRELOADER
// ══════════════════════════════════════════
(function () {
    const preloader = document.getElementById('preloader');
    const sleekFill = document.getElementById('preloaderSleekFill');
    const particlesContainer = document.getElementById('preloaderParticles');
    if (!preloader) return;

    const DURATION = 3500;         // Total animation duration in ms
    const startTime = performance.now();
    let pageLoaded = false;
    let animationDone = false;

    // ── Spawn floating particles ──
    if (particlesContainer) {
        for (let i = 0; i < 100; i++) {
            const p = document.createElement('div');
            p.classList.add('preloader-particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.bottom = -(Math.random() * 20) + '%';

            // Sync with the ~3.5s DURATION. Duration between 2s and 4s, delay up to 1.5s
            p.style.animationDuration = (2 + Math.random() * 2) + 's';
            p.style.animationDelay = (Math.random() * 1.5) + 's';
            p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
            particlesContainer.appendChild(p);
        }
    }

    // ── Smooth linear animation via requestAnimationFrame ──
    function animate(now) {
        const elapsed = now - startTime;
        // Ease-out cubic for a natural deceleration feel
        let t = Math.min(elapsed / DURATION, 1);
        let easedT = 1 - Math.pow(1 - t, 3);

        // If page has loaded and we're past 80%, accelerate to finish
        if (pageLoaded && easedT >= 0.8) {
            easedT = Math.min(easedT + (1 - easedT) * 0.1, 1);
        }

        // Update loading bar
        if (sleekFill) {
            sleekFill.style.width = (easedT * 100) + '%';
        }

        if (easedT < 1) {
            requestAnimationFrame(animate);
        } else {
            // Reached 100%
            if (sleekFill) sleekFill.style.width = '100%';
            animationDone = true;
            tryDismiss();
        }
    }

    requestAnimationFrame(animate);

    // ── Dismiss only when BOTH animation is done AND page is loaded ──
    function tryDismiss() {
        if (!animationDone || !pageLoaded) return;

        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => {
                preloader.remove();
                // Dispatch event to tell landing page to start animating
                document.body.classList.add('page-loaded');
                window.dispatchEvent(new Event('preloaderComplete'));
            }, 1000);
        }, 500);
    }

    window.addEventListener('load', () => {
        pageLoaded = true;
        tryDismiss();
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

    // ── Position the sliding indicator ──
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

    // ── Set active link ──
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

    // ── IntersectionObserver for section tracking ──
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

    // ── Show/hide navbar based on scroll position ──
    const heroSection = document.getElementById('home');
    let heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

    function checkNavVisibility() {
        const scrollY = window.scrollY;

        if (scrollY > heroHeight * 0.5 && !navShown) {
            nav.classList.add('nav-visible');
            navShown = true;
            // Initial indicator position
            requestAnimationFrame(() => {
                const activeLink = nav.querySelector('.nav-link.active');
                updateIndicator(activeLink);
            });
        } else if (scrollY <= heroHeight * 0.3 && navShown) {
            nav.classList.remove('nav-visible');
            navShown = false;
        }
    }

    window.addEventListener('scroll', checkNavVisibility, { passive: true });

    // ── Update indicator on resize ──
    window.addEventListener('resize', () => {
        heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
        const activeLink = nav.querySelector('.nav-link.active');
        updateIndicator(activeLink);
    });

    // ── Smooth scroll on nav link click ──
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

    // Initial check
    checkNavVisibility();
})();
