import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SmoothScroll from '@/components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================== */
/*  TOKENS                                                             */
/* ================================================================== */
const C = {
    bg: '#1A1E1B',
    bgWarm: '#1E2320',
    grove: '#2F4A3F',
    groveDark: '#1A2E25',
    sand: '#EAE4D8',
    cream: '#F5F2EA',
    sage: '#7A8F82',
    wood: '#8A6B4F',
    woodLight: '#A4845E',
    charcoal: '#2C2C2C',
    divider: '#DCD6CA',
} as const;

const display = "'Cormorant Garamond', Georgia, serif";
const body = "'DM Sans', system-ui, sans-serif";
const mono = "'JetBrains Mono', 'Fira Code', monospace";

/* Category swatches from the project */
const swatches = ['#4d665a', '#bdc2b6', '#847963', '#96acac', '#4b544e'];

/* ================================================================== */
/*  FONT LOADER                                                        */
/* ================================================================== */
function useFonts(): void {
    useEffect(() => {
        const id = '__cover-fonts';
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href =
            'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400&display=swap';
        document.head.appendChild(link);
    }, []);
}

/* ================================================================== */
/*  TOPOGRAPHIC CONTOURS                                               */
/* ================================================================== */
function TopoLines({ opacity = 0.05 }: { opacity?: number }) {
    return (
        <svg
            viewBox="0 0 1000 700"
            fill="none"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            style={{ opacity }}
        >
            <path
                d="M-50 350 C100 280,200 200,350 220 S550 300,650 250 S800 180,950 220"
                stroke={C.sage}
                strokeWidth="0.7"
            />
            <path
                d="M-30 380 C80 320,180 250,320 260 S520 330,620 290 S780 220,930 250"
                stroke={C.sage}
                strokeWidth="0.7"
            />
            <path
                d="M500 50 C550 80,620 60,700 90 S820 120,900 80 L1050 100"
                stroke={C.sage}
                strokeWidth="0.5"
            />
            <path
                d="M520 80 C560 105,630 90,710 115 S830 140,910 110"
                stroke={C.sage}
                strokeWidth="0.5"
            />
            <path
                d="M-50 200 C30 180,100 160,180 190 S280 240,340 210 S420 170,480 200"
                stroke={C.sage}
                strokeWidth="0.5"
            />
            <path
                d="M200 480 C280 450,360 420,440 440 S560 490,640 460 S740 430,820 450"
                stroke={C.sage}
                strokeWidth="0.6"
            />
            <path
                d="M160 540 C240 520,320 500,400 510 S520 540,600 520 S700 500,780 510"
                stroke={C.sage}
                strokeWidth="0.6"
            />
            <path
                d="M100 600 C180 560,260 530,340 520 S450 510,530 490 S650 460,750 440"
                stroke={C.sage}
                strokeWidth="0.8"
                strokeDasharray="8 6"
            />
            <path
                d="M700 300 C730 275,780 270,810 290 S830 330,805 345 S760 350,730 335 S690 315,700 300Z"
                stroke={C.sage}
                strokeWidth="0.4"
            />
        </svg>
    );
}

/* ================================================================== */
/*  FILM GRAIN OVERLAY                                                 */
/* ================================================================== */
function FilmGrain() {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-[60]"
            style={{
                opacity: 0.03,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '128px 128px',
            }}
        />
    );
}

/* ================================================================== */
/*  HERO VIDEO BACKGROUND — rotates between clips                      */
/* ================================================================== */
const heroClips = [
    { landscape: '/videos/hero-landscape-04.mp4', portrait: '/videos/hero-portrait-04.mp4' },
    { landscape: '/videos/hero-landscape-51.mp4', portrait: '/videos/hero-portrait-51.mp4' },
    { landscape: '/videos/hero-landscape-01.mp4', portrait: '/videos/hero-portrait-01.mp4' },
];

