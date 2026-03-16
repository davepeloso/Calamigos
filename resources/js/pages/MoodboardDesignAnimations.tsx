import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
    useMotionValue,
    useSpring,
    useInView,
} from 'motion/react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import StudyNav from '@/components/StudyNav';

// ─── Brand Tokens ───────────────────────────────────────────────────────────
const C = {
    grove: '#2F4A3F',
    sand: '#EAE4D8',
    cream: '#F5F2EA',
    sage: '#7A8F82',
    wood: '#8A6B4F',
    charcoal: '#2C2C2C',
    divider: '#DCD6CA',
    groveLight: '#3D6152',
    white: '#FFFFFF',
} as const;

const FONT = {
    display: "'Cormorant Garamond', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
} as const;

// ─── Shared Demo Card Wrapper ───────────────────────────────────────────────
const DemoCard = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div
        className="flex flex-col"
        style={{ fontFamily: FONT.body }}
    >
        <div
            className="relative flex items-center justify-center overflow-hidden rounded-lg"
            style={{
                backgroundColor: C.white,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
                minHeight: 220,
            }}
        >
            {children}
        </div>
        <span
            className="mt-3 text-xs tracking-widest uppercase"
            style={{ color: C.sage, letterSpacing: '0.15em' }}
        >
            {title}
        </span>
    </div>
);

// ─── Section Divider ────────────────────────────────────────────────────────
const SectionDivider = () => (
    <div className="my-24 flex items-center justify-center">
        <div className="h-px flex-1" style={{ backgroundColor: C.divider }} />
        <div
            className="mx-6 h-1.5 w-1.5 rotate-45"
            style={{ backgroundColor: C.sage }}
        />
        <div className="h-px flex-1" style={{ backgroundColor: C.divider }} />
    </div>
);

// ─── Chapter Header ─────────────────────────────────────────────────────────
const ChapterHeader = ({
    number,
    title,
    description,
}: {
    number: string;
    title: string;
    description: string;
}) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            className="mb-14"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <span
                className="text-xs tracking-[0.3em] uppercase block mb-3"
                style={{ color: C.sage, fontFamily: FONT.body }}
            >
                Chapter {number}
            </span>
            <h2
                className="text-5xl font-light mb-4"
                style={{ fontFamily: FONT.display, color: C.charcoal }}
            >
                {title}
            </h2>
            <p
                className="text-sm leading-relaxed max-w-lg"
                style={{ color: C.sage, fontFamily: FONT.body }}
            >
                {description}
            </p>
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER 01 — ENTRANCE ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const FadeUpDemo = () => {
    const [key, setKey] = useState(0);
    return (
        <DemoCard title="Fade Up">
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="rounded-md px-8 py-4 text-sm font-medium tracking-wide"
                    style={{
                        backgroundColor: C.grove,
                        color: C.sand,
                        fontFamily: FONT.body,
                    }}
                >
                    Revealed Element
                </motion.div>
                <button
                    onClick={() => setKey((k) => k + 1)}
                    className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ color: C.charcoal, fontFamily: FONT.body }}
                >
                    Replay
                </button>
            </div>
        </DemoCard>
    );
};

const SlideInDemo = () => {
    const [key, setKey] = useState(0);
    return (
        <DemoCard title="Slide In">
            <div className="flex flex-col items-center gap-4 overflow-hidden w-full px-6">
                <motion.div
                    key={key}
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-md px-8 py-4 text-sm font-medium tracking-wide"
                    style={{
                        backgroundColor: C.wood,
                        color: C.cream,
                        fontFamily: FONT.body,
                    }}
                >
                    From the Left
                </motion.div>
                <button
                    onClick={() => setKey((k) => k + 1)}
                    className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ color: C.charcoal, fontFamily: FONT.body }}
                >
                    Replay
                </button>
            </div>
        </DemoCard>
    );
};

const ScaleRevealDemo = () => {
    const [key, setKey] = useState(0);
    return (
        <DemoCard title="Scale Reveal">
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    key={key}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                    }}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{
                        backgroundColor: C.sage,
                        color: C.white,
                        fontFamily: FONT.body,
                    }}
                >
                    Pop
                </motion.div>
                <button
                    onClick={() => setKey((k) => k + 1)}
                    className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ color: C.charcoal, fontFamily: FONT.body }}
                >
                    Replay
                </button>
            </div>
        </DemoCard>
    );
};

const BlurInDemo = () => {
    const [key, setKey] = useState(0);
    return (
        <DemoCard title="Blur In">
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    key={key}
                    initial={{ opacity: 0, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-2xl font-light"
                    style={{
                        fontFamily: FONT.display,
                        color: C.charcoal,
                    }}
                >
                    Into Focus
                </motion.div>
                <button
                    onClick={() => setKey((k) => k + 1)}
                    className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ color: C.charcoal, fontFamily: FONT.body }}
                >
                    Replay
                </button>
            </div>
        </DemoCard>
    );
};

