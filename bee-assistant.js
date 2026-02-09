(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function start() {
        const tips = [
            { text: 'Explore our latest products and offers.', href: 'products.html', cta: 'View Products' },
            { text: 'Need a custom website? We offer web design services.', href: 'services.html', cta: 'Web Design' },
            { text: 'Talk to us directly on WhatsApp for quick support.', href: 'https://wa.me/919591555095', cta: 'Chat Now' }
        ];

        const canvas = document.createElement('canvas');
        canvas.className = 'bee-particle-canvas github-style';

        const bee = document.createElement('button');
        bee.type = 'button';
        bee.className = 'bee-assistant github-style';
        bee.setAttribute('aria-label', 'DhanuTech assistant bee');
        bee.innerHTML = `
            <svg class="bee-body" viewBox="0 0 170 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                <defs>
                    <linearGradient id="gBee" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#ffe480"/>
                        <stop offset="100%" stop-color="#f5b700"/>
                    </linearGradient>
                    <radialGradient id="gWing" cx="50%" cy="35%" r="80%">
                        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
                        <stop offset="100%" stop-color="#99f6e4" stop-opacity="0.2"/>
                    </radialGradient>
                </defs>
                <ellipse class="bee-wing wing-left" cx="54" cy="45" rx="14" ry="22" fill="url(#gWing)"/>
                <ellipse class="bee-wing wing-right" cx="114" cy="45" rx="14" ry="22" fill="url(#gWing)"/>
                <ellipse cx="84" cy="86" rx="44" ry="35" fill="url(#gBee)" stroke="#111827" stroke-width="5"/>
                <rect x="52" y="76" width="64" height="10" rx="5" fill="#111827"/>
                <rect x="52" y="92" width="64" height="10" rx="5" fill="#111827"/>
                <circle cx="72" cy="77" r="8" fill="#fff"/><circle cx="96" cy="77" r="8" fill="#fff"/>
                <circle cx="72" cy="78" r="4" fill="#0f172a"/><circle cx="96" cy="78" r="4" fill="#0f172a"/>
                <path d="M73 93 Q84 101 95 93" stroke="#7c2d12" stroke-width="3" fill="none" stroke-linecap="round"/>
            </svg>
        `;

        const tip = document.createElement('aside');
        tip.className = 'bee-tooltip github-style';

        document.body.appendChild(canvas);
        document.body.appendChild(bee);
        document.body.appendChild(tip);

        const ctx = canvas.getContext('2d');
        const particles = [];
        let tipIndex = 0;
        let hideTimer;

        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function showTip(force) {
            if (typeof force === 'number') tipIndex = force % tips.length;
            const item = tips[tipIndex];
            tipIndex = (tipIndex + 1) % tips.length;
            const external = item.href.startsWith('http');
            tip.innerHTML = `<p>${item.text}</p><a href="${item.href}" class="bee-tooltip-link" ${external ? 'target="_blank" rel="noopener noreferrer"' : ''}>${item.cta}</a>`;
            tip.classList.add('show');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => tip.classList.remove('show'), 3200);
        }

        function emit(x, y) {
            particles.push({ x, y, vx: (Math.random() - 0.5) * 0.2, vy: -0.22, a: 0.8, r: 2 + Math.random() * 2 });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (let i = particles.length - 1; i >= 0; i -= 1) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.a -= 0.02;
                if (p.a <= 0) {
                    particles.splice(i, 1);
                    continue;
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(250, 204, 21, ${p.a})`;
                ctx.fill();
            }
        }

        const state = {
            x: window.innerWidth - 120,
            y: window.innerHeight - 170,
            targetX: window.innerWidth - 120,
            targetY: window.innerHeight - 170,
            t: 0,
            angle: 0
        };

        gsap.ticker.add(() => {
            state.t += 0.012;
            const ox = Math.sin(state.t * 1.4) * 18;
            const oy = Math.cos(state.t * 1.9) * 12;

            state.x += ((state.targetX + ox) - state.x) * 0.08;
            state.y += ((state.targetY + oy) - state.y) * 0.08;
            state.angle += ((ox * 0.25) - state.angle) * 0.12;

            bee.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}deg)`;
            tip.style.left = `${Math.max(12, state.x - 210)}px`;
            tip.style.top = `${Math.max(80, state.y - 10)}px`;

            if (Math.random() < 0.45) emit(state.x + 38, state.y + 58);
            drawParticles();
        });

        function moveToCurrentSection() {
            const sections = [...document.querySelectorAll('section, .service-section, .page-header')];
            const mid = window.scrollY + window.innerHeight * 0.5;
            let nearest = null;
            let min = Infinity;
            sections.forEach((s) => {
                const d = Math.abs(s.offsetTop - mid);
                if (d < min) { min = d; nearest = s; }
            });
            if (!nearest) return;
            const rect = nearest.getBoundingClientRect();
            state.targetY = Math.min(window.innerHeight - 140, Math.max(120, rect.top + rect.height * 0.28));
            state.targetX = window.innerWidth - 120;
        }

        bee.addEventListener('mouseenter', () => {
            showTip();
            gsap.to(state, { duration: 0.7, t: state.t + 2.5, ease: 'power2.inOut' });
        });

        bee.addEventListener('click', () => showTip());
        window.addEventListener('scroll', moveToCurrentSection, { passive: true });
        window.addEventListener('resize', () => {
            resizeCanvas();
            state.targetX = window.innerWidth - 120;
        });

        resizeCanvas();
        showTip(0);
        setInterval(() => showTip(), 10000);
    }

    if (window.gsap) {
        start();
    } else {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
        s.onload = start;
        document.head.appendChild(s);
    }
})();
