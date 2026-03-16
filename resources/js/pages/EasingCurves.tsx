import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import React, { useEffect, useState, useCallback, useRef } from 'react';
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
        const id = 'easing-curves-fonts';
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href =
            'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap';
        document.head.appendChild(link);
    }, []);
};

// ─── Section Wrapper ────────────────────────────────────────────────────────────
interface SectionProps {
    number: string;
    title: string;
    description: string;
    children: React.ReactNode;
    id?: string;
    fullWidth?: boolean;
}

const Section = ({ number, title, description, children, id, fullWidth }: SectionProps) => (
    <section
        id={id}
        className="relative flex flex-col"
        style={{
            borderBottom: `1px solid ${brand.divider}`,
            padding: '6rem 0',
        }}
    >
        <div className={fullWidth ? 'w-full' : 'max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20'}>
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
            <div className={fullWidth ? 'px-6 md:px-12 lg:px-20' : ''}>{children}</div>
        </div>
    </section>
);

// ─── Easing Definitions ─────────────────────────────────────────────────────────
interface EasingDef {
    name: string;
    label: string;
    description: string;
    cubicBezier: [number, number, number, number] | null;
    transition: Record<string, unknown>;
    svgPath: string;
}

const buildCurvePath = (p1x: number, p1y: number, p2x: number, p2y: number): string => {
    const w = 120;
    const h = 80;
    const pad = 10;
    const sx = pad;
    const sy = h - pad;
    const ex = w - pad;
    const ey = pad;
    const c1x = sx + (ex - sx) * p1x;
    const c1y = sy + (ey - sy) * p1y;
    const c2x = sx + (ex - sx) * p2x;
    const c2y = sy + (ey - sy) * p2y;
    return `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;
};

const easings: EasingDef[] = [
    {
        name: 'linear',
        label: 'Linear',
        description: 'Constant speed, no acceleration',
        cubicBezier: [0, 0, 1, 1],
        transition: { duration: 1.5, ease: 'linear' },
        svgPath: `M 10 70 L 110 10`,
    },
    {
        name: 'ease-in',
        label: 'Ease In',
        description: 'Starts slow, accelerates',
        cubicBezier: [0.42, 0, 1, 1],
        transition: { duration: 1.5, ease: [0.42, 0, 1, 1] },
        svgPath: buildCurvePath(0.42, 0, 1, 1),
    },
    {
        name: 'ease-out',
        label: 'Ease Out',
        description: 'Starts fast, decelerates',
        cubicBezier: [0, 0, 0.58, 1],
        transition: { duration: 1.5, ease: [0, 0, 0.58, 1] },
        svgPath: buildCurvePath(0, 0, 0.58, 1),
    },
    {
        name: 'ease-in-out',
        label: 'Ease In Out',
        description: 'Slow start and end',
        cubicBezier: [0.42, 0, 0.58, 1],
        transition: { duration: 1.5, ease: [0.42, 0, 0.58, 1] },
        svgPath: buildCurvePath(0.42, 0, 0.58, 1),
    },
    {
        name: 'ease-out-back',
        label: 'Ease Out Back',
        description: 'Overshoots then settles',
        cubicBezier: [0.34, 1.56, 0.64, 1],
        transition: { duration: 1.5, ease: [0.34, 1.56, 0.64, 1] },
        svgPath: buildCurvePath(0.34, 1.56, 0.64, 1),
    },
    {
        name: 'ease-in-expo',
        label: 'Ease In Expo',
        description: 'Exponential acceleration',
        cubicBezier: [0.95, 0.05, 0.795, 0.035],
        transition: { duration: 1.5, ease: [0.95, 0.05, 0.795, 0.035] },
        svgPath: buildCurvePath(0.95, 0.05, 0.795, 0.035),
    },
    {
        name: 'spring',
        label: 'Spring',
        description: 'Physics-based spring motion',
        cubicBezier: null,
        transition: { type: 'spring', stiffness: 200, damping: 15, duration: 1.5 },
        svgPath: 'M 10 70 C 30 70, 40 5, 60 10 C 70 12, 72 8, 80 10 C 86 11, 88 9, 95 10 L 110 10',
    },
    {
        name: 'bounce',
        label: 'Bounce',
        description: 'Bouncy ending effect',
        cubicBezier: null,
        transition: { type: 'spring', stiffness: 300, damping: 10, duration: 1.5 },
        svgPath: 'M 10 70 C 25 70, 35 -5, 50 10 C 58 18, 62 5, 70 10 C 76 14, 80 8, 86 10 C 92 12, 96 9, 110 10',
    },
];

// ─── SVG Curve Card ─────────────────────────────────────────────────────────────
const CurveCard = ({ easing }: { easing: EasingDef }) => {
    const [playing, setPlaying] = useState(false);
    const [key, setKey] = useState(0);

    const play = () => {
        setKey((k) => k + 1);
        setPlaying(true);
        setTimeout(() => setPlaying(false), 2000);
    };

    return (
        <motion.div
            className="relative rounded-sm overflow-hidden"
            style={{
                backgroundColor: brand.creamWarm,
                border: `1px solid ${brand.divider}`,
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
        >
            <div className="p-6 pb-4">
                {/* Header */}
                <div className="flex items-baseline justify-between mb-1">
                    <h3
                        className="text-xl font-light tracking-tight"
                        style={{ fontFamily: serif, color: brand.charcoal }}
                    >
                        {easing.label}
                    </h3>
                    {easing.cubicBezier && (
                        <span
                            className="text-[9px] tracking-wider font-mono opacity-40"
                            style={{ color: brand.charcoal }}
                        >
                            {easing.cubicBezier.map((v) => v.toFixed(2)).join(', ')}
                        </span>
                    )}
                </div>
                <p
                    className="text-xs tracking-wide mb-5"
                    style={{ fontFamily: sans, color: brand.sage }}
                >
                    {easing.description}
                </p>

                {/* SVG Curve */}
                <div
                    className="relative rounded-sm mb-5"
                    style={{ backgroundColor: `${brand.grove}06` }}
                >
                    <svg
                        viewBox="0 0 120 80"
                        className="w-full"
                        style={{ display: 'block' }}
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {/* Grid lines */}
                        <line x1="10" y1="70" x2="110" y2="70" stroke={brand.divider} strokeWidth="0.5" />
                        <line x1="10" y1="10" x2="110" y2="10" stroke={brand.divider} strokeWidth="0.5" />
                        <line x1="10" y1="10" x2="10" y2="70" stroke={brand.divider} strokeWidth="0.5" />
                        <line x1="110" y1="10" x2="110" y2="70" stroke={brand.divider} strokeWidth="0.5" />
                        {/* Diagonal reference */}
                        <line
                            x1="10" y1="70" x2="110" y2="10"
                            stroke={brand.divider}
                            strokeWidth="0.5"
                            strokeDasharray="2 2"
                        />
                        {/* Curve */}
                        <path
                            d={easing.svgPath}
                            fill="none"
                            stroke={brand.grove}
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        {/* Endpoints */}
                        <circle cx="10" cy="70" r="2.5" fill={brand.grove} />
                        <circle cx="110" cy="10" r="2.5" fill={brand.grove} />
                    </svg>
                </div>

                {/* Animation track */}
                <div className="relative h-8 mb-4">
                    <div
                        className="absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2"
                        style={{ backgroundColor: brand.divider }}
                    />
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={key}
                            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
                            style={{
                                backgroundColor: brand.grove,
                                boxShadow: `0 2px 8px ${brand.grove}30`,
                            }}
                            initial={{ left: 0 }}
                            animate={{ left: 'calc(100% - 20px)' }}
                            transition={easing.transition}
                        />
                    </AnimatePresence>
                </div>

                {/* Play button */}
                <motion.button
                    onClick={play}
                    disabled={playing}
                    className="w-full py-2.5 text-[10px] tracking-[0.2em] uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
                    style={{
                        fontFamily: sans,
                        color: brand.grove,
                        border: `1px solid ${brand.divider}`,
                        backgroundColor: 'transparent',
                    }}
                    whileHover={{ backgroundColor: `${brand.grove}08` }}
                    whileTap={{ scale: 0.97 }}
                >
                    {playing ? 'Playing...' : 'Play'}
                </motion.button>
            </div>
        </motion.div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════════
// 01 — The Easing Library
// ═════════════════════════════════════════════════════════════════════════════════
const EasingLibrary = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {easings.map((easing) => (
            <CurveCard key={easing.name} easing={easing} />
        ))}
    </div>
);

// ═════════════════════════════════════════════════════════════════════════════════
// 02 — The Race Track
// ═════════════════════════════════════════════════════════════════════════════════
const RaceTrack = () => {
    const [racing, setRacing] = useState(false);
    const [key, setKey] = useState(0);

    const startRace = () => {
        setKey((k) => k + 1);
        setRacing(true);
        setTimeout(() => setRacing(false), 2200);
    };

    return (
        <div>
            {/* Start button */}
            <div className="flex justify-center mb-10">
                <motion.button
                    onClick={startRace}
                    disabled={racing}
                    className="px-10 py-4 text-xs tracking-[0.25em] uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
                    style={{
                        fontFamily: sans,
                        color: brand.cream,
                        backgroundColor: brand.grove,
                        border: 'none',
                    }}
                    whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${brand.grove}30` }}
                    whileTap={{ scale: 0.97 }}
                >
                    {racing ? 'Racing...' : 'Start Race'}
                </motion.button>
            </div>

            {/* Track */}
            <div
                className="rounded-sm overflow-hidden"
                style={{
                    backgroundColor: brand.creamWarm,
                    border: `1px solid ${brand.divider}`,
                }}
            >
                {easings.map((easing, i) => (
                    <div
                        key={`${easing.name}-${key}`}
                        className="relative flex items-center"
                        style={{
                            borderBottom: i < easings.length - 1 ? `1px solid ${brand.divider}` : 'none',
                            height: '60px',
                        }}
                    >
                        {/* Grid lines */}
                        {[0.25, 0.5, 0.75].map((pos) => (
                            <div
                                key={pos}
                                className="absolute top-0 bottom-0 w-[1px]"
                                style={{
                                    left: `${120 + (100 - 12) * pos}px`,
                                    backgroundColor: brand.divider,
                                    opacity: 0.5,
                                }}
                            />
                        ))}

                        {/* Label */}
                        <div
                            className="shrink-0 w-[120px] md:w-[160px] px-4 md:px-6 flex items-center h-full"
                            style={{
                                borderRight: `1px solid ${brand.divider}`,
                                backgroundColor: `${brand.grove}04`,
                            }}
                        >
                            <span
                                className="text-[10px] md:text-xs tracking-[0.1em] uppercase truncate"
                                style={{ fontFamily: sans, color: brand.charcoal }}
                            >
                                {easing.label}
                            </span>
                        </div>

                        {/* Track lane */}
                        <div className="relative flex-1 h-full flex items-center px-3">
                            {/* Track line */}
                            <div
                                className="absolute inset-x-3 top-1/2 h-[1px] -translate-y-1/2"
                                style={{ backgroundColor: `${brand.grove}10` }}
                            />

                            {/* Racing dot */}
                            <motion.div
                                className="relative w-4 h-4 md:w-5 md:h-5 rounded-full z-10"
                                style={{
                                    backgroundColor: brand.grove,
                                    boxShadow: `0 2px 10px ${brand.grove}40`,
                                }}
                                initial={{ left: 0 }}
                                animate={racing ? { left: 'calc(100% - 20px)' } : { left: 0 }}
                                transition={
                                    racing
                                        ? easing.transition
                                        : { duration: 0 }
                                }
                            />
                        </div>

                        {/* Finish line */}
                        <div
                            className="absolute right-0 top-0 bottom-0 w-[3px]"
                            style={{
                                background: `repeating-linear-gradient(to bottom, ${brand.charcoal} 0px, ${brand.charcoal} 4px, transparent 4px, transparent 8px)`,
                                opacity: 0.2,
                            }}
                        />
                    </div>
                ))}

                {/* Start / Finish labels */}
                <div
                    className="flex justify-between px-4 md:px-6 py-3"
                    style={{ borderTop: `1px solid ${brand.divider}`, backgroundColor: `${brand.grove}04` }}
                >
                    <span
                        className="text-[9px] tracking-[0.2em] uppercase ml-[120px] md:ml-[160px]"
                        style={{ fontFamily: sans, color: brand.sage }}
                    >
                        Start
                    </span>
                    <span
                        className="text-[9px] tracking-[0.2em] uppercase"
                        style={{ fontFamily: sans, color: brand.sage }}
                    >
                        Finish
                    </span>
                </div>
            </div>

            {/* Duration note */}
            <div className="flex justify-center mt-5">
                <span
                    className="text-[10px] tracking-[0.15em] uppercase"
                    style={{ fontFamily: sans, color: brand.sage }}
                >
                    All animations: 1.5s duration
                </span>
            </div>
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════════
// 03 — Spring Tuning
// ═════════════════════════════════════════════════════════════════════════════════
interface SpringPreset {
    name: string;
    stiffness: number;
    damping: number;
    feeling: string;
}