const ClipRevealDemo = () => {
    const [key, setKey] = useState(0);
    return (
        <DemoCard title="Clip Reveal">
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    key={key}
                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                    animate={{ clipPath: 'inset(0 0% 0 0)' }}
                    transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
                    className="rounded-md px-8 py-4 text-sm font-medium tracking-wide"
                    style={{
                        backgroundColor: C.charcoal,
                        color: C.sand,
                        fontFamily: FONT.body,
                    }}
                >
                    Clip Path Wipe
                </motion.div>
                <button
                    onClick={() => setKey((k) => k + 1)}
                    className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ color: C.charcoal, fontFamily: FONT.body }}
                >
                    Replay
                </button>
            </div>
        </DemoCard>
    );
};

const StaggerCascadeDemo = () => {
    const [key, setKey] = useState(0);
    const items = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
    return (
        <DemoCard title="Stagger Cascade">
            <div className="flex flex-col items-center gap-3 py-4">
                <div className="flex gap-2">
                    {items.map((label, i) => (
                        <motion.div
                            key={`${key}-${i}`}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: i * 0.08,
                                duration: 0.4,
                                ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                            className="h-10 w-10 rounded-md flex items-center justify-center text-xs font-medium"
                            style={{
                                backgroundColor: C.grove,
                                color: C.sand,
                                fontFamily: FONT.body,
                                opacity: 1 - i * 0.12,
                            }}
                        >
                            {i + 1}
                        </motion.div>
                    ))}
                </div>
                <button
                    onClick={() => setKey((k) => k + 1)}
                    className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity cursor-pointer mt-2"
                    style={{ color: C.charcoal, fontFamily: FONT.body }}
                >
                    Replay
                </button>
            </div>
        </DemoCard>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER 02 — HOVER & CURSOR EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

const MagneticPullDemo = () => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouse = (e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = e.clientX - rect.left - rect.width / 2;
        const cy = e.clientY - rect.top - rect.height / 2;
        x.set(cx * 0.2);
        y.set(cy * 0.2);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <DemoCard title="Magnetic Pull">
            <div
                ref={ref}
                className="flex items-center justify-center w-full h-full min-h-[220px]"
                onMouseMove={handleMouse}
                onMouseLeave={reset}
            >
                <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-xs font-medium cursor-pointer"
                    style={{
                        backgroundColor: C.grove,
                        color: C.sand,
                        fontFamily: FONT.body,
                        x: springX,
                        y: springY,
                    }}
                >
                    Hover
                </motion.div>
            </div>
        </DemoCard>
    );
};

const Tilt3DDemo = () => {
    const ref = useRef<HTMLDivElement>(null);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springRX = useSpring(rotateX, { stiffness: 200, damping: 20 });
    const springRY = useSpring(rotateY, { stiffness: 200, damping: 20 });

    const handleMouse = (e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(px * 20);
        rotateX.set(-py * 20);
    };

    const reset = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <DemoCard title="Tilt 3D">
            <div
                className="flex items-center justify-center w-full h-full min-h-[220px]"
                style={{ perspective: 600 }}
                onMouseMove={handleMouse}
                onMouseLeave={reset}
                ref={ref}
            >
                <motion.div
                    className="w-32 h-24 rounded-lg flex items-center justify-center text-sm font-medium"
                    style={{
                        backgroundColor: C.charcoal,
                        color: C.sand,
                        fontFamily: FONT.body,
                        rotateX: springRX,
                        rotateY: springRY,
                        transformStyle: 'preserve-3d',
                    }}
                >
                    Tilt Card
                </motion.div>
            </div>
        </DemoCard>
    );
};

const BorderTraceDemo = () => {
    const [hovered, setHovered] = useState(false);
    return (
        <DemoCard title="Border Trace">
            <div
                className="flex items-center justify-center w-full h-full min-h-[220px]"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="relative w-36 h-24">
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 144 96"
                        fill="none"
                    >
                        <rect
                            x="1"
                            y="1"
                            width="142"
                            height="94"
                            rx="8"
                            stroke={C.divider}
                            strokeWidth="1"
                        />
                        <motion.rect
                            x="1"
                            y="1"
                            width="142"
                            height="94"
                            rx="8"
                            stroke={C.grove}
                            strokeWidth="2"
                            strokeDasharray="472"
                            initial={{ strokeDashoffset: 472 }}
                            animate={{
                                strokeDashoffset: hovered ? 0 : 472,
                            }}
                            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                    </svg>
                    <div
                        className="absolute inset-0 flex items-center justify-center text-xs font-medium"
                        style={{ color: C.charcoal, fontFamily: FONT.body }}
                    >
                        Hover Me
                    </div>
                </div>
            </div>
        </DemoCard>
    );
};

