(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const suggestions = [
        { text: 'Need a new laptop? Explore our latest products.', href: 'products.html', cta: 'View Products' },
        { text: 'Get quick support and pricing on WhatsApp.', href: 'https://wa.me/919591555095', cta: 'Chat on WhatsApp' },
        { text: 'Build your dream PC with our customization service.', href: 'customization.html', cta: 'Customize Now' },
        { text: 'Discover CCTV, power backup, and electrical services.', href: 'services.html', cta: 'See Services' },
        { text: 'Read useful tech tips and updates in our blog.', href: 'blog.html', cta: 'Read Blog' }
    ];

    const flowerSpots = [
        { x: 0.08, y: 0.8 }, { x: 0.18, y: 0.88 }, { x: 0.3, y: 0.82 },
        { x: 0.44, y: 0.9 }, { x: 0.56, y: 0.8 }, { x: 0.7, y: 0.88 }, { x: 0.84, y: 0.82 }
    ];

    const sky = document.createElement('div');
    sky.className = 'bee-sky-glow';

    const garden = document.createElement('div');
    garden.className = 'bee-garden';

    const trailLayer = document.createElement('div');
    trailLayer.className = 'bee-trail-layer';

    const shadow = document.createElement('div');
    shadow.className = 'bee-shadow';

    const nest = document.createElement('div');
    nest.className = 'bee-nest';

    const bee = document.createElement('button');
    bee.type = 'button';
    bee.className = 'bee-assistant';
    bee.setAttribute('aria-label', 'Interactive bumblebee guide mascot');
    bee.innerHTML = `
        <svg class="bee-body" viewBox="0 0 260 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
            <defs>
                <radialGradient id="beeAura" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#fde68a" stop-opacity="0.58"/>
                    <stop offset="100%" stop-color="#fde68a" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="beeGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#fff8b8"/>
                    <stop offset="50%" stop-color="#facc15"/>
                    <stop offset="100%" stop-color="#eab308"/>
                </linearGradient>
                <radialGradient id="beeFurShade" cx="45%" cy="30%" r="75%">
                    <stop offset="0%" stop-color="#43302b"/>
                    <stop offset="100%" stop-color="#1f1715"/>
                </radialGradient>
                <radialGradient id="wingSSS" cx="50%" cy="40%" r="80%">
                    <stop offset="0%" stop-color="#f0fdff" stop-opacity="0.84"/>
                    <stop offset="70%" stop-color="#99f6e4" stop-opacity="0.32"/>
                    <stop offset="100%" stop-color="#67e8f9" stop-opacity="0.08"/>
                </radialGradient>
            </defs>

            <circle cx="130" cy="122" r="88" fill="url(#beeAura)" class="bee-aura"/>

            <ellipse class="bee-wing wing-left" cx="88" cy="79" rx="24" ry="34" fill="url(#wingSSS)"/>
            <ellipse class="bee-wing wing-right" cx="171" cy="79" rx="24" ry="34" fill="url(#wingSSS)"/>

            <ellipse cx="130" cy="132" rx="64" ry="52" fill="url(#beeGold)"/>
            <ellipse cx="130" cy="132" rx="64" ry="52" fill="none" stroke="#111827" stroke-width="7"/>
            <ellipse cx="130" cy="102" rx="47" ry="39" fill="url(#beeFurShade)"/>

            <path d="M78 126 C100 116 160 116 182 126 L182 136 C160 130 100 130 78 136 Z" fill="#0f172a" opacity="0.95"/>
            <path d="M78 146 C100 136 160 136 182 146 L182 156 C160 150 100 150 78 156 Z" fill="#0f172a" opacity="0.95"/>

            <path d="M102 95 Q111 90 120 95" stroke="#111827" stroke-width="3.3" fill="none" stroke-linecap="round"/>
            <path d="M140 95 Q149 90 158 95" stroke="#111827" stroke-width="3.3" fill="none" stroke-linecap="round"/>

            <circle cx="114" cy="109" r="12.5" fill="#fff"/>
            <circle cx="147" cy="109" r="12.5" fill="#fff"/>
            <circle cx="114" cy="110" r="6.7" fill="#0f172a"/>
            <circle cx="147" cy="110" r="6.7" fill="#0f172a"/>
            <circle cx="116.6" cy="106" r="1.8" fill="#fff"/>
            <circle cx="149.6" cy="106" r="1.8" fill="#fff"/>

            <ellipse cx="102" cy="120" rx="6" ry="4" fill="#fb7185" opacity="0.35"/>
            <ellipse cx="159" cy="120" rx="6" ry="4" fill="#fb7185" opacity="0.35"/>
            <path d="M116 128 Q130 138 144 128" stroke="#7c2d12" stroke-width="4" fill="none" stroke-linecap="round"/>

            <g class="bee-fur-strands" stroke="#2c211d" stroke-width="1.2" stroke-linecap="round" opacity="0.58">
                <path d="M106 88 l-2 -6"/>
                <path d="M113 86 l-1 -7"/>
                <path d="M120 85 l0 -7"/>
                <path d="M127 84 l1 -7"/>
                <path d="M134 84 l2 -6"/>
                <path d="M141 85 l2 -6"/>
            </g>

            <path d="M118 74 Q109 40 90 31" stroke="#1f2937" stroke-width="3.5" fill="none"/>
            <path d="M142 74 Q151 40 170 31" stroke="#1f2937" stroke-width="3.5" fill="none"/>
            <circle cx="88" cy="30" r="7.5" fill="#f59e0b"/>
            <circle cx="172" cy="30" r="7.5" fill="#f59e0b"/>
        </svg>
    `;

    const tooltip = document.createElement('aside');
    tooltip.className = 'bee-tooltip';

    document.body.appendChild(sky);
    document.body.appendChild(garden);
    document.body.appendChild(trailLayer);
    document.body.appendChild(nest);
    document.body.appendChild(shadow);
    document.body.appendChild(bee);
    document.body.appendChild(tooltip);

    flowerSpots.forEach((spot, i) => {
        const flower = document.createElement('div');
        flower.className = `bee-flower flower-${i % 4}`;
        flower.innerHTML = `
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="50" cy="50" r="14" fill="#f59e0b"/>
                <ellipse cx="50" cy="22" rx="11" ry="18" fill="#f472b6"/>
                <ellipse cx="50" cy="78" rx="11" ry="18" fill="#f472b6"/>
                <ellipse cx="22" cy="50" rx="18" ry="11" fill="#f472b6"/>
                <ellipse cx="78" cy="50" rx="18" ry="11" fill="#f472b6"/>
                <ellipse cx="31" cy="31" rx="12" ry="9" fill="#f9a8d4"/>
                <ellipse cx="69" cy="31" rx="12" ry="9" fill="#f9a8d4"/>
            </svg>
        `;
        spot.element = flower;
        document.body.appendChild(flower);
    });

    let x = window.innerWidth * 0.35;
    let y = window.innerHeight * 0.35;
    let phase = 0;
    let centerX = x;
    let centerY = y;
    let targetCenterX = centerX;
    let targetCenterY = centerY;
    let targetHoldUntil = 0;
    let scrollBoost = 0;
    let mouseX = x;
    let mouseY = y;
    let idleMode = false;
    let suggestionIndex = 0;
    let hideTipTimer;
    let nestX = 110;
    let nestY = window.innerHeight - 105;

    function positionScene() {
        nestX = Math.max(90, Math.min(window.innerWidth - 130, window.innerWidth * 0.12));
        nestY = window.innerHeight - 105;
        nest.style.left = `${nestX}px`;
        nest.style.top = `${nestY}px`;
        flowerSpots.forEach((spot) => {
            spot.element.style.left = `${Math.round(window.innerWidth * spot.x)}px`;
            spot.element.style.top = `${Math.round(window.innerHeight * spot.y)}px`;
        });
    }

    function showSuggestion(forceIndex) {
        if (typeof forceIndex === 'number') {
            suggestionIndex = forceIndex % suggestions.length;
        }
        const item = suggestions[suggestionIndex];
        suggestionIndex = (suggestionIndex + 1) % suggestions.length;
        const external = item.href.startsWith('http');
        tooltip.innerHTML = `<p>${item.text}</p><a href="${item.href}" class="bee-tooltip-link" ${external ? 'target="_blank" rel="noopener noreferrer"' : ''}>${item.cta}</a>`;
        tooltip.classList.add('show');
        clearTimeout(hideTipTimer);
        hideTipTimer = setTimeout(() => tooltip.classList.remove('show'), 4200);
    }

    function spawnLoveParticle(speed) {
        const p = document.createElement('span');
        p.className = Math.random() < 0.48 ? 'bee-sparkle heart' : 'bee-sparkle';
        p.style.left = `${x + 26 + Math.random() * 10}px`;
        p.style.top = `${y + 40 + Math.random() * 8}px`;
        p.style.setProperty('--sparkle-size', `${4 + Math.min(9, speed * 14)}px`);
        trailLayer.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
    }

    function pickIdleCenter(now) {
        targetCenterX = Math.random() < 0.5 ? Math.max(90, Math.min(window.innerWidth - 90, mouseX)) : nestX;
        targetCenterY = Math.random() < 0.5 ? Math.max(95, Math.min(window.innerHeight - 130, mouseY - 35)) : nestY;
        targetHoldUntil = now + 2200;
    }

    function updateNearbyFlowers() {
        flowerSpots.forEach((spot) => {
            const fx = window.innerWidth * spot.x;
            const fy = window.innerHeight * spot.y;
            const d = Math.hypot(fx - x, fy - y);
            if (d < 150) {
                spot.element.classList.add('is-visited');
            } else {
                spot.element.classList.remove('is-visited');
            }
        });
    }

    function animate(now) {
        phase += 0.014 + scrollBoost * 0.0015;
        scrollBoost *= 0.9;

        if (idleMode) {
            if (now > targetHoldUntil) {
                pickIdleCenter(now);
            }
        } else {
            targetCenterX = window.innerWidth * 0.5 + Math.sin(phase * 0.35) * window.innerWidth * 0.18;
            targetCenterY = window.innerHeight * 0.4 + Math.cos(phase * 0.28) * window.innerHeight * 0.14;
        }

        centerX += (targetCenterX - centerX) * 0.014;
        centerY += (targetCenterY - centerY) * 0.014;

        const fig8x = Math.sin(phase * 1.05) * 96;
        const fig8y = Math.sin(phase * 2.1) * 52;
        const microX = Math.sin(phase * 5.4) * 4;
        const microY = Math.cos(phase * 4.7) * 3;

        const nx = centerX + fig8x + microX;
        const ny = centerY + fig8y + microY;

        const dx = nx - x;
        const dy = ny - y;
        const speed = Math.hypot(dx, dy) * 0.025;

        x += dx * 0.082;
        y += dy * 0.082;

        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        bee.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle * 0.1}deg)`;

        shadow.style.transform = `translate3d(${x + 28}px, ${Math.min(window.innerHeight - 52, y + 92)}px, 0) scale(${0.75 + Math.min(0.28, speed * 1.4)})`;
        shadow.style.opacity = `${0.15 + Math.min(0.25, speed * 0.9)}`;

        tooltip.style.left = `${Math.min(window.innerWidth - 270, x + 56)}px`;
        tooltip.style.top = `${Math.max(84, y - 24)}px`;

        document.documentElement.style.setProperty('--bee-x', `${x}px`);
        document.documentElement.style.setProperty('--bee-y', `${y}px`);

        const wingSkew = Math.min(1.15, 0.82 + speed * 0.9);
        bee.style.setProperty('--wing-squash', wingSkew.toFixed(3));

        if (speed > 0.1) {
            spawnLoveParticle(speed);
        }

        updateNearbyFlowers();
        requestAnimationFrame(animate);
    }

    bee.addEventListener('mouseenter', () => {
        showSuggestion();
        idleMode = true;
        targetHoldUntil = 0;
    });

    bee.addEventListener('mouseleave', () => {
        idleMode = false;
    });

    bee.addEventListener('click', () => {
        showSuggestion();
    });

    let idleTimer;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        idleMode = false;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            idleMode = true;
            targetHoldUntil = 0;
        }, 2600);
    }, { passive: true });

    window.addEventListener('scroll', () => {
        scrollBoost = Math.min(3, scrollBoost + 0.55);
    }, { passive: true });

    window.addEventListener('resize', positionScene);

    positionScene();
    showSuggestion(0);
    requestAnimationFrame(animate);
    setInterval(() => showSuggestion(), 9000);
})();
