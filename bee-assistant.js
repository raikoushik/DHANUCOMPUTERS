(() => {
    if (window.__dhanuHoneyBeeInit) return;
    window.__dhanuHoneyBeeInit = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tips = [
        { text: 'Hi, I am your living DhanuTech Honey Bee assistant.', href: 'index.html', cta: 'Home' },
        { text: 'I can guide you to products, services, customization, and support.', href: 'services.html', cta: 'Services' },
        { text: 'Need help fast? Open contact and we are ready for you.', href: 'contact.html', cta: 'Contact' }
    ];

    function start() {
        if (!document.body) return;

        document.querySelector('.honey-bee-assistant')?.remove();
        document.querySelector('.honey-bee-tooltip')?.remove();
        document.querySelector('.honey-bee-shadow')?.remove();

        const bee = document.createElement('button');
        bee.type = 'button';
        bee.className = 'honey-bee-assistant';
        bee.setAttribute('aria-label', 'DhanuTech living honey bee assistant');
        bee.innerHTML = `
            <svg class="honey-bee-svg" viewBox="0 0 180 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                <defs>
                    <linearGradient id="hb_y" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#ffe7a3"/>
                        <stop offset="60%" stop-color="#f7bf45"/>
                        <stop offset="100%" stop-color="#d89a2a"/>
                    </linearGradient>
                    <radialGradient id="hb_fur" cx="42%" cy="35%" r="70%">
                        <stop offset="0%" stop-color="#fff3c4" stop-opacity="0.65"/>
                        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
                    </radialGradient>
                    <linearGradient id="hb_w" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#ecfeff" stop-opacity="0.95"/>
                        <stop offset="100%" stop-color="#93c5fd" stop-opacity="0.34"/>
                    </linearGradient>
                </defs>
                <ellipse class="hb-wing hb-wing-left" cx="82" cy="50" rx="22" ry="12" fill="url(#hb_w)" stroke="#60a5fa" stroke-width="1.2"/>
                <ellipse class="hb-wing hb-wing-right" cx="103" cy="45" rx="22" ry="12" fill="url(#hb_w)" stroke="#60a5fa" stroke-width="1.2"/>
                <ellipse cx="94" cy="90" rx="34" ry="23" fill="url(#hb_y)" stroke="#6b3f1d" stroke-width="2.8" transform="rotate(-12 94 90)"/>
                <ellipse cx="90" cy="84" rx="26" ry="15" fill="url(#hb_fur)"/>
                <path d="M68 84 Q92 72 117 79" stroke="#1f2937" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M66 95 Q90 84 114 90" stroke="#1f2937" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M64 106 Q88 96 110 101" stroke="#1f2937" stroke-width="6" fill="none" stroke-linecap="round"/>
                <circle cx="57" cy="74" r="20" fill="url(#hb_y)" stroke="#6b3f1d" stroke-width="2.4"/>
                <circle cx="50" cy="72" r="3.2" fill="#111827"/>
                <circle cx="62" cy="72" r="3.2" fill="#111827"/>
                <path d="M49 82 Q56 88 63 82" stroke="#9a3412" stroke-width="2.2" fill="none" stroke-linecap="round"/>
                <path class="hb-ant" d="M53 58 Q48 46 41 40" stroke="#2f2f2f" stroke-width="2" fill="none"/>
                <path class="hb-ant" d="M66 58 Q70 45 77 40" stroke="#2f2f2f" stroke-width="2" fill="none"/>
                <circle cx="41" cy="39" r="2.4" fill="#2f2f2f"/>
                <circle cx="78" cy="39" r="2.4" fill="#2f2f2f"/>
                <path d="M113 84 L130 77 L118 92 L132 100" fill="#c07a22" stroke="#6b3f1d" stroke-width="1.8"/>
            </svg>
        `;

        const tip = document.createElement('aside');
        tip.className = 'honey-bee-tooltip';
        const shadow = document.createElement('div');
        shadow.className = 'honey-bee-shadow';

        document.body.appendChild(shadow);
        document.body.appendChild(bee);
        document.body.appendChild(tip);

        const state = {
            x: Math.max(80, window.innerWidth - 220),
            y: Math.max(110, window.innerHeight - 290),
            tx: Math.max(80, window.innerWidth - 220),
            ty: Math.max(110, window.innerHeight - 290),
            t: 0,
            angle: 0,
            retargetAt: performance.now() + 1400,
            paused: false,
            rafId: 0,
            mode: 'fly',
            hovering: false,
            announceUntil: 0
        };

        let tipIndex = 0;
        let hideTimer;

        function showTip(force) {
            if (typeof force === 'number') tipIndex = force % tips.length;
            const item = tips[tipIndex];
            tipIndex = (tipIndex + 1) % tips.length;
            tip.innerHTML = `<p>${item.text}</p><a href="${item.href}">${item.cta}</a>`;
            tip.classList.add('show');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => tip.classList.remove('show'), 3200);

            state.announceUntil = performance.now() + 2600;
            state.paused = true;
            setTimeout(() => {
                if (!state.hovering && performance.now() >= state.announceUntil) state.paused = false;
            }, 2700);
        }

        function retarget() {
            const margin = 90;
            state.mode = Math.random() < 0.25 ? 'hover' : 'fly';
            state.tx = margin + Math.random() * Math.max(140, window.innerWidth - margin * 2);
            state.ty = 100 + Math.random() * Math.max(120, window.innerHeight - 330);
            state.retargetAt = performance.now() + (state.mode === 'hover' ? 2100 : 1700) + Math.random() * 1300;
        }

        function tick(now) {
            state.t += 0.016;
            const inAnnouncement = now < state.announceUntil;

            if (!state.paused && !inAnnouncement) {
                if (now > state.retargetAt || (Math.abs(state.tx - state.x) < 14 && Math.abs(state.ty - state.y) < 14)) retarget();

                const drift = state.mode === 'hover' ? 5 : 12;
                const ox = Math.sin(state.t * 1.5) * drift;
                const oy = Math.cos(state.t * 1.8) * (state.mode === 'hover' ? 4 : 7);
                state.x += (state.tx + ox - state.x) * (state.mode === 'hover' ? 0.042 : 0.056);
                state.y += (state.ty + oy - state.y) * (state.mode === 'hover' ? 0.042 : 0.056);
                state.angle += (((state.mode === 'hover' ? 0 : ox * 0.2)) - state.angle) * 0.11;
            }

            const z = (Math.sin(state.t * 0.7) + 1) * 0.5;
            const scale = 1 + z * 0.06;
            bee.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}deg) scale(${scale})`;
            bee.style.setProperty('--hb-wing', `${Math.sin(state.t * 42) * 24}deg`);

            shadow.style.left = `${state.x + 42}px`;
            shadow.style.top = `${state.y + 78}px`;
            shadow.style.transform = `translate(-50%, -50%) scale(${0.9 + (1 - z) * 0.3})`;
            shadow.style.opacity = `${0.16 + (1 - z) * 0.16}`;

            tip.style.left = `${Math.max(12, Math.min(window.innerWidth - 260, state.x - 240))}px`;
            tip.style.top = `${Math.max(64, state.y - 4)}px`;

            state.rafId = requestAnimationFrame(tick);
        }

        bee.addEventListener('mouseenter', () => {
            state.hovering = true;
            state.paused = true;
            showTip();
        });
        bee.addEventListener('mouseleave', () => {
            state.hovering = false;
            if (performance.now() >= state.announceUntil) state.paused = false;
        });
        bee.addEventListener('click', () => showTip());
        bee.addEventListener('focus', () => showTip());

        window.addEventListener('resize', retarget, { passive: true });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                state.paused = true;
                if (state.rafId) cancelAnimationFrame(state.rafId);
                state.rafId = 0;
            } else {
                state.paused = false;
                if (!state.rafId) state.rafId = requestAnimationFrame(tick);
            }
        });

        setInterval(() => showTip(), 14000);

        showTip(0);
        retarget();
        state.rafId = requestAnimationFrame(tick);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