const RevealLayerDemo = () => {
    const [hovered, setHovered] = useState(false);
    return (
        <DemoCard title="Reveal Layer">
            <div
                className="flex items-center justify-center w-full h-full min-h-[220px] cursor-pointer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="relative w-36 h-24 rounded-lg overflow-hidden">
                    <div
                        className="absolute inset-0 flex items-center justify-center text-xs font-medium"
                        style={{
                            backgroundColor: C.cream,
                            color: C.charcoal,
                            fontFamily: FONT.body,
                        }}
                    >
                        Hidden Content
                    </div>
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center text-xs font-medium"
                        style={{ backgroundColor: C.grove, color: C.sand }}
                        animate={{ x: hovered ? '100%' : '0%' }}
                        transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                    >
                        <motion.span
                            animate={{ opacity: hovered ? 0 : 1 }}
                            transition={{ duration: 0.15 }}
                        >
                            Hover to Reveal
                        </motion.span>
                    </motion.div>
                </div>
            </div>
        </DemoCard>
    );
};

const ShadowDanceDemo = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [shadow, setShadow] = useState('0 4px 12px rgba(0,0,0,0.08)');

    const handleMouse = (e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const ox = -px * 20;
        const oy = -py * 20;
        setShadow(`${ox}px ${oy}px 24px rgba(47,74,63,0.15)`);
    };

    const reset = () => setShadow('0 4px 12px rgba(0,0,0,0.08)');

    return (
        <DemoCard title="Shadow Dance">
            <div
                className="flex items-center justify-center w-full h-full min-h-[220px]"
                ref={ref}
                onMouseMove={handleMouse}
                onMouseLeave={reset}
            >
                <motion.div
                    className="w-32 h-20 rounded-lg flex items-center justify-center text-xs font-medium"
                    style={{
                        backgroundColor: C.white,
                        color: C.charcoal,
                        fontFamily: FONT.body,
                        border: `1px solid ${C.divider}`,
                    }}
                    animate={{ boxShadow: shadow }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                    Move cursor
                </motion.div>
            </div>
        </DemoCard>
    );
};

