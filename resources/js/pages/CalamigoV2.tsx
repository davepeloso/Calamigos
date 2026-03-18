import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SmoothScroll from '@/components/SmoothScroll';
import DeckNav from '@/components/DeckNav';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================== */
/*  BRAND TOKENS                                                       */
/* ================================================================== */
const C = {
    groveDark: '#1A2E25',
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

/* ================================================================== */
/*  FONT LOADER                                                        */
/* ================================================================== */
function useFonts(): void {
    useEffect(() => {
        const id = '__calamigo-v2-fonts';
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href =
            'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400&display=swap';
        document.head.appendChild(link);
    }, []);
}

/* ================================================================== */
/*  CATEGORY SYSTEM — color swatches from brand palette                */
/* ================================================================== */
type Category = 'venues' | 'stay' | 'dining' | 'wellness' | 'services';

interface CategoryDef {
    id: Category;
    label: string;
    color: string;       // swatch color at 60%
    colorFull: string;    // full saturation
    description: string;
}

const CATEGORIES: CategoryDef[] = [
    { id: 'venues', label: 'Event Venues', color: '#847963', colorFull: '#A4956E', description: 'Ceremony & reception spaces' },
    { id: 'stay', label: 'Accommodations', color: '#bdc2b6', colorFull: '#D4D9CE', description: 'Cottages & lodging' },
    { id: 'dining', label: 'Dine & Drink', color: '#4d665a', colorFull: '#5E7D6E', description: 'Restaurants, bars & markets' },
    { id: 'wellness', label: 'Wellness & Play', color: '#96acac', colorFull: '#A8C0C0', description: 'Pools, spa & recreation' },
    { id: 'services', label: 'Services', color: '#4b544e', colorFull: '#5D665F', description: 'Parking, lobby & offices' },
];

/* ================================================================== */
/*  LOCATION DATA — 34 pins                                            */
/* ================================================================== */
interface MapLocation {
    name: string;
    shortName: string;
    x: number;
    y: number;
    category: Category;
    description: string;
    capacity?: string;
}

const LOCATIONS: MapLocation[] = [
    // VENUES
    { name: 'The Barn', shortName: 'Barn', x: 0.59, y: 0.57, category: 'venues', description: 'Rustic elegance beneath vaulted timber ceilings.', capacity: '300' },
    { name: 'The Pavilion', shortName: 'Pavilion', x: 0.51, y: 0.69, category: 'venues', description: 'Open-air grandeur beside the creek.', capacity: '400' },
    { name: 'The Oak Room', shortName: 'Oak Room', x: 0.64, y: 0.44, category: 'venues', description: 'Intimate garden setting framed by heritage oaks.', capacity: '150' },
    { name: 'The Redwood Room', shortName: 'Redwood Room', x: 0.77, y: 0.13, category: 'venues', description: 'Cathedral-scale redwood hall.', capacity: '250' },
    { name: 'The Grove', shortName: 'Grove', x: 0.38, y: 0.59, category: 'venues', description: 'Shaded ceremony meadow under a living canopy.', capacity: '200' },
    { name: 'The Meadows', shortName: 'Meadows', x: 0.68, y: 0.52, category: 'venues', description: 'Sweeping hillside lawn with mountain views.', capacity: '500' },
    { name: 'The North 40', shortName: 'North 40', x: 0.39, y: 0.72, category: 'venues', description: 'Expansive outdoor space for large gatherings.', capacity: '800' },
    // STAY
    { name: 'Falling Oaks Cottages', shortName: 'Falling Oaks', x: 0.28, y: 0.46, category: 'stay', description: 'Secluded woodland cottages with private porches.' },
    { name: 'Butterfly Lane Cottage', shortName: 'Butterfly Ln', x: 0.35, y: 0.44, category: 'stay', description: 'Garden-view cottage along the butterfly corridor.' },
    { name: 'Sunset Meadows Cottages', shortName: 'Sunset Mdws', x: 0.36, y: 0.56, category: 'stay', description: 'West-facing suites with golden-hour views.' },
    { name: 'Pavilion Cottage Suites', shortName: 'Pavilion Cts', x: 0.43, y: 0.80, category: 'stay', description: 'Premium suites steps from the main pavilion.' },
    { name: 'Calamigos Camper', shortName: 'Camper', x: 0.74, y: 0.33, category: 'stay', description: 'Members-only glamping lodge.' },
    { name: 'The Red Cottage', shortName: 'Red Cottage', x: 0.61, y: 0.51, category: 'stay', description: 'The original ranch cottage, fully restored.' },
    { name: 'Tree House', shortName: 'Tree House', x: 0.62, y: 0.57, category: 'stay', description: 'Elevated retreat with canopy views.' },
    // DINING
    { name: 'Members Clubhouse & Pizza Bar', shortName: 'Clubhouse', x: 0.22, y: 0.44, category: 'dining', description: 'Wood-fired pizza and craft cocktails.' },
    { name: 'The House Bar', shortName: 'House Bar', x: 0.51, y: 0.36, category: 'dining', description: 'Ranch signature cocktails.' },
    { name: 'Gentry Market', shortName: 'Market', x: 0.57, y: 0.46, category: 'dining', description: 'Artisan provisions and coffee.' },
    { name: 'BOOTHILL Little Shop', shortName: 'Boothill', x: 0.72, y: 0.38, category: 'dining', description: 'Ranch merchandise and curated gifts.' },
    // WELLNESS
    { name: 'Spa Calamigos', shortName: 'Spa', x: 0.58, y: 0.38, category: 'wellness', description: 'Full-service spa with canyon views.' },
    { name: 'Resort Pool & Pickleball', shortName: 'Resort Pool', x: 0.49, y: 0.41, category: 'wellness', description: 'Main resort pool with lounge deck.' },
    { name: 'Members Pool & Studio', shortName: 'Members Pool', x: 0.24, y: 0.56, category: 'wellness', description: 'Private pool with yoga studio.' },
    { name: 'Pavilion Pool', shortName: 'Pvln Pool', x: 0.37, y: 0.83, category: 'wellness', description: 'Adults-only infinity pool.' },
    { name: 'Estate Pool', shortName: 'Estate Pool', x: 0.77, y: 0.22, category: 'wellness', description: 'Hillside pool with panoramic views.' },
    { name: 'The Beach Club', shortName: 'Beach Club', x: 0.67, y: 0.06, category: 'wellness', description: 'Sandy oasis with cabanas.' },
    { name: 'Ferris Wheel', shortName: 'Ferris Whl', x: 0.54, y: 0.78, category: 'wellness', description: 'Iconic ranch landmark.' },
    { name: 'Stables', shortName: 'Stables', x: 0.09, y: 0.44, category: 'wellness', description: 'Equestrian center with guided rides.' },
    { name: 'The Vineyards', shortName: 'Vineyards', x: 0.13, y: 0.41, category: 'wellness', description: 'Estate vineyard with tastings.' },
    // SERVICES
    { name: 'Lobby & Valet', shortName: 'Lobby', x: 0.18, y: 0.53, category: 'services', description: 'Main entrance with concierge.' },
    { name: 'Events Office', shortName: 'Events', x: 0.72, y: 0.21, category: 'services', description: 'Event coordination office.' },
    { name: 'Star C / Ranch Club Lot', shortName: 'Ranch Lot', x: 0.64, y: 0.32, category: 'services', description: 'Primary guest parking.' },
    { name: 'Pavilion Lot', shortName: 'Pvln Lot', x: 0.35, y: 0.77, category: 'services', description: 'Pavilion and cottage parking.' },
    { name: 'North 40 Lot', shortName: 'N40 Lot', x: 0.19, y: 0.79, category: 'services', description: 'Overflow and event parking.' },
    { name: 'Pavilion & Cottages Area', shortName: 'Cottage Area', x: 0.61, y: 0.74, category: 'services', description: 'Cottage check-in hub.' },
    { name: 'VARIANT3D Office', shortName: 'V3D', x: 0.57, y: 0.52, category: 'services', description: 'Creative technology studio.' },
];

// Always-present entrance point
const ENTRANCE: MapLocation = {
    name: 'Main Entrance',
    shortName: 'Entrance',
    x: 0.18, y: 0.53,
    category: 'services',
    description: 'Main ranch entrance & valet',
};

/* ================================================================== */
/*  HELPERS                                                            */
/* ================================================================== */
function dist(a: MapLocation, b: MapLocation): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function walkTime(d: number): string {
    const m = Math.max(1, Math.round(d * 25));
    return m <= 1 ? '< 1 min' : `${m} min walk`;
}

function getNearby(loc: MapLocation, count = 6): { location: MapLocation; distance: number; index: number }[] {
    return LOCATIONS
        .map((l, i) => ({ location: l, distance: dist(loc, l), index: i }))
        .filter(r => r.location.name !== loc.name)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, count);
}

