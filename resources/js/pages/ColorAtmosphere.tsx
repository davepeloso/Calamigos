import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import StudyNav from '@/components/StudyNav';

// ---------------------------------------------------------------------------
// Brand Palette
// ---------------------------------------------------------------------------

const COLORS = {
    grove:      '#2F4A3F',
    groveDark:  '#243A32',
    groveLight: '#3D6152',
    sand:       '#EAE4D8',
    sandDark:   '#D4CBBA',
    cream:      '#F5F2EA',
    creamWarm:  '#FAF7F0',
    sage:       '#7A8F82',
    sageLight:  '#95A89C',
    wood:       '#8A6B4F',
    woodLight:  '#A4845E',
    water:      '#A8C0C8',
    charcoal:   '#2C2C2C',
    divider:    '#DCD6CA',
} as const;

type ColorKey = keyof typeof COLORS;

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'DM Sans', system-ui, sans-serif";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
}

/** Relative luminance (WCAG) */
function luminance(hex: string): number {
    const [r, g, b] = hexToRgb(hex).map(v => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number {
    const l1 = luminance(hex1);
    const l2 = luminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

function isLight(hex: string): boolean {
    return luminance(hex) > 0.4;
}

/** Generate tints (mix with white) or shades (mix with black) */
function generateTints(hex: string, count: number): string[] {
    const [r, g, b] = hexToRgb(hex);
    return Array.from({ length: count }, (_, i) => {
        const t = (i + 1) / (count + 1);
        return rgbToHex(r + (255 - r) * t, g + (255 - g) * t, b + (255 - b) * t);
    });
}

function generateShades(hex: string, count: number): string[] {
    const [r, g, b] = hexToRgb(hex);
    return Array.from({ length: count }, (_, i) => {
        const t = (i + 1) / (count + 1);
        return rgbToHex(r * (1 - t), g * (1 - t), b * (1 - t));
    });
}

function mixColors(hex1: string, hex2: string, amount: number): string {
    const [r1, g1, b1] = hexToRgb(hex1);
    const [r2, g2, b2] = hexToRgb(hex2);
    return rgbToHex(
        r1 + (r2 - r1) * amount,
        g1 + (g2 - g1) * amount,
        b1 + (b2 - b1) * amount,
    );
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({
    children,
    bg = COLORS.cream,
    color = COLORS.charcoal,
    className = '',
}: {
    children: React.ReactNode;
    bg?: string;
    color?: string;
    className?: string;
}) {
    return (
        <section className={`relative w-full ${className}`} style={{ backgroundColor: bg, color }}>
            {children}
        </section>
    );
}

function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`max-w-7xl mx-auto px-6 md:px-12 lg:px-20 ${className}`}>{children}</div>;
}

function ChapterLabel({ number, title }: { number: string; title: string }) {
    return (
        <motion.div
            className="flex items-baseline gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
        >
            <span
                className="text-xs tracking-[0.3em] uppercase opacity-40"
                style={{ fontFamily: BODY }}
            >
                {number}
            </span>
            <span className="h-[1px] w-12 bg-current opacity-20" />
            <span
                className="text-xs tracking-[0.3em] uppercase opacity-40"
                style={{ fontFamily: BODY }}
            >
                {title}
            </span>
        </motion.div>
    );
}

// ---------------------------------------------------------------------------
// 00  Hero
// ---------------------------------------------------------------------------

function Hero() {
    return (
        <Section bg={COLORS.cream} className="min-h-screen flex items-center justify-center overflow-hidden">
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(180deg, ${COLORS.creamWarm} 0%, ${COLORS.cream} 40%, ${COLORS.sand} 100%)`,
                }}
            />
            <div className="relative z-10 text-center px-6">
                <motion.h1
                    className="font-light tracking-tight leading-[0.85]"
                    style={{
                        fontFamily: DISPLAY,
                        fontSize: 'clamp(4rem, 15vw, 14rem)',
                        color: COLORS.grove,
                    }}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    Atmosphere
                </motion.h1>
                <motion.p
                    className="mt-8 text-lg md:text-xl tracking-wide max-w-xl mx-auto"
                    style={{ fontFamily: BODY, color: COLORS.sage }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    Color tells a story before a single word is read.
                </motion.p>
                <motion.div
                    className="mt-16 w-[1px] h-24 mx-auto"
                    style={{ backgroundColor: COLORS.divider }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
                />
            </div>
        </Section>
    );
}

// ---------------------------------------------------------------------------
// 01  The Palette
// ---------------------------------------------------------------------------

const PALETTE_ENTRIES: { key: ColorKey; name: string; descriptor: string }[] = [
    { key: 'grove',    name: 'Grove',    descriptor: 'Ancient Canopy' },
    { key: 'sand',     name: 'Sand',     descriptor: 'Canyon Floor' },
    { key: 'cream',    name: 'Cream',    descriptor: 'Morning Light' },
    { key: 'sage',     name: 'Sage',     descriptor: 'Meadow Haze' },
    { key: 'wood',     name: 'Wood',     descriptor: 'Weathered Oak' },
    { key: 'water',    name: 'Water',    descriptor: 'Mountain Stream' },
    { key: 'charcoal', name: 'Charcoal', descriptor: 'Twilight' },
];

function PaletteSection() {
    return (
        <Section bg={COLORS.creamWarm} className="py-32">
            <Container>
                <ChapterLabel number="01" title="The Palette" />
                <motion.h2
                    className="text-4xl md:text-6xl font-light mb-4"
                    style={{ fontFamily: DISPLAY, color: COLORS.grove }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Seven voices, one story
                </motion.h2>
                <motion.p
                    className="text-base md:text-lg mb-20 max-w-2xl opacity-60"
                    style={{ fontFamily: BODY }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.6 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Each color drawn from the natural landscape of Calamigos Ranch — canopy greens, canyon earth, and the soft light that filters through it all.
                </motion.p>
            </Container>

            {/* Full-bleed swatches */}
            <div className="space-y-0">
                {PALETTE_ENTRIES.map((entry, i) => {
                    const hex = COLORS[entry.key];
                    const textColor = isLight(hex) ? COLORS.charcoal : COLORS.cream;
                    return (
                        <motion.div
                            key={entry.key}
                            className="relative w-full flex items-center justify-between px-6 md:px-20"
                            style={{
                                backgroundColor: hex,
                                color: textColor,
                                minHeight: '200px',
                            }}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {/* Left: name + descriptor */}
                            <div>
                                <h3
                                    className="text-3xl md:text-5xl font-light mb-2"
                                    style={{ fontFamily: DISPLAY }}
                                >
                                    {entry.name}
                                </h3>
                                <p
                                    className="text-xs tracking-[0.25em] uppercase opacity-60"
                                    style={{ fontFamily: BODY }}
                                >
                                    {entry.descriptor}
                                </p>
                            </div>

                            {/* Right: hex + sample text */}
                            <div className="text-right">
                                <p
                                    className="text-sm tracking-[0.15em] uppercase mb-3 opacity-70"
                                    style={{ fontFamily: BODY }}
                                >
                                    {hex}
                                </p>
                                <p
                                    className="text-base md:text-lg"
                                    style={{ fontFamily: DISPLAY }}
                                >
                                    Aa Bb Cc
                                </p>
                                <p
                                    className="text-xs mt-1 opacity-50"
                                    style={{ fontFamily: BODY }}
                                >
                                    The quick brown fox jumps over the lazy dog
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </Section>
    );
}

// ---------------------------------------------------------------------------
// 02  Color Relationships
// ---------------------------------------------------------------------------

const PAIRINGS: { bg: ColorKey; fg: ColorKey; label: string }[] = [
    { bg: 'grove',    fg: 'cream',    label: 'Grove on Cream' },
    { bg: 'cream',    fg: 'charcoal', label: 'Charcoal on Cream' },
    { bg: 'sand',     fg: 'grove',    label: 'Grove on Sand' },
    { bg: 'groveDark',fg: 'sand',     label: 'Sand on Grove Dark' },
    { bg: 'wood',     fg: 'cream',    label: 'Cream on Wood' },
    { bg: 'water',    fg: 'charcoal', label: 'Charcoal on Water' },
];

function PairingCard({
    pairing,
    index,
}: {
    pairing: (typeof PAIRINGS)[number];
    index: number;
}) {
    const [expanded, setExpanded] = useState(false);
    const bgHex = COLORS[pairing.bg];
    const fgHex = COLORS[pairing.fg];
    const ratio = contrastRatio(bgHex, fgHex);

    return (
        <motion.div
            className="relative cursor-pointer overflow-hidden rounded-xl"
            style={{ backgroundColor: bgHex, color: fgHex }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <motion.div
                className="p-8 md:p-10"
                animate={{ height: expanded ? 360 : 220 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                <div className="flex items-start justify-between mb-6">
                    <span
                        className="text-xs tracking-[0.2em] uppercase opacity-60"
                        style={{ fontFamily: BODY }}
                    >
                        {pairing.label}
                    </span>
                    <span
                        className="text-xs tracking-[0.15em] px-3 py-1 rounded-full border border-current opacity-50"
                        style={{ fontFamily: BODY }}
                    >
                        {ratio.toFixed(1)}:1
                    </span>
                </div>

                <h3
                    className="text-2xl md:text-3xl font-light mb-3"
                    style={{ fontFamily: DISPLAY }}
                >
                    Experience the Extraordinary
                </h3>
                <p
                    className="text-sm leading-relaxed opacity-70 max-w-sm"
                    style={{ fontFamily: BODY }}
                >
                    Nestled in the Santa Monica Mountains, Calamigos Ranch offers an escape into nature.
                </p>

                {/* Expanded mock layout */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            className="mt-8 space-y-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="h-[1px] w-full opacity-20 bg-current" />
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-10 h-10 rounded-full border border-current flex items-center justify-center text-xs"
                                    style={{ fontFamily: BODY }}
                                >
                                    CR
                                </div>
                                <div>
                                    <p className="text-sm font-medium" style={{ fontFamily: BODY }}>Calamigos Ranch</p>
                                    <p className="text-xs opacity-50" style={{ fontFamily: BODY }}>Malibu, California</p>
                                </div>
                            </div>
                            <div
                                className="inline-block px-6 py-2.5 rounded-full text-xs tracking-[0.15em] uppercase border border-current opacity-70"
                                style={{ fontFamily: BODY }}
                            >
                                Reserve Your Date
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}

function RelationshipsSection() {
    return (
        <Section bg={COLORS.cream} className="py-32">
            <Container>
                <ChapterLabel number="02" title="Color Relationships" />
                <motion.h2
                    className="text-4xl md:text-6xl font-light mb-20"
                    style={{ fontFamily: DISPLAY, color: COLORS.grove }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Harmony in contrast
                </motion.h2>
            </Container>
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PAIRINGS.map((p, i) => (
                        <PairingCard key={p.label} pairing={p} index={i} />
                    ))}
                </div>
            </Container>
        </Section>
    );
}

// ---------------------------------------------------------------------------
// 03  Mood Gradients
// ---------------------------------------------------------------------------

const GRADIENTS: { name: string; stops: string[]; textColor: string }[] = [
    { name: 'Dawn',         stops: [COLORS.creamWarm, COLORS.sand, COLORS.sageLight], textColor: COLORS.grove },
    { name: 'Canopy',       stops: [COLORS.groveDark, COLORS.grove, COLORS.groveLight], textColor: COLORS.cream },
    { name: 'Golden Hour',  stops: [COLORS.wood, COLORS.sand, COLORS.cream], textColor: COLORS.grove },
    { name: 'Dusk',         stops: [COLORS.charcoal, COLORS.groveDark, COLORS.grove], textColor: COLORS.sand },
    { name: 'Morning Mist', stops: [COLORS.cream, COLORS.water, COLORS.sage], textColor: COLORS.charcoal },
    { name: 'Earth',        stops: [COLORS.wood, COLORS.sandDark, COLORS.grove], textColor: COLORS.cream },
    { name: 'Shoreline',    stops: [COLORS.sand, COLORS.water, COLORS.sage], textColor: COLORS.charcoal },
    { name: 'Ember',        stops: [COLORS.charcoal, COLORS.wood, COLORS.woodLight], textColor: COLORS.cream },
];

function GradientStrip({ gradient, index }: { gradient: (typeof GRADIENTS)[number]; index: number }) {
    const [hovered, setHovered] = useState(false);
    const css = `linear-gradient(90deg, ${gradient.stops.join(', ')})`;

    return (
        <motion.div
            className="relative w-full cursor-pointer overflow-hidden"
            style={{ height: 200, background: css, color: gradient.textColor }}
            initial={{ opacity: 0, scaleX: 0.9 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.h3
                    className="text-3xl md:text-5xl font-light"
                    style={{ fontFamily: DISPLAY }}
                    animate={{ opacity: hovered ? 0.4 : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {gradient.name}
                </motion.h3>
            </div>

            {/* Color stops overlay */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        className="absolute inset-0 flex items-end justify-center gap-6 pb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25 }}
                    >
                        {gradient.stops.map((stop, si) => (
                            <div key={si} className="flex items-center gap-2">
                                <div
                                    className="w-5 h-5 rounded-full border border-white/30"
                                    style={{ backgroundColor: stop }}
                                />
                                <span
                                    className="text-xs tracking-[0.1em] uppercase"
                                    style={{ fontFamily: BODY }}
                                >
                                    {stop}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function GradientsSection() {
    return (
        <Section bg={COLORS.charcoal} color={COLORS.cream} className="py-32">
            <Container className="mb-20">
                <ChapterLabel number="03" title="Mood Gradients" />
                <motion.h2
                    className="text-4xl md:text-6xl font-light"
                    style={{ fontFamily: DISPLAY }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Gradients of feeling
                </motion.h2>
            </Container>
            <div className="space-y-1">
                {GRADIENTS.map((g, i) => (
                    <GradientStrip key={g.name} gradient={g} index={i} />
                ))}
            </div>
        </Section>
    );
}

// ---------------------------------------------------------------------------
// 04  In Context
// ---------------------------------------------------------------------------

interface MockCardProps {
    modeName: string;
    bg: string;
    text: string;
    accent: string;
    index: number;
}

function MockEventCard({ modeName, bg, text, accent, index }: MockCardProps) {
    return (
        <motion.div
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: bg, color: text }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.15 }}
        >
            {/* Decorative gradient bar */}
            <div className="h-1.5" style={{ backgroundColor: accent }} />

            <div className="p-8 md:p-10">
                <span
                    className="text-xs tracking-[0.25em] uppercase mb-6 block opacity-50"
                    style={{ fontFamily: BODY }}
                >
                    {modeName}
                </span>

                <h4
                    className="text-2xl md:text-3xl font-light mb-2"
                    style={{ fontFamily: DISPLAY }}
                >
                    Midsummer Evening Soiree
                </h4>
                <p
                    className="text-sm mb-1 opacity-60"
                    style={{ fontFamily: BODY }}
                >
                    June 21, 2026 / 6:00 PM
                </p>
                <p
                    className="text-sm leading-relaxed opacity-60 mt-4 max-w-sm"
                    style={{ fontFamily: BODY }}
                >
                    An enchanted evening beneath the oak canopy. Live music, artisan cocktails, and farm-to-table dining under the stars.
                </p>

                <div className="mt-8 flex items-center gap-4">
                    <div
                        className="px-6 py-3 rounded-full text-xs tracking-[0.15em] uppercase"
                        style={{ backgroundColor: accent, color: bg, fontFamily: BODY }}
                    >
                        Reserve
                    </div>
                    <span
                        className="text-xs tracking-[0.15em] underline underline-offset-4 opacity-60 cursor-pointer"
                        style={{ fontFamily: BODY }}
                    >
                        View Details
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

function MockSectionHeader({ bg, text, accent }: { bg: string; text: string; accent: string }) {
    return (
        <motion.div
            className="rounded-xl p-8 md:p-12"
            style={{ backgroundColor: bg, color: text }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
        >
            <span
                className="text-xs tracking-[0.3em] uppercase opacity-40 block mb-4"
                style={{ fontFamily: BODY, color: accent }}
            >
                Section Header
            </span>
            <h3 className="text-3xl md:text-4xl font-light mb-2" style={{ fontFamily: DISPLAY }}>
                Gather Under the Oaks
            </h3>
            <div className="h-[1px] w-16 mt-4" style={{ backgroundColor: accent, opacity: 0.4 }} />
        </motion.div>
    );
}

function MockNavBar({ bg, text, accent, label }: { bg: string; text: string; accent: string; label: string }) {
    return (
        <motion.div
            className="rounded-xl px-8 py-5 flex items-center justify-between"
            style={{ backgroundColor: bg, color: text }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <span className="text-lg font-light" style={{ fontFamily: DISPLAY }}>
                Calamigos
            </span>
            <div className="flex items-center gap-8">
                {['Events', 'Venue', 'Gallery', 'Contact'].map(item => (
                    <span
                        key={item}
                        className="text-xs tracking-[0.15em] uppercase opacity-60 hover:opacity-100 transition-opacity cursor-pointer hidden md:inline"
                        style={{ fontFamily: BODY }}
                    >
                        {item}
                    </span>
                ))}
                <span
                    className="px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase"
                    style={{ backgroundColor: accent, color: bg, fontFamily: BODY }}
                >
                    Book
                </span>
            </div>
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-30 absolute -bottom-6 left-1/2 -translate-x-1/2" style={{ fontFamily: BODY }}>
                {label}
            </span>
        </motion.div>
    );
}

function InContextSection() {
    return (
        <Section bg={COLORS.sand} className="py-32">
            <Container>
                <ChapterLabel number="04" title="In Context" />
                <motion.h2
                    className="text-4xl md:text-6xl font-light mb-6"
                    style={{ fontFamily: DISPLAY, color: COLORS.grove }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Palette in practice
                </motion.h2>
                <motion.p
                    className="text-base md:text-lg mb-20 max-w-2xl opacity-60"
                    style={{ fontFamily: BODY, color: COLORS.charcoal }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.6 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    The same palette shifts mood entirely based on which colors take the lead.
                </motion.p>

                {/* Event Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <MockEventCard modeName="Light Mode" bg={COLORS.cream} text={COLORS.grove} accent={COLORS.wood} index={0} />
                    <MockEventCard modeName="Dark Mode" bg={COLORS.groveDark} text={COLORS.cream} accent={COLORS.sage} index={1} />
                    <MockEventCard modeName="Warm Mode" bg={COLORS.sand} text={COLORS.charcoal} accent={COLORS.wood} index={2} />
                </div>

                {/* Section Headers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <MockSectionHeader bg={COLORS.cream} text={COLORS.grove} accent={COLORS.wood} />
                    <MockSectionHeader bg={COLORS.grove} text={COLORS.cream} accent={COLORS.sageLight} />
                </div>

                {/* Navigation Bars */}
                <div className="space-y-10">
                    <div className="relative">
                        <MockNavBar bg={COLORS.creamWarm} text={COLORS.grove} accent={COLORS.grove} label="Light Variant" />
                    </div>
                    <div className="relative">
                        <MockNavBar bg={COLORS.groveDark} text={COLORS.cream} accent={COLORS.sageLight} label="Dark Variant" />
                    </div>
                </div>
            </Container>
        </Section>
    );
}

// ---------------------------------------------------------------------------
// 05  Color Theory Notes
// ---------------------------------------------------------------------------

const THEORY_NOTES: { title: string; body: string; pullQuote?: string }[] = [
    {
        title: 'Why Natural Tones for an Event Space',
        body: 'Calamigos Ranch exists at the intersection of nature and celebration. The palette draws directly from its surroundings: the deep greens of century-old oaks, the warm sand of canyon trails, the cool blue-green of mountain streams. Natural tones signal authenticity and timelessness, qualities that resonate deeply when people gather to mark meaningful occasions.',
        pullQuote: 'Color should feel like it belongs to the land, not applied to it.',
    },
    {
        title: 'Warm vs Cool Balance',
        body: 'The palette maintains a careful equilibrium. Warm tones (sand, wood, cream) evoke intimacy and welcome, while cool tones (grove, water, sage) create a sense of calm and sophistication. Neither dominates. This balance ensures the brand can flex between celebratory warmth and editorial restraint depending on context.',
    },
    {
        title: 'The Role of Neutrals in Luxury Branding',
        body: 'Cream, sand, and charcoal do the quiet work. They provide breathing room for bolder colors to resonate. In luxury contexts, whitespace and neutral tones signal confidence. A brand that does not need to shout. The neutrals here are never sterile; they carry warmth, referencing natural materials like linen, stone, and aged paper.',
        pullQuote: 'Luxury whispers. Neutrals give it room to be heard.',
    },
    {
        title: 'How Color Creates Emotional Response',
        body: 'Color is processed before language. A visitor seeing grove green paired with cream experiences calm authority before reading a single word. The wood and sand tones trigger associations with organic craft and earthen warmth. These are not arbitrary choices; they are carefully calibrated emotional signals that align with the ranch experience: grounded, welcoming, and quietly extraordinary.',
    },
];

function TheorySection() {
    return (
        <Section bg={COLORS.grove} color={COLORS.cream} className="py-32">
            <Container>
                <ChapterLabel number="05" title="Color Theory Notes" />
                <motion.h2
                    className="text-4xl md:text-6xl font-light mb-24"
                    style={{ fontFamily: DISPLAY }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Why these colors
                </motion.h2>

                <div className="space-y-24">
                    {THEORY_NOTES.map((note, i) => (
                        <motion.div
                            key={i}
                            className="grid grid-cols-1 md:grid-cols-12 gap-8"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="md:col-span-4">
                                <h3
                                    className="text-xl md:text-2xl font-light mb-4"
                                    style={{ fontFamily: DISPLAY }}
                                >
                                    {note.title}
                                </h3>
                            </div>
                            <div className="md:col-span-8 space-y-6">
                                <p
                                    className="text-sm md:text-base leading-relaxed opacity-70"
                                    style={{ fontFamily: BODY }}
                                >
                                    {note.body}
                                </p>
                                {note.pullQuote && (
                                    <motion.blockquote
                                        className="border-l-2 pl-6 py-2"
                                        style={{
                                            borderColor: COLORS.sageLight,
                                            fontFamily: DISPLAY,
                                            fontStyle: 'italic',
                                        }}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                    >
                                        <p className="text-xl md:text-2xl font-light leading-relaxed" style={{ color: COLORS.sageLight }}>
                                            {note.pullQuote}
                                        </p>
                                    </motion.blockquote>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}

// ---------------------------------------------------------------------------
// 06  Interactive Tint Generator
// ---------------------------------------------------------------------------

const BASE_COLORS: { key: ColorKey; label: string }[] = [
    { key: 'grove',    label: 'Grove' },
    { key: 'sand',     label: 'Sand' },
    { key: 'sage',     label: 'Sage' },
    { key: 'wood',     label: 'Wood' },
    { key: 'water',    label: 'Water' },
    { key: 'charcoal', label: 'Charcoal' },
];

const MIX_TARGETS: ColorKey[] = ['grove', 'sand', 'sage', 'wood', 'water', 'charcoal'];
const MIX_PERCENTAGES = [20, 40, 60, 80];

function TintGeneratorSection() {
    const [selected, setSelected] = useState<ColorKey>('grove');
    const baseHex = COLORS[selected];

    const tints = useMemo(() => generateTints(baseHex, 5), [baseHex]);
    const shades = useMemo(() => generateShades(baseHex, 5), [baseHex]);

    const mixes = useMemo(() => {
        return MIX_TARGETS.filter(k => k !== selected).map(targetKey => ({
            targetKey,
            targetLabel: BASE_COLORS.find(b => b.key === targetKey)?.label ?? targetKey,
            values: MIX_PERCENTAGES.map(pct => ({
                pct,
                hex: mixColors(baseHex, COLORS[targetKey], pct / 100),
            })),
        }));
    }, [baseHex, selected]);

    return (
        <Section bg={COLORS.creamWarm} className="py-32">
            <Container>
                <ChapterLabel number="06" title="Tint Generator" />
                <motion.h2
                    className="text-4xl md:text-6xl font-light mb-6"
                    style={{ fontFamily: DISPLAY, color: COLORS.grove }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    Explore the spectrum
                </motion.h2>
                <motion.p
                    className="text-base md:text-lg mb-16 max-w-2xl opacity-60"
                    style={{ fontFamily: BODY, color: COLORS.charcoal }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.6 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Select a base color to generate its tints, shades, and mixes with every other brand color.
                </motion.p>

                {/* Color selector */}
                <div className="flex flex-wrap gap-3 mb-16">
                    {BASE_COLORS.map(c => {
                        const active = selected === c.key;
                        return (
                            <button
                                key={c.key}
                                onClick={() => setSelected(c.key)}
                                className="flex items-center gap-3 px-5 py-3 rounded-full transition-all"
                                style={{
                                    backgroundColor: active ? COLORS[c.key] : 'transparent',
                                    color: active ? (isLight(COLORS[c.key]) ? COLORS.charcoal : COLORS.cream) : COLORS.charcoal,
                                    border: `1.5px solid ${COLORS[c.key]}`,
                                    fontFamily: BODY,
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase' as const,
                                }}
                            >
                                <span
                                    className="w-3.5 h-3.5 rounded-full shrink-0"
                                    style={{ backgroundColor: COLORS[c.key] }}
                                />
                                {c.label}
                            </button>
                        );
                    })}
                </div>

                {/* Base swatch */}
                <motion.div
                    key={selected}
                    className="mb-12 rounded-xl overflow-hidden"
                    style={{ backgroundColor: baseHex, height: 120 }}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="h-full flex items-center justify-between px-8" style={{ color: isLight(baseHex) ? COLORS.charcoal : COLORS.cream }}>
                        <span className="text-2xl font-light" style={{ fontFamily: DISPLAY }}>
                            {BASE_COLORS.find(b => b.key === selected)?.label}
                        </span>
                        <span className="text-sm tracking-[0.15em] uppercase" style={{ fontFamily: BODY }}>
                            {baseHex}
                        </span>
                    </div>
                </motion.div>

                {/* Tints + Shades */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {/* Tints */}
                    <div>
                        <p className="text-xs tracking-[0.25em] uppercase opacity-40 mb-4" style={{ fontFamily: BODY, color: COLORS.charcoal }}>
                            Tints (lighter)
                        </p>
                        <div className="space-y-1">
                            {tints.map((hex, i) => (
                                <motion.div
                                    key={`${selected}-tint-${i}`}
                                    className="rounded-lg overflow-hidden"
                                    style={{ backgroundColor: hex, height: 52 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                >
                                    <div
                                        className="h-full flex items-center justify-between px-6"
                                        style={{ color: isLight(hex) ? COLORS.charcoal : COLORS.cream }}
                                    >
                                        <span className="text-xs opacity-60" style={{ fontFamily: BODY }}>
                                            +{Math.round(((i + 1) / 6) * 100)}%
                                        </span>
                                        <span className="text-xs tracking-[0.1em]" style={{ fontFamily: BODY }}>
                                            {hex}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Shades */}
                    <div>
                        <p className="text-xs tracking-[0.25em] uppercase opacity-40 mb-4" style={{ fontFamily: BODY, color: COLORS.charcoal }}>
                            Shades (darker)
                        </p>
                        <div className="space-y-1">
                            {shades.map((hex, i) => (
                                <motion.div
                                    key={`${selected}-shade-${i}`}
                                    className="rounded-lg overflow-hidden"
                                    style={{ backgroundColor: hex, height: 52 }}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                >
                                    <div
                                        className="h-full flex items-center justify-between px-6"
                                        style={{ color: isLight(hex) ? COLORS.charcoal : COLORS.cream }}
                                    >
                                        <span className="text-xs opacity-60" style={{ fontFamily: BODY }}>
                                            -{Math.round(((i + 1) / 6) * 100)}%
                                        </span>
                                        <span className="text-xs tracking-[0.1em]" style={{ fontFamily: BODY }}>
                                            {hex}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Color Mixes */}
                <p className="text-xs tracking-[0.25em] uppercase opacity-40 mb-6" style={{ fontFamily: BODY, color: COLORS.charcoal }}>
                    Mixed with other brand colors
                </p>
                <div className="space-y-6">
                    {mixes.map(mix => (
                        <motion.div
                            key={`${selected}-mix-${mix.targetKey}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[mix.targetKey] }}
                                />
                                <span className="text-xs tracking-[0.15em] uppercase opacity-60" style={{ fontFamily: BODY, color: COLORS.charcoal }}>
                                    {mix.targetLabel}
                                </span>
                            </div>
                            <div className="flex gap-1 rounded-lg overflow-hidden">
                                {/* Source swatch */}
                                <div
                                    className="flex-1 h-14 flex items-center justify-center"
                                    style={{ backgroundColor: baseHex, color: isLight(baseHex) ? COLORS.charcoal : COLORS.cream }}
                                >
                                    <span className="text-[10px] tracking-wider" style={{ fontFamily: BODY }}>Base</span>
                                </div>
                                {mix.values.map(v => (
                                    <div
                                        key={v.pct}
                                        className="flex-1 h-14 flex items-center justify-center"
                                        style={{ backgroundColor: v.hex, color: isLight(v.hex) ? COLORS.charcoal : COLORS.cream }}
                                    >
                                        <span className="text-[10px] tracking-wider" style={{ fontFamily: BODY }}>
                                            {v.pct}%
                                        </span>
                                    </div>
                                ))}
                                {/* Target swatch */}
                                <div
                                    className="flex-1 h-14 flex items-center justify-center"
                                    style={{ backgroundColor: COLORS[mix.targetKey], color: isLight(COLORS[mix.targetKey]) ? COLORS.charcoal : COLORS.cream }}
                                >
                                    <span className="text-[10px] tracking-wider" style={{ fontFamily: BODY }}>Target</span>
                                </div>
                            </div>
                            <div className="flex gap-1 mt-1">
                                <div className="flex-1 text-center">
                                    <span className="text-[9px] opacity-40" style={{ fontFamily: BODY }}>{baseHex}</span>
                                </div>
                                {mix.values.map(v => (
                                    <div key={v.pct} className="flex-1 text-center">
                                        <span className="text-[9px] opacity-40" style={{ fontFamily: BODY }}>{v.hex}</span>
                                    </div>
                                ))}
                                <div className="flex-1 text-center">
                                    <span className="text-[9px] opacity-40" style={{ fontFamily: BODY }}>{COLORS[mix.targetKey]}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ColorAtmosphere() {
    useEffect(() => {
        const id = 'color-atmosphere-fonts';
        if (!document.getElementById(id)) {
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href =
                'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap';
            document.head.appendChild(link);
        }
    }, []);

    return (
        <div
            className="min-h-screen w-full"
            style={{
                fontFamily: BODY,
                color: COLORS.charcoal,
                backgroundColor: COLORS.cream,
            }}
        >
            <StudyNav currentPage="color" />
            <Hero />
            <PaletteSection />
            <RelationshipsSection />
            <GradientsSection />
            <InContextSection />
            <TheorySection />
            <TintGeneratorSection />

            {/* Footer */}
            <Section bg={COLORS.groveDark} color={COLORS.sage} className="py-20">
                <Container>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-xs tracking-[0.25em] uppercase opacity-40" style={{ fontFamily: BODY }}>
                            Calamigos Ranch -- Color Atmosphere Study
                        </p>
                        <p
                            className="text-lg font-light opacity-40"
                            style={{ fontFamily: DISPLAY }}
                        >
                            07
                        </p>
                    </div>
                </Container>
            </Section>
        </div>
    );
}