const TextScrambleDemo = () => {
    const target = 'Calamigos';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const [display, setDisplay] = useState(target);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const scramble = () => {
        let iteration = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setDisplay(
                target
                    .split('')
                    .map((char, i) => {
                        if (i < iteration) return target[i];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join(''),
            );
            iteration += 1 / 2;
            if (iteration >= target.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setDisplay(target);
            }
        }, 40);
    };

    const reset = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplay(target);
    };

    return (
        <DemoCard title="Text Scramble">
            <div
                className="flex items-center justify-center w-full h-full min-h-[220px] cursor-pointer"
                onMouseEnter={scramble}
                onMouseLeave={reset}
            >
                <span
                    className="text-2xl font-light tracking-wide"
                    style={{
                        fontFamily: FONT.display,
                        color: C.charcoal,
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {display}
                </span>
            </div>
        </DemoCard>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER 03 — STATE TRANSITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const MorphingButtonDemo = () => {
    const shapes = [
        { borderRadius: 999, width: 140, height: 48, label: 'Pill' },
        { borderRadius: 999, width: 48, height: 48, label: 'Circle' },
        { borderRadius: 8, width: 48, height: 48, label: 'Square' },
    ];
    const [shapeIdx, setShapeIdx] = useState(0);
    const shape = shapes[shapeIdx];

    return (
        <DemoCard title="Morphing Button">
            <div className="flex flex-col items-center gap-4">
                <motion.button
                    className="flex items-center justify-center text-xs font-medium cursor-pointer"
                    style={{
                        backgroundColor: C.grove,
                        color: C.sand,
                        fontFamily: FONT.body,
                    }}
                    animate={{
                        borderRadius: shape.borderRadius,
                        width: shape.width,
                        height: shape.height,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    onClick={() => setShapeIdx((i) => (i + 1) % shapes.length)}
                    whileTap={{ scale: 0.92 }}
                >
                    {shape.label}
                </motion.button>
                <span
                    className="text-xs opacity-40"
                    style={{ fontFamily: FONT.body, color: C.charcoal }}
                >
                    Click to morph
                </span>
            </div>
        </DemoCard>
    );
};

const ExpandableCardDemo = () => {
    const [expanded, setExpanded] = useState(false);
    return (
        <DemoCard title="Expandable Card">
            <motion.div
                layout
                className="cursor-pointer overflow-hidden rounded-lg"
                style={{
                    backgroundColor: C.sand,
                    border: `1px solid ${C.divider}`,
                    width: 160,
                }}
                onClick={() => setExpanded(!expanded)}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <motion.div layout className="p-4">
                    <motion.h4
                        layout="position"
                        className="text-sm font-medium"
                        style={{ color: C.charcoal, fontFamily: FONT.body }}
                    >
                        Expand Me
                    </motion.h4>
                </motion.div>
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="px-4 pb-4"
                        >
                            <p
                                className="text-xs leading-relaxed"
                                style={{ color: C.sage, fontFamily: FONT.body }}
                            >
                                Additional content that was hidden, now
                                gracefully revealed with layout animation.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </DemoCard>
    );
};

const CountTransitionDemo = () => {
    const [count, setCount] = useState(0);
    const motionVal = useMotionValue(0);
    const springVal = useSpring(motionVal, { stiffness: 100, damping: 20 });
    const [displayed, setDisplayed] = useState('0');

    useEffect(() => {
        motionVal.set(count);
    }, [count, motionVal]);

    useEffect(() => {
        const unsub = springVal.on('change', (v) => {
            setDisplayed(Math.round(v).toLocaleString());
        });
        return unsub;
    }, [springVal]);

    return (
        <DemoCard title="Count Transition">
            <div className="flex flex-col items-center gap-4">
                <span
                    className="text-4xl font-light"
                    style={{ fontFamily: FONT.display, color: C.charcoal }}
                >
                    {displayed}
                </span>
                <div className="flex gap-2">
                    {[10, 100, 1000].map((n) => (
                        <button
                            key={n}
                            onClick={() => setCount((c) => c + n)}
                            className="px-3 py-1 rounded text-xs font-medium cursor-pointer"
                            style={{
                                backgroundColor: C.sand,
                                color: C.charcoal,
                                fontFamily: FONT.body,
                            }}
                        >
                            +{n}
                        </button>
                    ))}
                </div>
            </div>
        </DemoCard>
    );
};

const ToggleSwitchDemo = () => {
    const [on, setOn] = useState(false);
    return (
        <DemoCard title="Toggle Switch">
            <div className="flex flex-col items-center gap-3">
                <motion.div
                    className="w-14 h-8 rounded-full p-1 cursor-pointer flex items-center"
                    style={{
                        backgroundColor: on ? C.grove : C.divider,
                        justifyContent: on ? 'flex-end' : 'flex-start',
                    }}
                    onClick={() => setOn(!on)}
                    layout
                >
                    <motion.div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: C.white }}
                        layout
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                        }}
                    />
                </motion.div>
                <span
                    className="text-xs"
                    style={{ color: C.sage, fontFamily: FONT.body }}
                >
                    {on ? 'On' : 'Off'}
                </span>
            </div>
        </DemoCard>
    );
};

const AccordionDemo = () => {
    const [open, setOpen] = useState<number | null>(null);
    const sections = ['Overview', 'Details', 'Contact'];
    return (
        <DemoCard title="Accordion">
            <div className="w-44 py-2">
                {sections.map((s, i) => (
                    <div
                        key={s}
                        className="border-b last:border-0"
                        style={{ borderColor: C.divider }}
                    >
                        <button
                            className="w-full text-left py-2.5 px-3 text-xs font-medium flex items-center justify-between cursor-pointer"
                            style={{
                                color: C.charcoal,
                                fontFamily: FONT.body,
                            }}
                            onClick={() => setOpen(open === i ? null : i)}
                        >
                            {s}
                            <motion.span
                                animate={{ rotate: open === i ? 180 : 0 }}
                                transition={{ duration: 0.25 }}
                                className="text-xs"
                                style={{ color: C.sage }}
                            >
                                v
                            </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                            {open === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="overflow-hidden"
                                >
                                    <p
                                        className="px-3 pb-3 text-xs leading-relaxed"
                                        style={{
                                            color: C.sage,
                                            fontFamily: FONT.body,
                                        }}
                                    >
                                        Content for the {s.toLowerCase()}{' '}
                                        section with smooth height animation.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </DemoCard>
    );
};

const TabIndicatorDemo = () => {
    const tabs = ['Details', 'Gallery', 'Map'];
    const [active, setActive] = useState(0);
    return (
        <DemoCard title="Tab Indicator">
            <div className="flex flex-col items-center gap-4">
                <div
                    className="relative flex gap-0 rounded-lg overflow-hidden"
                    style={{ backgroundColor: C.sand }}
                >
                    {tabs.map((t, i) => (
                        <button
                            key={t}
                            className="relative z-10 px-5 py-2 text-xs font-medium cursor-pointer"
                            style={{
                                color: active === i ? C.white : C.charcoal,
                                fontFamily: FONT.body,
                                transition: 'color 0.2s',
                            }}
                            onClick={() => setActive(i)}
                        >
                            {t}
                        </button>
                    ))}
                    <motion.div
                        className="absolute top-0 bottom-0 rounded-lg"
                        style={{
                            backgroundColor: C.grove,
                            width: `${100 / tabs.length}%`,
                        }}
                        animate={{ x: `${active * 100}%` }}
                        transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                        }}
                    />
                </div>
            </div>
        </DemoCard>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER 04 — LOADING & PROGRESS
// ═══════════════════════════════════════════════════════════════════════════════

const OrganicLoaderDemo = () => {
    return (
        <DemoCard title="Organic Loader">
            <motion.div
                className="w-16 h-16"
                style={{ backgroundColor: C.grove }}
                animate={{
                    borderRadius: [
                        '30% 70% 70% 30% / 30% 30% 70% 70%',
                        '70% 30% 30% 70% / 70% 70% 30% 30%',
                        '30% 70% 70% 30% / 70% 30% 70% 30%',
                        '30% 70% 70% 30% / 30% 30% 70% 70%',
                    ],
                    rotate: [0, 90, 180, 360],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </DemoCard>
    );
};

const StaggerDotsDemo = () => {
    return (
        <DemoCard title="Stagger Dots">
            <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: C.grove }}
                        animate={{ y: [0, -12, 0] }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
        </DemoCard>
    );
};

const ProgressArcDemo = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((p) => (p >= 100 ? 0 : p + 1));
        }, 40);
        return () => clearInterval(interval);
    }, []);

    const circumference = 2 * Math.PI * 38;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <DemoCard title="Progress Arc">
            <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle
                        cx="40"
                        cy="40"
                        r="38"
                        fill="none"
                        stroke={C.divider}
                        strokeWidth="3"
                    />
                    <motion.circle
                        cx="40"
                        cy="40"
                        r="38"
                        fill="none"
                        stroke={C.grove}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                    />
                </svg>
                <div
                    className="absolute inset-0 flex items-center justify-center text-sm font-medium"
                    style={{ color: C.charcoal, fontFamily: FONT.body }}
                >
                    {progress}%
                </div>
            </div>
        </DemoCard>
    );
};

