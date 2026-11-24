
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

    // ── Smooth 60/120fps LERP Momentum Scroll for Experience Timeline ──
    const timelineSections = document.querySelectorAll('.timeline');
    if (timelineSections.length) {
        timelineSections.forEach(timelineSection => {
            const timelineProgress = timelineSection.querySelector('.timeline-progress');
            const timelineDots = timelineSection.querySelectorAll('.timeline-dot');

            if (!timelineProgress) return;

            let targetProgress = 0;
            let currentProgress = 0;
            let isRunning = false;

            function calculateTarget() {
                const sectionRect = timelineSection.getBoundingClientRect();
                const sectionTop = sectionRect.top;
                const sectionHeight = sectionRect.height;
                const windowHeight = window.innerHeight;

                // Timeline bar fills as it scrolls past viewport midpoint
                const startOffset = windowHeight * 0.55;
                const scrollDistance = startOffset - sectionTop;

                const pct = (scrollDistance / sectionHeight) * 100;
                targetProgress = Math.max(0, Math.min(100, pct));

                if (!isRunning) {
                    isRunning = true;
                    requestAnimationFrame(renderSmoothTimeline);
                }
            }

            function renderSmoothTimeline() {
                const diff = targetProgress - currentProgress;
                if (Math.abs(diff) > 0.05) {
                    currentProgress += diff * 0.12;
                    applyProgress(currentProgress);
                    requestAnimationFrame(renderSmoothTimeline);
                } else {
                    currentProgress = targetProgress;
                    applyProgress(currentProgress);
                    isRunning = false;
                }
            }

            function applyProgress(pct) {
                timelineProgress.style.height = `${pct.toFixed(2)}%`;
                const progressPx = (pct / 100) * timelineSection.offsetHeight;
                timelineDots.forEach(dot => {
                    const dotCenter = dot.offsetTop + (dot.offsetHeight / 2);
                    if (progressPx >= dotCenter) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }

            window.addEventListener('scroll', calculateTarget, { passive: true });
            window.addEventListener('resize', calculateTarget, { passive: true });
            calculateTarget();
        });
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

    // ── Smooth GSAP-Powered Skill Filtering (Fluid, Non-Jumping Transitions) ──
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card[data-category]');

    if (filterBtns.length && skillCards.length) {
        let isFiltering = false;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active') || isFiltering) return;

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                isFiltering = true;

                const toHide = [];
                const toShow = [];

                skillCards.forEach(card => {
                    const category = card.dataset.category;
                    const matches = filter === 'all' || category === filter;
                    const isVisible = !card.classList.contains('d-none');

                    if (matches) {
                        toShow.push(card);
                    } else if (isVisible) {
                        toHide.push(card);
                    }
                });

                function showFilteredCards(cards) {
                    cards.forEach(c => {
                        c.classList.remove('d-none', 'filter-hide');
                    });

                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(cards,
                            { opacity: 0, scale: 0.82, y: 18 },
                            {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                duration: 0.35,
                                stagger: 0.025,
                                ease: "back.out(1.4)",
                                onComplete: () => {
                                    isFiltering = false;
                                }
                            }
                        );
                    } else {
                        cards.forEach(c => c.style.opacity = '1');
                        isFiltering = false;
                    }
                }

                if (toHide.length && typeof gsap !== 'undefined') {
                    gsap.to(toHide, {
                        opacity: 0,
                        scale: 0.8,
                        y: 10,
                        duration: 0.2,
                        ease: "power2.in",
                        stagger: 0.015,
                        onComplete: () => {
                            toHide.forEach(c => c.classList.add('d-none'));
                            showFilteredCards(toShow);
                        }
                    });
                } else {
                    toHide.forEach(c => c.classList.add('d-none'));
                    showFilteredCards(toShow);
                }
            });
        });
    }

    // ── Custom Glassmorphic Purpose Dropdown Controller ──
    const customDropdown = document.getElementById('customPurposeDropdown');
    const nativeSelect = document.getElementById('purpose');

    if (customDropdown && nativeSelect) {
        const trigger = customDropdown.querySelector('.custom-select-trigger');
        const triggerText = customDropdown.querySelector('.custom-select-text');
        const options = customDropdown.querySelectorAll('.custom-select-option');

        function closeAllCustomDropdowns() {
            customDropdown.classList.remove('open');
            customDropdown.setAttribute('aria-expanded', 'false');
            options.forEach(opt => opt.classList.remove('focused'));
        }

        // Toggle open / close
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = customDropdown.classList.contains('open');
            closeAllCustomDropdowns();
            if (!isOpen) {
                customDropdown.classList.add('open');
                customDropdown.setAttribute('aria-expanded', 'true');
            }
        });

        // Option selection
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.dataset.value;
                const text = option.querySelector('.option-text').textContent;

                triggerText.textContent = text;
                triggerText.classList.remove('placeholder');
                customDropdown.classList.add('has-value');

                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                nativeSelect.value = value;
                nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));

                closeAllCustomDropdowns();
            });
        });

        // Keyboard accessibility
        customDropdown.addEventListener('keydown', (e) => {
            const isOpen = customDropdown.classList.contains('open');
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const focused = customDropdown.querySelector('.custom-select-option.focused');
                if (isOpen && focused) {
                    focused.click();
                } else {
                    customDropdown.classList.toggle('open');
                    customDropdown.setAttribute('aria-expanded', customDropdown.classList.contains('open'));
                }
            } else if (e.key === 'Escape') {
                closeAllCustomDropdowns();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (!isOpen) {
                    customDropdown.classList.add('open');
                    customDropdown.setAttribute('aria-expanded', 'true');
                    return;
                }
                const current = customDropdown.querySelector('.custom-select-option.focused') || customDropdown.querySelector('.custom-select-option.selected');
                const allOpts = Array.from(options);
                let idx = allOpts.indexOf(current);
                if (e.key === 'ArrowDown') {
                    idx = (idx + 1) % allOpts.length;
                } else {
                    idx = (idx - 1 + allOpts.length) % allOpts.length;
                }
                options.forEach(opt => opt.classList.remove('focused'));
                allOpts[idx].classList.add('focused');
                allOpts[idx].scrollIntoView({ block: 'nearest' });
            }
        });

        // Click outside closes dropdown
        document.addEventListener('click', (e) => {
            if (!customDropdown.contains(e.target)) {
                closeAllCustomDropdowns();
            }
        });

        // Reset sync with contact form
        const form = customDropdown.closest('form');
        if (form) {
            form.addEventListener('reset', () => {
                triggerText.textContent = 'Select the primary reason for reaching out...';
                triggerText.classList.add('placeholder');
                customDropdown.classList.remove('has-value', 'open');
                customDropdown.setAttribute('aria-expanded', 'false');
                options.forEach(opt => opt.classList.remove('selected', 'focused'));
                nativeSelect.value = '';
                if (window.__contactTypewriter) {
                    window.__contactTypewriter.resume();
                }
            });
        }
    }

    // ══════════════════════════════════════════════════════════
    //  SYNCHRONOUS CASE-BASED CONTACT FORM TYPEWRITER ENGINE
    // ══════════════════════════════════════════════════════════
    const contactCases = [
        {
            name: "Sarah Jenkins",
            email: "sarah.jenkins@techcorp.io",
            purpose: "Full-time / Internship Opportunity",
            message: "Hi Aakarsh, we love your full-stack engineering work and would love to discuss an SDE role."
        },
        {
            name: "Alex Rivera",
            email: "alex@venturelab.ai",
            purpose: "Project Collaboration / Freelance",
            message: "Hey Aakarsh, building an AI-native SaaS platform and looking for a strong systems engineer to collaborate on architecture."
        },
        {
            name: "Dr. Marcus Vance",
            email: "m.vance@systemsresearch.org",
            purpose: "Technical Advisory / Mentorship",
            message: "Hello Aakarsh, saw your work on Nyaya Saathi. Would love to exchange perspectives on autonomous agentic workflows."
        },
        {
            name: "Jordan Chen",
            email: "jordan.chen@cloudscale.dev",
            purpose: "Networking / Discussion",
            message: "Hey! Loved your 3D WebGL portfolio and Lighthouse optimizations. Let's connect for an engineering sync."
        },
        {
            name: "Elena Rostova",
            email: "elena.rostova@globaltech.com",
            purpose: "Other Inquiries",
            message: "Hi Aakarsh, reaching out regarding a technical keynote and panel discussion on next-gen developer tooling."
        }
    ];

    class SynchronousContactTypewriter {
        constructor(elements, cases, options = {}) {
            this.nameEl = elements.name;
            this.emailEl = elements.email;
            this.purposeEl = elements.purpose;
            this.messageEl = elements.message;
            this.customDropdown = elements.customDropdown;
            this.cases = cases;

            this.typeDuration = options.typeDuration || 1800; // ms to type full case
            this.deleteDuration = options.deleteDuration || 750; // ms to delete full case
            this.holdTime = options.holdTime || 2600; // ms to hold complete case
            this.pauseBetween = options.pauseBetween || 250; // ms pause before next case
            this.tickInterval = 30; // ms per update frame (crisp 33.3 fps)

            this.caseIndex = 0;
            this.state = 'idle'; // 'idle', 'typing', 'holding', 'deleting', 'paused'
            this.progress = 0;
            this.timer = null;
            this.isUserInteracting = false;
            this.hasStarted = false;
            this.isInView = false;

            this.init();
        }

        init() {
            const inputs = [this.nameEl, this.emailEl, this.messageEl].filter(Boolean);

            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    this.isUserInteracting = true;
                    clearTimeout(this.timer);
                    input.setAttribute('placeholder', '');
                });

                input.addEventListener('blur', () => {
                    setTimeout(() => {
                        this.checkInteractionState();
                    }, 150);
                });

                input.addEventListener('input', () => {
                    this.isUserInteracting = true;
                    clearTimeout(this.timer);
                });
            });

            if (this.customDropdown) {
                this.customDropdown.addEventListener('click', () => {
                    this.checkInteractionState();
                });
            }

            // Keep fields clear before the visitor arrives at the contact section
            this.renderSlice(0);

            // Observe contact section so typing motion begins strictly upon section visit
            const contactSection = document.getElementById('contact');
            if (contactSection && 'IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.isInView = true;
                            if (!this.hasStarted) {
                                this.hasStarted = true;
                                this.timer = setTimeout(() => {
                                    this.startTyping();
                                }, 300);
                            } else if (!this.isUserInteracting && this.state === 'paused') {
                                this.resume();
                            }
                        } else {
                            this.isInView = false;
                            // Pause off-screen to conserve resources and avoid missing motion
                            if (this.hasStarted && !this.isUserInteracting) {
                                this.state = 'paused';
                                clearTimeout(this.timer);
                            }
                        }
                    });
                }, { threshold: 0.2 });

                observer.observe(contactSection);
            } else {
                // Fallback for browsers without IntersectionObserver
                this.timer = setTimeout(() => {
                    this.startTyping();
                }, 1000);
            }
        }

        checkInteractionState() {
            const hasInputValue = [this.nameEl, this.emailEl, this.messageEl].some(
                el => el && el.value && el.value.trim().length > 0
            );
            const isAnyFocused = [this.nameEl, this.emailEl, this.messageEl].some(
                el => el && document.activeElement === el
            );
            const hasSelectedPurpose = this.customDropdown && this.customDropdown.classList.contains('has-value');

            if (!hasInputValue && !isAnyFocused && !hasSelectedPurpose) {
                this.isUserInteracting = false;
                this.resume();
            }
        }

        resume() {
            clearTimeout(this.timer);
            this.state = 'typing';
            this.progress = 0;
            this.timer = setTimeout(() => this.tickTyping(), 250);
        }

        renderSlice(progress) {
            const c = this.cases[this.caseIndex];
            const p = Math.max(0, Math.min(1, progress));

            // Name
            if (this.nameEl && (!this.nameEl.value || !this.nameEl.value.trim()) && document.activeElement !== this.nameEl) {
                const len = Math.ceil(c.name.length * p);
                this.nameEl.setAttribute('placeholder', c.name.substring(0, len));
            }

            // Email
            if (this.emailEl && (!this.emailEl.value || !this.emailEl.value.trim()) && document.activeElement !== this.emailEl) {
                const len = Math.ceil(c.email.length * p);
                this.emailEl.setAttribute('placeholder', c.email.substring(0, len));
            }

            // Purpose (Only if user hasn't actively selected a purpose)
            if (this.purposeEl && this.customDropdown && !this.customDropdown.classList.contains('has-value')) {
                const len = Math.ceil(c.purpose.length * p);
                const str = c.purpose.substring(0, len);
                this.purposeEl.textContent = str.length > 0 ? str : '\u00A0';
                this.purposeEl.classList.add('placeholder');
            }

            // Message
            if (this.messageEl && (!this.messageEl.value || !this.messageEl.value.trim()) && document.activeElement !== this.messageEl) {
                const len = Math.ceil(c.message.length * p);
                this.messageEl.setAttribute('placeholder', c.message.substring(0, len));
            }
        }

        startTyping() {
            if (this.isUserInteracting) return;
            this.state = 'typing';
            this.progress = 0;
            this.tickTyping();
        }

        tickTyping() {
            if (this.isUserInteracting) return;
            const step = this.tickInterval / this.typeDuration;
            this.progress += step;

            if (this.progress >= 1) {
                this.progress = 1;
                this.renderSlice(1);
                this.state = 'holding';
                this.timer = setTimeout(() => {
                    this.startDeleting();
                }, this.holdTime);
                return;
            }

            this.renderSlice(this.progress);
            this.timer = setTimeout(() => this.tickTyping(), this.tickInterval);
        }

        startDeleting() {
            if (this.isUserInteracting) return;
            this.state = 'deleting';
            this.tickDeleting();
        }

        tickDeleting() {
            if (this.isUserInteracting) return;
            const step = this.tickInterval / this.deleteDuration;
            this.progress -= step;

            if (this.progress <= 0) {
                this.progress = 0;
                this.renderSlice(0);
                this.caseIndex = (this.caseIndex + 1) % this.cases.length;
                this.timer = setTimeout(() => {
                    this.startTyping();
                }, this.pauseBetween);
                return;
            }

            this.renderSlice(this.progress);
            this.timer = setTimeout(() => this.tickDeleting(), this.tickInterval);
        }
    }

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const purposeText = document.querySelector('.custom-select-text');
    const customPurposeDropdown = document.getElementById('customPurposeDropdown');

    if (nameInput || emailInput || messageInput || purposeText) {
        window.__contactTypewriter = new SynchronousContactTypewriter({
            name: nameInput,
            email: emailInput,
            purpose: purposeText,
            message: messageInput,
            customDropdown: customPurposeDropdown
        }, contactCases, {
            typeDuration: 1800,
            deleteDuration: 750,
            holdTime: 2600,
            pauseBetween: 250
        });
    }
});