/** Get points that roughly fall along the path between two locations */
function getWaypoints(from: MapLocation, to: MapLocation): MapLocation[] {
    const d = dist(from, to);
    return LOCATIONS
        .filter(l => l.name !== from.name && l.name !== to.name)
        .filter(l => {
            const dFromStart = dist(from, l);
            const dFromEnd = dist(to, l);
            // Point is "along the way" if it's within the corridor
            return (dFromStart + dFromEnd) < d * 1.4 && dFromStart > d * 0.1 && dFromEnd > d * 0.1;
        })
        .sort((a, b) => dist(from, a) - dist(from, b))
        .slice(0, 3);
}

/* ================================================================== */
/*  TOPOGRAPHIC SVG                                                    */
/* ================================================================== */
function TopoLines({ opacity = 0.08 }: { opacity?: number }) {
    return (
        <svg viewBox="0 0 1000 700" fill="none" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ opacity }}>
            <path d="M-50 350 C100 280,200 200,350 220 S550 300,650 250 S800 180,950 220 L1050 220" stroke={C.sage} strokeWidth="0.8" />
            <path d="M-30 380 C80 320,180 250,320 260 S520 330,620 290 S780 220,930 250 L1050 250" stroke={C.sage} strokeWidth="0.8" />
            <path d="M-60 420 C60 370,160 300,300 310 S490 370,600 340 S760 270,920 290 L1050 290" stroke={C.sage} strokeWidth="0.7" />
            <path d="M500 50 C550 80,620 60,700 90 S820 120,900 80 L1050 100" stroke={C.sage} strokeWidth="0.6" />
            <path d="M520 80 C560 105,630 90,710 115 S830 140,910 110 L1050 125" stroke={C.sage} strokeWidth="0.6" />
            <path d="M-50 200 C30 180,100 160,180 190 S280 240,340 210 S420 170,480 200" stroke={C.sage} strokeWidth="0.6" />
            <path d="M-40 230 C40 215,110 195,190 220 S290 260,350 235 S430 200,490 225" stroke={C.sage} strokeWidth="0.6" />
            <path d="M200 480 C280 450,360 420,440 440 S560 490,640 460 S740 430,820 450" stroke={C.sage} strokeWidth="0.7" />
            <path d="M180 510 C260 485,340 460,420 475 S540 515,620 490 S720 465,800 480" stroke={C.sage} strokeWidth="0.7" />
            <path d="M160 540 C240 520,320 500,400 510 S520 540,600 520 S700 500,780 510" stroke={C.sage} strokeWidth="0.7" />
            <path d="M100 600 C180 560,260 530,340 520 S450 510,530 490 S650 460,750 440 S860 410,950 380" stroke={C.sage} strokeWidth="1" strokeDasharray="8 6" />
            <path d="M80 120 C100 100,140 95,160 110 S180 140,160 155 S120 160,100 145 S75 130,80 120Z" stroke={C.sage} strokeWidth="0.5" />
            <path d="M700 300 C730 275,780 270,810 290 S830 330,805 345 S760 350,730 335 S690 315,700 300Z" stroke={C.sage} strokeWidth="0.5" />
            <path d="M600 580 C650 560,720 550,780 570 S860 610,920 590 L1050 600" stroke={C.sage} strokeWidth="0.5" />
            <path d="M620 610 C665 595,730 585,790 600 S870 630,930 615 L1050 625" stroke={C.sage} strokeWidth="0.5" />
        </svg>
    );
}

