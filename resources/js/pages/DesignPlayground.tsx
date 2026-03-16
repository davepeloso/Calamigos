import { motion, useScroll, useTransform } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import StudyNav from '@/components/StudyNav';

// Brand tokens
const brand = {
    grove: '#2F4A3F',
    sand: '#EAE4D8',
    cream: '#F5F2EA',
    sage: '#7A8F82',
    wood: '#8A6B4F',
    charcoal: '#2C2C2C',
    divider: '#DCD6CA',
    groveDark: '#243A32',
    groveLight: '#3D6152',
    water: '#A8C0C8',
};

const font = {
    display: "'Cormorant Garamond', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
};

// Shared animation presets
const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.8 },
};

// ─── Section Header ────────────────────────────────────────
const SectionHeader = ({ chapter, title, description }: { chapter: string; title: string; description: string }) => (
    <motion.div className="mb-16" {...fadeUp}>
        <div className="flex items-center gap-4 mb-6">
            <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: font.body, color: brand.sage }}
            >
                {chapter}
            </span>
            <div className="flex-1 h-[1px]" style={{ backgroundColor: brand.divider }} />
        </div>
        <h2
            className="text-4xl md:text-5xl font-light mb-4"
            style={{ fontFamily: font.display, color: brand.charcoal }}
        >
            {title}
        </h2>
        <p
            className="text-base max-w-xl"
            style={{ fontFamily: font.body, color: brand.sage }}
        >
            {description}
        </p>
    </motion.div>
);

// ─── Component Label ───────────────────────────────────────
const ComponentLabel = ({ label }: { label: string }) => (
    <div className="mb-6">
        <span
            className="text-[11px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full"
            style={{
                fontFamily: font.body,
                color: brand.grove,
                backgroundColor: `${brand.sage}18`,
                border: `1px solid ${brand.divider}`,
            }}
        >
            {label}
        </span>
    </div>
);

// ─── Decorative Pattern SVG ────────────────────────────────
const BotanicalPattern = ({ color = brand.sage, opacity = 0.15 }: { color?: string; opacity?: number }) => (
    <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        style={{ opacity }}
    >
        <defs>
            <pattern id="leaves" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path
                    d="M25 5 Q30 15 25 25 Q20 15 25 5Z"
                    fill="none"
                    stroke={color}
                    strokeWidth="0.5"
                />
                <path
                    d="M10 30 Q15 40 10 50 Q5 40 10 30Z"
                    fill="none"
                    stroke={color}
                    strokeWidth="0.5"
                />
                <path
                    d="M40 35 Q45 45 40 55 Q35 45 40 35Z"
                    fill="none"
                    stroke={color}
                    strokeWidth="0.5"
                />
            </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#leaves)" />
    </svg>
);

// ═══════════════════════════════════════════════════════════
// HERO VARIANTS
// ═══════════════════════════════════════════════════════════

