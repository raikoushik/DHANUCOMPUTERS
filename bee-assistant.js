(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tips = [
        { text: 'Welcome to DhanuTech — power, computers, electronics and electrical solutions.', href: 'index.html', cta: 'Home' },
        { text: 'See latest laptops, desktops and accessories in Products.', href: 'products.html', cta: 'Products' },
        { text: 'Need custom work or support? Visit Contact for quick help.', href: 'contact.html', cta: 'Contact' }
    ];

    function startBirdAssistant() {
        const bird = document.createElement('button');
        bird.type = 'button';
        bird.className = 'bird-assistant';
        bird.setAttribute('aria-label', 'DhanuTech bird assistant');
        bird.innerHTML = `
            <svg class="bird-svg" viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                <defs>
                    <linearGradient id="birdBodyFill" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#fff5b1"/>
                        <stop offset="55%" stop-color="#facc15"/>
                        <stop offset="100%" stop-color="#eab308"/>
                    </linearGradient>
                </defs>
                <ellipse cx="86" cy="84" rx="40" ry="31" fill="url(#birdBodyFill)" stroke="#7c4a16" stroke-width="3"/>
                <ellipse class="bird-wing" cx="90" cy="87" rx="21" ry="14" fill="#f59e0b"/>
                <circle cx="56" cy="76" r="18" fill="url(#birdBodyFill)" stroke="#7c4a16" stroke-width="2.6"/>
                <circle cx="51" cy="74" r="4.6" fill="#111827"/>
                <circle cx="52.2" cy="72.5" r="1.3" fill="#fff"/>
                <polygon points="35,76 16,82 35,88" fill="#fb923c"/>
                <path d="M44 87 Q50 93 57 87" stroke="#9a3412" stroke-width="2.2" fill="none" stroke-linecap="round"/>
                <path d="M82 113 L80 128" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/>
                <path d="M95 113 L94 128" stroke="#7c2d12" stroke-width="3" stroke-linecap="round"/>
                <ellipse cx="79" cy="129" rx="5" ry="2.7" fill="#7c2d12"/>
                <ellipse cx="94" cy="129" rx="5" ry="2.7" fill="#7c2d12"/>
            </svg>
        `;

        const tooltip = document.createElement('aside');
        tooltip.className = 'bird-tooltip';

        const loveLayer = document.createElement('div');
        loveLayer.className = 'bird-love-layer';

        document.body.appendChild(loveLayer);
        document.body.appendChild(bird);
        document.body.appendChild(tooltip);

        const state = {
            x: Math.max(30, window.innerWidth - 160),
            y: Math.max(100, window.innerHeight - 230),
            tx: Math.max(30, window.innerWidth - 160),
            ty: Math.max(100, window.innerHeight - 230),
            t: 0,
            angle: 0
        };

        let tipIndex = 0;
        let hideTimer;

        function showTip(force) {
            if (typeof force === 'number') tipIndex = force % tips.length;
            const item = tips[tipIndex];
            tipIndex = (tipIndex + 1) % tips.length;
            tooltip.innerHTML = `<p>${item.text}</p><a class="bird-link" href="${item.href}">${item.cta}</a>`;
            tooltip.classList.add('show');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => tooltip.classList.remove('show'), 3200);
        }

        function emitLove(x, y) {
            const node = document.createElement('span');
            node.className = 'bird-love';
            node.textContent = Math.random() < 0.7 ? '❤' : '✨';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.setProperty('--dx', `${(Math.random() - 0.5) * 36}px`);
            loveLayer.appendChild(node);
            setTimeout(() => node.remove(), 1250);
        }

        function retarget() {
            state.tx = 28 + Math.random() * (window.innerWidth - 120);
            state.ty = 90 + Math.random() * (window.innerHeight - 260);
        }

        gsap.ticker.add(() => {
            state.t += 0.012;
            if (Math.abs(state.tx - state.x) < 20 && Math.abs(state.ty - state.y) < 20) retarget();

            const ox = Math.sin(state.t * 1.2) * 18;
            const oy = Math.cos(state.t * 1.7) * 11;

            state.x += (state.tx + ox - state.x) * 0.05;
            state.y += (state.ty + oy - state.y) * 0.05;
            state.angle += ((ox * 0.28) - state.angle) * 0.14;

            bird.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}deg)`;
            bird.style.setProperty('--wing', `${Math.sin(state.t * 18) * 16}deg`);

            tooltip.style.left = `${Math.max(12, state.x - 230)}px`;
            tooltip.style.top = `${Math.max(72, state.y - 8)}px`;

            if (Math.random() < 0.06) emitLove(state.x + 32, state.y + 30);
        });

        bird.addEventListener('mouseenter', () => {
            showTip();
            emitLove(state.x + 30, state.y + 10);
        });

        bird.addEventListener('click', () => {
            showTip();
            emitLove(state.x + 20, state.y + 16);
            emitLove(state.x + 44, state.y + 16);
        });

        window.addEventListener('resize', retarget);
        retarget();
        showTip(0);
        setInterval(() => showTip(), 10000);
    }

    if (window.gsap) {
        startBirdAssistant();
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
        script.onload = startBirdAssistant;
        document.head.appendChild(script);
    }
})();