/* ================================================================== */
/*  DEV BOARDS NAV (bottom right)                                      */
/* ================================================================== */
function DevBoardsNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pages = [
        { label: 'Motion', href: '/moodboard/motion' },
        { label: 'Type', href: '/moodboard/fonts' },
        { label: 'Scroll', href: '/moodboard/scrollytelling' },
        { label: 'Interact', href: '/moodboard/animations' },
        { label: 'Vocab', href: '/moodboard/vocabulary' },
        { label: 'Easing', href: '/moodboard/easing' },
        { label: 'Color', href: '/moodboard/color' },
        { label: 'GSAP', href: '/moodboard/scrollcraft' },
        { label: 'Snap', href: '/moodboard/snapflow' },
        { label: 'Play', href: '/designs' },
        { label: 'v1.0', href: '/v1' },
        { label: 'Cover', href: '/' },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: `${C.groveDark}CC`, backdropFilter: 'blur(8px)', border: `1px solid ${C.sage}20` }}
            >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.sage }} />
                <span className="text-[9px] tracking-[0.15em] uppercase" style={{ fontFamily: mono, color: C.sage }}>
                    {isOpen ? 'Close' : "Dave's Boards"}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-12 right-4 z-[99] p-4 rounded-sm"
                        style={{ background: `${C.groveDark}F0`, backdropFilter: 'blur(16px)', border: `1px solid ${C.sage}15` }}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    >
                        <span className="block text-[9px] tracking-[0.2em] uppercase mb-3" style={{ fontFamily: mono, color: `${C.sage}60` }}>
                            Dev Design Boards
                        </span>
                        <div className="grid grid-cols-2 gap-1" style={{ width: '240px' }}>
                            {pages.map(p => (
                                <a key={p.href} href={p.href} className="text-[11px] px-2.5 py-1.5 rounded-sm hover:bg-white/5 transition-colors"
                                   style={{ fontFamily: body, color: C.sage }}>{p.label}</a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ================================================================== */
/*  PHASE 1: HERO — 5 Category Panels                                 */
/* ================================================================== */
interface HeroPanelsProps {
    onSelectCategory: (cat: Category) => void;
}

function HeroPanels({ onSelectCategory }: HeroPanelsProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="h-screen flex relative overflow-hidden">
            {/* Topo background behind panels */}
            <div className="absolute inset-0" style={{ background: C.grove }}>
                <TopoLines opacity={0.06} />
            </div>

            {/* 5 vertical panels */}
            {CATEGORIES.map((cat, i) => {
                const isHovered = hoveredIndex === i;
                const otherHovered = hoveredIndex !== null && hoveredIndex !== i;

                return (
                    <motion.button
                        key={cat.id}
                        className="relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                        style={{
                            background: cat.color,
                            borderRight: i < 4 ? `1px solid ${C.groveDark}30` : 'none',
                        }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => onSelectCategory(cat.id)}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            flex: isHovered ? 1.6 : otherHovered ? 0.85 : 1,
                        }}
                        transition={{
                            opacity: { duration: 0.6, delay: i * 0.1 },
                            flex: { type: 'spring', stiffness: 300, damping: 30 },
                        }}
                    >
                        {/* Topo texture overlay */}
                        <div className="absolute inset-0 opacity-[0.04]">
                            <TopoLines opacity={1} />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 text-center px-4">
                            {/* Category number */}
                            <motion.span
                                className="block text-[10px] tracking-[0.3em] uppercase mb-6"
                                style={{ fontFamily: mono, color: `${C.groveDark}60` }}
                                animate={{ opacity: isHovered ? 1 : 0.5 }}
                            >
                                0{i + 1}
                            </motion.span>

                            {/* Category name — vertical by default, horizontal on hover */}
                            <motion.h2
                                className="text-2xl md:text-3xl lg:text-4xl font-light tracking-wide"
                                style={{
                                    fontFamily: display,
                                    color: C.groveDark,
                                    writingMode: isHovered ? 'horizontal-tb' : 'vertical-rl',
                                    textOrientation: 'mixed',
                                    transition: 'writing-mode 0.3s',
                                }}
                                animate={{
                                    opacity: isHovered ? 1 : 0.7,
                                    scale: isHovered ? 1.05 : 1,
                                }}
                            >
                                {cat.label}
                            </motion.h2>

                            {/* Description — visible on hover */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.p
                                        className="mt-4 text-xs tracking-wide max-w-[200px]"
                                        style={{ fontFamily: body, color: `${C.groveDark}90` }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {cat.description}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Location count */}
                            <motion.span
                                className="block mt-6 text-[10px] tracking-[0.2em]"
                                style={{ fontFamily: mono, color: `${C.groveDark}50` }}
                                animate={{ opacity: isHovered ? 1 : 0.4 }}
                            >
                                {LOCATIONS.filter(l => l.category === cat.id).length} locations
                            </motion.span>
                        </div>

                        {/* Bottom accent line */}
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 origin-left"
                            style={{ height: '2px', background: C.groveDark }}
                            animate={{ scaleX: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.button>
                );
            })}

            {/* Top branding */}
            <div className="absolute top-6 left-8 z-20">
                <span className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: mono, color: `${C.groveDark}60` }}>
                    Calamigos Ranch · v1.1
                </span>
            </div>

            {/* Bottom instruction */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <span className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: body, color: C.groveDark }}>
                    Select a category to explore
                </span>
            </motion.div>
        </section>
    );
}