const SkeletonPulseDemo = () => {
    return (
        <DemoCard title="Skeleton Pulse">
            <div className="flex flex-col gap-3 w-40">
                {[100, 75, 90].map((w, i) => (
                    <motion.div
                        key={i}
                        className="h-3 rounded-full"
                        style={{
                            width: `${w}%`,
                            background: `linear-gradient(90deg, ${C.divider} 25%, ${C.sand} 50%, ${C.divider} 75%)`,
                            backgroundSize: '200% 100%',
                        }}
                        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                ))}
                <motion.div
                    className="h-16 rounded-lg mt-1"
                    style={{
                        background: `linear-gradient(90deg, ${C.divider} 25%, ${C.sand} 50%, ${C.divider} 75%)`,
                        backgroundSize: '200% 100%',
                    }}
                    animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            </div>
        </DemoCard>
    );
};

const TypewriterDemo = () => {
    const text = 'Welcome to Calamigos Ranch';
    const [displayed, setDisplayed] = useState('');
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (idx <= text.length) {
            const timeout = setTimeout(() => {
                setDisplayed(text.slice(0, idx));
                setIdx((i) => i + 1);
            }, 60);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => {
                setIdx(0);
                setDisplayed('');
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [idx, text]);

    return (
        <DemoCard title="Typewriter">
            <div className="flex items-center gap-0.5 px-4">
                <span
                    className="text-base font-light"
                    style={{ fontFamily: FONT.display, color: C.charcoal }}
                >
                    {displayed}
                </span>
                <motion.span
                    className="inline-block w-[2px] h-5"
                    style={{ backgroundColor: C.grove }}
                    animate={{ opacity: [1, 0] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                />
            </div>
        </DemoCard>
    );
};

const WaveBarsDemo = () => {
    return (
        <DemoCard title="Wave Bars">
            <div className="flex items-end gap-1 h-16">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 rounded-full"
                        style={{ backgroundColor: C.grove }}
                        animate={{
                            height: [12, 40, 20, 48, 12],
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>
        </DemoCard>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER 05 — SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const ParallaxCardDemo = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

    return (
        <DemoCard title="Parallax Card">
            <div
                ref={ref}
                className="w-36 h-28 rounded-lg overflow-hidden relative"
                style={{ border: `1px solid ${C.divider}` }}
            >
                <motion.div
                    className="absolute inset-[-20px] flex items-center justify-center"
                    style={{
                        y,
                        backgroundColor: C.grove,
                    }}
                >
                    <span
                        className="text-sm font-light"
                        style={{ color: C.sand, fontFamily: FONT.display }}
                    >
                        Parallax
                    </span>
                </motion.div>
            </div>
        </DemoCard>
    );
};

const CounterScrollDemo = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: '-40px' });
    const motionVal = useMotionValue(0);
    const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
    const [displayed, setDisplayed] = useState('0');

    useEffect(() => {
        motionVal.set(inView ? 2024 : 0);
    }, [inView, motionVal]);

    useEffect(() => {
        const unsub = spring.on('change', (v) => {
            setDisplayed(Math.round(v).toLocaleString());
        });
        return unsub;
    }, [spring]);

    return (
        <DemoCard title="Counter Scroll">
            <div ref={ref} className="flex flex-col items-center">
                <span
                    className="text-4xl font-light"
                    style={{ fontFamily: FONT.display, color: C.charcoal }}
                >
                    {displayed}
                </span>
                <span
                    className="text-xs mt-1"
                    style={{ color: C.sage, fontFamily: FONT.body }}
                >
                    Counts when visible
                </span>
            </div>
        </DemoCard>
    );
};

const RevealLineDemo = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: '-60px' });
    return (
        <DemoCard title="Reveal Line">
            <div ref={ref} className="flex flex-col items-center gap-3 w-44">
                <span
                    className="text-xs tracking-widest uppercase"
                    style={{ color: C.sage, fontFamily: FONT.body }}
                >
                    Section Title
                </span>
                <motion.div
                    className="h-px w-full"
                    style={{ backgroundColor: C.grove }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: inView ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
                />
            </div>
        </DemoCard>
    );
};

const FadeSectionsDemo = () => {
    const [key, setKey] = useState(0);
    const items = ['Left block', 'Right block', 'Left block'];
    return (
        <DemoCard title="Fade Sections">
            <div className="flex flex-col gap-2 w-44 py-2">
                {items.map((label, i) => (
                    <motion.div
                        key={`${key}-${i}`}
                        initial={{
                            opacity: 0,
                            x: i % 2 === 0 ? -20 : 20,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: i * 0.15,
                            duration: 0.5,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="h-8 rounded flex items-center justify-center text-xs"
                        style={{
                            backgroundColor: C.sand,
                            color: C.charcoal,
                            fontFamily: FONT.body,
                        }}
                    >
                        {label}
                    </motion.div>
                ))}
                <button
                    onClick={() => setKey((k) => k + 1)}
                    className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity cursor-pointer mt-1 self-center"
                    style={{ color: C.charcoal, fontFamily: FONT.body }}
                >
                    Replay
                </button>
            </div>
        </DemoCard>
    );
};

const ScaleOnScrollDemo = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'center center'],
    });
    const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);
    const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

    return (
        <DemoCard title="Scale On Scroll">
            <motion.div
                ref={ref}
                className="w-20 h-20 rounded-lg flex items-center justify-center text-xs font-medium"
                style={{
                    backgroundColor: C.wood,
                    color: C.cream,
                    fontFamily: FONT.body,
                    scale,
                    opacity,
                }}
            >
                Scroll
            </motion.div>
        </DemoCard>
    );
};