function HeroVideo() {
    const [clipIndex, setClipIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const landscapeRef = useRef<HTMLVideoElement>(null);
    const portraitRef = useRef<HTMLVideoElement>(null);

    // Rotate to next clip when the current one ends
    const handleEnded = () => {
        setClipIndex((prev) => (prev + 1) % heroClips.length);
    };

    // Crossfade: reset loaded state on clip change, then fade in
    useEffect(() => {
        setIsLoaded(false);

        const landscape = landscapeRef.current;
        const portrait = portraitRef.current;

        const onCanPlay = () => setIsLoaded(true);

        landscape?.addEventListener('canplaythrough', onCanPlay);
        portrait?.addEventListener('canplaythrough', onCanPlay);

        landscape?.load();
        portrait?.load();

        return () => {
            landscape?.removeEventListener('canplaythrough', onCanPlay);
            portrait?.removeEventListener('canplaythrough', onCanPlay);
        };
    }, [clipIndex]);

    const clip = heroClips[clipIndex];

    return (
        <div className="hero-video absolute inset-0 z-0 overflow-hidden">
            {/* Landscape video — desktop */}
            <video
                ref={landscapeRef}
                key={`landscape-${clipIndex}`}
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={handleEnded}
                className="absolute inset-0 hidden h-full w-full object-cover md:block"
                style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 1.8s ease-out',
                }}
            >
                <source src={clip.landscape} type="video/mp4" />
            </video>

            {/* Portrait video — mobile */}
            <video
                ref={portraitRef}
                key={`portrait-${clipIndex}`}
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={handleEnded}
                className="absolute inset-0 block h-full w-full object-cover md:hidden"
                style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 1.8s ease-out',
                }}
            >
                <source src={clip.portrait} type="video/mp4" />
            </video>

            {/* Gradient overlays for depth & text legibility */}
            <div
                className="absolute inset-0 z-[1]"
                style={{
                    background: `linear-gradient(
                        to bottom,
                        ${C.bg}E6 0%,
                        ${C.bg}99 15%,
                        ${C.bg}4D 35%,
                        ${C.bg}4D 65%,
                        ${C.bg}CC 85%,
                        ${C.bg} 100%
                    )`,
                }}
            />

            {/* Radial vignette */}
            <div
                className="absolute inset-0 z-[2]"
                style={{
                    background: `radial-gradient(ellipse at center, transparent 30%, ${C.bg}B3 80%, ${C.bg} 100%)`,
                }}
            />

            {/* Subtle color tint to match brand palette */}
            <div
                className="absolute inset-0 z-[3]"
                style={{
                    background: C.groveDark,
                    mixBlendMode: 'multiply',
                    opacity: 0.3,
                }}
            />
        </div>
    );
}

