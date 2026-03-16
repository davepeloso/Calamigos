import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
    useMotionValueEvent,
    AnimatePresence,
} from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import StudyNav from '@/components/StudyNav';

// ─── Brand tokens ───────────────────────────────────────────────────────────────
const brand = {
    grove: '#2F4A3F',
    sand: '#EAE4D8',
    cream: '#F5F2EA',
    creamWarm: '#FAF7F0',
    sage: '#7A8F82',
    wood: '#8A6B4F',
    charcoal: '#2C2C2C',
    divider: '#DCD6CA',
};

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', system-ui, sans-serif";

// ─── Font Loader ────────────────────────────────────────────────────────────────
const useFonts = () => {
    useEffect(() => {
        const id = 'moodboard-motion-fonts';
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href =
            'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap';
        document.head.appendChild(link);
    }, []);
};

// ─── Reusable section wrapper ───────────────────────────────────────────────────
interface ChapterProps {
    number: string;
    title: string;
    description: string;
    technique: string;
    children: React.ReactNode;
    id?: string;
}

const Chapter = ({ number, title, description, technique, children, id }: ChapterProps) => (
    <section
        id={id}
        className="relative min-h-screen flex flex-col justify-center"
        style={{
            borderBottom: `1px solid ${brand.divider}`,
            padding: '6rem 0',
        }}
    >
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20">
            {/* Chapter header */}
            <div className="mb-16 max-w-2xl">
                <motion.span
                    className="block mb-4 text-xs tracking-[0.3em] uppercase"
                    style={{ fontFamily: sans, color: brand.sage }}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                >
                    {number}
                </motion.span>
                <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1]"
                    style={{ fontFamily: serif, color: brand.charcoal }}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    {title}
                </motion.h2>
                <motion.p
                    className="mt-5 text-base md:text-lg leading-relaxed max-w-xl"
                    style={{ fontFamily: sans, color: brand.sage }}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {description}
                </motion.p>
            </div>

            {/* Demo area */}
            <div className="mb-16">{children}</div>

            {/* Technique note */}
            <motion.div
                className="flex items-start gap-4 max-w-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div
                    className="w-[3px] shrink-0 rounded-full self-stretch"
                    style={{ backgroundColor: brand.sage, opacity: 0.3 }}
                />
                <div>
                    <span
                        className="text-[10px] tracking-[0.25em] uppercase block mb-1"
                        style={{ fontFamily: sans, color: brand.sage }}
                    >
                        Technique
                    </span>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: sans, color: brand.wood }}>
                        {technique}
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
);