const TextHighlightDemo = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: '-40px' });
    const words = ['Design', 'with', 'intention', 'and', 'elegance'];

    return (
        <DemoCard title="Text Highlight">
            <div ref={ref} className="flex flex-wrap gap-1.5 justify-center px-4">
                {words.map((word, i) => (
                    <motion.span
                        key={i}
                        className="text-lg font-light px-1"
                        style={{ fontFamily: FONT.display }}
                        initial={{ color: C.divider }}
                        animate={{
                            color: inView ? C.charcoal : C.divider,
                        }}
                        transition={{
                            delay: inView ? i * 0.12 : 0,
                            duration: 0.4,
                        }}
                    >
                        {word}
                    </motion.span>
                ))}
            </div>
        </DemoCard>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER 06 — GESTURE & DRAG
// ═══════════════════════════════════════════════════════════════════════════════

const DraggableCardStackDemo = () => {
    const [cards, setCards] = useState([0, 1, 2, 3]);

    const handleDragEnd = (
        _: any,
        info: { offset: { x: number } },
        idx: number,
    ) => {
        if (Math.abs(info.offset.x) > 80) {
            setCards((prev) => prev.filter((_, i) => i !== idx));
        }
    };

    const resetCards = () => setCards([0, 1, 2, 3]);

    return (
        <DemoCard title="Draggable Card Stack">
            <div className="relative w-32 h-28 flex items-center justify-center">
                {cards.length === 0 ? (
                    <button
                        onClick={resetCards}
                        className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ color: C.charcoal, fontFamily: FONT.body }}
                    >
                        Reset
                    </button>
                ) : (
                    cards.map((c, i) => (
                        <motion.div
                            key={c}
                            className="absolute w-28 h-20 rounded-lg flex items-center justify-center text-xs font-medium cursor-grab active:cursor-grabbing"
                            style={{
                                backgroundColor: C.white,
                                color: C.charcoal,
                                fontFamily: FONT.body,
                                border: `1px solid ${C.divider}`,
                                zIndex: cards.length - i,
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(_, info) =>
                                handleDragEnd(_, info, i)
                            }
                            initial={{ scale: 1 - i * 0.04, y: i * 4 }}
                            animate={{ scale: 1 - i * 0.04, y: i * 4 }}
                            whileDrag={{
                                scale: 1.05,
                                rotate: 5,
                                boxShadow:
                                    '0 10px 30px rgba(0,0,0,0.12)',
                            }}
                        >
                            Swipe away
                        </motion.div>
                    ))
                )}
            </div>
        </DemoCard>
    );
};