/* ================================================================== */
/*  HERO — Opening title with cinematic video background               */
/* ================================================================== */
function Hero() {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!ref.current) return;
            const tl = gsap.timeline({ delay: 0.4 });

            // Video fades in with a slow scale-up
            tl.fromTo(
                ref.current.querySelector('.hero-video'),
                { scale: 1.1, opacity: 0 },
                { scale: 1, opacity: 1, duration: 2.5, ease: 'power2.out' },
            );

            // Swatch bar grows in
            tl.fromTo(
                ref.current.querySelectorAll('.swatch'),
                { scaleY: 0, opacity: 0 },
                {
                    scaleY: 1,
                    opacity: 1,
                    stagger: 0.06,
                    duration: 0.8,
                    ease: 'power3.out',
                },
                '-=2.0',
            );

            // Top label
            tl.fromTo(
                ref.current.querySelector('.hero-label'),
                { y: 15, opacity: 0 },
                { y: 0, opacity: 0.4, duration: 0.7, ease: 'power2.out' },
                '-=1.5',
            );

            // Name words
            tl.fromTo(
                ref.current.querySelectorAll('.name-word'),
                { y: 100, opacity: 0, skewY: 6 },
                {
                    y: 0,
                    opacity: 1,
                    skewY: 0,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: 'power4.out',
                },
                '-=0.5',
            );

            // Horizontal rule
            tl.fromTo(
                ref.current.querySelector('.hero-rule'),
                { scaleX: 0 },
                { scaleX: 1, duration: 1, ease: 'power2.inOut' },
                '-=0.7',
            );

            // Subtitle
            tl.fromTo(
                ref.current.querySelector('.hero-role'),
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
                '-=0.5',
            );

            // Deck cards
            tl.fromTo(
                ref.current.querySelectorAll('.deck-cards a'),
                { y: 25, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.08,
                    duration: 0.7,
                    ease: 'power2.out',
                },
                '-=0.3',
            );

            // Scroll cue
            tl.fromTo(
                ref.current.querySelector('.scroll-cue'),
                { opacity: 0 },
                { opacity: 0.3, duration: 1 },
                '-=0.2',
            );

            // Scroll-driven: video scales up + fades, content floats away
            gsap.to(ref.current.querySelector('.hero-video'), {
                scale: 1.15,
                opacity: 0,
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top top',
                    end: '80% top',
                    scrub: 1.5,
                },
            });

            gsap.to(ref.current.querySelector('.hero-content'), {
                y: -120,
                opacity: 0,
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top top',
                    end: '70% top',
                    scrub: 1,
                },
            });
        },
        { scope: ref },
    );

    return (
        <section ref={ref} className="relative h-[130vh] overflow-hidden">
            {/* Cinematic video background */}
            <HeroVideo />

            {/* Topo lines on top of video for texture */}
            <div className="relative z-[5]">
                <TopoLines opacity={0.03} />
            </div>

            {/* Color swatch strip — left edge */}
            <div className="absolute top-0 bottom-0 left-0 z-10 flex flex-col">
                {swatches.map((color, i) => (
                    <div
                        key={i}
                        className="swatch w-[6px] flex-1 origin-top"
                        style={{ background: color, opacity: 0 }}
                    />
                ))}
            </div>

            <div className="sticky top-0 flex h-screen items-center justify-center">
                <div className="hero-content relative z-10 max-w-4xl px-8 text-center">
                    <span
                        className="hero-label mb-10 block text-[10px] tracking-[0.5em] uppercase"
                        style={{ fontFamily: mono, color: C.sage }}
                    >
                        Media & Design
                    </span>

                    <h1 className="mb-0 overflow-hidden">
                        {'Dave Peloso'.split(' ').map((word, i) => (
                            <span
                                key={i}
                                className="name-word mx-[0.06em] inline-block text-[clamp(3.5rem,12vw,9rem)] leading-[0.88] font-light tracking-tight"
                                style={{
                                    fontFamily: display,
                                    color: C.cream,
                                    textShadow: '0 2px 40px rgba(0,0,0,0.5)',
                                }}
                            >
                                {word}
                            </span>
                        ))}
                    </h1>

                    <div
                        className="hero-rule mx-auto my-8 h-[1px] w-48 origin-center"
                        style={{ background: `${C.sage}40` }}
                    />

                    <p
                        className="hero-role text-sm tracking-[0.25em] uppercase"
                        style={{ fontFamily: body, color: C.sage, opacity: 0 }}
                    >
                        Photography · Design
                    </p>

                    {/* Deck cards — inline under name */}
                    <div className="deck-cards mx-auto mt-12 grid max-w-xl grid-cols-3 gap-3">
                        {deckCards.map((d, i) => (
                            <a
                                key={i}
                                href={d.href}
                                className="group relative block overflow-hidden rounded-sm px-4 py-3.5 text-center backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
                                style={{
                                    background: `${C.grove}35`,
                                    border: `1px solid ${C.sage}15`,
                                }}
                            >
                                <div
                                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    style={{
                                        background: `linear-gradient(135deg, ${d.accent}12, transparent)`,
                                    }}
                                />
                                <div className="relative z-10">
                                    <span
                                        className="mb-1 block text-[9px] tracking-[0.15em] uppercase"
                                        style={{
                                            fontFamily: mono,
                                            color: d.accent,
                                        }}
                                    >
                                        {d.version}
                                    </span>
                                    <span
                                        className="block text-sm font-light"
                                        style={{
                                            fontFamily: display,
                                            color: C.cream,
                                        }}
                                    >
                                        {d.title}
                                    </span>
                                </div>
                                <div
                                    className="absolute right-0 bottom-0 left-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                                    style={{ background: d.accent }}
                                />
                            </a>
                        ))}
                    </div>

                    <div className="scroll-cue mt-14 flex flex-col items-center gap-2">
                        <span
                            className="text-[9px] tracking-[0.3em] uppercase"
                            style={{ fontFamily: mono, color: C.sage }}
                        >
                            Scroll
                        </span>
                        <div
                            className="h-12 w-[1px] overflow-hidden"
                            style={{ background: `${C.sage}25` }}
                        >
                            <div
                                className="h-4 w-full"
                                style={{
                                    background: C.cream,
                                    animation:
                                        'coverPulse 2.2s ease-in-out infinite',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes coverPulse {
                    0% { transform: translateY(-16px); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(48px); opacity: 0; }
                }
            `}</style>
        </section>
    );
}

/* ================================================================== */
/*  PANEL STACK — About sections with pin+scrub                        */
/* ================================================================== */
const panels = [
    {
        id: 'photography',
        number: '01',
        title: 'Photography',
        accent: '#4d665a',
        body: `Photography is one of our most essential tools. Whether for still photography or video, a distinctive natural photographic style has been created to portray our vision and brand values.`,
        philosophy: `My photography is earthy, deep and has uncluttered backgrounds to ensure subjects stand out — or employs a shallow depth of field to achieve the same result. Characterized by soft whites, deep greens, and subtle film grain. Our photos are not overly saturated and have a classic premium aesthetic.`,
        details: [
            'Natural light, golden hour',
            'Shallow depth of field',
            'Film grain texture',
            'Muted, earthy palette',
            'Editorial composition',
        ],
    },
    {
        id: 'color',
        number: '02',
        title: 'Color Composition\n& Typography',
        accent: '#847963',
        body: `Colour means everything to me. It helps define who we are. It's one of the strongest elements we use to connect with our audience. It simultaneously establishes tone and aids in the recognition of our brand across all communications — thus the balanced use of colour is crucial.`,
        philosophy: `Typography is an essential element in our visual language. Our typographic system is built on legibility and accessibility. It's clear, bold, and endlessly expressive. It's a keystone of our identity, and through careful and consistent application of typographic principles across all communications, a vital tool in building brand recognition.`,
        details: [
            'Cormorant Garamond — editorial display',
            'DM Sans — clean, modern body',
            'OKLCH color space for harmony',
            'Five-swatch brand palette',
            'Deliberate contrast ratios',
        ],
    },
    {
        id: 'atmosphere',
        number: '03',
        title: 'Atmosphere\n& Interaction',
        accent: '#96acac',
        body: `Every scroll, every hover, every transition is authored — never arbitrary. The interface should feel like the brand itself: warm, considered, and effortlessly elegant. Motion is restraint. Timing is everything.`,
        philosophy: `We build with GSAP ScrollTrigger, Motion.js, and Lenis smooth scroll. Pin, scrub, snap, batch — each technique chosen for its emotional effect, not its novelty. The reader's scroll becomes a creative instrument.`,
        details: [
            'GSAP + ScrollTrigger choreography',
            'Motion.js spring physics',
            'Lenis smooth scroll',
            'Scroll-driven narratives',
            'Pinned & scrubbed sequences',
        ],
    },
];

function PanelStack() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;
            const panelEls =
                containerRef.current.querySelectorAll<HTMLElement>(
                    '.stack-panel',
                );

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: `+=${(panelEls.length - 1) * 120}%`,
                    pin: true,
                    scrub: 1.5,
                    invalidateOnRefresh: true,
                },
            });

            panelEls.forEach((panel, i) => {
                if (i === 0) return;

                // Previous panel fades slightly
                tl.to(panelEls[i - 1].querySelector('.panel-content'), {
                    opacity: 0.15,
                    y: -30,
                    duration: 0.3,
                });

                // New panel slides up
                tl.fromTo(
                    panel,
                    { yPercent: 100 },
                    { yPercent: 0, duration: 1, ease: 'none' },
                    '-=0.15',
                );

                // New panel content animates in
                const content = panel.querySelectorAll('[data-anim]');
                tl.fromTo(
                    content,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: 0.06,
                        duration: 0.5,
                        ease: 'power2.out',
                    },
                    '-=0.3',
                );

                // Hold
                if (i < panelEls.length - 1) {
                    tl.to({}, { duration: 0.4 });
                }
            });
        },
        { scope: containerRef },
    );

    return (
        <div ref={containerRef} className="relative h-screen overflow-hidden">
            {panels.map((panel, i) => (
                <div
                    key={panel.id}
                    className="stack-panel absolute inset-0"
                    style={{
                        background: C.bg,
                        zIndex: i + 1,
                        borderTop:
                            i > 0 ? `1px solid ${panel.accent}20` : 'none',
                    }}
                >
                    <div className="panel-content flex h-full items-start overflow-y-auto pt-20 pb-12">
                        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-8 md:px-16 lg:grid-cols-[1fr_1fr] lg:gap-16">
                            {/* Left — title + philosophy */}
                            <div>
                                <span
                                    data-anim
                                    className="mb-6 block text-[10px] tracking-[0.3em] uppercase"
                                    style={{
                                        fontFamily: mono,
                                        color: panel.accent,
                                    }}
                                >
                                    {panel.number}
                                </span>

                                <h2
                                    data-anim
                                    className="mb-8 text-4xl leading-[1.0] font-light whitespace-pre-line md:text-6xl"
                                    style={{
                                        fontFamily: display,
                                        color: C.cream,
                                    }}
                                >
                                    {panel.title}
                                </h2>

                                <p
                                    data-anim
                                    className="mb-6 text-base leading-[1.9]"
                                    style={{ fontFamily: body, color: C.sage }}
                                >
                                    {panel.body}
                                </p>

                                {/* Color swatch row for color panel */}
                                {panel.id === 'color' && (
                                    <div data-anim className="mt-4 flex gap-2">
                                        {swatches.map((color, si) => (
                                            <div
                                                key={si}
                                                className="group relative h-10 flex-1 cursor-default rounded-sm"
                                                style={{ background: color }}
                                            >
                                                <span
                                                    className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[8px] opacity-0 transition-opacity group-hover:opacity-100"
                                                    style={{
                                                        fontFamily: mono,
                                                        color: `${C.sage}80`,
                                                    }}
                                                >
                                                    {color}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right — extended philosophy + details */}
                            <div className="flex flex-col justify-center">
                                <p
                                    data-anim
                                    className="mb-8 text-sm leading-[1.9] italic"
                                    style={{
                                        fontFamily: display,
                                        color: `${C.cream}CC`,
                                        fontSize: '1.1rem',
                                    }}
                                >
                                    "{panel.philosophy}"
                                </p>

                                <div
                                    data-anim
                                    className="mb-6 h-[1px]"
                                    style={{ background: `${C.sage}15` }}
                                />

                                <ul className="space-y-2.5">
                                    {panel.details.map((d, di) => (
                                        <li
                                            key={di}
                                            data-anim
                                            className="flex items-center gap-3"
                                        >
                                            <span
                                                className="h-1.5 w-1.5 shrink-0 rounded-full"
                                                style={{
                                                    background: panel.accent,
                                                }}
                                            />
                                            <span
                                                className="text-xs tracking-[0.05em]"
                                                style={{
                                                    fontFamily: body,
                                                    color: C.sage,
                                                }}
                                            >
                                                {d}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Photography panel: simulated photo grid */}
                                {panel.id === 'photography' && (
                                    <div
                                        data-anim
                                        className="mt-8 grid grid-cols-3 gap-2"
                                    >
                                        {[
                                            C.grove,
                                            '#3A3A2E',
                                            C.sage,
                                            '#2A3830',
                                            C.wood,
                                            '#343430',
                                        ].map((bg, pi) => (
                                            <div
                                                key={pi}
                                                className="relative aspect-[3/4] overflow-hidden rounded-sm"
                                                style={{ background: bg }}
                                            >
                                                <div
                                                    className="absolute inset-0"
                                                    style={{
                                                        background: `radial-gradient(circle at ${30 + pi * 10}% ${40 + pi * 5}%, ${C.cream}08, transparent 60%)`,
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Atmosphere panel: technique badges */}
                                {panel.id === 'atmosphere' && (
                                    <div
                                        data-anim
                                        className="mt-6 flex flex-wrap gap-2"
                                    >
                                        {[
                                            'GSAP',
                                            'ScrollTrigger',
                                            'Motion.js',
                                            'Lenis',
                                            'React 19',
                                            'TypeScript',
                                            'Tailwind v4',
                                            'Inertia v2',
                                        ].map((t) => (
                                            <span
                                                key={t}
                                                className="rounded-full px-2.5 py-1 text-[10px] tracking-[0.1em] uppercase"
                                                style={{
                                                    fontFamily: mono,
                                                    color: panel.accent,
                                                    border: `1px solid ${panel.accent}30`,
                                                }}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Panel accent stripe — left edge */}
                        <div
                            className="absolute top-0 bottom-0 left-0 w-[4px]"
                            style={{ background: panel.accent, opacity: 0.3 }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ================================================================== */
/*  DECK NAV — 3 proposal decks                                        */
/* ================================================================== */
const deckCards = [
    {
        version: 'Deck v1.0',
        title: 'Interactive Map',
        description:
            'Category filters, proximity data, topographic map with 34 plotted locations and path drawing.',
        href: '/v1',
        accent: '#4d665a',
    },
    {
        version: 'Deck v1.2',
        title: 'Panel Navigation',
        description:
            'Category hero panels, map reveal, scrollytelling location detail with start-point routing.',
        href: '/v2',
        accent: '#847963',
    },
    {
        version: 'Deck v1.3',
        title: 'Narrative Journey',
        description:
            'Full scrollytelling experience — a guided walk through the ranch told as a visual story.',
        href: '/v3',
        accent: '#96acac',
    },
];

function DeckSection() {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!ref.current) return;
            gsap.fromTo(
                ref.current.querySelectorAll('[data-reveal]'),
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.08,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: ref.current, start: 'top 80%' },
                },
            );
        },
        { scope: ref },
    );

    return (
        <section
            ref={ref}
            className="py-20 md:py-24"
            style={{ borderTop: `1px solid ${C.sage}08` }}
        >
            <div className="mx-auto max-w-5xl px-8 md:px-16">
                <span
                    data-reveal
                    className="mb-4 block text-[10px] tracking-[0.3em] uppercase"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Calamigos Ranch
                </span>
                <h2
                    data-reveal
                    className="mb-10 text-3xl leading-[1.1] font-light md:text-4xl"
                    style={{ fontFamily: display, color: C.cream }}
                >
                    Proposal Decks
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {deckCards.map((d, i) => (
                        <motion.a
                            key={i}
                            data-reveal
                            href={d.href}
                            className="group relative block overflow-hidden rounded-sm p-6 md:p-7"
                            style={{
                                background: `${C.grove}25`,
                                border: `1px solid ${C.sage}10`,
                            }}
                            whileHover={{ y: -4 }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 25,
                            }}
                        >
                            <div
                                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                style={{
                                    background: `linear-gradient(135deg, ${d.accent}12, transparent)`,
                                }}
                            />

                            <div className="relative z-10">
                                <span
                                    className="mb-4 inline-block rounded-sm px-2 py-0.5 text-[10px] tracking-[0.2em] uppercase"
                                    style={{
                                        fontFamily: mono,
                                        color: d.accent,
                                        border: `1px solid ${d.accent}30`,
                                    }}
                                >
                                    {d.version}
                                </span>
                                <h3
                                    className="mb-2 text-xl font-light"
                                    style={{
                                        fontFamily: display,
                                        color: C.cream,
                                    }}
                                >
                                    {d.title}
                                </h3>
                                <p
                                    className="mb-5 text-[11px] leading-[1.7]"
                                    style={{ fontFamily: body, color: C.sage }}
                                >
                                    {d.description}
                                </p>
                                <span
                                    className="inline-block text-[11px] tracking-[0.15em] uppercase transition-transform group-hover:translate-x-2"
                                    style={{
                                        fontFamily: body,
                                        color: d.accent,
                                    }}
                                >
                                    View →
                                </span>
                            </div>

                            {/* Accent bar bottom */}
                            <div
                                className="absolute right-0 bottom-0 left-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                                style={{ background: d.accent }}
                            />
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ================================================================== */
/*  DESIGN BOARDS                                                      */
/* ================================================================== */
function DesignBoardsSection() {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!ref.current) return;
            gsap.fromTo(
                ref.current.querySelectorAll('[data-reveal]'),
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.06,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: ref.current, start: 'top 80%' },
                },
            );
        },
        { scope: ref },
    );

    const boards = [
        { label: 'Motion', href: '/moodboard/motion' },
        { label: 'Typography', href: '/moodboard/fonts' },
        { label: 'Scrollytelling', href: '/moodboard/scrollytelling' },
        { label: 'Interactions', href: '/moodboard/animations' },
        { label: 'Vocabulary', href: '/moodboard/vocabulary' },
        { label: 'Easing', href: '/moodboard/easing' },
        { label: 'Color', href: '/moodboard/color' },
        { label: 'GSAP', href: '/moodboard/scrollcraft' },
        { label: 'Snap Flow', href: '/moodboard/snapflow' },
        { label: 'Playground', href: '/designs' },
    ];

    return (
        <section
            ref={ref}
            className="py-16"
            style={{ borderTop: `1px solid ${C.sage}08` }}
        >
            <div className="mx-auto max-w-5xl px-8 md:px-16">
                <span
                    data-reveal
                    className="mb-4 block text-[9px] tracking-[0.25em] uppercase"
                    style={{ fontFamily: mono, color: `${C.sage}50` }}
                >
                    Design Study Boards
                </span>
                <div data-reveal className="flex flex-wrap gap-2">
                    {boards.map((b) => (
                        <a
                            key={b.href}
                            href={b.href}
                            className="rounded-sm px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase transition-colors hover:bg-white/5"
                            style={{
                                fontFamily: body,
                                color: C.sage,
                                background: `${C.sage}08`,
                            }}
                        >
                            {b.label}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ================================================================== */
/*  CONTACT FOOTER                                                     */
/* ================================================================== */
function ContactFooter() {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!ref.current) return;
            gsap.fromTo(
                ref.current.querySelectorAll('[data-reveal]'),
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.08,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: ref.current, start: 'top 80%' },
                },
            );
        },
        { scope: ref },
    );

    return (
        <footer
            ref={ref}
            className="relative py-24 md:py-32"
            style={{ borderTop: `1px solid ${C.sage}10` }}
        >
            <TopoLines opacity={0.03} />

            <div className="relative z-10 mx-auto max-w-4xl px-8 text-center md:px-16">
                <span
                    data-reveal
                    className="mb-8 block text-[10px] tracking-[0.4em] uppercase"
                    style={{ fontFamily: mono, color: C.sage }}
                >
                    Let's build something beautiful
                </span>

                <h2
                    data-reveal
                    className="mb-8 text-5xl leading-[0.95] font-light md:text-7xl"
                    style={{ fontFamily: display, color: C.cream }}
                >
                    Dave Peloso
                </h2>

                <div
                    data-reveal
                    className="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row"
                >
                    <a
                        href="tel:818-312-7735"
                        className="flex items-center gap-2 text-sm tracking-[0.1em] transition-colors hover:text-white"
                        style={{ fontFamily: body, color: C.sage }}
                    >
                        <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: C.woodLight }}
                        />
                        818-312-7735
                    </a>
                    <span
                        className="hidden h-4 w-[1px] sm:block"
                        style={{ background: `${C.sage}30` }}
                    />
                    <a
                        href="mailto:davepeloso@gmail.com"
                        className="flex items-center gap-2 text-sm tracking-[0.1em] transition-colors hover:text-white"
                        style={{ fontFamily: body, color: C.sage }}
                    >
                        <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: C.woodLight }}
                        />
                        davepeloso@gmail.com
                    </a>
                </div>

                {/* Color swatch signature */}
                <div data-reveal className="mb-12 flex justify-center gap-1.5">
                    {swatches.map((color, i) => (
                        <div
                            key={i}
                            className="h-1 w-8 rounded-full"
                            style={{ background: color, opacity: 0.5 }}
                        />
                    ))}
                </div>

                <p
                    data-reveal
                    className="text-[10px] tracking-[0.15em]"
                    style={{ fontFamily: mono, color: `${C.sage}35` }}
                >
                    Media & Design · Calamigos Ranch Proposal · 2026
                </p>
            </div>
        </footer>
    );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export default function Cover() {
    useFonts();

    useEffect(() => {
        const t = setTimeout(() => ScrollTrigger.refresh(), 200);
        return () => clearTimeout(t);
    }, []);

    return (
        <SmoothScroll lerp={0.08} duration={1.4}>
            <div
                className="min-h-screen"
                style={{ background: C.bg, color: C.cream }}
            >
                <FilmGrain />
                <Hero />
                <PanelStack />
                <DesignBoardsSection />
                <ContactFooter />
            </div>
        </SmoothScroll>
    );
}