// ═════════════════════════════════════════════════════════════════════════════════
// 01 — Scroll-Triggered Reveals
// ═════════════════════════════════════════════════════════════════════════════════
const ScrollReveals = () => {
    const items = [
        { label: 'Oak Grove', w: 'col-span-2', h: 'h-64 md:h-80' },
        { label: 'Garden Terrace', w: 'col-span-1', h: 'h-64 md:h-80' },
        { label: 'Birchwood Hall', w: 'col-span-1', h: 'h-56 md:h-72' },
        { label: 'Vineyard', w: 'col-span-1', h: 'h-56 md:h-72' },
        { label: 'Lakeside Pavilion', w: 'col-span-1', h: 'h-56 md:h-72' },
    ];

    const directions: Array<{ x: number; y: number }> = [
        { x: 0, y: 60 },
        { x: 40, y: 0 },
        { x: -40, y: 0 },
        { x: 0, y: 60 },
        { x: 40, y: 20 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {items.map((item, i) => (
                <motion.div
                    key={item.label}
                    className={`${item.w} ${item.h} relative rounded-sm overflow-hidden group cursor-default`}
                    style={{ backgroundColor: brand.sand }}
                    initial={{ opacity: 0, x: directions[i].x, y: directions[i].y }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{
                        duration: 0.8,
                        delay: i * 0.12,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                >
                    {/* Decorative inner pattern */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="w-full h-full"
                            style={{
                                background: `linear-gradient(${135 + i * 30}deg, ${brand.grove}10, ${brand.sage}20, ${brand.sand}40)`,
                            }}
                            initial={{ scale: 1.2 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: i * 0.12 + 0.2 }}
                        />
                    </div>
                    {/* Label */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 p-5"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.12 + 0.4 }}
                    >
                        <span
                            className="text-xs tracking-[0.2em] uppercase"
                            style={{ fontFamily: sans, color: brand.grove }}
                        >
                            {item.label}
                        </span>
                    </motion.div>
                    {/* Hover overlay */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ backgroundColor: brand.grove }}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.06 }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>
            ))}
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════════
// 02 — Parallax Depth
// ═════════════════════════════════════════════════════════════════════════════════
const ParallaxDepth = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const layer1Y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const layer2Y = useTransform(scrollYProgress, [0, 1], [60, -60]);
    const layer3Y = useTransform(scrollYProgress, [0, 1], [30, -30]);
    const layer4Y = useTransform(scrollYProgress, [0, 1], [0, 0]);
    const textOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);

    return (
        <div ref={containerRef} className="relative h-[70vh] md:h-[80vh] overflow-hidden rounded-sm" style={{ backgroundColor: brand.sand }}>
            {/* Layer 1 - furthest back, moves most */}
            <motion.div
                className="absolute inset-0"
                style={{ y: layer1Y }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: `${20 + i * 8}px`,
                                height: `${20 + i * 8}px`,
                                backgroundColor: brand.sage,
                                opacity: 0.08,
                                left: `${10 + (i * 37) % 80}%`,
                                top: `${5 + (i * 23) % 90}%`,
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Layer 2 */}
            <motion.div
                className="absolute inset-0"
                style={{ y: layer2Y }}
            >
                <div className="absolute left-[8%] top-[15%] w-[1px] h-[40%]" style={{ backgroundColor: brand.grove, opacity: 0.12 }} />
                <div className="absolute right-[15%] top-[25%] w-[1px] h-[30%]" style={{ backgroundColor: brand.grove, opacity: 0.08 }} />
                <div className="absolute left-[45%] top-[10%] w-[1px] h-[50%]" style={{ backgroundColor: brand.grove, opacity: 0.06 }} />
                {/* Horizontal lines */}
                <div className="absolute left-[5%] top-[40%] w-[25%] h-[1px]" style={{ backgroundColor: brand.grove, opacity: 0.1 }} />
                <div className="absolute right-[10%] bottom-[30%] w-[20%] h-[1px]" style={{ backgroundColor: brand.grove, opacity: 0.08 }} />
            </motion.div>

            {/* Layer 3 - shapes */}
            <motion.div
                className="absolute inset-0"
                style={{ y: layer3Y }}
            >
                <div
                    className="absolute left-[10%] top-[20%] w-32 h-32 md:w-48 md:h-48 rounded-full"
                    style={{ border: `1px solid ${brand.grove}`, opacity: 0.15 }}
                />
                <div
                    className="absolute right-[12%] bottom-[25%] w-40 h-40 md:w-56 md:h-56"
                    style={{ border: `1px solid ${brand.wood}`, opacity: 0.12 }}
                />
                <div
                    className="absolute left-[55%] top-[15%] w-24 h-24 md:w-36 md:h-36 rotate-45"
                    style={{ border: `1px solid ${brand.sage}`, opacity: 0.1 }}
                />
            </motion.div>

            {/* Layer 4 - foreground text, stays still */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ y: layer4Y, opacity: textOpacity }}
            >
                <span
                    className="text-xs tracking-[0.4em] uppercase mb-6"
                    style={{ fontFamily: sans, color: brand.sage }}
                >
                    Depth in Motion
                </span>
                <h3
                    className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-center"
                    style={{ fontFamily: serif, color: brand.grove }}
                >
                    Calamigos
                </h3>
                <p
                    className="mt-4 text-sm tracking-widest uppercase"
                    style={{ fontFamily: sans, color: brand.wood, opacity: 0.7 }}
                >
                    Malibu, California
                </p>
            </motion.div>
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════════
// 03 — Spring Physics
// ═════════════════════════════════════════════════════════════════════════════════
interface SpringConfig {
    label: string;
    stiffness: number;
    damping: number;
    color: string;
    shape: 'circle' | 'rounded' | 'square';
}

const springConfigs: SpringConfig[] = [
    { label: 'Gentle', stiffness: 100, damping: 10, color: brand.sage, shape: 'circle' },
    { label: 'Snappy', stiffness: 400, damping: 15, color: brand.grove, shape: 'rounded' },
    { label: 'Bouncy', stiffness: 300, damping: 8, color: brand.wood, shape: 'square' },
    { label: 'Stiff', stiffness: 600, damping: 30, color: brand.charcoal, shape: 'circle' },
];

const DraggableSpring = ({ config }: { config: SpringConfig }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: config.stiffness, damping: config.damping });
    const springY = useSpring(y, { stiffness: config.stiffness, damping: config.damping });

    const borderRadius =
        config.shape === 'circle' ? '50%' : config.shape === 'rounded' ? '12px' : '4px';

    return (
        <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <div
                className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center rounded-sm"
                style={{ backgroundColor: `${config.color}08`, border: `1px solid ${brand.divider}` }}
            >
                {/* Ghost outline showing origin */}
                <div
                    className="absolute w-16 h-16 md:w-20 md:h-20"
                    style={{
                        borderRadius,
                        border: `1px dashed ${config.color}30`,
                    }}
                />
                {/* Draggable element */}
                <motion.div
                    className="w-16 h-16 md:w-20 md:h-20 cursor-grab active:cursor-grabbing z-10"
                    style={{
                        borderRadius,
                        backgroundColor: config.color,
                        x: springX,
                        y: springY,
                        boxShadow: `0 4px 20px ${config.color}30`,
                    }}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.8}
                    onDrag={(_, info) => {
                        x.set(info.offset.x);
                        y.set(info.offset.y);
                    }}
                    onDragEnd={() => {
                        x.set(0);
                        y.set(0);
                    }}
                    whileDrag={{ scale: 1.08 }}
                />
            </div>
            <div className="text-center">
                <span
                    className="text-xs tracking-[0.15em] uppercase block"
                    style={{ fontFamily: sans, color: config.color }}
                >
                    {config.label}
                </span>
                <span
                    className="text-[10px] mt-1 block"
                    style={{ fontFamily: sans, color: brand.sage }}
                >
                    {config.stiffness} / {config.damping}
                </span>
            </div>
        </motion.div>
    );
};

const SpringPhysics = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {springConfigs.map((config) => (
            <DraggableSpring key={config.label} config={config} />
        ))}
    </div>
);