const SliderControlDemo = () => {
    const [value, setValue] = useState(50);
    const constraintsRef = useRef<HTMLDivElement>(null);

    const handleDrag = (_: any, info: { point: { x: number } }) => {
        const rect = constraintsRef.current?.getBoundingClientRect();
        if (!rect) return;
        const pct = Math.max(
            0,
            Math.min(100, ((info.point.x - rect.left) / rect.width) * 100),
        );
        setValue(Math.round(pct));
    };

    return (
        <DemoCard title="Slider Control">
            <div className="flex flex-col items-center gap-4 w-44">
                <span
                    className="text-2xl font-light"
                    style={{ fontFamily: FONT.display, color: C.charcoal }}
                >
                    {value}%
                </span>
                <div
                    ref={constraintsRef}
                    className="relative w-full h-2 rounded-full"
                    style={{ backgroundColor: C.divider }}
                >
                    <motion.div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{ backgroundColor: C.grove, width: `${value}%` }}
                    />
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full cursor-grab active:cursor-grabbing"
                        style={{
                            backgroundColor: C.grove,
                            border: `2px solid ${C.white}`,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            left: `calc(${value}% - 10px)`,
                        }}
                        drag="x"
                        dragConstraints={constraintsRef}
                        dragElastic={0}
                        dragMomentum={false}
                        onDrag={handleDrag}
                        whileDrag={{ scale: 1.2 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                        }}
                    />
                </div>
            </div>
        </DemoCard>
    );
};

const SortableListDemo = () => {
    const [items, setItems] = useState(['Ceremony', 'Cocktails', 'Dinner', 'Dancing']);

    return (
        <DemoCard title="Sortable List">
            <div className="flex flex-col gap-1.5 w-36">
                {items.map((item, i) => (
                    <motion.div
                        key={item}
                        layout
                        className="flex items-center gap-2 px-3 py-2 rounded text-xs font-medium cursor-grab active:cursor-grabbing"
                        style={{
                            backgroundColor: C.sand,
                            color: C.charcoal,
                            fontFamily: FONT.body,
                        }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(_, info) => {
                            const offset = Math.round(
                                info.offset.y / 36,
                            );
                            if (offset !== 0) {
                                const newIdx = Math.max(
                                    0,
                                    Math.min(items.length - 1, i + offset),
                                );
                                const newItems = [...items];
                                const [moved] = newItems.splice(i, 1);
                                newItems.splice(newIdx, 0, moved);
                                setItems(newItems);
                            }
                        }}
                        whileDrag={{
                            scale: 1.05,
                            boxShadow:
                                '0 4px 12px rgba(0,0,0,0.1)',
                            zIndex: 10,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                        }}
                    >
                        <span style={{ color: C.sage }}>{i + 1}.</span>
                        {item}
                    </motion.div>
                ))}
            </div>
        </DemoCard>
    );
};