const springPresets: SpringPreset[] = [
    { name: 'Gentle', stiffness: 80, damping: 12, feeling: 'Soft and floaty, like settling into a cushion' },
    { name: 'Snappy', stiffness: 400, damping: 30, feeling: 'Quick and decisive, no wasted motion' },
    { name: 'Bouncy', stiffness: 300, damping: 8, feeling: 'Playful overshoot, full of personality' },
    { name: 'Stiff', stiffness: 500, damping: 45, feeling: 'Heavy and controlled, almost mechanical' },
];

const getSpringFeeling = (stiffness: number, damping: number): string => {
    const ratio = stiffness / damping;
    if (ratio > 30) return 'Extremely bouncy and chaotic';
    if (ratio > 20) return 'Very bouncy with strong overshoot';
    if (ratio > 12) return 'Playful with noticeable bounce';
    if (ratio > 8) return 'Balanced with subtle oscillation';
    if (ratio > 5) return 'Snappy and responsive';
    if (ratio > 3) return 'Controlled and deliberate';
    return 'Heavy and sluggish';
};

const SpringTuning = () => {
    const [stiffness, setStiffness] = useState(200);
    const [damping, setDamping] = useState(15);
    const [bounceKey, setBounceKey] = useState(0);
    const [bouncing, setBouncing] = useState(false);

    const bounce = () => {
        setBounceKey((k) => k + 1);
        setBouncing(true);
        setTimeout(() => setBouncing(false), 2000);
    };

    const applyPreset = (preset: SpringPreset) => {
        setStiffness(preset.stiffness);
        setDamping(preset.damping);
        setBounceKey((k) => k + 1);
        setBouncing(true);
        setTimeout(() => setBouncing(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Controls */}
            <div>
                {/* Presets */}
                <div className="mb-8">
                    <span
                        className="text-[10px] tracking-[0.25em] uppercase block mb-4"
                        style={{ fontFamily: sans, color: brand.sage }}
                    >
                        Presets
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                        {springPresets.map((preset) => (
                            <motion.button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="py-3 px-4 rounded-sm text-left cursor-pointer"
                                style={{
                                    border: `1px solid ${
                                        stiffness === preset.stiffness && damping === preset.damping
                                            ? brand.grove
                                            : brand.divider
                                    }`,
                                    backgroundColor:
                                        stiffness === preset.stiffness && damping === preset.damping
                                            ? `${brand.grove}08`
                                            : 'transparent',
                                }}
                                whileHover={{ backgroundColor: `${brand.grove}06` }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <span
                                    className="text-xs tracking-[0.1em] uppercase block"
                                    style={{ fontFamily: sans, color: brand.charcoal }}
                                >
                                    {preset.name}
                                </span>
                                <span
                                    className="text-[9px] block mt-1"
                                    style={{ fontFamily: sans, color: brand.sage }}
                                >
                                    {preset.stiffness} / {preset.damping}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Sliders */}
                <div className="space-y-6 mb-8">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span
                                className="text-xs tracking-[0.1em] uppercase"
                                style={{ fontFamily: sans, color: brand.charcoal }}
                            >
                                Stiffness
                            </span>
                            <span
                                className="text-xs tabular-nums"
                                style={{ fontFamily: sans, color: brand.sage }}
                            >
                                {stiffness}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={50}
                            max={500}
                            value={stiffness}
                            onChange={(e) => setStiffness(Number(e.target.value))}
                            className="w-full h-[2px] appearance-none rounded-full cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, ${brand.grove} ${((stiffness - 50) / 450) * 100}%, ${brand.divider} ${((stiffness - 50) / 450) * 100}%)`,
                                accentColor: brand.grove,
                            }}
                        />
                        <div className="flex justify-between mt-1">
                            <span className="text-[9px]" style={{ fontFamily: sans, color: brand.sage }}>50</span>
                            <span className="text-[9px]" style={{ fontFamily: sans, color: brand.sage }}>500</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <span
                                className="text-xs tracking-[0.1em] uppercase"
                                style={{ fontFamily: sans, color: brand.charcoal }}
                            >
                                Damping
                            </span>
                            <span
                                className="text-xs tabular-nums"
                                style={{ fontFamily: sans, color: brand.sage }}
                            >
                                {damping}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={5}
                            max={50}
                            value={damping}
                            onChange={(e) => setDamping(Number(e.target.value))}
                            className="w-full h-[2px] appearance-none rounded-full cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, ${brand.grove} ${((damping - 5) / 45) * 100}%, ${brand.divider} ${((damping - 5) / 45) * 100}%)`,
                                accentColor: brand.grove,
                            }}
                        />
                        <div className="flex justify-between mt-1">
                            <span className="text-[9px]" style={{ fontFamily: sans, color: brand.sage }}>5</span>
                            <span className="text-[9px]" style={{ fontFamily: sans, color: brand.sage }}>50</span>
                        </div>
                    </div>
                </div>

                {/* Feeling description */}
                <div
                    className="rounded-sm p-5 mb-6"
                    style={{ backgroundColor: `${brand.grove}06`, border: `1px solid ${brand.divider}` }}
                >
                    <span
                        className="text-[10px] tracking-[0.2em] uppercase block mb-2"
                        style={{ fontFamily: sans, color: brand.sage }}
                    >
                        Character
                    </span>
                    <p
                        className="text-sm italic leading-relaxed"
                        style={{ fontFamily: serif, color: brand.charcoal }}
                    >
                        "{getSpringFeeling(stiffness, damping)}"
                    </p>
                </div>

                {/* Bounce button */}
                <motion.button
                    onClick={bounce}
                    disabled={bouncing}
                    className="w-full py-3 text-xs tracking-[0.2em] uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
                    style={{
                        fontFamily: sans,
                        color: brand.cream,
                        backgroundColor: brand.grove,
                        border: 'none',
                    }}
                    whileHover={{ scale: 1.01, boxShadow: `0 4px 20px ${brand.grove}25` }}
                    whileTap={{ scale: 0.97 }}
                >
                    {bouncing ? 'Bouncing...' : 'Bounce'}
                </motion.button>
            </div>

            {/* Preview area */}
            <div
                className="relative rounded-sm flex items-center justify-center min-h-[360px]"
                style={{
                    backgroundColor: brand.creamWarm,
                    border: `1px solid ${brand.divider}`,
                }}
            >
                {/* Grid */}
                <div className="absolute inset-0 opacity-30">
                    {[0.25, 0.5, 0.75].map((pos) => (
                        <React.Fragment key={pos}>
                            <div
                                className="absolute top-0 bottom-0 w-[1px]"
                                style={{ left: `${pos * 100}%`, backgroundColor: brand.divider }}
                            />
                            <div
                                className="absolute left-0 right-0 h-[1px]"
                                style={{ top: `${pos * 100}%`, backgroundColor: brand.divider }}
                            />
                        </React.Fragment>
                    ))}
                </div>

                {/* Crosshair origin */}
                <div className="absolute w-[1px] h-6" style={{ backgroundColor: brand.sage, opacity: 0.3 }} />
                <div className="absolute w-6 h-[1px]" style={{ backgroundColor: brand.sage, opacity: 0.3 }} />

                {/* Ghost */}
                <div
                    className="absolute w-20 h-20 rounded-full"
                    style={{
                        border: `1px dashed ${brand.grove}25`,
                    }}
                />

                {/* Spring circle */}
                <motion.div
                    key={bounceKey}
                    className="w-20 h-20 rounded-full z-10"
                    style={{
                        backgroundColor: brand.grove,
                        boxShadow: `0 8px 30px ${brand.grove}30`,
                    }}
                    initial={{ scale: 0.2, y: -120 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness,
                        damping,
                    }}
                />

                {/* Values overlay */}
                <div className="absolute bottom-4 right-4 text-right">
                    <span
                        className="text-[9px] tracking-[0.15em] uppercase block"
                        style={{ fontFamily: sans, color: brand.sage }}
                    >
                        stiffness: {stiffness} / damping: {damping}
                    </span>
                </div>
            </div>
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════════
// 04 — Duration & Timing
// ═════════════════════════════════════════════════════════════════════════════════
const durations = [
    { value: 0.1, label: '0.1s' },
    { value: 0.3, label: '0.3s' },
    { value: 0.5, label: '0.5s' },
    { value: 1.0, label: '1.0s' },
    { value: 2.0, label: '2.0s' },
];

const durationGuidelines = [
    { range: '100 - 200ms', category: 'Micro-interactions', examples: 'Button hover, toggle, checkbox' },
    { range: '200 - 500ms', category: 'Interface transitions', examples: 'Dropdown open, tab switch, modal enter' },
    { range: '300 - 800ms', category: 'Page transitions', examples: 'Route change, view swap, panel slide' },
    { range: '800 - 1500ms', category: 'Dramatic reveals', examples: 'Hero entrance, loading complete, celebration' },
];

const DurationTiming = () => {
    const [playing, setPlaying] = useState(false);
    const [key, setKey] = useState(0);

    const play = () => {
        setKey((k) => k + 1);
        setPlaying(true);
        setTimeout(() => setPlaying(false), 3000);
    };

    return (
        <div>
            {/* Play button */}
            <div className="flex justify-center mb-10">
                <motion.button
                    onClick={play}
                    disabled={playing}
                    className="px-8 py-3.5 text-xs tracking-[0.2em] uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
                    style={{
                        fontFamily: sans,
                        color: brand.grove,
                        border: `1px solid ${brand.divider}`,
                        backgroundColor: 'transparent',
                    }}
                    whileHover={{ backgroundColor: `${brand.grove}08` }}
                    whileTap={{ scale: 0.97 }}
                >
                    {playing ? 'Playing...' : 'Compare Durations'}
                </motion.button>
            </div>

            {/* Duration tracks */}
            <div
                className="rounded-sm overflow-hidden mb-12"
                style={{ backgroundColor: brand.creamWarm, border: `1px solid ${brand.divider}` }}
            >
                {durations.map((d, i) => (
                    <div
                        key={`${d.value}-${key}`}
                        className="relative flex items-center"
                        style={{
                            borderBottom: i < durations.length - 1 ? `1px solid ${brand.divider}` : 'none',
                            height: '56px',
                        }}
                    >
                        {/* Label */}
                        <div
                            className="shrink-0 w-[80px] md:w-[120px] px-4 md:px-6 flex items-center justify-center h-full"
                            style={{ borderRight: `1px solid ${brand.divider}`, backgroundColor: `${brand.grove}04` }}
                        >
                            <span
                                className="text-sm tabular-nums font-light"
                                style={{ fontFamily: serif, color: brand.charcoal }}
                            >
                                {d.label}
                            </span>
                        </div>

                        {/* Track */}
                        <div className="relative flex-1 h-full flex items-center px-3">
                            <div
                                className="absolute inset-x-3 top-1/2 h-[1px] -translate-y-1/2"
                                style={{ backgroundColor: `${brand.grove}10` }}
                            />
                            <motion.div
                                className="relative w-4 h-4 rounded-full z-10"
                                style={{
                                    backgroundColor: brand.wood,
                                    boxShadow: `0 2px 8px ${brand.wood}30`,
                                }}
                                initial={{ left: 0 }}
                                animate={playing ? { left: 'calc(100% - 16px)' } : { left: 0 }}
                                transition={
                                    playing
                                        ? { duration: d.value, ease: [0.42, 0, 0.58, 1] }
                                        : { duration: 0 }
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {durationGuidelines.map((guide) => (
                    <motion.div
                        key={guide.category}
                        className="rounded-sm p-5"
                        style={{
                            backgroundColor: brand.creamWarm,
                            border: `1px solid ${brand.divider}`,
                        }}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span
                            className="text-lg font-light block mb-1"
                            style={{ fontFamily: serif, color: brand.charcoal }}
                        >
                            {guide.range}
                        </span>
                        <span
                            className="text-[10px] tracking-[0.2em] uppercase block mb-2"
                            style={{ fontFamily: sans, color: brand.grove }}
                        >
                            {guide.category}
                        </span>
                        <p
                            className="text-xs leading-relaxed"
                            style={{ fontFamily: sans, color: brand.sage }}
                        >
                            {guide.examples}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════════
// 05 — When to Use What
// ═════════════════════════════════════════════════════════════════════════════════
interface UseCaseEntry {
    useCase: string;
    recommendation: string;
    reasoning: string;
    demoTransition: Record<string, unknown>;
    demoType: 'enter' | 'exit' | 'hover' | 'slide' | 'spring' | 'linear';
}

const useCases: UseCaseEntry[] = [
    {
        useCase: 'Entrances',
        recommendation: 'Ease Out',
        reasoning: 'Elements arriving should decelerate into place, like a guest settling into a chair.',
        demoTransition: { duration: 0.8, ease: [0, 0, 0.58, 1] },
        demoType: 'enter',
    },
    {
        useCase: 'Exits',
        recommendation: 'Ease In',
        reasoning: 'Elements leaving should accelerate away, gathering speed as they depart.',
        demoTransition: { duration: 0.8, ease: [0.42, 0, 1, 1] },
        demoType: 'exit',
    },
    {
        useCase: 'Hover States',
        recommendation: 'Ease Out',
        reasoning: 'Immediate responsiveness, then a gentle settle. The UI feels alive and attentive.',
        demoTransition: { duration: 0.3, ease: [0, 0, 0.58, 1] },
        demoType: 'hover',
    },
    {
        useCase: 'Page Transitions',
        recommendation: 'Ease In Out',
        reasoning: 'Smooth departure and smooth arrival. Neither side feels abrupt.',
        demoTransition: { duration: 1, ease: [0.42, 0, 0.58, 1] },
        demoType: 'slide',
    },
    {
        useCase: 'Playful UI',
        recommendation: 'Spring / Back',
        reasoning: 'Overshoot adds personality and delight. A little bounce goes a long way.',
        demoTransition: { type: 'spring', stiffness: 300, damping: 10 },
        demoType: 'spring',
    },
    {
        useCase: 'Loading',
        recommendation: 'Linear',
        reasoning: 'Constant and predictable. Users can gauge progress without false expectations.',
        demoTransition: { duration: 2, ease: 'linear', repeat: Infinity },
        demoType: 'linear',
    },
];

const UseCaseDemo = ({ entry }: { entry: UseCaseEntry }) => {
    const [active, setActive] = useState(false);
    const [key, setKey] = useState(0);

    const trigger = () => {
        setKey((k) => k + 1);
        setActive(true);
        setTimeout(() => setActive(false), 2500);
    };

    const renderDemo = () => {
        switch (entry.demoType) {
            case 'enter':
                return (
                    <motion.div
                        key={key}
                        className="w-12 h-12 rounded-sm"
                        style={{ backgroundColor: brand.grove }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={entry.demoTransition}
                    />
                );
            case 'exit':
                return (
                    <AnimatePresence mode="wait">
                        {!active ? (
                            <motion.div
                                key="visible"
                                className="w-12 h-12 rounded-sm"
                                style={{ backgroundColor: brand.wood }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={entry.demoTransition}
                            />
                        ) : (
                            <motion.div
                                key="gone"
                                className="w-12 h-12 rounded-sm opacity-0"
                            />
                        )}
                    </AnimatePresence>
                );
            case 'hover':
                return (
                    <motion.div
                        className="w-12 h-12 rounded-sm cursor-pointer"
                        style={{ backgroundColor: brand.sage }}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={entry.demoTransition}
                    />
                );
            case 'slide':
                return (
                    <motion.div
                        key={key}
                        className="w-full h-10 rounded-sm"
                        style={{ backgroundColor: brand.grove, maxWidth: '80%' }}
                        initial={{ x: '-110%' }}
                        animate={{ x: '0%' }}
                        transition={entry.demoTransition}
                    />
                );
            case 'spring':
                return (
                    <motion.div
                        key={key}
                        className="w-12 h-12 rounded-full"
                        style={{ backgroundColor: brand.grove }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={entry.demoTransition}
                    />
                );
            case 'linear':
                return (
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${brand.grove}15` }}>
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: brand.grove }}
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={entry.demoTransition}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            className="rounded-sm overflow-hidden"
            style={{
                backgroundColor: brand.creamWarm,
                border: `1px solid ${brand.divider}`,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-baseline justify-between mb-1">
                    <h4
                        className="text-xl font-light tracking-tight"
                        style={{ fontFamily: serif, color: brand.charcoal }}
                    >
                        {entry.useCase}
                    </h4>
                    <span
                        className="text-[10px] tracking-[0.15em] uppercase"
                        style={{ fontFamily: sans, color: brand.grove }}
                    >
                        {entry.recommendation}
                    </span>
                </div>
                <p
                    className="text-xs leading-relaxed mb-5"
                    style={{ fontFamily: sans, color: brand.sage }}
                >
                    {entry.reasoning}
                </p>

                {/* Demo area */}
                <div
                    className="relative rounded-sm h-20 flex items-center justify-center px-4 mb-4 overflow-hidden"
                    style={{ backgroundColor: `${brand.grove}06` }}
                >
                    {renderDemo()}
                </div>

                {/* Trigger */}
                {entry.demoType !== 'hover' && entry.demoType !== 'linear' && (
                    <motion.button
                        onClick={trigger}
                        disabled={active}
                        className="w-full py-2 text-[10px] tracking-[0.2em] uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
                        style={{
                            fontFamily: sans,
                            color: brand.grove,
                            border: `1px solid ${brand.divider}`,
                            backgroundColor: 'transparent',
                        }}
                        whileHover={{ backgroundColor: `${brand.grove}08` }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {active ? 'Playing...' : 'Demo'}
                    </motion.button>
                )}
                {entry.demoType === 'hover' && (
                    <div className="text-center py-2">
                        <span
                            className="text-[10px] tracking-[0.15em] uppercase"
                            style={{ fontFamily: sans, color: brand.sage }}
                        >
                            Hover the shape above
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const WhenToUseWhat = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((entry) => (
            <UseCaseDemo key={entry.useCase} entry={entry} />
        ))}
    </div>
);

// ═════════════════════════════════════════════════════════════════════════════════
// Main Page Component
// ═════════════════════════════════════════════════════════════════════════════════
const EasingCurves = () => {
    useFonts();

    return (
        <div style={{ backgroundColor: brand.cream, color: brand.charcoal }}>
            <StudyNav currentPage="easing" />

            {/* ─── Hero ───────────────────────────────────────────────── */}
            <section
                className="relative min-h-screen flex flex-col items-center justify-center px-6"
                style={{ borderBottom: `1px solid ${brand.divider}` }}
            >
                <motion.div className="text-center max-w-4xl">
                    <motion.span
                        className="block text-xs tracking-[0.4em] uppercase mb-8"
                        style={{ fontFamily: sans, color: brand.sage }}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Chapter 06 — Design Study
                    </motion.span>

                    <div className="overflow-hidden">
                        <motion.h1
                            className="text-7xl md:text-8xl lg:text-[10rem] font-light tracking-tight leading-[0.9]"
                            style={{ fontFamily: serif, color: brand.charcoal }}
                            initial={{ y: '100%' }}
                            animate={{ y: '0%' }}
                            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
                        >
                            Easing
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
                        className="mt-8 text-base md:text-lg leading-relaxed max-w-lg mx-auto italic"
                        style={{ fontFamily: serif, color: brand.sage }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                    >
                        The soul of animation is in its timing.
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
            <Section
                id="easing-library"
                number="01"
                title="The Easing Library"
                description="A visual catalogue of timing functions. Each curve describes how an animation accelerates over time — the same distance, the same duration, but a completely different feel."
            >
                <EasingLibrary />
            </Section>

            <Section
                id="race-track"
                number="02"
                title="The Race Track"
                description="All eight easings, side by side, racing the same distance in the same time. Watch how each one moves — some sprint early, some build slowly, some overshoot the finish line."
            >
                <RaceTrack />
            </Section>

            <Section
                id="spring-tuning"
                number="03"
                title="Spring Tuning"
                description="Springs have no fixed duration — they simulate real physics. Adjust stiffness and damping to shape how a spring settles. Higher stiffness means faster motion; lower damping means more bounce."
            >
                <SpringTuning />
            </Section>

            <Section
                id="duration-timing"
                number="04"
                title="Duration & Timing"
                description="The same easing at different speeds tells a completely different story. Too fast feels jarring; too slow feels sluggish. Finding the right duration is as important as choosing the right curve."
            >
                <DurationTiming />
            </Section>

            <Section
                id="when-to-use"
                number="05"
                title="When to Use What"
                description="An editorial guide matching easing types to common interaction patterns. Each pairing is deliberate — the right curve makes the motion feel inevitable."
            >
                <WhenToUseWhat />
            </Section>

            {/* ─── Footer ────────────────────────────────────────────── */}
            <footer className="py-20 px-6 text-center" style={{ borderTop: `1px solid ${brand.divider}` }}>
                <span
                    className="text-xs tracking-[0.3em] uppercase"
                    style={{ fontFamily: sans, color: brand.sage }}
                >
                    Calamigos Ranch — Easing Design Study
                </span>
            </footer>
        </div>
    );
};

export default EasingCurves;