/* ================================================================== */
/*  PHASE 2: MAP REVEAL — category pins with labels                    */
/* ================================================================== */
interface MapRevealProps {
    selectedCategory: Category;
    onSelectLocation: (index: number) => void;
    onBack: () => void;
}

function MapReveal({ selectedCategory, onSelectLocation, onBack }: MapRevealProps) {
    const cat = CATEGORIES.find(c => c.id === selectedCategory)!;
    const categoryLocations = useMemo(
        () => LOCATIONS.map((l, i) => ({ ...l, globalIndex: i })).filter(l => l.category === selectedCategory),
        [selectedCategory],
    );
    const otherLocations = useMemo(
        () => LOCATIONS.map((l, i) => ({ ...l, globalIndex: i })).filter(l => l.category !== selectedCategory),
        [selectedCategory],
    );

    return (
        <motion.section
            className="min-h-screen relative"
            style={{ background: C.grove }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Top bar */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-12 py-4"
                 style={{ background: `${C.grove}E0`, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.sage}15` }}>
                <button onClick={onBack} className="flex items-center gap-2 group">
                    <span className="text-sm group-hover:-translate-x-1 transition-transform" style={{ color: C.sage }}>←</span>
                    <span className="text-[10px] tracking-[0.15em] uppercase" style={{ fontFamily: body, color: C.sage }}>Categories</span>
                </button>
                <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                    <span className="text-sm tracking-[0.1em] uppercase" style={{ fontFamily: body, color: C.cream }}>{cat.label}</span>
                </div>
            </div>

            {/* Map */}
            <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
                <div className="relative rounded-sm overflow-hidden" style={{ aspectRatio: '10/7', background: C.groveDark, border: `1px solid ${C.sage}12` }}>
                    {/* Illustrated map image — desaturated & darkened to fit brand */}
                    <img
                        src="/images-from-site/map.jpg"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        style={{
                            opacity: 0.15,
                            filter: 'saturate(0.3) brightness(0.6) contrast(1.1)',
                            mixBlendMode: 'luminosity',
                            objectPosition: '52% 47%',
                        }}
                    />
                    <TopoLines opacity={0.04} />

                    {/* Subtle grid */}
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03 }}>
                        {[...Array(10)].map((_, i) => <div key={`v${i}`} className="absolute top-0 bottom-0" style={{ left: `${(i+1)*10}%`, width: '1px', background: C.sage }} />)}
                        {[...Array(7)].map((_, i) => <div key={`h${i}`} className="absolute left-0 right-0" style={{ top: `${(i+1)*14.28}%`, height: '1px', background: C.sage }} />)}
                    </div>

                    {/* Other category pins (dimmed) */}
                    {otherLocations.map((loc, i) => (
                        <div
                            key={`other-${i}`}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${loc.x * 100}%`, top: `${loc.y * 100}%` }}
                        >
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${C.sage}25` }} />
                        </div>
                    ))}

                    {/* Selected category pins with labels */}
                    {categoryLocations.map((loc, i) => (
                        <motion.button
                            key={loc.globalIndex}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 flex flex-col items-center"
                            style={{ left: `${loc.x * 100}%`, top: `${loc.y * 100}%` }}
                            onClick={() => onSelectLocation(loc.globalIndex)}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 400, damping: 25 }}
                            whileHover={{ scale: 1.2 }}
                        >
                            {/* Pin */}
                            <div className="w-3 h-3 rounded-full transition-shadow group-hover:shadow-lg"
                                 style={{ background: cat.color, boxShadow: `0 0 0 2px ${C.groveDark}` }} />
                            {/* Label */}
                            <span
                                className="mt-1 text-[9px] tracking-[0.08em] uppercase whitespace-nowrap px-1.5 py-0.5 rounded-sm opacity-70 group-hover:opacity-100 transition-opacity"
                                style={{ fontFamily: body, color: C.cream, background: `${C.groveDark}B0` }}
                            >
                                {loc.shortName}
                            </span>
                        </motion.button>
                    ))}

                    {/* Entrance pin (always visible) */}
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 z-5"
                         style={{ left: `${ENTRANCE.x * 100}%`, top: `${ENTRANCE.y * 100}%` }}>
                        <div className="w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: C.cream, background: `${C.groveDark}80` }} />
                        <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.1em] uppercase whitespace-nowrap"
                              style={{ fontFamily: mono, color: `${C.cream}80` }}>
                            Entrance
                        </span>
                    </div>
                </div>

                {/* Instruction */}
                <div className="mt-6 text-center">
                    <span className="text-xs tracking-[0.15em]" style={{ fontFamily: body, color: `${C.sage}80` }}>
                        Select a destination to begin your journey
                    </span>
                </div>
            </div>
        </motion.section>
    );
}

/* ================================================================== */
/*  PHASE 3: LOCATION DETAIL — scrollytelling with vector line         */
/* ================================================================== */
interface LocationDetailProps {
    locationIndex: number;
    onBack: () => void;
    onSelectStartPoint: (index: number) => void;
    startPointIndex: number | null;
}

function LocationDetail({ locationIndex, onBack, onSelectStartPoint, startPointIndex }: LocationDetailProps) {
    const location = LOCATIONS[locationIndex];
    const cat = CATEGORIES.find(c => c.id === location.category)!;
    const nearby = useMemo(() => getNearby(location, 8), [locationIndex]);
    const startPoint = startPointIndex !== null ? LOCATIONS[startPointIndex] : null;
    const waypoints = useMemo(() => startPoint ? getWaypoints(startPoint, location) : [], [startPoint, location]);

    // Scroll-driven vertical line
    const lineContainerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: lineContainerRef, offset: ['start center', 'end center'] });
    const lineScale = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

    // Entrance distance
    const entranceDist = dist(ENTRANCE, location);

    return (
        <motion.section
            className="min-h-screen relative"
            style={{ background: C.groveDark }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Back bar */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-12 py-4"
                 style={{ background: `${C.groveDark}E0`, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.sage}10` }}>
                <button onClick={onBack} className="flex items-center gap-2 group">
                    <span className="text-sm group-hover:-translate-x-1 transition-transform" style={{ color: C.sage }}>←</span>
                    <span className="text-[10px] tracking-[0.15em] uppercase" style={{ fontFamily: body, color: C.sage }}>Map</span>
                </button>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                    <span className="text-xs" style={{ fontFamily: body, color: C.cream }}>{location.shortName}</span>
                </div>
            </div>

            {/* TEXT CASCADE — location title */}
            <div className="relative py-24 md:py-32">
                <div className="max-w-5xl mx-auto px-8 md:px-16 text-center">
                    <motion.span
                        className="block text-[10px] tracking-[0.4em] uppercase mb-6"
                        style={{ fontFamily: body, color: cat.color }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Your Destination
                    </motion.span>

                    <h1 className="overflow-hidden">
                        {location.name.split(' ').map((word, i) => (
                            <motion.span
                                key={i}
                                className="inline-block text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-tight mx-[0.06em]"
                                style={{ fontFamily: display, color: C.cream }}
                                initial={{ y: 100, opacity: 0, skewY: 6 }}
                                animate={{ y: 0, opacity: 1, skewY: 0 }}
                                transition={{ delay: 0.3 + i * 0.08, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </h1>

                    <motion.p
                        className="mt-6 text-base leading-relaxed max-w-lg mx-auto"
                        style={{ fontFamily: body, color: C.sage }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        {location.description}
                    </motion.p>

                    {location.capacity && (
                        <motion.span
                            className="inline-block mt-4 text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-full"
                            style={{ fontFamily: mono, color: cat.color, border: `1px solid ${cat.color}30` }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            Capacity {location.capacity}
                        </motion.span>
                    )}
                </div>
            </div>

            {/* VECTOR LINE extending with scroll — connects hero to detail section */}
            <div ref={lineContainerRef} className="relative">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px]" style={{ background: `${C.sage}15` }}>
                    <motion.div className="w-full origin-top" style={{ background: cat.color, height: '100%', scaleY: lineScale, opacity: 0.4 }} />
                </div>

                {/* Pin icon at the line tip */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 z-10"
                    style={{ top: 0 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                >
                    <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
                        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill={cat.color} opacity="0.8" />
                        <circle cx="12" cy="12" r="5" fill={C.groveDark} />
                    </svg>
                </motion.div>

                {/* SPLIT LAYOUT: LEFT (media / route map) + RIGHT (nearby data) */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                        {/* ===== LEFT: Media / Route Map ===== */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {!startPoint ? (
                                    /* Photo / video placeholder */
                                    <motion.div
                                        key="media"
                                        className="aspect-[4/3] rounded-sm overflow-hidden relative"
                                        style={{ background: `linear-gradient(135deg, ${cat.color}20, ${C.grove}40)`, border: `1px solid ${C.sage}15` }}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <img
                                            src="/images-from-site/map.jpg"
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                            style={{ opacity: 0.12, filter: 'saturate(0.2) brightness(0.5) contrast(1.1)', mixBlendMode: 'luminosity', objectPosition: '52% 47%' }}
                                        />
                                        <TopoLines opacity={0.03} />

                                        {/* Media placeholder content */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
                                                 style={{ border: `1px solid ${C.sage}30` }}>
                                                <span className="text-xl" style={{ color: `${C.sage}60` }}>▶</span>
                                            </div>
                                            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: body, color: `${C.sage}60` }}>
                                                Media — Images & Video
                                            </span>
                                        </div>

                                        {/* Color swatches representing the location's palette */}
                                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                                            {CATEGORIES.map((c, i) => (
                                                <div key={i} className="flex-1 h-8 rounded-sm" style={{ background: c.color, opacity: c.id === location.category ? 0.8 : 0.2 }} />
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* Route map when start point is selected */
                                    <motion.div
                                        key="route-map"
                                        className="aspect-[4/3] rounded-sm overflow-hidden relative"
                                        style={{ background: C.grove, border: `1px solid ${C.sage}15` }}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <img
                                            src="/images-from-site/map.jpg"
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                            style={{ opacity: 0.12, filter: 'saturate(0.2) brightness(0.5) contrast(1.1)', mixBlendMode: 'luminosity', objectPosition: '52% 47%' }}
                                        />
                                        <TopoLines opacity={0.03} />

                                        {/* Route SVG */}
                                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                            {/* Dashed path from start to destination */}
                                            <RoutePathSVG from={startPoint} to={location} waypoints={waypoints} color={cat.color} />
                                        </svg>

                                        {/* Start pin */}
                                        <div className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                                             style={{ left: `${startPoint.x * 100}%`, top: `${startPoint.y * 100}%` }}>
                                            <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: C.cream, background: `${C.groveDark}80` }} />
                                            <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.1em] uppercase whitespace-nowrap px-1 rounded-sm"
                                                  style={{ fontFamily: mono, color: C.cream, background: `${C.groveDark}CC` }}>
                                                {startPoint.shortName}
                                            </span>
                                        </div>

                                        {/* Waypoint pins */}
                                        {waypoints.map((wp, i) => {
                                            const wpCat = CATEGORIES.find(c => c.id === wp.category)!;
                                            return (
                                                <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 z-5"
                                                     style={{ left: `${wp.x * 100}%`, top: `${wp.y * 100}%` }}>
                                                    <div className="w-2 h-2 rounded-full" style={{ background: wpCat.color, opacity: 0.6 }} />
                                                    <span className="absolute top-full mt-0.5 left-1/2 -translate-x-1/2 text-[7px] whitespace-nowrap"
                                                          style={{ fontFamily: body, color: `${C.sage}80` }}>
                                                        {wp.shortName}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        {/* Destination pin */}
                                        <div className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                                             style={{ left: `${location.x * 100}%`, top: `${location.y * 100}%` }}>
                                            <div className="w-4 h-4 rounded-full" style={{ background: cat.color, boxShadow: `0 0 0 3px ${C.groveDark}, 0 0 12px ${cat.color}50` }} />
                                            <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.1em] uppercase whitespace-nowrap px-1 rounded-sm"
                                                  style={{ fontFamily: mono, color: cat.color, background: `${C.groveDark}CC` }}>
                                                {location.shortName}
                                            </span>
                                        </div>

                                        {/* Walking time badge */}
                                        <div className="absolute bottom-4 left-4 px-3 py-2 rounded-sm"
                                             style={{ background: `${C.groveDark}E0`, border: `1px solid ${C.sage}15` }}>
                                            <span className="text-[10px] tracking-[0.15em] uppercase block" style={{ fontFamily: body, color: C.sage }}>
                                                Estimated walk
                                            </span>
                                            <span className="text-lg font-light" style={{ fontFamily: display, color: C.cream }}>
                                                {walkTime(dist(startPoint, location))}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Waypoint narration below map */}
                            {startPoint && waypoints.length > 0 && (
                                <motion.div
                                    className="mt-6 space-y-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <span className="text-[9px] tracking-[0.25em] uppercase block" style={{ fontFamily: body, color: C.wood }}>
                                        Along the way
                                    </span>
                                    {waypoints.map((wp, i) => {
                                        const wpCat = CATEGORIES.find(c => c.id === wp.category)!;
                                        const side = wp.x > ((startPoint.x + location.x) / 2) ? 'right' : 'left';
                                        const progress = dist(startPoint, wp) / dist(startPoint, location);
                                        const progressLabel = progress < 0.4 ? 'early on' : progress < 0.7 ? 'about halfway' : 'near the end';
                                        return (
                                            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-sm" style={{ background: `${C.sage}08` }}>
                                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: wpCat.color }} />
                                                <p className="text-xs leading-relaxed flex-1" style={{ fontFamily: body, color: C.sage }}>
                                                    You'll pass <span style={{ color: C.cream }}>{wp.shortName}</span> on the {side}, {progressLabel}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </div>

                        {/* ===== RIGHT: Popout Data ===== */}
                        <div>
                            {/* Entrance — always first */}
                            <motion.div
                                className="mb-2 px-4 py-3 rounded-sm cursor-pointer group"
                                style={{
                                    background: startPointIndex === LOCATIONS.findIndex(l => l.name === ENTRANCE.name) ? `${C.cream}12` : `${C.sage}08`,
                                    border: `1px solid ${startPointIndex === LOCATIONS.findIndex(l => l.name === ENTRANCE.name) ? C.cream + '25' : 'transparent'}`,
                                }}
                                onClick={() => onSelectStartPoint(LOCATIONS.findIndex(l => l.name === ENTRANCE.name))}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                whileHover={{ x: -2 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-3.5 h-3.5 rounded-full border-2 shrink-0" style={{ borderColor: C.cream, background: `${C.groveDark}80` }} />
                                    <div className="flex-1">
                                        <span className="text-sm block" style={{ fontFamily: display, color: C.cream }}>
                                            Main Entrance
                                        </span>
                                        <span className="text-[10px]" style={{ fontFamily: body, color: `${C.sage}80` }}>
                                            Lobby & Valet
                                        </span>
                                    </div>
                                    <span className="text-[10px] tracking-[0.1em]" style={{ fontFamily: mono, color: C.sage }}>
                                        {walkTime(entranceDist)}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Divider */}
                            <div className="my-3 flex items-center gap-3 px-4">
                                <div className="flex-1 h-[1px]" style={{ background: `${C.sage}15` }} />
                                <span className="text-[9px] tracking-[0.25em] uppercase" style={{ fontFamily: body, color: C.wood }}>
                                    Nearby
                                </span>
                                <div className="flex-1 h-[1px]" style={{ background: `${C.sage}15` }} />
                            </div>

                            {/* Nearby locations */}
                            <div className="space-y-1.5">
                                {nearby.map((n, i) => {
                                    const nCat = CATEGORIES.find(c => c.id === n.location.category)!;
                                    const isStartPoint = startPointIndex === n.index;

                                    return (
                                        <motion.button
                                            key={n.index}
                                            className="w-full text-left px-4 py-3 rounded-sm group transition-colors"
                                            style={{
                                                background: isStartPoint ? `${nCat.color}15` : `${C.sage}06`,
                                                border: `1px solid ${isStartPoint ? nCat.color + '30' : 'transparent'}`,
                                            }}
                                            onClick={() => onSelectStartPoint(n.index)}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.25 + i * 0.04 }}
                                            whileHover={{ x: -2 }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: nCat.color }} />
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm block truncate" style={{ fontFamily: display, color: C.cream }}>
                                                        {n.location.name}
                                                    </span>
                                                    <span className="text-[10px]" style={{ fontFamily: body, color: `${C.sage}70` }}>
                                                        {nCat.label}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] tracking-[0.1em] shrink-0" style={{ fontFamily: mono, color: nCat.color }}>
                                                    {walkTime(n.distance)}
                                                </span>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Start point prompt */}
                            {!startPoint && (
                                <motion.div
                                    className="mt-6 text-center py-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.6 }}
                                    transition={{ delay: 1 }}
                                >
                                    <span className="text-[10px] tracking-[0.15em] uppercase" style={{ fontFamily: body, color: C.sage }}>
                                        ↑ Select a start point to see your route
                                    </span>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

/* ================================================================== */
/*  ROUTE PATH SVG — animated vector line between two points           */
/* ================================================================== */
function RoutePathSVG({ from, to, waypoints, color }: { from: MapLocation; to: MapLocation; waypoints: MapLocation[]; color: string }) {
    const pathRef = useRef<SVGPathElement>(null);

    // Build path string through waypoints
    const allPoints = [from, ...waypoints, to];
    let d = `M ${from.x * 100} ${from.y * 100}`;

    for (let i = 1; i < allPoints.length; i++) {
        const prev = allPoints[i - 1];
        const curr = allPoints[i];
        const mx = ((prev.x + curr.x) / 2) * 100;
        const my = ((prev.y + curr.y) / 2) * 100;
        // Add slight curve
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const perpX = -dy * 8;
        const perpY = dx * 8;
        d += ` Q ${mx + perpX} ${my + perpY} ${curr.x * 100} ${curr.y * 100}`;
    }

    useEffect(() => {
        if (!pathRef.current) return;
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(pathRef.current, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', delay: 0.3 });
    }, [from, to]);

    return (
        <path
            ref={pathRef}
            d={d}
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
            vectorEffect="non-scaling-stroke"
        />
    );
}

/* ================================================================== */
/*  PAGE STATE MACHINE                                                 */
/* ================================================================== */
type Phase = 'hero' | 'map' | 'location';

export default function CalamigoV2() {
    useFonts();

    const [phase, setPhase] = useState<Phase>('hero');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedLocationIndex, setSelectedLocationIndex] = useState<number | null>(null);
    const [startPointIndex, setStartPointIndex] = useState<number | null>(null);

    // Phase transitions
    const handleSelectCategory = useCallback((cat: Category) => {
        setSelectedCategory(cat);
        setPhase('map');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleSelectLocation = useCallback((index: number) => {
        setSelectedLocationIndex(index);
        setStartPointIndex(null);
        setPhase('location');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleBackToHero = useCallback(() => {
        setPhase('hero');
        setSelectedCategory(null);
        setSelectedLocationIndex(null);
        setStartPointIndex(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleBackToMap = useCallback(() => {
        setPhase('map');
        setSelectedLocationIndex(null);
        setStartPointIndex(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => ScrollTrigger.refresh(), 200);
        return () => clearTimeout(timeout);
    }, [phase]);

    return (
        <SmoothScroll lerp={0.09} duration={1.3}>
            <div className="min-h-screen" style={{ background: C.groveDark, color: C.cream }}>
                <DeckNav currentDeck="v1.2" />
                <DevBoardsNav />

                <AnimatePresence mode="wait">
                    {phase === 'hero' && (
                        <motion.div key="hero" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                            <HeroPanels onSelectCategory={handleSelectCategory} />
                        </motion.div>
                    )}

                    {phase === 'map' && selectedCategory && (
                        <motion.div key="map" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                            <MapReveal
                                selectedCategory={selectedCategory}
                                onSelectLocation={handleSelectLocation}
                                onBack={handleBackToHero}
                            />
                        </motion.div>
                    )}

                    {phase === 'location' && selectedLocationIndex !== null && (
                        <motion.div key="location" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                            <LocationDetail
                                locationIndex={selectedLocationIndex}
                                onBack={handleBackToMap}
                                onSelectStartPoint={setStartPointIndex}
                                startPointIndex={startPointIndex}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer */}
                <footer className="py-12 text-center" style={{ borderTop: `1px solid ${C.sage}08` }}>
                    <p className="text-[10px] tracking-[0.15em]" style={{ fontFamily: mono, color: `${C.sage}30` }}>
                        Calamigos Ranch · v1.1 · Design & Development by Dave Peloso
                    </p>
                </footer>
            </div>
        </SmoothScroll>
    );
}