const HeroACinematic = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });
    const lineWidth = useTransform(scrollYProgress, [0, 0.5], ['0%', '60%']);

    return (
        <div ref={ref} className="relative w-full overflow-hidden" style={{ height: '70vh', backgroundColor: brand.grove }}>
            {/* Ambient gradient overlays */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse at 30% 40%, ${brand.groveLight}40 0%, transparent 60%),
                                 radial-gradient(ellipse at 70% 60%, ${brand.groveDark}80 0%, transparent 50%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
                <motion.span
                    className="text-xs tracking-[0.4em] uppercase mb-8"
                    style={{ fontFamily: font.body, color: brand.sage }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Est. 1937 &mdash; Malibu, California
                </motion.span>

                <motion.h1
                    className="text-6xl md:text-8xl lg:text-9xl font-light leading-[0.9] mb-6"
                    style={{ fontFamily: font.display, color: brand.cream }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    Calamigos
                    <br />
                    Ranch
                </motion.h1>

                <motion.p
                    className="text-lg tracking-[0.15em] mb-12"
                    style={{ fontFamily: font.body, color: brand.sage }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    Where Nature Hosts
                </motion.p>

                {/* Animated line */}
                <motion.div
                    className="h-[1px]"
                    style={{ width: lineWidth, backgroundColor: brand.sage }}
                />

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-10 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                >
                    <span
                        className="text-[10px] tracking-[0.3em] uppercase"
                        style={{ fontFamily: font.body, color: brand.sage }}
                    >
                        Scroll
                    </span>
                    <motion.div
                        className="w-[1px] h-8"
                        style={{ backgroundColor: brand.sage }}
                        animate={{ scaleY: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.div>
            </div>
        </div>
    );
};

const HeroBSplit = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2" style={{ minHeight: '60vh' }}>
        {/* Left — Image placeholder with pattern */}
        <motion.div
            className="relative overflow-hidden"
            style={{ backgroundColor: brand.grove, minHeight: '40vh' }}
            {...fadeIn}
        >
            <BotanicalPattern color={brand.cream} opacity={0.08} />
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(135deg, ${brand.groveDark} 0%, ${brand.grove} 50%, ${brand.groveLight}60 100%)`,
                }}
            />
            {/* Decorative frame lines */}
            <div className="absolute inset-8 border" style={{ borderColor: `${brand.sage}25` }} />
            <div className="absolute bottom-12 left-12">
                <span
                    className="text-[10px] tracking-[0.3em] uppercase"
                    style={{ fontFamily: font.body, color: brand.sage }}
                >
                    Photography placeholder
                </span>
            </div>
        </motion.div>

        {/* Right — Text content */}
        <motion.div
            className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16"
            style={{ backgroundColor: brand.cream }}
            {...fadeUp}
        >
            <span
                className="text-[10px] tracking-[0.4em] uppercase mb-6"
                style={{ fontFamily: font.body, color: brand.sage }}
            >
                Private Estate
            </span>
            <h2
                className="text-5xl md:text-6xl font-light leading-[1.05] mb-4"
                style={{ fontFamily: font.display, color: brand.charcoal }}
            >
                Calamigos
                <br />
                Ranch
            </h2>
            <p
                className="text-base leading-relaxed mb-8 max-w-sm"
                style={{ fontFamily: font.body, color: brand.sage }}
            >
                Fifty acres of ancient oaks and rolling meadows, where the Santa Monica
                Mountains meet the Pacific breeze.
            </p>
            <div>
                <motion.button
                    className="px-8 py-3.5 text-sm tracking-[0.15em] uppercase transition-colors"
                    style={{
                        fontFamily: font.body,
                        backgroundColor: brand.grove,
                        color: brand.cream,
                    }}
                    whileHover={{ backgroundColor: brand.groveDark }}
                    whileTap={{ scale: 0.98 }}
                >
                    Discover Spaces
                </motion.button>
            </div>
        </motion.div>
    </div>
);

const HeroCMinimal = () => (
    <div
        className="w-full flex flex-col items-center justify-center py-32 px-8"
        style={{ backgroundColor: brand.cream, minHeight: '50vh' }}
    >
        <motion.h2
            className="text-7xl md:text-8xl lg:text-[10rem] font-extralight leading-[0.85] text-center mb-8"
            style={{ fontFamily: font.display, color: brand.charcoal }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            Calamigos
        </motion.h2>

        <motion.div
            className="w-24 h-[1px] mb-10"
            style={{ backgroundColor: brand.divider }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
        />

        <motion.button
            className="px-10 py-3 text-xs tracking-[0.2em] uppercase"
            style={{
                fontFamily: font.body,
                backgroundColor: brand.grove,
                color: brand.cream,
            }}
            whileHover={{ backgroundColor: brand.groveDark }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            Begin your visit
        </motion.button>
    </div>
);

// ═══════════════════════════════════════════════════════════
// VENUE CARDS
// ═══════════════════════════════════════════════════════════

const venueData = [
    { name: 'The Oak Room', desc: 'A cathedral of ancient oaks, dappled light filtering through century-old canopies onto stone floors.', capacity: '200 Guests', vibe: 'Romantic' },
    { name: 'Birchwood Hall', desc: 'Open-air pavilion framed by birch groves, with views stretching to the canyon rim.', capacity: '150 Guests', vibe: 'Rustic' },
    { name: 'Lake Pavilion', desc: 'Waterside ceremony space where still waters mirror the surrounding mountains at dusk.', capacity: '120 Guests', vibe: 'Serene' },
];

const CardAEditorial = ({ venue }: { venue: typeof venueData[0] }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="flex flex-col cursor-pointer"
            style={{ maxWidth: 320 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35 }}
            {...fadeUp}
        >
            {/* Tall image area */}
            <div
                className="relative overflow-hidden mb-5"
                style={{ aspectRatio: '3/4', backgroundColor: brand.grove }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(160deg, ${brand.groveLight}50 0%, ${brand.grove} 50%, ${brand.groveDark} 100%)`,
                    }}
                />
                <BotanicalPattern color={brand.cream} opacity={0.06} />
                <motion.div
                    className="absolute inset-4 border"
                    style={{ borderColor: `${brand.sage}20` }}
                    animate={{ borderColor: isHovered ? `${brand.sage}40` : `${brand.sage}20` }}
                />
            </div>

            {/* Text */}
            <h3
                className="text-2xl font-light mb-2"
                style={{ fontFamily: font.display, color: brand.charcoal }}
            >
                {venue.name}
            </h3>
            <p
                className="text-sm leading-relaxed mb-4"
                style={{ fontFamily: font.body, color: brand.sage }}
            >
                {venue.desc}
            </p>

            {/* Explore link with animated underline */}
            <div className="inline-flex items-center gap-2 group">
                <span
                    className="text-xs tracking-[0.15em] uppercase"
                    style={{ fontFamily: font.body, color: brand.grove }}
                >
                    Explore
                </span>
                <motion.div
                    className="h-[1px] origin-left"
                    style={{ backgroundColor: brand.grove }}
                    animate={{ width: isHovered ? 32 : 16 }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </motion.div>
    );
};

const CardBOverlay = ({ venue }: { venue: typeof venueData[0] }) => (
    <motion.div
        className="relative overflow-hidden cursor-pointer group"
        style={{ aspectRatio: '16/10', backgroundColor: brand.grove }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.4 }}
        {...fadeUp}
    >
        {/* Background */}
        <motion.div
            className="absolute inset-0"
            style={{
                background: `linear-gradient(135deg, ${brand.groveLight}60 0%, ${brand.grove} 40%, ${brand.groveDark} 100%)`,
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
        />
        <BotanicalPattern color={brand.cream} opacity={0.05} />

        {/* Bottom gradient overlay */}
        <div
            className="absolute bottom-0 left-0 right-0 h-2/3"
            style={{
                background: `linear-gradient(to top, ${brand.groveDark}ee 0%, transparent 100%)`,
            }}
        />

        {/* Text content */}
        <motion.div
            className="absolute bottom-0 left-0 right-0 p-6"
            initial={{ y: 10 }}
            whileHover={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h3
                className="text-2xl font-light mb-2"
                style={{ fontFamily: font.display, color: brand.cream }}
            >
                {venue.name}
            </h3>
            <div className="flex items-center gap-3 mb-2">
                <span
                    className="text-xs tracking-[0.1em]"
                    style={{ fontFamily: font.body, color: brand.sand }}
                >
                    {venue.capacity}
                </span>
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: brand.sage }} />
                <span
                    className="text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
                    style={{
                        fontFamily: font.body,
                        color: brand.cream,
                        border: `1px solid ${brand.sage}50`,
                    }}
                >
                    {venue.vibe}
                </span>
            </div>
        </motion.div>
    </motion.div>
);

const CardCMinimalList = ({ venue, isLast }: { venue: typeof venueData[0]; isLast: boolean }) => (
    <motion.div
        className="group cursor-pointer transition-colors"
        style={{ backgroundColor: 'transparent' }}
        whileHover={{ backgroundColor: brand.sand }}
        {...fadeUp}
    >
        <div className="flex items-center gap-6 py-5 px-4">
            {/* Small square image */}
            <div
                className="w-16 h-16 shrink-0 relative overflow-hidden"
                style={{ backgroundColor: brand.grove }}
            >
                <BotanicalPattern color={brand.cream} opacity={0.1} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3
                    className="text-xl font-light mb-0.5"
                    style={{ fontFamily: font.display, color: brand.charcoal }}
                >
                    {venue.name}
                </h3>
                <p
                    className="text-xs"
                    style={{ fontFamily: font.body, color: brand.sage }}
                >
                    {venue.capacity} &middot; {venue.vibe}
                </p>
            </div>

            {/* Arrow */}
            <motion.span
                className="text-lg shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: brand.grove }}
            >
                &rarr;
            </motion.span>
        </div>

        {!isLast && (
            <div className="mx-4 h-[1px]" style={{ backgroundColor: brand.divider }} />
        )}
    </motion.div>
);

// ═══════════════════════════════════════════════════════════
// NAVIGATION VARIANTS
// ═══════════════════════════════════════════════════════════

const navLinks = ['Spaces', 'Events', 'Gallery', 'Contact'];

const NavATransparent = () => {
    const [activeLink, setActiveLink] = useState('Spaces');

    return (
        <motion.div
            className="w-full"
            style={{
                backgroundColor: brand.cream,
                borderBottom: `1px solid ${brand.divider}`,
            }}
            {...fadeUp}
        >
            <div className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
                {/* Wordmark */}
                <span
                    className="text-2xl font-light"
                    style={{ fontFamily: font.display, color: brand.charcoal }}
                >
                    Calamigos
                </span>

                {/* Links */}
                <nav className="flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = link === activeLink;
                        return (
                            <button
                                key={link}
                                onClick={() => setActiveLink(link)}
                                className="relative pb-1 transition-colors"
                                style={{
                                    fontFamily: font.body,
                                    fontSize: 13,
                                    letterSpacing: '0.05em',
                                    color: isActive ? brand.grove : brand.sage,
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) (e.target as HTMLElement).style.color = brand.grove;
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) (e.target as HTMLElement).style.color = brand.sage;
                                }}
                            >
                                {link}
                                {isActive && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-[1.5px]"
                                        style={{ backgroundColor: brand.grove }}
                                        layoutId="nav-underline"
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </motion.div>
    );
};

const sideNavItems = [
    { num: '01', label: 'Overview' },
    { num: '02', label: 'Spaces' },
    { num: '03', label: 'Events' },
    { num: '04', label: 'Gallery' },
    { num: '05', label: 'Contact' },
];

const NavBSide = () => {
    const [activeItem, setActiveItem] = useState('02');
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <motion.div
            className="flex overflow-hidden rounded"
            style={{ height: 380, border: `1px solid ${brand.divider}` }}
            {...fadeUp}
        >
            {/* Sidebar */}
            <motion.div
                className="shrink-0 flex flex-col py-6"
                style={{ backgroundColor: brand.grove }}
                animate={{ width: isExpanded ? 220 : 60 }}
                transition={{ duration: 0.3 }}
            >
                {/* Toggle */}
                <button
                    className="mb-8 px-5 self-start"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex flex-col gap-1.5 w-4">
                        <div className="h-[1.5px]" style={{ backgroundColor: brand.sage }} />
                        <div className="h-[1.5px] w-3" style={{ backgroundColor: brand.sage }} />
                    </div>
                </button>

                {/* Nav items */}
                <nav className="flex-1 flex flex-col gap-1">
                    {sideNavItems.map((item) => {
                        const isActive = item.num === activeItem;
                        return (
                            <button
                                key={item.num}
                                onClick={() => setActiveItem(item.num)}
                                className="flex items-center gap-3 px-5 py-2.5 text-left relative transition-colors"
                                style={{
                                    color: isActive ? brand.cream : brand.sage,
                                }}
                            >
                                {isActive && (
                                    <motion.div
                                        className="absolute left-0 top-0 bottom-0 w-[2px]"
                                        style={{ backgroundColor: brand.cream }}
                                        layoutId="side-nav-indicator"
                                        transition={{ duration: 0.25 }}
                                    />
                                )}
                                <span
                                    className="text-[10px] tracking-[0.15em] shrink-0"
                                    style={{ fontFamily: font.body }}
                                >
                                    {item.num}
                                </span>
                                {isExpanded && (
                                    <motion.span
                                        className="text-sm"
                                        style={{ fontFamily: font.body }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom wordmark */}
                {isExpanded && (
                    <div className="px-5 mt-auto">
                        <span
                            className="text-lg font-light"
                            style={{ fontFamily: font.display, color: `${brand.sage}60` }}
                        >
                            Calamigos
                        </span>
                    </div>
                )}
            </motion.div>

            {/* Content area preview */}
            <div className="flex-1 p-8" style={{ backgroundColor: brand.cream }}>
                <span
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ fontFamily: font.body, color: brand.sage }}
                >
                    Content Area
                </span>
                <h3
                    className="text-3xl font-light mt-2"
                    style={{ fontFamily: font.display, color: brand.charcoal }}
                >
                    {sideNavItems.find(i => i.num === activeItem)?.label}
                </h3>
                <div className="mt-6 space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-3 rounded-full" style={{ backgroundColor: brand.divider, width: `${90 - i * 15}%` }} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// ═══════════════════════════════════════════════════════════
// DETAIL COMPONENTS
// ═══════════════════════════════════════════════════════════

const EventDetailBlock = () => (
    <motion.div
        className="p-8 rounded"
        style={{ backgroundColor: 'white', border: `1px solid ${brand.divider}` }}
        {...fadeUp}
    >
        {/* Date */}
        <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: font.body, color: brand.sage }}
        >
            June 21, 2026 &middot; 5:00 PM
        </span>

        {/* Title */}
        <h3
            className="text-3xl font-light mt-3 mb-3"
            style={{ fontFamily: font.display, color: brand.charcoal }}
        >
            Midsummer Garden Soiree
        </h3>

        {/* Description */}
        <p
            className="text-sm leading-relaxed mb-6 max-w-lg"
            style={{ fontFamily: font.body, color: brand.sage }}
        >
            An evening of al fresco dining beneath string lights and heritage oaks.
            Live acoustic music, farm-to-table courses, and hand-selected wines
            from local Malibu vineyards.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
            {['Ceremony', 'Reception', 'Dinner'].map(tag => (
                <span
                    key={tag}
                    className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full"
                    style={{
                        fontFamily: font.body,
                        color: brand.grove,
                        backgroundColor: `${brand.sage}12`,
                        border: `1px solid ${brand.divider}`,
                    }}
                >
                    {tag}
                </span>
            ))}
        </div>

        {/* Reserve button */}
        <motion.button
            className="px-8 py-3 text-xs tracking-[0.15em] uppercase"
            style={{
                fontFamily: font.body,
                backgroundColor: brand.grove,
                color: brand.cream,
            }}
            whileHover={{ backgroundColor: brand.groveDark }}
            whileTap={{ scale: 0.98 }}
        >
            Reserve
        </motion.button>
    </motion.div>
);

const TestimonialQuote = () => (
    <motion.div
        className="relative py-12 px-8 md:px-16 text-center"
        style={{ backgroundColor: brand.cream }}
        {...fadeUp}
    >
        {/* Decorative quotation mark */}
        <span
            className="block text-[120px] leading-none font-light -mb-10"
            style={{ fontFamily: font.display, color: `${brand.sage}30` }}
        >
            &ldquo;
        </span>

        <blockquote
            className="text-2xl md:text-3xl font-light italic leading-relaxed max-w-2xl mx-auto mb-8"
            style={{ fontFamily: font.display, color: brand.charcoal }}
        >
            The moment we drove through those gates, we knew this was the place.
            The oaks, the light, the quiet — it felt less like a venue and more
            like coming home.
        </blockquote>

        <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-[1px] mb-3" style={{ backgroundColor: brand.divider }} />
            <span
                className="text-xs tracking-[0.2em] uppercase"
                style={{ fontFamily: font.body, color: brand.sage }}
            >
                Sarah & James, October 2025
            </span>
        </div>
    </motion.div>
);

const stats = [
    { number: '200', label: 'Guests' },
    { number: '50', label: 'Acres' },
    { number: '1937', label: 'Established' },
    { number: '5', label: 'Venues' },
];

const StatsRow = () => (
    <motion.div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ borderTop: `1px solid ${brand.divider}`, borderBottom: `1px solid ${brand.divider}` }}
        {...fadeUp}
    >
        {stats.map((stat, i) => (
            <motion.div
                key={stat.label}
                className="flex flex-col items-center py-10"
                style={{
                    borderRight: i < stats.length - 1 ? `1px solid ${brand.divider}` : 'none',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
            >
                <span
                    className="text-4xl md:text-5xl font-light mb-1"
                    style={{ fontFamily: font.display, color: brand.charcoal }}
                >
                    {stat.number}
                </span>
                <span
                    className="text-[10px] tracking-[0.25em] uppercase"
                    style={{ fontFamily: font.body, color: brand.sage }}
                >
                    {stat.label}
                </span>
            </motion.div>
        ))}
    </motion.div>
);

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════

const DesignPlayground = () => {
    useEffect(() => {
        const id = 'calamigos-playground-fonts';
        if (!document.getElementById(id)) {
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href =
                'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap';
            document.head.appendChild(link);
        }
    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundColor: brand.cream, color: brand.charcoal }}>
            <StudyNav currentPage="designs" />

            {/* ── Page Hero ─────────────────────────────── */}
            <header className="flex flex-col items-center justify-center pt-32 pb-24 px-8 text-center">
                <motion.span
                    className="text-[10px] tracking-[0.4em] uppercase mb-6"
                    style={{ fontFamily: font.body, color: brand.sage }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Chapter 08
                </motion.span>
                <motion.h1
                    className="text-6xl md:text-8xl font-light mb-5"
                    style={{ fontFamily: font.display, color: brand.charcoal }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    Playground
                </motion.h1>
                <motion.p
                    className="text-base"
                    style={{ fontFamily: font.body, color: brand.sage }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    Components shaped by place.
                </motion.p>
            </header>

            {/* ── Section 01: Hero Variants ──────────────── */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
                <SectionHeader
                    chapter="Section 01"
                    title="Hero Variants"
                    description="Three approaches to the first moment of encounter — cinematic, compositional, and restrained."
                />

                <div className="space-y-16">
                    <div>
                        <ComponentLabel label="Hero A — Cinematic Full-Bleed" />
                        <div className="rounded overflow-hidden" style={{ border: `1px solid ${brand.divider}` }}>
                            <HeroACinematic />
                        </div>
                    </div>

                    <div>
                        <ComponentLabel label="Hero B — Split Composition" />
                        <div className="rounded overflow-hidden" style={{ border: `1px solid ${brand.divider}` }}>
                            <HeroBSplit />
                        </div>
                    </div>

                    <div>
                        <ComponentLabel label="Hero C — Minimal Statement" />
                        <div className="rounded overflow-hidden" style={{ border: `1px solid ${brand.divider}` }}>
                            <HeroCMinimal />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 02: Venue Cards ────────────────── */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
                <SectionHeader
                    chapter="Section 02"
                    title="Venue Cards"
                    description="How spaces are presented across different layout contexts — editorial, immersive, and utilitarian."
                />

                {/* Card A — Editorial */}
                <div className="mb-16">
                    <ComponentLabel label="Card A — Editorial Card" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {venueData.map(venue => (
                            <CardAEditorial key={venue.name} venue={venue} />
                        ))}
                    </div>
                </div>

                {/* Card B — Overlay */}
                <div className="mb-16">
                    <ComponentLabel label="Card B — Overlay Card" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {venueData.slice(0, 2).map(venue => (
                            <CardBOverlay key={venue.name} venue={venue} />
                        ))}
                    </div>
                </div>

                {/* Card C — Minimal List */}
                <div>
                    <ComponentLabel label="Card C — Minimal List Card" />
                    <div
                        className="rounded overflow-hidden"
                        style={{ backgroundColor: 'white', border: `1px solid ${brand.divider}` }}
                    >
                        {venueData.map((venue, i) => (
                            <CardCMinimalList
                                key={venue.name}
                                venue={venue}
                                isLast={i === venueData.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 03: Navigation Variants ────────── */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
                <SectionHeader
                    chapter="Section 03"
                    title="Navigation Variants"
                    description="Wayfinding that reflects the pace of the place — horizontal for browsing, vertical for depth."
                />

                <div className="space-y-16">
                    <div>
                        <ComponentLabel label="Nav A — Transparent Header" />
                        <div className="rounded overflow-hidden" style={{ border: `1px solid ${brand.divider}` }}>
                            <NavATransparent />
                        </div>
                    </div>

                    <div>
                        <ComponentLabel label="Nav B — Side Navigation" />
                        <NavBSide />
                    </div>
                </div>
            </section>

            {/* ── Section 04: Detail Components ──────────── */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
                <SectionHeader
                    chapter="Section 04"
                    title="Detail Components"
                    description="The building blocks of deeper pages — events, voices, and vital numbers."
                />

                <div className="space-y-16">
                    <div>
                        <ComponentLabel label="Event Detail Block" />
                        <div className="max-w-2xl">
                            <EventDetailBlock />
                        </div>
                    </div>

                    <div>
                        <ComponentLabel label="Testimonial Quote" />
                        <div className="rounded overflow-hidden" style={{ border: `1px solid ${brand.divider}` }}>
                            <TestimonialQuote />
                        </div>
                    </div>

                    <div>
                        <ComponentLabel label="Stats Row" />
                        <StatsRow />
                    </div>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────── */}
            <footer className="py-20 text-center" style={{ borderTop: `1px solid ${brand.divider}` }}>
                <motion.span
                    className="text-xs tracking-[0.25em] uppercase"
                    style={{ fontFamily: font.body, color: brand.sage }}
                    {...fadeIn}
                >
                    Calamigos Ranch &mdash; Design Study
                </motion.span>
            </footer>
        </div>
    );
};

export default DesignPlayground;
