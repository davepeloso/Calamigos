import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import StudyNav from '@/components/StudyNav';
import SmoothScroll from '@/components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */
const C = {
    groveDark: '#243A32',
    grove: '#2F4A3F',
    groveLight: '#3D6152',
    sand: '#EAE4D8',
    cream: '#F5F2EA',
    sage: '#7A8F82',
    wood: '#8A6B4F',
    charcoal: '#2C2C2C',
    divider: '#DCD6CA',
} as const;

const display = "'Cormorant Garamond', Georgia, serif";
const body = "'DM Sans', system-ui, sans-serif";
const mono = "'JetBrains Mono', 'Fira Code', monospace";

/* ------------------------------------------------------------------ */
/*  Font loader                                                        */
/* ------------------------------------------------------------------ */
function useFonts() {
    useEffect(() => {
        const id = '__scrollcraft-fonts';
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href =
            'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400&display=swap';
        document.head.appendChild(link);
    }, []);
}

/* ------------------------------------------------------------------ */
/*  Shared UI                                                          */
/* ------------------------------------------------------------------ */
function ChapterHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;
        const els = ref.current.querySelectorAll('[data-reveal]');
        gsap.fromTo(
            els,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: { trigger: ref.current, start: 'top 80%' },
            },
        );
    }, { scope: ref });

    return (
        <div ref={ref} className="max-w-5xl mx-auto px-8 md:px-16 py-32">
            <span
                data-reveal
                className="block text-xs tracking-[0.3em] uppercase mb-4"
                style={{ fontFamily: body, color: C.sage }}
            >
                Pattern {number}
            </span>
            <h2
                data-reveal
                className="text-5xl md:text-7xl font-light leading-[1.05] mb-6"
                style={{ fontFamily: display, color: C.cream }}
            >
                {title}
            </h2>
            <p
                data-reveal
                className="text-lg max-w-xl leading-relaxed"
                style={{ fontFamily: body, color: C.sage }}
            >
                {subtitle}
            </p>
        </div>
    );
}

function TechNote({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="max-w-5xl mx-auto px-8 md:px-16 py-16"
            style={{ borderTop: `1px solid ${C.grove}` }}
        >
            <span
                className="block text-[10px] tracking-[0.3em] uppercase mb-3"
                style={{ fontFamily: body, color: C.wood }}
            >
                GSAP Technique
            </span>
            <p className="text-sm leading-relaxed max-w-2xl" style={{ fontFamily: body, color: C.sage }}>
                {children}
            </p>
        </div>
    );
}