// ═════════════════════════════════════════════════════════════════════════════════
// 04 — Orchestrated Sequences
// ═════════════════════════════════════════════════════════════════════════════════
const OrchestratedSequence = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [key, setKey] = useState(0);

    const replay = () => {
        setKey((k) => k + 1);
        setIsPlaying(true);
        setTimeout(() => setIsPlaying(false), 4000);
    };

    const words = ['Where', 'Nature', 'Meets', 'Ceremony'];

    return (
        <div className="relative">
            <div
                className="relative min-h-[50vh] md:min-h-[60vh] rounded-sm overflow-hidden flex flex-col items-center justify-center"
                style={{ backgroundColor: brand.grove }}
            >
                <AnimatePresence mode="wait">
                    <motion.div key={key} className="flex flex-col items-center text-center px-6">
                        {/* Decorative line */}
                        <motion.div
                            className="w-[1px] mb-8"
                            style={{ backgroundColor: brand.sage }}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 60, opacity: 0.5 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />

                        {/* Small text */}
                        <motion.span
                            className="text-xs tracking-[0.4em] uppercase mb-8"
                            style={{ fontFamily: sans, color: brand.sage }}
                            initial={{ opacity: 0, letterSpacing: '0.6em' }}
                            animate={{ opacity: 0.7, letterSpacing: '0.4em' }}
                            transition={{ delay: 0.6, duration: 1 }}
                        >
                            Calamigos Ranch
                        </motion.span>

                        {/* Main words */}
                        <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-1">
                            {words.map((word, i) => (
                                <div key={word} className="overflow-hidden">
                                    <motion.span
                                        className="block text-4xl md:text-6xl lg:text-7xl font-light"
                                        style={{ fontFamily: serif, color: brand.sand }}
                                        initial={{ y: '110%', rotate: 3 }}
                                        animate={{ y: '0%', rotate: 0 }}
                                        transition={{
                                            delay: 0.9 + i * 0.15,
                                            duration: 0.7,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                        }}
                                    >
                                        {word}
                                    </motion.span>
                                </div>
                            ))}
                        </div>

                        {/* Horizontal rule */}
                        <motion.div
                            className="h-[1px] mt-10 mb-6"
                            style={{ backgroundColor: brand.sage }}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 120, opacity: 0.3 }}
                            transition={{ delay: 1.8, duration: 0.8 }}
                        />

                        {/* Subtitle */}
                        <motion.p
                            className="text-sm md:text-base tracking-wide max-w-md"
                            style={{ fontFamily: sans, color: brand.sage }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 0.7, y: 0 }}
                            transition={{ delay: 2.2, duration: 0.6 }}
                        >
                            A choreographed entrance, timed to perfection.
                        </motion.p>

                        {/* Corner accents */}
                        <motion.div
                            className="absolute top-8 left-8 w-12 h-12"
                            style={{
                                borderLeft: `1px solid ${brand.sage}`,
                                borderTop: `1px solid ${brand.sage}`,
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.2, scale: 1 }}
                            transition={{ delay: 2.5, duration: 0.5 }}
                        />
                        <motion.div
                            className="absolute bottom-8 right-8 w-12 h-12"
                            style={{
                                borderRight: `1px solid ${brand.sage}`,
                                borderBottom: `1px solid ${brand.sage}`,
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.2, scale: 1 }}
                            transition={{ delay: 2.5, duration: 0.5 }}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Replay button */}
            <div className="flex justify-center mt-6">
                <motion.button
                    onClick={replay}
                    disabled={isPlaying}
                    className="px-6 py-3 text-xs tracking-[0.2em] uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                        fontFamily: sans,
                        color: brand.grove,
                        border: `1px solid ${brand.divider}`,
                        backgroundColor: 'transparent',
                    }}
                    whileHover={{ backgroundColor: `${brand.grove}08` }}
                    whileTap={{ scale: 0.97 }}
                >
                    {isPlaying ? 'Playing...' : 'Replay Sequence'}
                </motion.button>
            </div>
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════════
// 05 — Gesture Interactions
// ═════════════════════════════════════════════════════════════════════════════════
const GestureInteractions = () => {
    const cards = [
        {
            title: 'The Ceremony',
            subtitle: 'Under ancient oaks',
            accent: brand.grove,
        },
        {
            title: 'The Reception',
            subtitle: 'Garden terrace dining',
            accent: brand.wood,
        },
        {
            title: 'The Celebration',
            subtitle: 'Starlit dancing',
            accent: brand.charcoal,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 perspective-[1200px]">
            {cards.map((card, i) => (
                <motion.div
                    key={card.title}
                    className="relative group cursor-pointer"
                    style={{ transformStyle: 'preserve-3d' }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{
                        y: -12,
                        rotateX: -4,
                        rotateY: i === 0 ? 3 : i === 2 ? -3 : 0,
                        transition: { type: 'spring', stiffness: 300, damping: 20 },
                    }}
                    whileTap={{
                        scale: 0.97,
                        rotateX: 0,
                        rotateY: 0,
                        transition: { duration: 0.15 },
                    }}
                >
                    <div
                        className="relative overflow-hidden rounded-sm p-8 md:p-10"
                        style={{
                            backgroundColor: brand.creamWarm,
                            border: `1px solid ${brand.divider}`,
                            minHeight: '280px',
                        }}
                    >
                        {/* Accent corner */}
                        <motion.div
                            className="absolute top-0 right-0 w-16 h-16"
                            style={{
                                background: `linear-gradient(135deg, ${card.accent}15, transparent)`,
                            }}
                            whileHover={{ scale: 2.5 }}
                            transition={{ duration: 0.4 }}
                        />

                        <div className="relative z-10 h-full flex flex-col justify-between" style={{ minHeight: '220px' }}>
                            <div>
                                <motion.span
                                    className="text-[10px] tracking-[0.3em] uppercase block mb-3"
                                    style={{ fontFamily: sans, color: brand.sage }}
                                >
                                    0{i + 1}
                                </motion.span>
                                <h4
                                    className="text-2xl md:text-3xl font-light tracking-tight"
                                    style={{ fontFamily: serif, color: brand.charcoal }}
                                >
                                    {card.title}
                                </h4>
                            </div>

                            <div>
                                <motion.div
                                    className="h-[1px] mb-4"
                                    style={{ backgroundColor: brand.divider }}
                                    initial={{ width: '30%' }}
                                    whileHover={{ width: '100%' }}
                                    transition={{ duration: 0.4 }}
                                />
                                <span
                                    className="text-xs tracking-wider"
                                    style={{ fontFamily: sans, color: brand.wood }}
                                >
                                    {card.subtitle}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shadow layer that intensifies on hover */}
                    <motion.div
                        className="absolute inset-0 rounded-sm -z-10"
                        initial={{
                            boxShadow: `0 2px 8px ${card.accent}08`,
                        }}
                        whileHover={{
                            boxShadow: `0 20px 50px ${card.accent}18, 0 8px 20px ${card.accent}10`,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>
            ))}
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════════
// 06 — Scroll-Linked Progress
// ═════════════════════════════════════════════════════════════════════════════════
const ScrollProgress = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const progressWidth = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);
    const circleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);
    const circleRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const barOneWidth = useTransform(scrollYProgress, [0.05, 0.35], ['0%', '100%']);
    const barTwoWidth = useTransform(scrollYProgress, [0.2, 0.55], ['0%', '100%']);
    const barThreeWidth = useTransform(scrollYProgress, [0.35, 0.7], ['0%', '100%']);
    const textVal = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const [displayPercent, setDisplayPercent] = useState(0);

    useMotionValueEvent(textVal, 'change', (latest) => {
        setDisplayPercent(Math.round(latest));
    });

    const barLabels = ['Planning', 'Design', 'Experience'];
    const barWidths = [barOneWidth, barTwoWidth, barThreeWidth];

    return (
        <div ref={sectionRef} className="relative">
            <div
                className="rounded-sm p-8 md:p-12 lg:p-16"
                style={{ backgroundColor: brand.creamWarm, border: `1px solid ${brand.divider}` }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    {/* Left: bars and percentage */}
                    <div>
                        <span
                            className="text-[10px] tracking-[0.3em] uppercase block mb-8"
                            style={{ fontFamily: sans, color: brand.sage }}
                        >
                            Scroll to Fill
                        </span>

                        <div className="space-y-6">
                            {barLabels.map((label, i) => (
                                <div key={label}>
                                    <div className="flex justify-between mb-2">
                                        <span
                                            className="text-xs tracking-wider"
                                            style={{ fontFamily: sans, color: brand.charcoal }}
                                        >
                                            {label}
                                        </span>
                                    </div>
                                    <div className="h-[3px] w-full rounded-full" style={{ backgroundColor: `${brand.grove}10` }}>
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{
                                                width: barWidths[i],
                                                backgroundColor: i === 0 ? brand.grove : i === 1 ? brand.wood : brand.sage,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10">
                            <span
                                className="text-6xl md:text-7xl font-light tabular-nums"
                                style={{ fontFamily: serif, color: brand.charcoal }}
                            >
                                {displayPercent}
                            </span>
                            <span
                                className="text-xl ml-1"
                                style={{ fontFamily: serif, color: brand.sage }}
                            >
                                %
                            </span>
                        </div>
                    </div>

                    {/* Right: geometric progress indicator */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-48 h-48 md:w-64 md:h-64">
                            {/* Outer ring */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke={brand.divider}
                                    strokeWidth="1"
                                />
                            </svg>
                            {/* Progress arc */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                                <motion.circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke={brand.grove}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeDasharray="565.48"
                                    style={{
                                        strokeDashoffset: useTransform(
                                            scrollYProgress,
                                            [0.1, 0.9],
                                            [565.48, 0]
                                        ),
                                    }}
                                />
                            </svg>
                            {/* Rotating inner element */}
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                style={{ scale: circleScale, rotate: circleRotation }}
                            >
                                <div
                                    className="w-16 h-16 md:w-20 md:h-20 rotate-45"
                                    style={{ border: `1px solid ${brand.wood}`, opacity: 0.5 }}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Bottom progress bar */}
                <div className="mt-12">
                    <div className="h-[2px] w-full" style={{ backgroundColor: `${brand.grove}10` }}>
                        <motion.div
                            className="h-full"
                            style={{
                                width: progressWidth,
                                backgroundColor: brand.grove,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════════
// Main Page Component
// ═════════════════════════════════════════════════════════════════════════════════
const MoodboardMotion = () => {
    useFonts();

    const { scrollYProgress } = useScroll();
    const heroTextY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

    return (
        <div style={{ backgroundColor: brand.cream, color: brand.charcoal }}>
            <StudyNav currentPage="motion" />

            {/* ─── Hero ───────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6" style={{ borderBottom: `1px solid ${brand.divider}` }}>
                <motion.div
                    className="text-center max-w-4xl"
                    style={{ y: heroTextY, opacity: heroOpacity }}
                >
                    <motion.span
                        className="block text-xs tracking-[0.4em] uppercase mb-8"
                        style={{ fontFamily: sans, color: brand.sage }}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Chapter 01 — Design Study
                    </motion.span>

                    <div className="overflow-hidden">
                        <motion.h1
                            className="text-7xl md:text-8xl lg:text-[10rem] font-light tracking-tight leading-[0.9]"
                            style={{ fontFamily: serif, color: brand.charcoal }}
                            initial={{ y: '100%' }}
                            animate={{ y: '0%' }}
                            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
                        >
                            Motion
                        </motion.h1>
                    </div>

                    <motion.div
                        className="mx-auto mt-10 h-[1px]"
                        style={{ backgroundColor: brand.divider }}
                        initial={{ width: 0 }}
                        animate={{ width: 80 }}
                        transition={{ duration: 0.8, delay: 1.0 }}
                    />

                    <motion.p
                        className="mt-8 text-base md:text-lg leading-relaxed max-w-lg mx-auto"
                        style={{ fontFamily: sans, color: brand.sage }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                    >
                        An exploration of animation principles for digital experiences
                        — scroll-driven, physics-based, and choreographed with intention.
                    </motion.p>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    className="absolute bottom-12 flex flex-col items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.8 }}
                >
                    <span
                        className="text-[10px] tracking-[0.3em] uppercase"
                        style={{ fontFamily: sans, color: brand.sage }}
                    >
                        Scroll
                    </span>
                    <motion.div
                        className="w-[1px] h-8"
                        style={{ backgroundColor: brand.sage, opacity: 0.4 }}
                        animate={{ scaleY: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.div>
            </section>

            {/* ─── Sections ───────────────────────────────────────────── */}
            <Chapter
                id="scroll-reveals"
                number="01"
                title="Scroll-Triggered Reveals"
                description="Elements materialize as they enter the viewport, each arriving from a different direction with staggered timing. The grid composes itself as you scroll, like turning the pages of a lookbook."
                technique="whileInView with viewport margin detection, staggered delays, and directional offsets (x/y) per child. The ease curve [0.25, 0.46, 0.45, 0.94] creates a natural deceleration."
            >
                <ScrollReveals />
            </Chapter>

            <Chapter
                id="parallax"
                number="02"
                title="Parallax Depth"
                description="Four layers move at different velocities as you scroll, creating an illusion of spatial depth. The furthest layer drifts the most; the foreground remains anchored."
                technique="useScroll tracks the container's scroll progress. useTransform maps that 0-to-1 value into different pixel offsets for each layer, creating the parallax ratio."
            >
                <ParallaxDepth />
            </Chapter>

            <Chapter
                id="spring-physics"
                number="03"
                title="Spring Physics"
                description="Drag each shape and release. They return to center with distinct physical character — gentle, snappy, bouncy, or stiff — defined purely by spring stiffness and damping."
                technique="useMotionValue + useSpring with custom stiffness/damping. The drag gesture updates raw motion values; the spring wraps them with physical behavior. No keyframes or durations."
            >
                <SpringPhysics />
            </Chapter>

            <Chapter
                id="orchestrated"
                number="04"
                title="Orchestrated Sequences"
                description="A cinematic reveal where each element enters on cue — vertical line, tracking text, words rising from below, horizontal rule, and subtitle — all precisely timed to build a moment."
                technique="Cascading delay values create the sequence. Each motion.div has an explicit delay offset. The text-reveal uses overflow:hidden with a y-translate from 110% to 0%."
            >
                <OrchestratedSequence />
            </Chapter>

            <Chapter
                id="gestures"
                number="05"
                title="Gesture Interactions"
                description="Hover to lift and tilt. Tap to compress. Each card responds with perspective-aware 3D transforms, deepening shadows, and expanding accent gradients. Interaction as editorial detail."
                technique="whileHover and whileTap with rotateX/rotateY for 3D tilt. The parent has perspective:1200px. Spring transitions (stiffness:300, damping:20) make the movement feel physical."
            >
                <GestureInteractions />
            </Chapter>

            <Chapter
                id="scroll-progress"
                number="06"
                title="Scroll-Linked Progress"
                description="Every visual on this panel is driven directly by your scroll position. The progress bars, the percentage counter, the circular indicator, and the bottom bar all respond in real time."
                technique="useScroll targets the container. Multiple useTransform calls derive different ranges from a single scrollYProgress. useMotionValueEvent feeds the numeric display with rounded integers."
            >
                <ScrollProgress />
            </Chapter>

            {/* ─── Footer ────────────────────────────────────────────── */}
            <footer className="py-20 px-6 text-center" style={{ borderTop: `1px solid ${brand.divider}` }}>
                <span
                    className="text-xs tracking-[0.3em] uppercase"
                    style={{ fontFamily: sans, color: brand.sage }}
                >
                    Calamigos Ranch — Motion Design Study
                </span>
            </footer>
        </div>
    );
};

export default MoodboardMotion;
