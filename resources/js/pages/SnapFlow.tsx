import React, { useEffect, useRef, useState } from 'react';
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
    groveDark: '#1A2E25',
    grove: '#2F4A3F',
    groveLight: '#3D6152',
    sand: '#EAE4D8',
    cream: '#F5F2EA',
    creamWarm: '#FAF7F0',
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
        const id = '__snapflow-fonts';
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
/*  Technique label                                                    */
/* ------------------------------------------------------------------ */
function TechNote({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-5xl mx-auto px-8 md:px-16 py-16" style={{ borderTop: `1px solid ${C.grove}` }}>
            <span
                className="block text-[10px] tracking-[0.3em] uppercase mb-3"
                style={{ fontFamily: body, color: C.wood }}
            >
                Technique
            </span>
            <p className="text-sm leading-relaxed max-w-2xl" style={{ fontFamily: body, color: C.sage }}>
                {children}
            </p>
        </div>
    );
}

/* ================================================================== */
/*  HERO — Full-screen snap landing                                    */
/* ================================================================== */
function Hero() {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;
        const tl = gsap.timeline({ delay: 0.2 });

        tl.fromTo(
            ref.current.querySelector('.hero-label'),
            { y: 30, opacity: 0 },
            { y: 0, opacity: 0.6, duration: 0.8, ease: 'power2.out' },
        );
        tl.fromTo(
            ref.current.querySelectorAll('.hero-word'),
            { y: 100, opacity: 0, skewY: 8 },
            { y: 0, opacity: 1, skewY: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out' },
            '-=0.4',
        );
        tl.fromTo(
            ref.current.querySelector('.hero-desc'),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
            '-=0.6',
        );
        tl.fromTo(
            ref.current.querySelector('.hero-scroll-cue'),
            { opacity: 0 },
            { opacity: 0.35, duration: 1 },
            '-=0.3',
        );

        // Parallax exit
        gsap.to(ref.current.querySelector('.hero-content'), {
            y: -120,
            opacity: 0,
            scrollTrigger: {
                trigger: ref.current,
                start: 'top top',
                end: '80% top',
                scrub: 1,
            },
        });
    }, { scope: ref });

    return (
        <section ref={ref} className="relative h-[130vh]">
            {/* Grain overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: '128px 128px',
                }}
            />

            <div className="sticky top-0 h-screen flex items-center justify-center">
                <div className="hero-content text-center px-8 max-w-5xl">
                    <span
                        className="hero-label block text-xs tracking-[0.4em] uppercase mb-10"
                        style={{ fontFamily: body, color: C.sage }}
                    >
                        Chapter 09 — Snap & Pin Sequences
                    </span>

                    <h1 className="overflow-hidden" style={{ fontFamily: display, color: C.cream }}>
                        {'Snap Flow'.split(' ').map((word, i) => (
                            <span
                                key={i}
                                className="hero-word inline-block text-[clamp(3.5rem,15vw,13rem)] font-light leading-[0.88] tracking-tight mx-[0.08em]"
                            >
                                {word}
                            </span>
                        ))}
                    </h1>

                    <p
                        className="hero-desc mt-10 text-lg tracking-wide max-w-xl mx-auto leading-relaxed"
                        style={{ fontFamily: body, color: C.sage }}
                    >
                        Scroll-snapped sections, pinned multi-step sequences, and choreographed
                        transitions that give scroll interactions a deliberate, authored rhythm.
                    </p>

                    <div className="hero-scroll-cue mt-20 flex flex-col items-center gap-2">
                        <span
                            className="text-[10px] tracking-[0.3em] uppercase"
                            style={{ fontFamily: body, color: C.sage }}
                        >
                            Scroll
                        </span>
                        <div className="w-[1px] h-12 overflow-hidden" style={{ background: `${C.sage}30` }}>
                            <div
                                className="w-full h-4"
                                style={{
                                    background: C.cream,
                                    animation: 'snapPulse 2s ease-in-out infinite',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes snapPulse {
                    0% { transform: translateY(-16px); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(48px); opacity: 0; }
                }
            `}</style>
        </section>
    );
}

/* ================================================================== */
/*  SECTION 1: Full-Screen Snap Sections                               */
/* ================================================================== */
const snapSections = [
    {
        heading: 'Arrival',
        subheading: 'The first breath',
        body: 'Guests cross the threshold and time dilates. The winding drive through sycamores is a decompression chamber — each curve shedding the outside world.',
        accent: C.grove,
        align: 'left' as const,
    },
    {
        heading: 'Discovery',
        subheading: 'Unfolding spaces',
        body: 'Terraced gardens reveal themselves one by one. The property is designed to be experienced sequentially — each space a chapter in a story written in landscape.',
        accent: C.wood,
        align: 'right' as const,
    },
    {
        heading: 'Gathering',
        subheading: 'The convergence',
        body: 'Scattered paths lead to one place: a long table beneath the oaks. String lights overhead mirror the constellations. Voices layer into a single chord.',
        accent: C.sage,
        align: 'center' as const,
    },
    {
        heading: 'Ceremony',
        subheading: 'The threshold',
        body: 'Golden hour arrives not as a moment but as a slow suffusion. The meadow glows. Every eye is drawn to the same point. The only sound is heartbeat and birdsong.',
        accent: C.sand,
        align: 'left' as const,
    },
];

function SnapSections() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const sections = containerRef.current.querySelectorAll<HTMLElement>('.snap-section');

        sections.forEach((section) => {
            const content = section.querySelectorAll('[data-anim]');
            const decorLine = section.querySelector('.decor-line');

            // Content entrance
            gsap.fromTo(
                content,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.12,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 60%',
                        toggleActions: 'play none none reverse',
                    },
                },
            );

            // Decorative line grow
            if (decorLine) {
                gsap.fromTo(
                    decorLine,
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        duration: 1.2,
                        ease: 'power2.inOut',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 50%',
                            toggleActions: 'play none none reverse',
                        },
                    },
                );
            }
        });

        // Snap: each section snaps to center
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            snap: {
                snapTo: 1 / (sections.length - 1),
                duration: { min: 0.2, max: 0.6 },
                ease: 'power2.inOut',
            },
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef}>
            <div className="max-w-5xl mx-auto px-8 md:px-16 py-32">
                <span
                    className="block text-xs tracking-[0.3em] uppercase mb-4"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Pattern 01
                </span>
                <h2
                    className="text-5xl md:text-7xl font-light leading-[1.05] mb-6"
                    style={{ fontFamily: display, color: C.cream }}
                >
                    Snap Sections
                </h2>
                <p
                    className="text-lg max-w-xl leading-relaxed"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Full-viewport sections that magnetically lock into place.
                    GSAP's snap gives fine-grained control over duration, easing,
                    and snap points — far beyond CSS scroll-snap.
                </p>
            </div>

            {snapSections.map((s, i) => (
                <section
                    key={i}
                    className="snap-section h-screen flex items-center relative overflow-hidden"
                >
                    {/* Background number */}
                    <span
                        className="absolute top-1/2 -translate-y-1/2 pointer-events-none select-none"
                        style={{
                            fontFamily: display,
                            fontSize: 'clamp(15rem, 30vw, 25rem)',
                            fontWeight: 300,
                            color: s.accent,
                            opacity: 0.04,
                            ...(s.align === 'left' ? { right: '5%' } : s.align === 'right' ? { left: '5%' } : { left: '50%', transform: 'translate(-50%, -50%)' }),
                        }}
                    >
                        {String(i + 1).padStart(2, '0')}
                    </span>

                    <div
                        className={`relative z-10 max-w-5xl mx-auto px-8 md:px-16 w-full ${
                            s.align === 'right' ? 'text-right ml-auto' :
                            s.align === 'center' ? 'text-center' : ''
                        }`}
                    >
                        <span
                            data-anim
                            className="block text-xs tracking-[0.3em] uppercase mb-4"
                            style={{ fontFamily: body, color: s.accent }}
                        >
                            {s.subheading}
                        </span>
                        <h3
                            data-anim
                            className="text-5xl md:text-8xl font-light leading-[0.95] mb-8"
                            style={{ fontFamily: display, color: C.cream }}
                        >
                            {s.heading}
                        </h3>
                        <div
                            className={`decor-line h-[1px] mb-8 ${
                                s.align === 'right' ? 'ml-auto origin-right' :
                                s.align === 'center' ? 'mx-auto origin-center' : 'origin-left'
                            }`}
                            style={{ background: s.accent, opacity: 0.3, width: '120px' }}
                        />
                        <p
                            data-anim
                            className={`text-base leading-[1.9] max-w-lg ${
                                s.align === 'right' ? 'ml-auto' :
                                s.align === 'center' ? 'mx-auto' : ''
                            }`}
                            style={{ fontFamily: body, color: C.sage }}
                        >
                            {s.body}
                        </p>
                    </div>
                </section>
            ))}

            <TechNote>
                ScrollTrigger.create with snap.snapTo divides the scroll range into equal segments.
                The snap object controls duration min/max and easing, providing magnetic locking
                without CSS scroll-snap's limitations. Content animates via toggleActions for
                enter/leave reversibility.
            </TechNote>
        </div>
    );
}

