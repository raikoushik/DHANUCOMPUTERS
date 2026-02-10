(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function startBeeAssistant() {
        const bee = document.createElement('button');
        bee.type = 'button';
        bee.className = 'honeybee-assistant';
        bee.setAttribute('aria-label', 'DhanuTech honey bee assistant');
        bee.innerHTML = `
            <svg class="honeybee-svg" viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                <ellipse class="honeybee-wing back" cx="132" cy="55" rx="34" ry="48" transform="rotate(-14 132 55)"/>
                <ellipse class="honeybee-wing front" cx="170" cy="75" rx="31" ry="45" transform="rotate(16 170 75)"/>

                <ellipse class="honeybee-body" cx="128" cy="106" rx="66" ry="43" transform="rotate(12 128 106)"/>
                <ellipse class="honeybee-stripe" cx="108" cy="104" rx="11" ry="36" transform="rotate(12 108 104)"/>
                <ellipse class="honeybee-stripe" cx="134" cy="108" rx="11" ry="37" transform="rotate(12 134 108)"/>
                <ellipse class="honeybee-stripe" cx="160" cy="112" rx="10" ry="35" transform="rotate(12 160 112)"/>
                <path class="honeybee-tail" d="M188 125 L212 140 L188 148 Z"/>

                <circle class="honeybee-head" cx="66" cy="93" r="47"/>
                <path class="honeybee-smile" d="M50 108 Q62 119 76 109"/>

                <ellipse class="honeybee-eye-open" cx="47" cy="87" rx="7" ry="11"/>
                <ellipse class="honeybee-eye-dot" cx="49" cy="83" rx="2.2" ry="3"/>
                <path class="honeybee-eye-wink" d="M72 88 Q82 81 88 88"/>

                <ellipse class="honeybee-cheek" cx="41" cy="102" rx="8" ry="5"/>
                <ellipse class="honeybee-cheek" cx="86" cy="102" rx="8" ry="5"/>

                <path class="honeybee-leg" d="M113 135 Q105 150 93 151"/>
                <path class="honeybee-leg" d="M154 139 Q165 153 178 154"/>

                <path class="honeybee-antenna" d="M44 52 Q31 24 21 20"/>
                <circle class="honeybee-antenna-tip" cx="19" cy="18" r="5"/>
                <path class="honeybee-antenna" d="M70 51 Q73 25 84 20"/>
                <circle class="honeybee-antenna-tip" cx="86" cy="18" r="5"/>
            </svg>
        `;

        const sparkleLayer = document.createElement('div');
        sparkleLayer.className = 'honeybee-sparkle-layer';

        document.body.appendChild(sparkleLayer);
        document.body.appendChild(bee);

        const state = {
            x: Math.max(25, window.innerWidth - 250),
            y: Math.max(70, window.innerHeight - 260),
            tx: Math.max(25, window.innerWidth - 250),
            ty: Math.max(70, window.innerHeight - 260),
            t: 0,
            angle: 0
        };

        function emitSparkle(x, y) {
            const node = document.createElement('span');
            node.className = 'honeybee-sparkle';
            node.textContent = Math.random() < 0.45 ? '✨' : '•';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.setProperty('--dx', `${(Math.random() - 0.5) * 22}px`);
            sparkleLayer.appendChild(node);
            setTimeout(() => node.remove(), 900);
        }

        function retarget() {
            state.tx = 30 + Math.random() * (window.innerWidth - 220);
            state.ty = 75 + Math.random() * (window.innerHeight - 260);
        }

        gsap.ticker.add(() => {
            state.t += 0.016;
            if (Math.abs(state.tx - state.x) < 22 && Math.abs(state.ty - state.y) < 22) retarget();

            const ox = Math.sin(state.t * 1.7) * 13;
            const oy = Math.cos(state.t * 2.3) * 9;

            state.x += (state.tx + ox - state.x) * 0.07;
            state.y += (state.ty + oy - state.y) * 0.07;
            state.angle += ((ox * 0.3) - state.angle) * 0.15;

            bee.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${state.angle}deg)`;
            bee.style.setProperty('--wing-flutter', `${Math.sin(state.t * 38) * 11}deg`);

            if (Math.random() < 0.04) emitSparkle(state.x + 34, state.y + 44);
        });

        bee.addEventListener('mouseenter', () => {
            emitSparkle(state.x + 28, state.y + 28);
            emitSparkle(state.x + 40, state.y + 30);
        });

        bee.addEventListener('click', () => {
            emitSparkle(state.x + 22, state.y + 22);
            emitSparkle(state.x + 42, state.y + 22);
            emitSparkle(state.x + 32, state.y + 34);
        });

        window.addEventListener('resize', retarget);
        retarget();
    }

    if (window.gsap) {
        startBeeAssistant();
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
        script.onload = startBeeAssistant;
        document.head.appendChild(script);
    }
})();