const PullToRefreshDemo = () => {
    const [pulled, setPulled] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const handleDragEnd = (_: any, info: { offset: { y: number } }) => {
        if (info.offset.y > 50) {
            setRefreshing(true);
            setTimeout(() => {
                setRefreshing(false);
                setPulled(false);
            }, 1500);
        }
    };

    return (
        <DemoCard title="Pull to Refresh">
            <div className="relative w-36 h-32 rounded-lg overflow-hidden" style={{ backgroundColor: C.sand }}>
                <AnimatePresence>
                    {refreshing && (
                        <motion.div
                            className="absolute top-2 left-0 right-0 flex justify-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <motion.div
                                className="w-4 h-4 rounded-full"
                                style={{ border: `2px solid ${C.grove}`, borderTopColor: 'transparent' }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div
                    className="absolute inset-0 flex items-center justify-center text-xs font-medium cursor-grab active:cursor-grabbing"
                    style={{ color: C.charcoal, fontFamily: FONT.body }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 60 }}
                    dragElastic={0.4}
                    onDragEnd={handleDragEnd}
                >
                    {refreshing ? 'Refreshing...' : 'Pull down'}
                </motion.div>
            </div>
        </DemoCard>
    );
};

const SwipeActionsDemo = () => {
    const [revealed, setRevealed] = useState(false);
    return (
        <DemoCard title="Swipe Actions">
            <div className="relative w-44 h-14 rounded-lg overflow-hidden">
                <div
                    className="absolute inset-0 flex items-center justify-end px-4 gap-2"
                    style={{ backgroundColor: C.grove }}
                >
                    <span
                        className="text-xs font-medium"
                        style={{ color: C.sand, fontFamily: FONT.body }}
                    >
                        Archive
                    </span>
                </div>
                <motion.div
                    className="absolute inset-0 flex items-center px-4 text-xs font-medium cursor-grab active:cursor-grabbing"
                    style={{
                        backgroundColor: C.white,
                        color: C.charcoal,
                        fontFamily: FONT.body,
                        border: `1px solid ${C.divider}`,
                        borderRadius: 8,
                    }}
                    drag="x"
                    dragConstraints={{ left: -80, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => {
                        setRevealed(info.offset.x < -40);
                    }}
                    animate={{ x: revealed ? -80 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    Swipe left
                </motion.div>
            </div>
        </DemoCard>
    );
};

const ElasticOverscrollDemo = () => {
    return (
        <DemoCard title="Elastic Overscroll">
            <motion.div
                className="w-36 h-28 rounded-lg flex items-center justify-center text-xs font-medium cursor-grab active:cursor-grabbing overflow-hidden"
                style={{
                    backgroundColor: C.sand,
                    color: C.charcoal,
                    fontFamily: FONT.body,
                }}
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                dragElastic={0.5}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
                whileDrag={{ scale: 0.97 }}
            >
                Drag and release
            </motion.div>
        </DemoCard>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

const MoodboardDesignAnimations = () => {
    useEffect(() => {
        const id = 'botanical-editorial-fonts';
        if (!document.getElementById(id)) {
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href =
                'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap';
            document.head.appendChild(link);
        }
    }, []);

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: C.cream, color: C.charcoal }}
        >
            <StudyNav currentPage="animations" />

            {/* Hero */}
            <header className="pt-32 pb-20 px-8 md:px-16 max-w-6xl mx-auto">
                <motion.span
                    className="text-xs tracking-[0.3em] uppercase block mb-4"
                    style={{ color: C.sage, fontFamily: FONT.body }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Design Study 04
                </motion.span>
                <motion.h1
                    className="text-6xl md:text-8xl font-light leading-[0.95] mb-6"
                    style={{ fontFamily: FONT.display, color: C.charcoal }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    Interaction
                    <br />
                    Dictionary
                </motion.h1>
                <motion.p
                    className="text-sm leading-relaxed max-w-md"
                    style={{ color: C.sage, fontFamily: FONT.body }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    A curated reference library of animation patterns for the
                    Calamigos Ranch digital experience. Each demo is
                    self-contained, interactive, and designed to teach a
                    specific motion principle.
                </motion.p>
            </header>

            <div className="max-w-6xl mx-auto px-8 md:px-16 pb-32">
                {/* Chapter 01 */}
                <ChapterHeader
                    number="01"
                    title="Entrance Animations"
                    description="How elements arrive on screen. The first impression of motion sets the tone for the entire experience."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FadeUpDemo />
                    <SlideInDemo />
                    <ScaleRevealDemo />
                    <BlurInDemo />
                    <ClipRevealDemo />
                    <StaggerCascadeDemo />
                </div>

                <SectionDivider />

                {/* Chapter 02 */}
                <ChapterHeader
                    number="02"
                    title="Hover & Cursor Effects"
                    description="Responsive feedback that acknowledges the visitor's presence. These patterns create a dialogue between user and interface."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <MagneticPullDemo />
                    <Tilt3DDemo />
                    <BorderTraceDemo />
                    <RevealLayerDemo />
                    <ShadowDanceDemo />
                    <TextScrambleDemo />
                </div>

                <SectionDivider />

                {/* Chapter 03 */}
                <ChapterHeader
                    number="03"
                    title="State Transitions"
                    description="Smooth morphs between interface states. Continuity of motion helps users maintain spatial awareness."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <MorphingButtonDemo />
                    <ExpandableCardDemo />
                    <CountTransitionDemo />
                    <ToggleSwitchDemo />
                    <AccordionDemo />
                    <TabIndicatorDemo />
                </div>

                <SectionDivider />

                {/* Chapter 04 */}
                <ChapterHeader
                    number="04"
                    title="Loading & Progress"
                    description="Elegant indicators of ongoing processes. Good loading animations reduce perceived wait time and maintain engagement."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <OrganicLoaderDemo />
                    <StaggerDotsDemo />
                    <ProgressArcDemo />
                    <SkeletonPulseDemo />
                    <TypewriterDemo />
                    <WaveBarsDemo />
                </div>

                <SectionDivider />

                {/* Chapter 05 */}
                <ChapterHeader
                    number="05"
                    title="Scroll Animations"
                    description="Motion tied to the scroll position. These patterns reward exploration and create a sense of depth through the page."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ParallaxCardDemo />
                    <CounterScrollDemo />
                    <RevealLineDemo />
                    <FadeSectionsDemo />
                    <ScaleOnScrollDemo />
                    <TextHighlightDemo />
                </div>

                <SectionDivider />

                {/* Chapter 06 */}
                <ChapterHeader
                    number="06"
                    title="Gesture & Drag"
                    description="Direct manipulation patterns that bring physicality to the interface. Spring physics make interactions feel tangible."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DraggableCardStackDemo />
                    <SliderControlDemo />
                    <SortableListDemo />
                    <PullToRefreshDemo />
                    <SwipeActionsDemo />
                    <ElasticOverscrollDemo />
                </div>
            </div>

            {/* Footer */}
            <footer
                className="border-t py-16 px-8 md:px-16"
                style={{ borderColor: C.divider }}
            >
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <span
                        className="text-xs tracking-[0.2em]"
                        style={{ color: C.sage, fontFamily: FONT.body }}
                    >
                        Calamigos Ranch -- Interaction Dictionary
                    </span>
                    <span
                        className="text-xs"
                        style={{ color: C.sage, fontFamily: FONT.body }}
                    >
                        36 Patterns
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default MoodboardDesignAnimations;