/* ================================================================== */
/*  SECTION 2: Pinned Multi-Step Narrative                             */
/* ================================================================== */
const narrativeSteps = [
    {
        title: 'Setting the Scene',
        text: 'Before words, there is atmosphere. The background shifts, the palette darkens, and the reader understands — instinctively — that something is about to change.',
        icon: '◯',
    },
    {
        title: 'Building Tension',
        text: 'Elements emerge in sequence. Each reveal is timed to the reader\'s breath — not too fast, not too slow. The scroll becomes a metronome.',
        icon: '△',
    },
    {
        title: 'The Turn',
        text: 'A single dramatic transformation. Scale shifts. Color inverts. Typography scales up 400%. The reader feels the pivot in their body.',
        icon: '◻',
    },
    {
        title: 'Resolution',
        text: 'Everything settles. The new state feels inevitable — as if the page was always meant to look this way. The reader exhales and scrolls on.',
        icon: '◇',
    },
];

function PinnedNarrative() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);

    useGSAP(() => {
        if (!containerRef.current) return;

        const steps = containerRef.current.querySelectorAll<HTMLElement>('.narrative-step');

        // Pin the section
        const pin = ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: `+=${steps.length * 100}%`,
            pin: true,
            onUpdate: (self) => {
                const idx = Math.min(
                    steps.length - 1,
                    Math.floor(self.progress * steps.length),
                );
                setActiveStep(idx);
            },
        });

        return () => pin.kill();
    }, { scope: containerRef });

    return (
        <section>
            <div className="max-w-5xl mx-auto px-8 md:px-16 py-32">
                <span
                    className="block text-xs tracking-[0.3em] uppercase mb-4"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Pattern 02
                </span>
                <h2
                    className="text-5xl md:text-7xl font-light leading-[1.05] mb-6"
                    style={{ fontFamily: display, color: C.cream }}
                >
                    Pinned Sequence
                </h2>
                <p
                    className="text-lg max-w-xl leading-relaxed"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    The viewport locks in place while content transforms step-by-step.
                    Each scroll increment advances the narrative without the reader
                    losing spatial context.
                </p>
            </div>

            <div ref={containerRef} className="h-screen flex relative overflow-hidden">
                {/* Left: step indicators */}
                <div className="hidden md:flex flex-col justify-center items-center w-24 shrink-0">
                    {narrativeSteps.map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div
                                className="w-2 h-2 rounded-full transition-all duration-500"
                                style={{
                                    background: i === activeStep ? C.cream : `${C.sage}30`,
                                    transform: i === activeStep ? 'scale(1.5)' : 'scale(1)',
                                }}
                            />
                            {i < narrativeSteps.length - 1 && (
                                <div
                                    className="w-[1px] h-12 transition-colors duration-500"
                                    style={{
                                        background: i < activeStep ? C.sage : `${C.sage}15`,
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Center: visual */}
                <div className="flex-1 flex items-center justify-center relative">
                    {/* Morphing shape */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80">
                        {narrativeSteps.map((step, i) => (
                            <div
                                key={i}
                                className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                                style={{
                                    opacity: i === activeStep ? 1 : 0,
                                    transform: i === activeStep
                                        ? 'scale(1) rotate(0deg)'
                                        : i < activeStep
                                            ? 'scale(0.8) rotate(-10deg)'
                                            : 'scale(1.2) rotate(10deg)',
                                }}
                            >
                                <span
                                    className="text-[10rem] md:text-[14rem] leading-none select-none"
                                    style={{
                                        fontFamily: 'system-ui',
                                        color: C.cream,
                                        opacity: 0.12,
                                    }}
                                >
                                    {step.icon}
                                </span>
                            </div>
                        ))}

                        {/* Step counter */}
                        <div
                            className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center"
                        >
                            <span
                                className="text-xs tracking-[0.3em] uppercase"
                                style={{ fontFamily: mono, color: `${C.sage}60` }}
                            >
                                {String(activeStep + 1).padStart(2, '0')} / {String(narrativeSteps.length).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: text content */}
                <div className="flex-1 flex items-center px-8 md:px-16">
                    <div className="max-w-md">
                        {narrativeSteps.map((step, i) => (
                            <div
                                key={i}
                                className="absolute transition-all duration-600"
                                style={{
                                    opacity: i === activeStep ? 1 : 0,
                                    transform: i === activeStep
                                        ? 'translateY(0)'
                                        : i < activeStep
                                            ? 'translateY(-40px)'
                                            : 'translateY(40px)',
                                    pointerEvents: i === activeStep ? 'auto' : 'none',
                                }}
                            >
                                <span
                                    className="block text-xs tracking-[0.3em] uppercase mb-4"
                                    style={{ fontFamily: body, color: C.wood }}
                                >
                                    Step {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3
                                    className="text-3xl md:text-4xl font-light mb-6 leading-[1.1]"
                                    style={{ fontFamily: display, color: C.cream }}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    className="text-base leading-[1.9]"
                                    style={{ fontFamily: body, color: C.sage }}
                                >
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <TechNote>
                A single ScrollTrigger pins the container and expands the scroll range by step-count × 100%.
                The onUpdate callback maps progress to a discrete step index via Math.floor.
                React state drives CSS transitions for the content swap — no GSAP needed for the
                crossfade since the transitions are simple opacity/transform.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  SECTION 3: Scrub Timeline Choreography                             */
/* ================================================================== */
function ScrubTimeline() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: '+=300%',
                pin: true,
                scrub: 1.5,
            },
        });

        // Phase 1: Title enters
        tl.fromTo(
            '.scrub-title',
            { y: 100, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
        );

        // Phase 2: Title exits up, subtitle enters
        tl.to('.scrub-title', { y: -80, opacity: 0, duration: 0.5 }, '+=0.3');
        tl.fromTo(
            '.scrub-subtitle',
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
            '-=0.2',
        );

        // Phase 3: Grid items cascade in
        tl.fromTo(
            '.scrub-grid-item',
            { y: 80, opacity: 0, scale: 0.85 },
            { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' },
            '-=0.3',
        );

        // Phase 4: Everything exits
        tl.to('.scrub-subtitle', { opacity: 0, y: -30, duration: 0.4 }, '+=0.5');
        tl.to('.scrub-grid-item', { opacity: 0, y: -40, stagger: 0.04, duration: 0.4 }, '-=0.2');

        // Phase 5: Final statement
        tl.fromTo(
            '.scrub-final',
            { opacity: 0, scale: 0.85, letterSpacing: '0.5em' },
            { opacity: 1, scale: 1, letterSpacing: '0.1em', duration: 1.2, ease: 'power2.out' },
            '-=0.1',
        );
    }, { scope: sectionRef });

    const gridItems = [
        'Rhythm', 'Contrast', 'Hierarchy', 'Whitespace',
        'Alignment', 'Proximity',
    ];

    return (
        <section>
            <div className="max-w-5xl mx-auto px-8 md:px-16 py-32">
                <span
                    className="block text-xs tracking-[0.3em] uppercase mb-4"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Pattern 03
                </span>
                <h2
                    className="text-5xl md:text-7xl font-light leading-[1.05] mb-6"
                    style={{ fontFamily: display, color: C.cream }}
                >
                    Scrub Timeline
                </h2>
                <p
                    className="text-lg max-w-xl leading-relaxed"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    A complete choreographed sequence bound to a single scrubbed timeline.
                    The reader controls the playhead — scrub forward to advance,
                    scrub backward to rewind. Every frame is intentional.
                </p>
            </div>

            <div ref={sectionRef} className="h-screen flex items-center justify-center overflow-hidden relative">
                {/* Background gradient that shifts */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(ellipse at center, ${C.grove}30, transparent 70%)`,
                    }}
                />

                <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
                    {/* Phase 1: Title */}
                    <h3
                        className="scrub-title text-6xl md:text-9xl font-light leading-[0.9]"
                        style={{ fontFamily: display, color: C.cream, opacity: 0 }}
                    >
                        Design<br />
                        <em style={{ color: C.sand }}>Principles</em>
                    </h3>

                    {/* Phase 2: Subtitle */}
                    <p
                        className="scrub-subtitle text-sm tracking-[0.3em] uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
                        style={{ fontFamily: body, color: C.sage, opacity: 0 }}
                    >
                        The foundation of every great interface
                    </p>

                    {/* Phase 3: Grid */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {gridItems.map((item, i) => (
                                <div
                                    key={i}
                                    className="scrub-grid-item py-8 rounded-sm text-center"
                                    style={{
                                        background: `${C.grove}40`,
                                        border: `1px solid ${C.sage}15`,
                                        opacity: 0,
                                    }}
                                >
                                    <span
                                        className="text-lg font-light"
                                        style={{ fontFamily: display, color: C.cream }}
                                    >
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Phase 5: Final */}
                    <p
                        className="scrub-final text-2xl md:text-4xl font-light absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full whitespace-nowrap"
                        style={{
                            fontFamily: display,
                            color: C.cream,
                            opacity: 0,
                        }}
                    >
                        Every detail, authored.
                    </p>
                </div>
            </div>

            <TechNote>
                A single gsap.timeline with scrollTrigger pin + scrub orchestrates 5 phases.
                Elements enter, crossfade, and exit in sequence — all reversible because GSAP
                timelines play backward when scrubbing up. The timeline is the scroll.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  SECTION 4: Reveal Mask / Clip Path                                 */
/* ================================================================== */
function RevealMask() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        // Circle reveal
        gsap.fromTo(
            sectionRef.current.querySelector('.reveal-circle'),
            { clipPath: 'circle(0% at 50% 50%)' },
            {
                clipPath: 'circle(75% at 50% 50%)',
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=200%',
                    pin: true,
                    scrub: 1,
                },
            },
        );

        // Text fade in during reveal
        gsap.fromTo(
            sectionRef.current.querySelector('.reveal-text'),
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: '30% top',
                    end: '60% top',
                    scrub: 1,
                },
            },
        );
    }, { scope: sectionRef });

    return (
        <section>
            <div className="max-w-5xl mx-auto px-8 md:px-16 py-32">
                <span
                    className="block text-xs tracking-[0.3em] uppercase mb-4"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Pattern 04
                </span>
                <h2
                    className="text-5xl md:text-7xl font-light leading-[1.05] mb-6"
                    style={{ fontFamily: display, color: C.cream }}
                >
                    Reveal Mask
                </h2>
                <p
                    className="text-lg max-w-xl leading-relaxed"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    A CSS clip-path circle expands from a point to reveal content beneath.
                    Scrubbed to scroll, the reader peels back a layer — literally uncovering
                    what lies beneath the surface.
                </p>
            </div>

            <div ref={sectionRef} className="h-screen relative overflow-hidden">
                {/* Base layer: dark with text */}
                <div className="absolute inset-0 flex items-center justify-center"
                     style={{ background: C.groveDark }}
                >
                    <p
                        className="text-xl tracking-[0.2em] uppercase"
                        style={{ fontFamily: body, color: `${C.sage}40` }}
                    >
                        Scroll to reveal
                    </p>
                </div>

                {/* Revealed layer */}
                <div
                    className="reveal-circle absolute inset-0 flex items-center justify-center"
                    style={{
                        background: `linear-gradient(160deg, ${C.grove}, ${C.wood}30)`,
                        clipPath: 'circle(0% at 50% 50%)',
                    }}
                >
                    <div className="reveal-text text-center px-8 max-w-2xl">
                        <span
                            className="block text-xs tracking-[0.4em] uppercase mb-6"
                            style={{ fontFamily: body, color: C.wood }}
                        >
                            Beneath the surface
                        </span>
                        <h3
                            className="text-5xl md:text-8xl font-light leading-[0.95] mb-8"
                            style={{ fontFamily: display, color: C.cream }}
                        >
                            Revealed
                        </h3>
                        <p
                            className="text-base leading-[1.8] max-w-lg mx-auto"
                            style={{ fontFamily: body, color: C.sage }}
                        >
                            The most powerful scroll moments are thresholds — points where
                            the reader crosses from one state to another and feels the
                            transformation in their body.
                        </p>
                    </div>
                </div>
            </div>

            <TechNote>
                GSAP animates clipPath from circle(0%) to circle(75%). Pinned with scrub,
                the reveal feels like opening an iris. This technique works for any CSS clip-path
                shape: polygon, inset, ellipse. Performance is excellent since clip-path
                is GPU-composited.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  SECTION 5: Scroll Speed Indicator                                  */
/* ================================================================== */
function ScrollSpeedDisplay() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [speed, setSpeed] = useState(0);
    const lastScroll = useRef(0);
    const lastTime = useRef(Date.now());

    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();
            const dt = now - lastTime.current;
            if (dt > 0) {
                const dy = Math.abs(window.scrollY - lastScroll.current);
                const v = Math.min(dy / dt * 16, 100); // Normalize to ~0-100
                setSpeed(Math.round(v));
            }
            lastScroll.current = window.scrollY;
            lastTime.current = now;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useGSAP(() => {
        if (!sectionRef.current) return;

        gsap.fromTo(
            sectionRef.current.querySelectorAll('[data-reveal]'),
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
            },
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef}>
            <div className="max-w-5xl mx-auto px-8 md:px-16 py-32">
                <span
                    className="block text-xs tracking-[0.3em] uppercase mb-4"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Pattern 05
                </span>
                <h2
                    className="text-5xl md:text-7xl font-light leading-[1.05] mb-6"
                    style={{ fontFamily: display, color: C.cream }}
                >
                    Velocity Response
                </h2>
                <p
                    className="text-lg max-w-xl leading-relaxed"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Interface elements that respond to scroll velocity, not just position.
                    Faster scrolling creates visual urgency — slower scrolling reveals detail.
                    The reader's speed becomes an input.
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-8 md:px-16 py-16 min-h-[80vh] flex flex-col items-center justify-center">
                {/* Speed visualization */}
                <div data-reveal className="relative mb-16">
                    <div
                        className="w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center relative"
                        style={{
                            border: `1px solid ${C.sage}20`,
                            background: `radial-gradient(circle, ${C.grove}${Math.min(99, speed).toString(16).padStart(2, '0')}, transparent)`,
                            transition: 'background 0.3s ease',
                        }}
                    >
                        <div className="text-center">
                            <span
                                className="block text-7xl md:text-8xl font-light tabular-nums"
                                style={{
                                    fontFamily: display,
                                    color: C.cream,
                                    transition: 'transform 0.1s ease',
                                    transform: `scale(${1 + speed * 0.003})`,
                                }}
                            >
                                {speed}
                            </span>
                            <span
                                className="block text-xs tracking-[0.3em] uppercase mt-2"
                                style={{ fontFamily: mono, color: C.sage }}
                            >
                                px/frame
                            </span>
                        </div>

                        {/* Orbiting dot */}
                        <div
                            className="absolute w-3 h-3 rounded-full"
                            style={{
                                background: C.sand,
                                top: '50%',
                                left: '50%',
                                transform: `rotate(${speed * 10}deg) translateX(${130}px)`,
                                transition: 'transform 0.2s ease',
                                opacity: 0.6,
                            }}
                        />
                    </div>
                </div>

                {/* Speed-reactive bars */}
                <div data-reveal className="w-full max-w-lg space-y-3">
                    {['Gentle', 'Moderate', 'Energetic', 'Rapid'].map((label, i) => {
                        const threshold = (i + 1) * 20;
                        const active = speed >= threshold;
                        return (
                            <div key={i} className="flex items-center gap-4">
                                <span
                                    className="w-20 text-xs tracking-[0.15em] uppercase text-right"
                                    style={{
                                        fontFamily: body,
                                        color: active ? C.cream : `${C.sage}40`,
                                        transition: 'color 0.3s',
                                    }}
                                >
                                    {label}
                                </span>
                                <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background: `${C.sage}15` }}>
                                    <div
                                        className="h-full origin-left transition-transform duration-300"
                                        style={{
                                            background: active ? C.sage : `${C.sage}30`,
                                            transform: `scaleX(${Math.min(1, speed / threshold)})`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <TechNote>
                Scroll velocity is computed from deltaY / deltaTime on each scroll event.
                The speed value drives CSS transforms via React state — the orbiting dot rotation,
                the number scale, and the progress bars all respond in real time. Combine with
                GSAP's ScrollTrigger velocity property for more advanced responses.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  SECTION 6: Split Text Cascade                                      */
/* ================================================================== */
function SplitTextCascade() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        // Cascade 1: Words dropping in
        const words = sectionRef.current.querySelectorAll('.cascade-word');
        gsap.fromTo(
            words,
            { y: -100, opacity: 0, rotationX: -90 },
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                stagger: {
                    each: 0.06,
                    from: 'start',
                },
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: sectionRef.current.querySelector('.cascade-block-1'),
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
            },
        );

        // Cascade 2: Characters fanning in from center
        const chars = sectionRef.current.querySelectorAll('.cascade-char');
        gsap.fromTo(
            chars,
            { opacity: 0, y: 40, scale: 0 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: {
                    each: 0.02,
                    from: 'center',
                },
                duration: 0.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current.querySelector('.cascade-block-2'),
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
            },
        );

        // Cascade 3: Scrubbed letter-by-letter
        const scrubChars = sectionRef.current.querySelectorAll('.scrub-char');
        gsap.fromTo(
            scrubChars,
            { color: `${C.sage}30`, y: 5 },
            {
                color: C.cream,
                y: 0,
                stagger: 0.02,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current.querySelector('.cascade-block-3'),
                    start: 'top 60%',
                    end: 'top 20%',
                    scrub: 1,
                },
            },
        );
    }, { scope: sectionRef });

    const phrase1 = 'Light shapes everything';
    const phrase2 = 'CALAMIGOS RANCH';
    const phrase3 = 'Where the canyon meets the sky and every detail speaks to the land beneath your feet.';

    return (
        <section ref={sectionRef}>
            <div className="max-w-5xl mx-auto px-8 md:px-16 py-32">
                <span
                    className="block text-xs tracking-[0.3em] uppercase mb-4"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Pattern 06
                </span>
                <h2
                    className="text-5xl md:text-7xl font-light leading-[1.05] mb-6"
                    style={{ fontFamily: display, color: C.cream }}
                >
                    Text Cascades
                </h2>
                <p
                    className="text-lg max-w-xl leading-relaxed"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Three text animation strategies: word-level drops with 3D rotation,
                    character-level fan from center, and scroll-scrubbed color reveal.
                    Each creates a different emotional cadence.
                </p>
            </div>

            <div className="max-w-5xl mx-auto px-8 md:px-16 space-y-48 py-16">
                {/* Cascade 1: Word drops */}
                <div className="cascade-block-1 text-center" style={{ perspective: '600px' }}>
                    <span
                        className="block text-[10px] tracking-[0.3em] uppercase mb-6"
                        style={{ fontFamily: mono, color: C.wood }}
                    >
                        Word Drop — back.out easing
                    </span>
                    <p className="text-4xl md:text-7xl font-light leading-[1.1]" style={{ fontFamily: display }}>
                        {phrase1.split(' ').map((word, i) => (
                            <span
                                key={i}
                                className="cascade-word inline-block mx-[0.12em]"
                                style={{ color: C.cream, transformStyle: 'preserve-3d' }}
                            >
                                {word}
                            </span>
                        ))}
                    </p>
                </div>

                {/* Cascade 2: Character fan */}
                <div className="cascade-block-2 text-center">
                    <span
                        className="block text-[10px] tracking-[0.3em] uppercase mb-6"
                        style={{ fontFamily: mono, color: C.wood }}
                    >
                        Character Fan — stagger from center
                    </span>
                    <p
                        className="text-5xl md:text-8xl font-light tracking-[0.15em]"
                        style={{ fontFamily: display }}
                    >
                        {phrase2.split('').map((char, i) => (
                            <span
                                key={i}
                                className="cascade-char inline-block"
                                style={{ color: C.sand }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </p>
                </div>

                {/* Cascade 3: Scrub reveal */}
                <div className="cascade-block-3 text-center">
                    <span
                        className="block text-[10px] tracking-[0.3em] uppercase mb-6"
                        style={{ fontFamily: mono, color: C.wood }}
                    >
                        Scroll Scrub — character-by-character color
                    </span>
                    <p
                        className="text-2xl md:text-4xl font-light leading-[1.5] max-w-3xl mx-auto"
                        style={{ fontFamily: display }}
                    >
                        {phrase3.split('').map((char, i) => (
                            <span
                                key={i}
                                className="scrub-char inline-block"
                                style={{ color: `${C.sage}30` }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </p>
                </div>
            </div>

            <div className="h-[30vh]" />

            <TechNote>
                GSAP stagger accepts a "from" parameter: "start", "end", "center", "edges", or "random".
                Combined with 3D transforms (rotationX) and back.out easing, text feels physical.
                The scrub variant ties character color directly to scroll position for a
                reading-speed reveal effect.
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
                scrollTrigger: { trigger: ref.current, start: 'top 85%' },
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
                Calamigos Ranch — Snap & Pin Patterns
            </p>
            <p
                data-reveal
                className="text-xs tracking-[0.15em]"
                style={{ fontFamily: mono, color: `${C.sage}55` }}
            >
                gsap · scrolltrigger · snap · pin · scrub
            </p>
        </footer>
    );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
const SnapFlow = () => {
    useFonts();

    useEffect(() => {
        const timeout = setTimeout(() => ScrollTrigger.refresh(), 100);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <SmoothScroll lerp={0.08} duration={1.4}>
            <div className="min-h-screen" style={{ background: C.groveDark, color: C.cream }}>
                <StudyNav currentPage="snapflow" />
                <Hero />
                <SnapSections />
                <PinnedNarrative />
                <ScrubTimeline />
                <RevealMask />
                <ScrollSpeedDisplay />
                <SplitTextCascade />
                <Footer />
            </div>
        </SmoothScroll>
    );
};

export default SnapFlow;