/* ================================================================== */
/*  HERO — Cinematic text reveal with scrub                            */
/* ================================================================== */
function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !titleRef.current) return;

        // Split each word of the title into spans
        const words = titleRef.current.querySelectorAll('.word');

        // Entrance stagger
        gsap.fromTo(
            words,
            { y: 120, opacity: 0, rotateX: -90 },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 1.2,
                stagger: 0.08,
                ease: 'power4.out',
                delay: 0.3,
            },
        );

        // Scrub-out on scroll
        gsap.to(words, {
            y: -80,
            opacity: 0,
            stagger: 0.03,
            ease: 'power2.in',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '60% top',
                scrub: 1.5,
            },
        });

        // Subtitle fade
        gsap.fromTo(
            containerRef.current.querySelector('.hero-subtitle'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, delay: 1.2, ease: 'power2.out' },
        );

        gsap.to(containerRef.current.querySelector('.hero-subtitle'), {
            opacity: 0,
            y: -40,
            scrollTrigger: {
                trigger: containerRef.current,
                start: '20% top',
                end: '50% top',
                scrub: 1,
            },
        });

        // Vertical lines entrance
        gsap.fromTo(
            containerRef.current.querySelectorAll('.hero-line'),
            { scaleY: 0 },
            { scaleY: 1, duration: 1.5, stagger: 0.1, ease: 'power2.inOut', delay: 0.1 },
        );

        // Scroll indicator
        gsap.fromTo(
            containerRef.current.querySelector('.scroll-indicator'),
            { opacity: 0 },
            { opacity: 0.4, duration: 1, delay: 1.8 },
        );
        gsap.to(containerRef.current.querySelector('.scroll-indicator'), {
            opacity: 0,
            scrollTrigger: { trigger: containerRef.current, start: '5% top', end: '15% top', scrub: true },
        });
    }, { scope: containerRef });

    const titleWords = 'Scroll Craft'.split(' ');

    return (
        <section ref={containerRef} className="relative h-[140vh]">
            {/* Atmospheric lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="hero-line absolute origin-top"
                        style={{
                            left: `${10 + i * 11.5}%`,
                            top: 0,
                            bottom: 0,
                            width: '1px',
                            background: `linear-gradient(to bottom, transparent, ${C.grove}, transparent)`,
                            opacity: 0.2,
                        }}
                    />
                ))}
            </div>

            <div className="sticky top-0 h-screen flex items-center justify-center">
                <div className="text-center px-8" style={{ perspective: '1200px' }}>
                    <span
                        className="block text-xs tracking-[0.4em] uppercase mb-8"
                        style={{ fontFamily: body, color: C.sage, opacity: 0.6 }}
                    >
                        Chapter 09 — GSAP + ScrollTrigger
                    </span>

                    <h1
                        ref={titleRef}
                        className="overflow-hidden"
                        style={{ fontFamily: display, color: C.cream }}
                    >
                        {titleWords.map((word, i) => (
                            <span
                                key={i}
                                className="word inline-block text-[clamp(3rem,14vw,12rem)] font-light leading-[0.9] tracking-tight mx-[0.1em]"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {word}
                            </span>
                        ))}
                    </h1>

                    <p
                        className="hero-subtitle mt-10 text-base tracking-wide max-w-lg mx-auto"
                        style={{ fontFamily: body, color: C.sage, opacity: 0 }}
                    >
                        Advanced scroll-driven animations powered by GSAP ScrollTrigger.
                        Pin, scrub, batch, and orchestrate with surgical precision.
                    </p>

                    <div
                        className="scroll-indicator mt-20"
                        style={{ opacity: 0 }}
                    >
                        <div
                            className="w-[1px] h-16 mx-auto origin-top"
                            style={{ background: C.sage }}
                        >
                            <div
                                className="w-full h-1/3"
                                style={{
                                    background: C.cream,
                                    animation: 'scrollPulse 2.5s ease-in-out infinite',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scrollPulse {
                    0%, 100% { transform: translateY(0); opacity: 0; }
                    50% { transform: translateY(32px); opacity: 1; }
                }
            `}</style>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 1: Text Line Reveal (character-by-character scrub)         */
/* ================================================================== */
function TextLineReveal() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;
        const lines = sectionRef.current.querySelectorAll('.reveal-line');

        lines.forEach((line) => {
            const chars = line.querySelectorAll('.char');
            gsap.fromTo(
                chars,
                { opacity: 0.08 },
                {
                    opacity: 1,
                    stagger: 0.03,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 75%',
                        end: 'top 25%',
                        scrub: 1,
                    },
                },
            );
        });
    }, { scope: sectionRef });

    const lines = [
        'Every great scroll experience',
        'begins with a single question:',
        'What does the reader feel',
        'as the page reveals itself?',
    ];

    return (
        <section ref={sectionRef}>
            <ChapterHeader
                number="01"
                title="Text Scrub"
                subtitle="Characters illuminate as the reader scrolls — each letter tied to scroll position via GSAP's scrub timeline. The text exists as a ghost until the reader gives it substance."
            />

            <div className="max-w-5xl mx-auto px-8 md:px-16 py-16 space-y-8">
                {lines.map((line, li) => (
                    <p
                        key={li}
                        className="reveal-line text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1]"
                        style={{ fontFamily: display, color: C.cream }}
                    >
                        {line.split('').map((char, ci) => (
                            <span key={ci} className="char inline-block" style={{ opacity: 0.08 }}>
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </p>
                ))}
            </div>

            <div className="h-[50vh]" /> {/* Extra scroll room */}

            <TechNote>
                Each character is wrapped in a span. GSAP's scrub ties their opacity to scroll position
                with stagger, creating a typewriter-meets-scroll effect. The trigger is per-line so each
                sentence activates independently as it enters the viewport.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 2: Pin & Scrub Panels                                      */
/* ================================================================== */
const pinnedPanels = [
    {
        title: 'The Oak Grove',
        text: 'Two-hundred-year-old valley oaks create a natural cathedral. Dappled light filters through the canopy, casting moving patterns across the ceremony space.',
        accent: C.grove,
        number: '01',
        bg: `linear-gradient(160deg, ${C.groveDark}, #1E332B)`,
    },
    {
        title: 'The Vineyard Terrace',
        text: 'Terraced rows of heritage grapevines descend toward the canyon floor. The golden-hour light transforms the landscape into a palette of amber and sage.',
        accent: C.wood,
        number: '02',
        bg: `linear-gradient(160deg, ${C.groveDark}, #2A2A20)`,
    },
    {
        title: 'The Rose Garden',
        text: 'Stone pathways wind through beds of David Austin roses, lavender hedges, and sculptural agave. A fountain anchors the courtyard at the garden\'s heart.',
        accent: C.sage,
        number: '03',
        bg: `linear-gradient(160deg, ${C.groveDark}, #243832)`,
    },
    {
        title: 'The Creek Pavilion',
        text: 'An open-air structure spanning the creek bed. Water murmurs beneath the dining floor while string lights trace the roofline against the darkening sky.',
        accent: C.sand,
        number: '04',
        bg: `linear-gradient(160deg, ${C.groveDark}, #2B2923)`,
    },
];

function PinScrubPanels() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;
        const panels = containerRef.current.querySelectorAll<HTMLElement>('.scrub-panel');

        // Single timeline pinned + scrubbed — keeps everything in sync
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: `+=${(panels.length - 1) * 100}%`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            },
        });

        // Each panel (after the first) slides up in sequence
        panels.forEach((panel, i) => {
            if (i === 0) return;
            tl.fromTo(
                panel,
                { yPercent: 100 },
                { yPercent: 0, duration: 1, ease: 'none' },
            );
            // Hold each panel for a beat before the next slides in
            if (i < panels.length - 1) {
                tl.to({}, { duration: 0.3 });
            }
        });
    }, { scope: containerRef });

    return (
        <section>
            <ChapterHeader
                number="02"
                title="Panel Stack"
                subtitle="Full-screen panels stack and reveal as cards, each sliding up to cover the previous. GSAP pins the container while scrubbing through the stack — a tactile, physical metaphor for turning pages."
            />

            <div ref={containerRef} className="relative h-screen overflow-hidden">
                {pinnedPanels.map((panel, i) => (
                    <div
                        key={i}
                        className="scrub-panel absolute inset-0 flex items-center justify-center px-8 md:px-16"
                        style={{
                            background: panel.bg,
                            borderTop: i > 0 ? `1px solid ${panel.accent}33` : 'none',
                            zIndex: i + 1,
                        }}
                    >
                        <div className="max-w-3xl w-full relative">
                            {/* Large number */}
                            <span
                                className="block text-[12rem] md:text-[16rem] font-light leading-none absolute top-1/2 right-0 md:right-8 -translate-y-1/2 pointer-events-none select-none"
                                style={{
                                    fontFamily: display,
                                    color: panel.accent,
                                    opacity: 0.06,
                                }}
                            >
                                {panel.number}
                            </span>

                            <span
                                className="block text-xs tracking-[0.3em] uppercase mb-6"
                                style={{ fontFamily: body, color: panel.accent }}
                            >
                                Space {panel.number}
                            </span>
                            <h3
                                className="text-5xl md:text-7xl font-light mb-8 leading-[1.05]"
                                style={{ fontFamily: display, color: C.cream }}
                            >
                                {panel.title}
                            </h3>
                            <p
                                className="text-lg leading-[1.8] max-w-xl"
                                style={{ fontFamily: body, color: C.sage }}
                            >
                                {panel.text}
                            </p>

                            {/* Decorative bar */}
                            <div
                                className="mt-12 h-[2px] w-24"
                                style={{ background: panel.accent, opacity: 0.4 }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <TechNote>
                Each panel after the first uses ScrollTrigger with yPercent: 100 → 0 and scrub.
                A single pin on the parent container holds the viewport while panels animate.
                The stacking order uses increasing z-index so each panel covers the previous.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 3: SVG Path Drawing                                        */
/* ================================================================== */
function PathDraw() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !pathRef.current) return;
        const length = pathRef.current.getTotalLength();

        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(pathRef.current, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: 1.5,
            },
        });

        // Animate the labels along with the path
        const labels = sectionRef.current.querySelectorAll('.path-label');
        labels.forEach((label, i) => {
            gsap.fromTo(
                label,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: `${15 + i * 18}% 60%`,
                        toggleActions: 'play none none reverse',
                    },
                },
            );
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef}>
            <ChapterHeader
                number="03"
                title="Path Draw"
                subtitle="An SVG path traces itself as the reader scrolls, drawing the journey through Calamigos. Labels appear at waypoints, tying geography to narrative. Perfect for maps, flows, and visual storytelling."
            />

            <div className="relative max-w-4xl mx-auto px-8 md:px-16 py-16" style={{ minHeight: '80vh' }}>
                <svg
                    viewBox="0 0 800 600"
                    fill="none"
                    className="w-full h-auto"
                    style={{ overflow: 'visible' }}
                >
                    {/* The journey path */}
                    <path
                        ref={pathRef}
                        d="M 50 500 C 100 450, 150 350, 200 300 S 300 200, 350 250 S 450 350, 500 280 S 600 150, 650 200 S 720 280, 750 180"
                        stroke={C.sand}
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* Waypoint dots */}
                    {[
                        { cx: 50, cy: 500 },
                        { cx: 200, cy: 300 },
                        { cx: 350, cy: 250 },
                        { cx: 500, cy: 280 },
                        { cx: 650, cy: 200 },
                        { cx: 750, cy: 180 },
                    ].map((pt, i) => (
                        <circle
                            key={i}
                            cx={pt.cx}
                            cy={pt.cy}
                            r="5"
                            fill={C.groveDark}
                            stroke={C.sage}
                            strokeWidth="1.5"
                        />
                    ))}
                </svg>

                {/* Floating labels */}
                {[
                    { label: 'Arrival Gate', x: '6%', y: '82%' },
                    { label: 'Oak Grove', x: '22%', y: '46%' },
                    { label: 'Rose Garden', x: '40%', y: '38%' },
                    { label: 'Vineyard', x: '60%', y: '44%' },
                    { label: 'Creek Pavilion', x: '78%', y: '30%' },
                    { label: 'Starlight Terrace', x: '90%', y: '26%' },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="path-label absolute"
                        style={{ left: item.x, top: item.y, opacity: 0 }}
                    >
                        <span
                            className="block text-[10px] tracking-[0.25em] uppercase mb-1"
                            style={{ fontFamily: mono, color: C.wood, fontSize: '10px' }}
                        >
                            0{i + 1}
                        </span>
                        <span
                            className="block text-sm"
                            style={{ fontFamily: body, color: C.cream }}
                        >
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            <TechNote>
                SVG path drawing uses strokeDasharray set to the path's total length, then scrubs
                strokeDashoffset from length → 0. Labels trigger at calculated percentages along
                the scroll range. getTotalLength() provides the exact dash value.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 4: Batch Stagger Grid                                      */
/* ================================================================== */
function BatchStaggerGrid() {
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!gridRef.current) return;

        ScrollTrigger.batch(gridRef.current.querySelectorAll('.grid-item'), {
            onEnter: (elements) => {
                gsap.fromTo(
                    elements,
                    { opacity: 0, y: 60, scale: 0.92 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.08,
                        ease: 'power3.out',
                    },
                );
            },
            start: 'top 85%',
        });
    }, { scope: gridRef });

    const items = [
        { name: 'Ceremony', desc: 'Oak-canopy cathedral' },
        { name: 'Reception', desc: 'Creek-side pavilion' },
        { name: 'Cocktails', desc: 'Rose garden terrace' },
        { name: 'Dining', desc: 'Long-table vineyard' },
        { name: 'Dancing', desc: 'Starlight deck' },
        { name: 'Lounge', desc: 'Fireside seating' },
        { name: 'Bridal', desc: 'Cottage suite' },
        { name: 'Photo', desc: 'Sycamore lane' },
        { name: 'Welcome', desc: 'Gate & arrival' },
        { name: 'Farewell', desc: 'Lantern path' },
        { name: 'Workshop', desc: 'Artisan barn' },
        { name: 'Retreat', desc: 'Canyon overlook' },
    ];

    return (
        <section>
            <ChapterHeader
                number="04"
                title="Batch Stagger"
                subtitle="ScrollTrigger.batch groups elements that enter the viewport together and applies a stagger automatically. This creates natural wave-like reveals without manually calculating delays for each item."
            />

            <div ref={gridRef} className="max-w-6xl mx-auto px-8 md:px-16 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="grid-item group relative aspect-[4/5] rounded-sm overflow-hidden flex flex-col justify-end p-6 cursor-default"
                            style={{
                                background: `linear-gradient(160deg, ${C.grove}66, ${C.groveDark})`,
                                border: `1px solid ${C.sage}15`,
                                opacity: 0,
                            }}
                        >
                            {/* Hover accent */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: `linear-gradient(160deg, ${C.wood}15, transparent)`,
                                }}
                            />

                            {/* Large number */}
                            <span
                                className="absolute top-4 right-4 text-5xl font-light"
                                style={{ fontFamily: display, color: C.sage, opacity: 0.12 }}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </span>

                            <div className="relative z-10">
                                <h4
                                    className="text-xl font-light mb-1"
                                    style={{ fontFamily: display, color: C.cream }}
                                >
                                    {item.name}
                                </h4>
                                <p
                                    className="text-xs tracking-[0.15em] uppercase"
                                    style={{ fontFamily: body, color: C.sage }}
                                >
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <TechNote>
                ScrollTrigger.batch collects all .grid-item elements and fires onEnter when any group
                enters the viewport together. GSAP staggers within each batch automatically.
                No manual IntersectionObserver or per-element triggers needed.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 5: Horizontal Scroll with Progress                         */
