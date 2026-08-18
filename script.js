document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const htmlElement = document.documentElement;

    function getInitialTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return 'dark';
    }

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const current = htmlElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    }

    // Initialize theme
    setTheme(getInitialTheme());

    // Add listeners to all toggle buttons
    themeToggles.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    // Listen to system preference changes (only when no manual override)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // --- Mobile Menu Toggle ---
    const menuToggleBtn = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggleBtn && mobileMenu) {
        menuToggleBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });

        // Close mobile menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });
    }

    // --- Set current year in footer ---
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        const updateLinks = (links) => {
            links.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && href.includes(current) && current !== '') {
                    link.classList.add('active');
                }
            });
        };

        updateLinks(navLinks);
        updateLinks(mobileNavLinks);
    });

    // --- Live Data Fetching ---
    const fetchCodingStats = async () => {
        const lcStatsEl = document.getElementById('lc-stats');
        const cfStatsEl = document.getElementById('cf-stats');

        if (cfStatsEl) {
            try {
                const cfRes = await fetch('https://codeforces.com/api/user.info?handles=smrkamboj');
                const cfData = await cfRes.json();
                if (cfData.status === 'OK' && cfData.result.length > 0) {
                    const user = cfData.result[0];
                    cfStatsEl.classList.remove('loading');
                    cfStatsEl.innerHTML = `Rating: <strong>${user.rating || 'Unrated'}</strong> <br> Max: ${user.maxRating || 'Unrated'} (${user.maxRank || 'Unknown'})`;
                } else {
                    throw new Error('CF API failed');
                }
            } catch (error) {
                console.error('Error fetching CF stats:', error);
                cfStatsEl.classList.remove('loading');
                cfStatsEl.textContent = 'View Profile →';
            }
        }

        if (lcStatsEl) {
            try {
                const lcRes = await fetch('https://leetcode-api-faisalshohag.vercel.app/smrkamboj');
                if (!lcRes.ok) throw new Error('LC API response not OK');
                const lcData = await lcRes.json();
                if (lcData.totalSolved !== undefined) {
                    lcStatsEl.classList.remove('loading');
                    lcStatsEl.innerHTML = `<strong>${lcData.totalSolved}</strong> Solved <br> ${lcData.easySolved} Easy · ${lcData.mediumSolved} Medium · ${lcData.hardSolved} Hard`;
                } else {
                    throw new Error('LC API missing data');
                }
            } catch (error) {
                console.error('Error fetching LC stats:', error);
                lcStatsEl.classList.remove('loading');
                lcStatsEl.textContent = 'View Profile →';
            }
        }
    };

    fetchCodingStats();
});
