import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';
import React, { useRef, useEffect, useState } from 'react';
import StudyNav from '@/components/StudyNav';

/* ------------------------------------------------------------------ */
/*  Color tokens                                                       */
/* ------------------------------------------------------------------ */
const C = {
    groveDark: '#243A32',
    grove: '#2F4A3F',
    sand: '#EAE4D8',
    cream: '#F5F2EA',
    sage: '#7A8F82',
    wood: '#8A6B4F',
    charcoal: '#2C2C2C',
    divider: '#DCD6CA',
} as const;

const display = "'Cormorant Garamond', Georgia, serif";
const body = "'DM Sans', system-ui, sans-serif";

/* ------------------------------------------------------------------ */
/*  Font loader                                                        */
/* ------------------------------------------------------------------ */
function useFonts() {
    useEffect(() => {
        const id = '__scrollytelling-fonts';
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href =
            'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap';
        document.head.appendChild(link);
    }, []);
}

/* ------------------------------------------------------------------ */
/*  Shared small components                                            */
/* ------------------------------------------------------------------ */
function ChapterHeader({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <motion.div
            className="max-w-5xl mx-auto px-8 md:px-16 py-32"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
        >
            <span
                className="block text-xs tracking-[0.3em] uppercase mb-4"
                style={{ fontFamily: body, color: C.sage }}
            >
                Pattern {number}
            </span>
            <h2
                className="text-5xl md:text-7xl font-light leading-[1.05] mb-6"
                style={{ fontFamily: display, color: C.cream }}
            >
                {title}
            </h2>
            <p
                className="text-lg max-w-xl leading-relaxed"
                style={{ fontFamily: body, color: C.sage }}
            >
                {description}
            </p>
        </motion.div>
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
                Technique
            </span>
            <p className="text-sm leading-relaxed max-w-2xl" style={{ fontFamily: body, color: C.sage }}>
                {children}
            </p>
        </div>
    );
}

