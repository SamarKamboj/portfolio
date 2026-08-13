document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check local storage for theme preference, default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Mobile Menu Toggle ---
    const menuToggleBtn = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    menuToggleBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    });

    // --- Set current year in footer ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it comes into view
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust offset to trigger active state earlier
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        const updateLinks = (links) => {
            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
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