/* ================================================================== */
const gallerySlides = [
    {
        title: 'Botanical',
        subtitle: 'Wild herbs and heritage roses frame every walkway',
        color: C.grove,
    },
    {
        title: 'Textural',
        subtitle: 'Stone, reclaimed wood, linen — materials that weather with grace',
        color: C.wood,
    },
    {
        title: 'Luminous',
        subtitle: 'String lights trace rooflines as golden hour fades to twilight',
        color: C.sage,
    },
    {
        title: 'Intimate',
        subtitle: 'Scale and proportion tuned for warmth, never grandeur',
        color: C.sand,
    },
    {
        title: 'Timeless',
        subtitle: 'Design decisions that speak to decades, not seasons',
        color: C.cream,
    },
];

function HorizontalGallery() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useGSAP(() => {
        if (!containerRef.current || !trackRef.current) return;

        const totalWidth = trackRef.current.scrollWidth - window.innerWidth;

        gsap.to(trackRef.current, {
            x: -totalWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: `+=${totalWidth}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => setProgress(self.progress),
            },
        });

        // Stagger the slide content in
        const slides = trackRef.current.querySelectorAll('.gallery-slide');
        slides.forEach((slide) => {
            const content = slide.querySelectorAll('[data-anim]');
            gsap.fromTo(
                content,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: slide,
                        containerAnimation: gsap.getById?.('hscroll') || undefined,
                        start: 'left 80%',
                        toggleActions: 'play none none reverse',
                        horizontal: true,
                    },
                },
            );
        });
    }, { scope: containerRef });

    return (
        <section>
            <ChapterHeader
                number="05"
                title="Horizontal Gallery"
                subtitle="A pinned horizontal scroll with GSAP's native scrub. Unlike CSS-only approaches, GSAP gives you a timeline you can query, reverse, and layer secondary animations onto."
            />

            <div ref={containerRef} className="relative">
                <div ref={trackRef} className="flex h-screen">
                    {gallerySlides.map((slide, i) => (
                        <div
                            key={i}
                            className="gallery-slide flex-shrink-0 w-screen h-full flex items-center justify-center px-8 md:px-20"
                        >
                            <div className="max-w-2xl w-full">
                                <div
                                    className="w-full aspect-[16/10] rounded-sm mb-10 relative overflow-hidden"
                                    style={{
                                        background: `linear-gradient(135deg, ${slide.color}30, ${slide.color}10)`,
                                        border: `1px solid ${slide.color}25`,
                                    }}
                                >
                                    {/* Decorative typography */}
                                    <span
                                        className="absolute bottom-4 right-6 text-[8rem] md:text-[12rem] font-light leading-none select-none pointer-events-none"
                                        style={{
                                            fontFamily: display,
                                            color: slide.color,
                                            opacity: 0.08,
                                        }}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                <div data-anim>
                                    <h3
                                        className="text-4xl md:text-6xl font-light mb-4"
                                        style={{ fontFamily: display, color: C.cream }}
                                    >
                                        {slide.title}
                                    </h3>
                                </div>
                                <div data-anim>
                                    <p
                                        className="text-base leading-relaxed max-w-md"
                                        style={{ fontFamily: body, color: C.sage }}
                                    >
                                        {slide.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-12 left-8 md:left-16 right-8 md:right-16 z-10">
                    <div className="h-[1px] w-full" style={{ background: `${C.sage}25` }}>
                        <div
                            className="h-full origin-left transition-transform duration-100"
                            style={{
                                background: C.sage,
                                transform: `scaleX(${progress})`,
                            }}
                        />
                    </div>
                    <div className="flex justify-between mt-3">
                        {gallerySlides.map((s, i) => (
                            <span
                                key={i}
                                className="text-[10px] tracking-[0.15em] uppercase transition-colors duration-300"
                                style={{
                                    fontFamily: body,
                                    color: progress >= (i / gallerySlides.length) ? C.cream : `${C.sage}55`,
                                }}
                            >
                                {s.title}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <TechNote>
                GSAP pins the container and scrubs translateX on the track. The onUpdate callback
                provides progress (0–1) which drives the progress bar via React state.
                Unlike Motion.js horizontal scroll, GSAP's version supports nested
                ScrollTriggers inside the horizontal track via containerAnimation.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 6: Counter & Stats on Scroll                               */
/* ================================================================== */
function ScrollCounters() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        sectionRef.current.querySelectorAll<HTMLElement>('.counter-value').forEach((el) => {
            const target = parseInt(el.dataset.target || '0', 10);
            const obj = { val: 0 };

            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
                onUpdate: () => {
                    el.textContent = Math.round(obj.val).toLocaleString();
                },
            });
        });

        // Reveal bars
        sectionRef.current.querySelectorAll<HTMLElement>('.stat-bar').forEach((bar) => {
            gsap.fromTo(
                bar,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: bar,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                },
            );
        });
    }, { scope: sectionRef });

    const stats = [
        { label: 'Acres of Gardens', value: 220, barWidth: '88%', accent: C.grove },
        { label: 'Heritage Oaks', value: 47, barWidth: '47%', accent: C.wood },
        { label: 'Events Hosted', value: 3200, barWidth: '100%', accent: C.sage },
        { label: 'Years of History', value: 87, barWidth: '72%', accent: C.sand },
    ];

    return (
        <section ref={sectionRef}>
            <ChapterHeader
                number="06"
                title="Scroll Counters"
                subtitle="Numbers that count up when they enter the viewport. GSAP interpolates between values while onUpdate pushes each frame to the DOM — no React re-renders needed for the counter itself."
            />

            <div className="max-w-4xl mx-auto px-8 md:px-16 py-16 space-y-16">
                {stats.map((stat, i) => (
                    <div key={i}>
                        <div className="flex items-baseline justify-between mb-4">
                            <span
                                className="text-xs tracking-[0.25em] uppercase"
                                style={{ fontFamily: body, color: C.sage }}
                            >
                                {stat.label}
                            </span>
                            <span
                                className="counter-value text-4xl md:text-5xl font-light tabular-nums"
                                data-target={stat.value}
                                style={{ fontFamily: display, color: C.cream }}
                            >
                                0
                            </span>
                        </div>
                        <div className="h-[2px] w-full" style={{ background: `${C.sage}15` }}>
                            <div
                                className="stat-bar h-full origin-left"
                                style={{
                                    background: stat.accent,
                                    width: stat.barWidth,
                                    opacity: 0.5,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <TechNote>
                GSAP tweens a plain object's value and uses onUpdate to write directly to the DOM
                via textContent — bypassing React's reconciliation entirely. Combined with
                toLocaleString() for number formatting and ScrollTrigger for viewport detection.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 7: Parallax Image Stack                                    */
/* ================================================================== */
function ParallaxStack() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const layers = sectionRef.current.querySelectorAll<HTMLElement>('.parallax-layer');
        const speeds = [-100, -200, -300, 50, 150];

        layers.forEach((layer, i) => {
            gsap.to(layer, {
                y: speeds[i] || 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        });

        // Text reveal
        gsap.fromTo(
            sectionRef.current.querySelector('.parallax-text'),
            { y: 80, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: '30% 60%',
                    end: '50% 40%',
                    scrub: 1,
                },
            },
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef}>
            <ChapterHeader
                number="07"
                title="Parallax Layers"
                subtitle="GSAP's scrub-based parallax moves each layer at a precise speed — including negative values for elements that rise against the scroll. More control than CSS-only parallax with guaranteed cross-browser behaviour."
            />

            <div className="relative overflow-hidden" style={{ height: '120vh' }}>
                {/* Background wash */}
                <div
                    className="parallax-layer absolute inset-0"
                    style={{
                        background: `radial-gradient(ellipse at 30% 40%, ${C.grove}40, transparent 70%)`,
                    }}
                />

                {/* Geometric shapes at different depths */}
                <div className="parallax-layer absolute top-[15%] left-[8%] w-64 h-64 rounded-full" style={{ background: `${C.sage}12` }} />
                <div className="parallax-layer absolute top-[25%] right-[12%] w-48 h-96 rounded-sm" style={{ background: `${C.wood}10`, transform: 'rotate(-8deg)' }} />
                <div className="parallax-layer absolute bottom-[20%] left-[20%] w-32 h-32 rounded-full" style={{ background: `${C.sand}15` }} />
                <div className="parallax-layer absolute top-[40%] left-[55%] w-[1px] h-64" style={{ background: `${C.sage}30` }} />

                {/* Foreground text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="parallax-text text-center px-8">
                        <p
                            className="text-5xl md:text-8xl font-light leading-[1.05]"
                            style={{ fontFamily: display, color: C.cream }}
                        >
                            Layers of
                            <br />
                            <em style={{ color: C.sand }}>meaning</em>
                        </p>
                        <p
                            className="mt-6 text-sm tracking-[0.2em] uppercase"
                            style={{ fontFamily: body, color: C.sage }}
                        >
                            Each element moves at its own pace
                        </p>
                    </div>
                </div>
            </div>

            <TechNote>
                Each .parallax-layer gets a GSAP tween with a different y target, all using
                scrub: true on the same trigger range. Negative values move elements upward.
                Unlike CSS perspective-based parallax, GSAP gives per-element speed control.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 8: Scroll-Linked Progress Ring                             */
/* ================================================================== */
function ProgressRing() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<SVGCircleElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !circleRef.current) return;

        const circumference = 2 * Math.PI * 140;
        gsap.set(circleRef.current, {
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
        });

        gsap.to(circleRef.current, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: 1,
            },
        });

        // Center text scale
        gsap.fromTo(
            sectionRef.current.querySelector('.ring-text'),
            { scale: 0.6, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: '20% 60%',
                    end: '50% 40%',
                    scrub: 1,
                },
            },
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef}>
            <ChapterHeader
                number="08"
                title="Progress Ring"
                subtitle="A circular progress indicator driven entirely by scroll position. The same strokeDashoffset technique as path drawing, applied to a circle — useful for completion states, loading metaphors, or decorative transitions."
            />

            <div className="flex items-center justify-center py-16" style={{ minHeight: '80vh' }}>
                <div className="relative">
                    <svg width="320" height="320" viewBox="0 0 320 320">
                        {/* Background ring */}
                        <circle
                            cx="160"
                            cy="160"
                            r="140"
                            fill="none"
                            stroke={`${C.sage}15`}
                            strokeWidth="1.5"
                        />
                        {/* Animated ring */}
                        <circle
                            ref={circleRef}
                            cx="160"
                            cy="160"
                            r="140"
                            fill="none"
                            stroke={C.sand}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                        />
                    </svg>

                    <div className="ring-text absolute inset-0 flex flex-col items-center justify-center">
                        <span
                            className="text-5xl md:text-6xl font-light"
                            style={{ fontFamily: display, color: C.cream }}
                        >
                            Complete
                        </span>
                        <span
                            className="text-xs tracking-[0.3em] uppercase mt-2"
                            style={{ fontFamily: body, color: C.sage }}
                        >
                            Scroll to fill
                        </span>
                    </div>
                </div>
            </div>

            <TechNote>
                Identical to path drawing: set strokeDasharray to the circle's circumference (2πr),
                then scrub strokeDashoffset from circumference → 0. The rotate(-90deg) starts
                the fill from 12 o'clock instead of 3 o'clock.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  FOOTER                                                             */
/* ================================================================== */
function Footer() {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;
        gsap.fromTo(
            ref.current.querySelectorAll('[data-reveal]'),
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: { trigger: ref.current, start: 'top 80%' },
            },
        );
    }, { scope: ref });

    return (
        <footer ref={ref} className="py-32 text-center" style={{ borderTop: `1px solid ${C.grove}` }}>
            <p
                data-reveal
                className="text-3xl md:text-4xl font-light mb-4"
                style={{ fontFamily: display, color: C.cream }}
            >
                End of study
            </p>
            <p
                data-reveal
                className="text-xs tracking-[0.3em] uppercase mb-8"
                style={{ fontFamily: body, color: C.sage }}
            >
                Calamigos Ranch — GSAP ScrollTrigger Patterns
            </p>
            <p
                data-reveal
                className="text-xs tracking-[0.15em]"
                style={{ fontFamily: mono, color: `${C.sage}55` }}
            >
                gsap · scrolltrigger · lenis · react
            </p>
        </footer>
    );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
const ScrollCraft = () => {
    useFonts();

    // Refresh ScrollTrigger after layout
    useEffect(() => {
        const timeout = setTimeout(() => ScrollTrigger.refresh(), 100);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <SmoothScroll>
            <div className="min-h-screen" style={{ background: C.groveDark, color: C.cream }}>
                <StudyNav currentPage="scrollcraft" />
                <Hero />
                <TextLineReveal />
                <PinScrubPanels />
                <PathDraw />
                <BatchStaggerGrid />
                <HorizontalGallery />
                <ScrollCounters />
                <ParallaxStack />
                <ProgressRing />
                <Footer />
            </div>
        </SmoothScroll>
    );
};

export default ScrollCraft;