/* ================================================================== */
/*  HERO                                                               */
/* ================================================================== */
function Hero() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.88]);
    const y = useTransform(scrollYProgress, [0, 0.6], [0, 120]);

    return (
        <section ref={ref} className="relative h-[120vh] flex items-center justify-center overflow-hidden">
            {/* Atmospheric background lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${15 + i * 14}%`,
                            top: 0,
                            bottom: 0,
                            width: '1px',
                            background: `linear-gradient(to bottom, transparent, ${C.grove}, transparent)`,
                            opacity: 0.25,
                        }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 1.5, delay: 0.1 * i, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                ))}
            </div>

            <motion.div className="relative text-center px-8" style={{ opacity, scale, y }}>
                <motion.span
                    className="block text-xs tracking-[0.4em] uppercase mb-8"
                    style={{ fontFamily: body, color: C.sage }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Chapter 03 &mdash; Design Study
                </motion.span>
                <motion.h1
                    className="text-[clamp(3rem,12vw,11rem)] font-light leading-[0.9] tracking-tight"
                    style={{ fontFamily: display, color: C.cream }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    Scrollytelling
                </motion.h1>
                <motion.p
                    className="mt-8 text-base tracking-wide max-w-lg mx-auto"
                    style={{ fontFamily: body, color: C.sage }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    Five narrative scroll patterns that transform passive reading into immersive experience.
                </motion.p>
                <motion.div
                    className="mt-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1.5, duration: 1 }}
                >
                    <motion.div
                        className="w-[1px] h-16 mx-auto"
                        style={{ background: C.sage }}
                        animate={{ scaleY: [0, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 1: Sticky Narrative                                        */
/* ================================================================== */
const narrativeSteps = [
    {
        title: 'The Arrival',
        text: 'Guests pass through the gates and the world outside falls away. Ancient sycamores line the winding drive, their canopy filtering the light into soft, dappled warmth. This first moment sets the tone for everything that follows.',
        shapes: [
            { type: 'rect' as const, x: 10, y: 15, w: 80, h: 70, color: C.grove, rotate: 0 },
            { type: 'circle' as const, cx: 50, cy: 50, r: 8, color: C.sage },
        ],
    },
    {
        title: 'The Garden',
        text: 'Terraced gardens descend toward the creek bed, each level offering new textures: wild lavender, heritage roses, sculptural oaks that have watched over this land for two hundred years. The garden is both sanctuary and stage.',
        shapes: [
            { type: 'rect' as const, x: 5, y: 20, w: 40, h: 60, color: C.sage, rotate: -3 },
            { type: 'rect' as const, x: 50, y: 10, w: 45, h: 50, color: C.wood, rotate: 2 },
            { type: 'circle' as const, cx: 30, cy: 70, r: 15, color: C.grove },
            { type: 'circle' as const, cx: 75, cy: 65, r: 10, color: C.sand },
        ],
    },
    {
        title: 'The Gathering',
        text: 'Under a canopy of string lights and live oaks, long tables are set with linen and wild-foraged centrepieces. Voices begin to overlap, laughter echoes off the canyon walls, and the evening takes on its own gentle rhythm.',
        shapes: [
            { type: 'rect' as const, x: 15, y: 5, w: 70, h: 20, color: C.wood, rotate: 0 },
            { type: 'rect' as const, x: 20, y: 30, w: 60, h: 20, color: C.sage, rotate: 0 },
            { type: 'rect' as const, x: 25, y: 55, w: 50, h: 20, color: C.grove, rotate: 0 },
            { type: 'circle' as const, cx: 50, cy: 85, r: 6, color: C.sand },
        ],
    },
    {
        title: 'The Ceremony',
        text: 'The meadow clears. A floral arch frames the far ridge and the golden hour spills across the grass like a slow exhalation. Everything converges on this single, luminous threshold between before and after.',
        shapes: [
            { type: 'circle' as const, cx: 50, cy: 45, r: 30, color: C.wood },
            { type: 'circle' as const, cx: 50, cy: 45, r: 18, color: C.groveDark },
            { type: 'rect' as const, x: 44, y: 15, w: 12, h: 60, color: C.sage, rotate: 0 },
        ],
    },
    {
        title: 'The Farewell',
        text: 'Lanterns line the path back through the oaks. The night air carries jasmine and embers. Guests leave slowly, reluctantly, knowing that what they felt here cannot be replicated -- only remembered.',
        shapes: [
            { type: 'circle' as const, cx: 20, cy: 25, r: 4, color: C.sand },
            { type: 'circle' as const, cx: 45, cy: 40, r: 5, color: C.sage },
            { type: 'circle' as const, cx: 70, cy: 30, r: 3, color: C.wood },
            { type: 'circle' as const, cx: 35, cy: 65, r: 6, color: C.sand },
            { type: 'circle' as const, cx: 80, cy: 70, r: 4, color: C.sage },
            { type: 'rect' as const, x: 0, y: 48, w: 100, h: 1, color: C.divider, rotate: 0 },
        ],
    },
];

function StickyNarrative() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 30 });
    const [activeStep, setActiveStep] = useState(0);

    useMotionValueEvent(smoothProgress, 'change', (v: number) => {
        const stepCount = narrativeSteps.length;
        const idx = Math.max(0, Math.min(stepCount - 1, Math.floor(v * stepCount)));
        setActiveStep(idx);
    });

    return (
        <section>
            <ChapterHeader
                number="01"
                title="Sticky Narrative"
                description="The anchor of every long-form scroll experience. A fixed visual responds to the reader's position while narrative text flows naturally alongside it. Best for step-by-step reveals where context and visual must stay connected."
            />

            <div ref={containerRef} className="relative" style={{ height: `${narrativeSteps.length * 100}vh` }}>
                <div className="sticky top-0 h-screen flex">
                    {/* Left: sticky visual */}
                    <div className="hidden md:flex w-1/2 items-center justify-center p-12">
                        <div className="relative w-full max-w-md aspect-square">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                {narrativeSteps[activeStep].shapes.map((s, i) => {
                                    if (s.type === 'circle') {
                                        return (
                                            <motion.circle
                                                key={`c-${activeStep}-${i}`}
                                                cx={s.cx}
                                                cy={s.cy}
                                                r={s.r}
                                                fill={s.color}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 0.85, scale: 1 }}
                                                transition={{ duration: 0.6, delay: i * 0.08 }}
                                            />
                                        );
                                    }
                                    return (
                                        <motion.rect
                                            key={`r-${activeStep}-${i}`}
                                            x={s.x}
                                            y={s.y}
                                            width={s.w}
                                            height={s.h}
                                            rx={2}
                                            fill={s.color}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 0.7, scale: 1 }}
                                            transition={{ duration: 0.6, delay: i * 0.08 }}
                                            style={{ transformOrigin: `${s.x! + s.w! / 2}px ${s.y! + s.h! / 2}px`, rotate: s.rotate }}
                                        />
                                    );
                                })}
                            </svg>
                            {/* Step indicator */}
                            <div
                                className="absolute -bottom-10 left-0 right-0 text-center text-xs tracking-[0.3em] uppercase"
                                style={{ fontFamily: body, color: C.sage }}
                            >
                                {activeStep + 1} / {narrativeSteps.length}
                            </div>
                        </div>
                    </div>

                    {/* Right: scrolling text (positioned via padding so each step roughly maps) */}
                    <div className="w-full md:w-1/2 relative">
                        {/* progress line */}
                        <motion.div
                            className="absolute left-0 top-0 w-[1px] origin-top"
                            style={{
                                background: C.sage,
                                height: '100%',
                                scaleY: smoothProgress,
                                opacity: 0.3,
                            }}
                        />
                    </div>
                </div>

                {/* Floating text blocks that trigger steps */}
                <div className="absolute inset-0 pointer-events-none">
                    {narrativeSteps.map((step, i) => (
                        <div
                            key={i}
                            className="h-screen flex items-center"
                        >
                            <div className="w-full md:w-1/2 md:ml-auto px-8 md:px-16 pointer-events-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 60 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ margin: '-40% 0px -40% 0px' }}
                                    transition={{ duration: 0.7 }}
                                >
                                    <span
                                        className="block text-xs tracking-[0.25em] uppercase mb-4"
                                        style={{ fontFamily: body, color: C.wood }}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <h3
                                        className="text-3xl md:text-4xl font-light mb-5"
                                        style={{ fontFamily: display, color: C.cream }}
                                    >
                                        {step.title}
                                    </h3>
                                    <p
                                        className="text-base leading-[1.8] max-w-md"
                                        style={{ fontFamily: body, color: C.sage }}
                                    >
                                        {step.text}
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <TechNote>
                useScroll with a target ref tracks progress within a specific container.
                Map scrollYProgress to discrete steps with Math.floor and drive the visual state from a single integer.
                useSpring smooths the raw progress so transitions between steps feel fluid rather than instant.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 2: Horizontal Scroll                                       */
/* ================================================================== */
const horizontalPanels = [
    { title: 'Oak Grove', subtitle: 'Ceremony space beneath two-hundred-year-old oaks', accent: C.grove },
    { title: 'The Vineyard', subtitle: 'Terraced rows descending toward the canyon floor', accent: C.wood },
    { title: 'Rose Garden', subtitle: 'Heritage blooms framing a stone-paved courtyard', accent: C.sage },
    { title: 'Creek Pavilion', subtitle: 'Open-air dining where water and candlelight converge', accent: C.sand },
    { title: 'Starlight Terrace', subtitle: 'Elevated deck with an unobstructed sky', accent: C.cream },
];

function HorizontalScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
    const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(horizontalPanels.length - 1) * 100}%`]);
    const smoothX = useSpring(x, { stiffness: 60, damping: 30 });

    return (
        <section>
            <ChapterHeader
                number="02"
                title="Horizontal Scroll"
                description="Vertical scroll input drives horizontal motion, creating a cinematic tracking shot through content. Best for spatial narratives, venue tours, or any sequence where left-to-right progression feels more natural than top-to-bottom."
            />

            <div ref={containerRef} style={{ height: `${horizontalPanels.length * 100}vh` }}>
                <div className="sticky top-0 h-screen overflow-hidden">
                    <motion.div className="flex h-full" style={{ x: smoothX, width: `${horizontalPanels.length * 100}%` }}>
                        {horizontalPanels.map((panel, i) => (
                            <div
                                key={i}
                                className="w-screen h-full flex items-center justify-center px-8 md:px-20"
                                style={{ flex: '0 0 auto', width: `${100 / horizontalPanels.length}%` }}
                            >
                                <div className="max-w-2xl w-full">
                                    <div
                                        className="w-full aspect-[3/2] rounded-sm mb-10 flex items-end p-8"
                                        style={{
                                            background: `linear-gradient(135deg, ${panel.accent}44, ${panel.accent}22)`,
                                            border: `1px solid ${panel.accent}33`,
                                        }}
                                    >
                                        <span
                                            className="text-[8rem] md:text-[10rem] font-light leading-none opacity-20"
                                            style={{ fontFamily: display, color: panel.accent }}
                                        >
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <h3
                                        className="text-4xl md:text-5xl font-light mb-4"
                                        style={{ fontFamily: display, color: C.cream }}
                                    >
                                        {panel.title}
                                    </h3>
                                    <p
                                        className="text-base leading-relaxed max-w-md"
                                        style={{ fontFamily: body, color: C.sage }}
                                    >
                                        {panel.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Horizontal progress indicator */}
                    <div className="absolute bottom-12 left-8 md:left-16 right-8 md:right-16">
                        <div className="h-[1px] w-full" style={{ background: `${C.sage}33` }}>
                            <motion.div
                                className="h-full origin-left"
                                style={{ background: C.sage, scaleX: scrollYProgress }}
                            />
                        </div>
                        <div className="flex justify-between mt-3">
                            {horizontalPanels.map((p, i) => (
                                <span
                                    key={i}
                                    className="text-[10px] tracking-[0.2em] uppercase"
                                    style={{ fontFamily: body, color: `${C.sage}88` }}
                                >
                                    {p.title}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <TechNote>
                Map vertical scrollYProgress [0,1] to a horizontal translateX via useTransform.
                Wrap in useSpring for momentum. The container height equals panel-count times 100vh,
                giving full scroll range while the visible track stays pinned.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 3: Parallax Depth Layers                                   */
/* ================================================================== */
function ParallaxDepth() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

    // Different speeds for each layer
    const y0 = useTransform(scrollYProgress, [0, 1], [0, -60]);   // slowest
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -280]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -420]);  // fastest

    const layers: { yVal: typeof y0; elements: React.ReactNode }[] = [
        {
            yVal: y0,
            elements: (
                <>
                    <div className="absolute top-[10%] left-[5%] w-[90%] h-[60%] rounded-sm" style={{ background: `${C.grove}30` }} />
                    <div className="absolute top-[50%] left-[20%] w-[60%] h-[1px]" style={{ background: `${C.sage}40` }} />
                </>
            ),
        },
        {
            yVal: y1,
            elements: (
                <>
                    <div className="absolute top-[20%] left-[10%] w-48 h-48 rounded-full" style={{ background: `${C.sage}25` }} />
                    <div className="absolute top-[60%] right-[15%] w-32 h-32 rounded-full" style={{ background: `${C.wood}20` }} />
                    <div className="absolute top-[40%] left-[50%] w-[1px] h-[30%]" style={{ background: `${C.divider}30` }} />
                </>
            ),
        },
        {
            yVal: y2,
            elements: (
                <>
                    <div className="absolute top-[30%] right-[25%] w-24 h-64 rounded-sm" style={{ background: `${C.wood}20`, transform: 'rotate(-5deg)' }} />
                    <div className="absolute top-[15%] left-[30%] w-40 h-[1px]" style={{ background: `${C.sand}50` }} />
                    <div className="absolute bottom-[25%] left-[15%] w-16 h-16 rounded-full" style={{ background: `${C.sand}30` }} />
                </>
            ),
        },
        {
            yVal: y3,
            elements: (
                <>
                    <div className="absolute top-[25%] left-[45%] w-3 h-3 rounded-full" style={{ background: C.sand }} />
                    <div className="absolute top-[55%] left-[25%] w-2 h-2 rounded-full" style={{ background: C.cream }} />
                    <div className="absolute top-[70%] right-[30%] w-4 h-4 rounded-full" style={{ background: C.sage }} />
                </>
            ),
        },
    ];

    return (
        <section>
            <ChapterHeader
                number="03"
                title="Parallax Depth"
                description="Layers moving at different speeds create an illusion of three-dimensional space. Background elements drift slowly while foreground details rush past, evoking the sensation of physically moving through a scene."
            />

            <div ref={ref} className="relative overflow-hidden" style={{ height: '200vh' }}>
                <div className="sticky top-0 h-screen overflow-hidden">
                    {layers.map((layer, i) => (
                        <motion.div
                            key={i}
                            className="absolute inset-0"
                            style={{ y: layer.yVal }}
                        >
                            {layer.elements}
                        </motion.div>
                    ))}

                    {/* Text overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center px-8">
                            <motion.p
                                className="text-5xl md:text-7xl font-light leading-[1.1]"
                                style={{
                                    fontFamily: display,
                                    color: C.cream,
                                    y: useTransform(scrollYProgress, [0, 1], [60, -60]),
                                }}
                            >
                                The canyon holds
                                <br />
                                <span style={{ fontStyle: 'italic', color: C.sand }}>its breath</span>
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>

            <TechNote>
                Create multiple motion.divs on the same container, each with useTransform mapping
                scrollYProgress to a different y offset. The largest offset moves fastest, simulating
                proximity. Combine with opacity fade for atmospheric haze.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 4: Progressive Reveal Timeline                             */
/* ================================================================== */
const milestones = [
    { year: '1937', title: 'The Land', text: 'The Calamigos property is first settled in the Santa Monica Mountains, a stretch of untouched oak savanna above Malibu Creek.' },
    { year: '1946', title: 'The Homestead', text: 'Post-war families build the first permanent structures: a stone barn, a wellhouse, and the cottage that still anchors the eastern garden.' },
    { year: '1968', title: 'The Ranch', text: 'The estate transitions to a working ranch, adding stables, vineyards, and the creek-side pavilion.' },
    { year: '1989', title: 'The Transformation', text: 'Calamigos opens as a private event destination, preserving its rustic character while introducing curated hospitality.' },
    { year: '2005', title: 'The Gardens', text: 'A decade-long landscape project installs terraced gardens, heritage roses, and the oak-shaded ceremony meadow.' },
    { year: '2024', title: 'The Vision', text: 'A new design language emerges: botanical editorial, rooted in the land, speaking through light, texture, and restraint.' },
];

function Timeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 80%', 'end 60%'] });
    const lineScale = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

    return (
        <section>
            <ChapterHeader
                number="04"
                title="Progressive Timeline"
                description="A vertical timeline that fills as the reader advances. Events emerge when they enter the viewport, creating a sense of history unfolding in real time. Ideal for brand stories, project chronologies, and milestone summaries."
            />

            <div ref={containerRef} className="relative max-w-4xl mx-auto px-8 md:px-16 pb-32">
                {/* Animated line */}
                <div className="absolute left-8 md:left-16 top-0 bottom-0 w-[1px]" style={{ background: `${C.sage}20` }}>
                    <motion.div
                        className="w-full origin-top"
                        style={{ background: C.sage, height: '100%', scaleY: lineScale }}
                    />
                </div>

                <div className="space-y-0">
                    {milestones.map((m, i) => (
                        <motion.div
                            key={i}
                            className="relative pl-12 md:pl-16 py-12"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-15%' }}
                            transition={{ duration: 0.6, delay: 0.05 }}
                        >
                            {/* Dot */}
                            <motion.div
                                className="absolute left-[29px] md:left-[61px] top-14 w-[7px] h-[7px] rounded-full"
                                style={{ background: C.wood }}
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                            />

                            <motion.span
                                className="block text-xs tracking-[0.25em] uppercase mb-2"
                                style={{ fontFamily: body, color: C.wood }}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                {m.year}
                            </motion.span>
                            <motion.h3
                                className="text-2xl md:text-3xl font-light mb-3"
                                style={{ fontFamily: display, color: C.cream }}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15 }}
                            >
                                {m.title}
                            </motion.h3>
                            <motion.p
                                className="text-sm leading-[1.8] max-w-lg"
                                style={{ fontFamily: body, color: C.sage }}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                {m.text}
                            </motion.p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <TechNote>
                The timeline line uses scaleY bound to a springed scrollYProgress scoped to
                the container. Each event uses whileInView with staggered delays on child elements.
                The dot uses a spring transition for a tactile &ldquo;pop&rdquo;.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  PATTERN 5: Zoom Scroll                                             */
/* ================================================================== */
function ZoomScroll() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 1, 2.8]);
    const smoothScale = useSpring(scale, { stiffness: 60, damping: 25 });
    const borderRadius = useTransform(scrollYProgress, [0, 0.3, 0.6], ['50%', '8px', '0px']);

    const textOpacity1 = useTransform(scrollYProgress, [0.0, 0.15, 0.25], [0, 1, 0]);
    const textOpacity2 = useTransform(scrollYProgress, [0.3, 0.45, 0.55], [0, 1, 0]);
    const textOpacity3 = useTransform(scrollYProgress, [0.6, 0.75, 0.9], [0, 1, 0]);

    return (
        <section>
            <ChapterHeader
                number="05"
                title="Zoom Scroll"
                description="An element grows from a distant point to engulf the viewport, pulling the reader into the content. Creates a dramatic threshold moment -- perfect for transitions between chapters, before-and-after reveals, or cinematic openings."
            />

            <div ref={ref} style={{ height: '400vh' }}>
                <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                    {/* The zooming element */}
                    <motion.div
                        className="flex items-center justify-center"
                        style={{
                            scale: smoothScale,
                            borderRadius,
                            width: '60vmin',
                            height: '60vmin',
                            background: `linear-gradient(160deg, ${C.grove}, ${C.wood}55)`,
                            border: `1px solid ${C.sage}33`,
                        }}
                    />

                    {/* Text layers that appear at different zoom levels */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.p
                            className="text-lg tracking-[0.3em] uppercase text-center"
                            style={{ fontFamily: body, color: C.sand, opacity: textOpacity1 }}
                        >
                            From a distance
                        </motion.p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.p
                            className="text-4xl md:text-6xl font-light text-center"
                            style={{ fontFamily: display, color: C.cream, opacity: textOpacity2 }}
                        >
                            Drawing closer
                        </motion.p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div className="text-center" style={{ opacity: textOpacity3 }}>
                            <p
                                className="text-5xl md:text-8xl font-light italic"
                                style={{ fontFamily: display, color: C.cream }}
                            >
                                Inside
                            </p>
                            <p
                                className="mt-4 text-sm tracking-[0.2em] uppercase"
                                style={{ fontFamily: body, color: C.sage }}
                            >
                                the moment itself
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <TechNote>
                useTransform maps scroll progress to a scale value (0.15 to 2.8).
                useSpring adds inertia so the zoom feels weighty rather than mechanical.
                Layer text at fixed positions with separate opacity transforms keyed to
                different progress ranges to create the sense of passing through thresholds.
            </TechNote>
        </section>
    );
}

/* ================================================================== */
/*  FOOTER                                                             */
/* ================================================================== */
function Footer() {
    return (
        <footer className="py-32 text-center" style={{ borderTop: `1px solid ${C.grove}` }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <p
                    className="text-3xl md:text-4xl font-light mb-4"
                    style={{ fontFamily: display, color: C.cream }}
                >
                    End of study
                </p>
                <p
                    className="text-xs tracking-[0.3em] uppercase"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Calamigos Ranch &mdash; Scrollytelling Patterns
                </p>
            </motion.div>
        </footer>
    );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
const MoodboardScrollytelling = () => {
    useFonts();

    return (
        <div className="min-h-screen" style={{ background: C.groveDark, color: C.cream }}>
            <StudyNav currentPage="scrollytelling" />
            <Hero />
            <StickyNarrative />
            <HorizontalScroll />
            <ParallaxDepth />
            <Timeline />
            <ZoomScroll />
            <Footer />
        </div>
    );
};

export default MoodboardScrollytelling;