// ══════════════════════════════════════════
//  PRELOADER (2.4s Cinematic First Visit with Instant Reload Bypass)
// ══════════════════════════════════════════
(function () {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hasVisited = sessionStorage.getItem('devhq_visited');

    // ── If already visited in this session (e.g. page reload), bypass instantly ──
    if (hasVisited) {
        preloader.remove();
        document.body.classList.add('page-loaded');
        // Let natural browser scroll restoration keep their current section
        window.dispatchEvent(new Event('preloaderComplete'));
        return;
    }

    // ── First visit in this session: Always start at top and play cinematic sequence ──
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Lock body scroll while preloader is active
    document.body.classList.add('preloader-active');

    const sleekFill = document.getElementById('preloaderSleekFill');
    const particlesContainer = document.getElementById('preloaderParticles');

    const DURATION = 2400; // Balanced, adequate cinematic duration (~2.4s)
    const startTime = performance.now();
    let pageLoaded = document.readyState === 'complete';
    let animationDone = false;
    let dismissed = false;

    // Floating particles
    if (particlesContainer) {
        for (let i = 0; i < 45; i++) {
            const p = document.createElement('div');
            p.classList.add('preloader-particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.bottom = -(Math.random() * 20) + '%';
            p.style.animationDuration = (1.8 + Math.random() * 1.5) + 's';
            p.style.animationDelay = (Math.random() * 1.0) + 's';
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
        if (dismissed || !animationDone) return;
        dismissed = true;

        sessionStorage.setItem('devhq_visited', 'true');
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'auto';
        }

        preloader.classList.add('loaded');
        document.body.classList.remove('preloader-active');
        document.body.classList.add('page-loaded');

        setTimeout(() => {
            preloader.remove();
            window.dispatchEvent(new Event('preloaderComplete'));
        }, 500);
    }

    function forceDismiss() {
        if (dismissed) return;
        dismissed = true;
        animationDone = true;

        sessionStorage.setItem('devhq_visited', 'true');
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'auto';
        }

        preloader.classList.add('loaded');
        document.body.classList.remove('preloader-active');
        document.body.classList.add('page-loaded');

        setTimeout(() => {
            preloader.remove();
            window.dispatchEvent(new Event('preloaderComplete'));
        }, 300);
    }

    preloader.addEventListener('click', () => {
        forceDismiss();
    });

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
