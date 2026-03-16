import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SmoothScroll from '@/components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================== */
/*  BRAND TOKENS                                                       */
/* ================================================================== */
const C = {
    groveDark: '#1A2E25',
    grove: '#2F4A3F',
    groveLight: '#3D6152',
    sand: '#EAE4D8',
    sandDark: '#D4CBBA',
    cream: '#F5F2EA',
    creamWarm: '#FAF7F0',
    sage: '#7A8F82',
    wood: '#8A6B4F',
    woodLight: '#A4845E',
    charcoal: '#2C2C2C',
    divider: '#DCD6CA',
    water: '#6B9FAF',
} as const;

const display = "'Cormorant Garamond', Georgia, serif";
const body = "'DM Sans', system-ui, sans-serif";
const mono = "'JetBrains Mono', 'Fira Code', monospace";

/* ================================================================== */
/*  FONT LOADER                                                        */
/* ================================================================== */
function useFonts(): void {
    useEffect(() => {
        const id = '__calamigos-fonts';
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
/*  LOCATION CATEGORIES                                                */
/* ================================================================== */
type Category = 'venues' | 'stay' | 'dining' | 'wellness' | 'services';

interface CategoryDef {
    id: Category;
    label: string;
    icon: string;
    color: string;
    colorMuted: string;
    description: string;
}

const CATEGORIES: CategoryDef[] = [
    { id: 'venues', label: 'Event Venues', icon: '◇', color: '#D4A574', colorMuted: '#D4A57440', description: 'Ceremony & reception spaces' },
    { id: 'stay', label: 'Accommodations', icon: '⌂', color: '#A4845E', colorMuted: '#A4845E40', description: 'Cottages & lodging' },
    { id: 'dining', label: 'Dine & Drink', icon: '◦', color: '#C4956A', colorMuted: '#C4956A40', description: 'Restaurants, bars & markets' },
    { id: 'wellness', label: 'Wellness & Play', icon: '○', color: '#7AADA0', colorMuted: '#7AADA040', description: 'Pools, spa & recreation' },
    { id: 'services', label: 'Services', icon: '·', color: '#8A9A92', colorMuted: '#8A9A9240', description: 'Parking, lobby & offices' },
];

const CATEGORY_MAP: Record<Category, string> = {
    venues: '#D4A574',
    stay: '#A4845E',
    dining: '#C4956A',
    wellness: '#7AADA0',
    services: '#8A9A92',
};

/* ================================================================== */
/*  LOCATION DATA — 34 pins, categorized                               */
/* ================================================================== */
interface MapLocation {
    name: string;
    shortName: string;
    x: number;
    y: number;
    category: Category;
    description?: string;
    capacity?: string;
    nearbyIds?: number[];
}

const LOCATIONS: MapLocation[] = [
    // VENUES (7)
    { name: 'The Barn', shortName: 'Barn', x: 0.59, y: 0.57, category: 'venues', description: 'Rustic elegance beneath vaulted timber ceilings. Seats up to 300.', capacity: '300' },
    { name: 'The Pavilion', shortName: 'Pavilion', x: 0.51, y: 0.69, category: 'venues', description: 'Open-air grandeur beside the creek. The signature reception space.', capacity: '400' },
    { name: 'The Oak Room', shortName: 'Oak Room', x: 0.64, y: 0.44, category: 'venues', description: 'Intimate garden setting framed by heritage oaks.', capacity: '150' },
    { name: 'The Redwood Room', shortName: 'Redwood', x: 0.77, y: 0.13, category: 'venues', description: 'Cathedral-scale redwood hall for grand celebrations.', capacity: '250' },
    { name: 'The Grove', shortName: 'Grove', x: 0.38, y: 0.59, category: 'venues', description: 'Shaded ceremony meadow under a living canopy.', capacity: '200' },
    { name: 'The Meadows', shortName: 'Meadows', x: 0.68, y: 0.52, category: 'venues', description: 'Sweeping hillside lawn with mountain views.', capacity: '500' },
    { name: 'The North 40', shortName: 'North 40', x: 0.39, y: 0.72, category: 'venues', description: 'Expansive outdoor space for festivals and large gatherings.', capacity: '800' },

    // STAY (7)
    { name: 'Falling Oaks Cottages', shortName: 'Falling Oaks', x: 0.28, y: 0.46, category: 'stay', description: 'Secluded woodland cottages with private porches.' },
    { name: 'Butterfly Lane Cottage', shortName: 'Butterfly Ln', x: 0.35, y: 0.44, category: 'stay', description: 'Garden-view cottage along the butterfly corridor.' },
    { name: 'Sunset Meadows Cottages', shortName: 'Sunset Mdws', x: 0.36, y: 0.56, category: 'stay', description: 'West-facing suites with golden-hour views.' },
    { name: 'Pavilion Cottage Suites', shortName: 'Pavilion Cts', x: 0.43, y: 0.80, category: 'stay', description: 'Premium suites steps from the main pavilion.' },
    { name: 'Calamigos Camper', shortName: 'Camper', x: 0.74, y: 0.33, category: 'stay', description: 'Members-only glamping lodge with campfire terrace.' },
    { name: 'The Red Cottage', shortName: 'Red Cottage', x: 0.61, y: 0.51, category: 'stay', description: 'The original ranch cottage, fully restored.' },
    { name: 'Tree House', shortName: 'Tree House', x: 0.62, y: 0.57, category: 'stay', description: 'Elevated retreat with canopy views. Barbershop on ground floor.' },

    // DINING (4)
    { name: 'Members Clubhouse & Pizza Bar', shortName: 'Clubhouse', x: 0.22, y: 0.44, category: 'dining', description: 'Wood-fired pizza and craft cocktails for members.' },
    { name: 'The House Bar', shortName: 'House Bar', x: 0.51, y: 0.36, category: 'dining', description: 'Ranch signature cocktails in a midcentury lounge.' },
    { name: 'Gentry Market', shortName: 'Market', x: 0.57, y: 0.46, category: 'dining', description: 'Artisan provisions, coffee, and grab-and-go bites.' },
    { name: 'BOOTHILL Little Shop', shortName: 'Boothill', x: 0.72, y: 0.38, category: 'dining', description: 'Ranch merchandise and curated gifts.' },

    // WELLNESS & PLAY (9)
    { name: 'Spa Calamigos', shortName: 'Spa', x: 0.58, y: 0.38, category: 'wellness', description: 'Full-service spa with canyon-view treatment rooms.' },
    { name: 'Resort Pool & Pickleball', shortName: 'Resort Pool', x: 0.49, y: 0.41, category: 'wellness', description: 'Main resort pool with lounge deck and courts.' },
    { name: 'Members Pool & Studio', shortName: 'Members Pool', x: 0.24, y: 0.56, category: 'wellness', description: 'Private pool with yoga studio and sun deck.' },
    { name: 'Pavilion Pool', shortName: 'Pvln Pool', x: 0.37, y: 0.83, category: 'wellness', description: 'Adults-only infinity pool with mountain backdrop.' },
    { name: 'Estate Pool', shortName: 'Estate Pool', x: 0.77, y: 0.22, category: 'wellness', description: 'Hillside pool with panoramic canyon views.' },
    { name: 'The Beach Club', shortName: 'Beach Club', x: 0.62, y: 0.08, category: 'wellness', description: 'Sandy oasis with cabanas and a swim-up bar.' },
    { name: 'Ferris Wheel', shortName: 'Ferris Whl', x: 0.54, y: 0.78, category: 'wellness', description: 'Iconic ranch landmark with evening light shows.' },
    { name: 'Stables', shortName: 'Stables', x: 0.09, y: 0.44, category: 'wellness', description: 'Equestrian center with guided trail rides.' },
    { name: 'The Vineyards', shortName: 'Vineyards', x: 0.13, y: 0.41, category: 'wellness', description: 'Estate vineyard with seasonal tasting events.' },

    // SERVICES (7)
    { name: 'Lobby & Valet', shortName: 'Lobby', x: 0.18, y: 0.53, category: 'services', description: 'Main entrance with concierge and valet parking.' },
    { name: 'Events Office', shortName: 'Events', x: 0.72, y: 0.21, category: 'services', description: 'Event coordination and planning office.' },
    { name: 'Star C / Ranch Club Lot', shortName: 'Ranch Lot', x: 0.64, y: 0.32, category: 'services', description: 'Primary guest parking area.' },
    { name: 'Pavilion Lot', shortName: 'Pvln Lot', x: 0.35, y: 0.77, category: 'services', description: 'Parking for pavilion and cottage guests.' },
    { name: 'North 40 Lot', shortName: 'N40 Lot', x: 0.19, y: 0.79, category: 'services', description: 'Overflow and event parking.' },
    { name: 'Pavilion & Cottages Area', shortName: 'Cottage Area', x: 0.61, y: 0.74, category: 'services', description: 'Cottage check-in and guest services hub.' },
    { name: 'VARIANT3D Office', shortName: 'V3D', x: 0.57, y: 0.52, category: 'services', description: 'Creative technology studio.' },
];

/* ================================================================== */
/*  DISTANCE HELPERS                                                   */
/* ================================================================== */
function distanceBetween(a: MapLocation, b: MapLocation): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function getNearby(loc: MapLocation, count: number = 5, filterCats?: Category[]): { location: MapLocation; distance: number; index: number }[] {
    return LOCATIONS
        .map((l, i) => ({ location: l, distance: distanceBetween(loc, l), index: i }))
        .filter(r => r.location.name !== loc.name && (!filterCats || filterCats.includes(r.location.category)))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, count);
}

function distanceToWalkTime(d: number): string {
    const minutes = Math.round(d * 25); // rough scale: 1.0 = ~25 min
    if (minutes <= 1) return '< 1 min';
    return `${minutes} min walk`;
}

/* ================================================================== */
/*  TOPOGRAPHIC SVG BACKGROUND                                         */
/* ================================================================== */
function TopographicContours({ opacity = 0.08 }: { opacity?: number }) {
    return (
        <svg
            viewBox="0 0 1000 700"
            fill="none"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            style={{ opacity }}
        >
            {/* Outer contours — large terrain features */}
            <path d="M-50 350 C100 280, 200 200, 350 220 S550 300, 650 250 S800 180, 950 220 L1050 220" stroke={C.sage} strokeWidth="0.8" fill="none" />
            <path d="M-30 380 C80 320, 180 250, 320 260 S520 330, 620 290 S780 220, 930 250 L1050 250" stroke={C.sage} strokeWidth="0.8" fill="none" />
            <path d="M-60 420 C60 370, 160 300, 300 310 S490 370, 600 340 S760 270, 920 290 L1050 290" stroke={C.sage} strokeWidth="0.8" fill="none" />

            {/* Ridge system — upper right */}
            <path d="M500 50 C550 80, 620 60, 700 90 S820 120, 900 80 L1050 100" stroke={C.sage} strokeWidth="0.6" fill="none" />
            <path d="M520 80 C560 105, 630 90, 710 115 S830 140, 910 110 L1050 125" stroke={C.sage} strokeWidth="0.6" fill="none" />
            <path d="M540 110 C575 130, 640 120, 720 140 S840 160, 920 140 L1050 150" stroke={C.sage} strokeWidth="0.6" fill="none" />

            {/* Valley — left side */}
            <path d="M-50 200 C30 180, 100 160, 180 190 S280 240, 340 210 S420 170, 480 200" stroke={C.sage} strokeWidth="0.6" fill="none" />
            <path d="M-40 230 C40 215, 110 195, 190 220 S290 260, 350 235 S430 200, 490 225" stroke={C.sage} strokeWidth="0.6" fill="none" />
            <path d="M-30 260 C50 250, 120 235, 200 255 S300 280, 360 260 S440 235, 500 255" stroke={C.sage} strokeWidth="0.6" fill="none" />

            {/* Canyon contours — center/bottom */}
            <path d="M200 480 C280 450, 360 420, 440 440 S560 490, 640 460 S740 430, 820 450" stroke={C.sage} strokeWidth="0.7" fill="none" />
            <path d="M180 510 C260 485, 340 460, 420 475 S540 515, 620 490 S720 465, 800 480" stroke={C.sage} strokeWidth="0.7" fill="none" />
            <path d="M160 540 C240 520, 320 500, 400 510 S520 540, 600 520 S700 500, 780 510" stroke={C.sage} strokeWidth="0.7" fill="none" />
            <path d="M140 570 C220 555, 300 540, 380 548 S500 565, 580 550 S680 535, 760 545" stroke={C.sage} strokeWidth="0.7" fill="none" />

            {/* Creek path — flowing through center */}
            <path d="M100 600 C180 560, 260 530, 340 520 S450 510, 530 490 S650 460, 750 440 S860 410, 950 380" stroke={C.sage} strokeWidth="1" fill="none" strokeDasharray="8 6" />

            {/* Hilltop rings — upper left */}
            <path d="M80 120 C100 100, 140 95, 160 110 S180 140, 160 155 S120 160, 100 145 S75 130, 80 120Z" stroke={C.sage} strokeWidth="0.5" fill="none" />
            <path d="M90 125 C105 110, 135 106, 150 118 S165 140, 150 150 S125 153, 110 143 S85 133, 90 125Z" stroke={C.sage} strokeWidth="0.5" fill="none" />

            {/* Hilltop rings — right center */}
            <path d="M700 300 C730 275, 780 270, 810 290 S830 330, 805 345 S760 350, 730 335 S690 315, 700 300Z" stroke={C.sage} strokeWidth="0.5" fill="none" />
            <path d="M715 305 C738 285, 775 280, 800 296 S816 325, 796 337 S756 340, 735 328 S706 314, 715 305Z" stroke={C.sage} strokeWidth="0.5" fill="none" />

            {/* Scatter contours — lower right */}
            <path d="M600 580 C650 560, 720 550, 780 570 S860 610, 920 590 L1050 600" stroke={C.sage} strokeWidth="0.5" fill="none" />
            <path d="M620 610 C665 595, 730 585, 790 600 S870 630, 930 615 L1050 625" stroke={C.sage} strokeWidth="0.5" fill="none" />
            <path d="M640 640 C680 628, 740 620, 800 632 S880 650, 940 640 L1050 648" stroke={C.sage} strokeWidth="0.5" fill="none" />
        </svg>
    );
}

/* ================================================================== */
/*  MAP PIN COMPONENT                                                  */
/* ================================================================== */
interface PinProps {
    location: MapLocation;
    index: number;
    isSelected: boolean;
    isHighlighted: boolean;
    isDimmed: boolean;
    isNearby: boolean;
    onClick: (index: number) => void;
}

function MapPin({ location, index, isSelected, isHighlighted, isDimmed, isNearby, onClick }: PinProps) {
    const cat = CATEGORIES.find(c => c.id === location.category)!;
    const pinColor = cat.color;

    return (
        <motion.button
            className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{ left: `${location.x * 100}%`, top: `${location.y * 100}%` }}
            onClick={() => onClick(index)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: isSelected ? 1.3 : isDimmed ? 0.7 : 1,
                opacity: isDimmed ? 0.2 : 1,
            }}
            whileHover={{ scale: isSelected ? 1.35 : 1.15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            {/* Pulse ring for selected */}
            {isSelected && (
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: `1.5px solid ${pinColor}` }}
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
            )}

            {/* Nearby indicator ring */}
            {isNearby && !isSelected && (
                <motion.div
                    className="absolute inset-[-3px] rounded-full"
                    style={{ border: `1px dashed ${pinColor}60` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}

            {/* Pin dot */}
            <div
                className="w-3 h-3 rounded-full relative transition-shadow duration-300"
                style={{
                    background: pinColor,
                    boxShadow: isSelected
                        ? `0 0 0 3px ${C.groveDark}, 0 0 12px ${pinColor}60`
                        : isHighlighted
                            ? `0 0 0 2px ${C.groveDark}, 0 0 6px ${pinColor}40`
                            : `0 0 0 1.5px ${C.groveDark}`,
                }}
            />

            {/* Label — show on hover or when selected */}
            <div
                className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-200 pointer-events-none ${
                    isSelected ? 'opacity-100 -top-7' : 'opacity-0 group-hover:opacity-100 -top-6'
                }`}
            >
                <span
                    className="text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm"
                    style={{
                        fontFamily: body,
                        color: C.cream,
                        background: `${C.groveDark}E0`,
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    {location.shortName}
                </span>
            </div>
        </motion.button>
    );
}

/* ================================================================== */
/*  PATH CONNECTOR — SVG line between two points                       */
/* ================================================================== */
function PathConnector({ from, to, color, delay = 0 }: { from: MapLocation; to: MapLocation; color: string; delay?: number }) {
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (!pathRef.current) return;
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(pathRef.current, { strokeDashoffset: 0, duration: 0.6, delay, ease: 'power2.inOut' });
    }, [from, to, delay]);

    // Create a slight curve between the two points
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    // Perpendicular offset for curve
    const offset = Math.min(0.04, distanceBetween(from, to) * 0.3);
    const cx = mx - dy * offset * 3;
    const cy = my + dx * offset * 3;

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5]" preserveAspectRatio="none">
            <path
                ref={pathRef}
                d={`M ${from.x * 100}% ${from.y * 100}% Q ${cx * 100}% ${cy * 100}% ${to.x * 100}% ${to.y * 100}%`}
                stroke={color}
                strokeWidth="1"
                strokeDasharray="4 3"
                fill="none"
                opacity="0.5"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

/* ================================================================== */
/*  CATEGORY FILTER — Accordion variant                                */
/* ================================================================== */
function CategoryAccordion({ activeCategories, onToggle }: { activeCategories: Set<Category>; onToggle: (cat: Category) => void }) {
    const [expandedCat, setExpandedCat] = useState<Category | null>(null);

    return (
        <div className="space-y-1">
            {CATEGORIES.map(cat => {
                const isActive = activeCategories.has(cat.id);
                const isExpanded = expandedCat === cat.id;
                const count = LOCATIONS.filter(l => l.category === cat.id).length;

                return (
                    <div key={cat.id}>
                        <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 text-left"
                            style={{
                                background: isActive ? `${cat.color}12` : 'transparent',
                                borderLeft: `2px solid ${isActive ? cat.color : 'transparent'}`,
                            }}
                            onClick={() => {
                                onToggle(cat.id);
                                setExpandedCat(isExpanded ? null : cat.id);
                            }}
                        >
                            <span style={{ color: cat.color, fontSize: '14px' }}>{cat.icon}</span>
                            <span
                                className="flex-1 text-xs tracking-[0.12em] uppercase"
                                style={{ fontFamily: body, color: isActive ? C.cream : C.sage }}
                            >
                                {cat.label}
                            </span>
                            <span
                                className="text-[10px] tabular-nums"
                                style={{ fontFamily: mono, color: isActive ? cat.color : `${C.sage}60` }}
                            >
                                {count}
                            </span>
                        </button>

                        <AnimatePresence>
                            {isExpanded && isActive && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pl-8 pr-3 pb-2 space-y-0.5">
                                        {LOCATIONS.filter(l => l.category === cat.id).map((loc, i) => (
                                            <div
                                                key={i}
                                                className="text-[11px] py-1 flex items-center gap-2"
                                                style={{ fontFamily: body, color: `${C.sage}AA` }}
                                            >
                                                <span className="w-1 h-1 rounded-full" style={{ background: cat.color, opacity: 0.5 }} />
                                                {loc.shortName}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}

/* ================================================================== */
/*  CATEGORY FILTER — Toggle Switch variant                            */
/* ================================================================== */
function CategoryToggles({ activeCategories, onToggle }: { activeCategories: Set<Category>; onToggle: (cat: Category) => void }) {
    return (
        <div className="space-y-2">
            {CATEGORIES.map(cat => {
                const isActive = activeCategories.has(cat.id);
                const count = LOCATIONS.filter(l => l.category === cat.id).length;

                return (
                    <button
                        key={cat.id}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-200"
                        onClick={() => onToggle(cat.id)}
                    >
                        <span style={{ color: isActive ? cat.color : `${C.sage}50`, fontSize: '13px' }}>{cat.icon}</span>
                        <span
                            className="flex-1 text-xs tracking-[0.1em] uppercase text-left"
                            style={{ fontFamily: body, color: isActive ? C.cream : `${C.sage}50` }}
                        >
                            {cat.label}
                        </span>

                        {/* Toggle switch */}
                        <div
                            className="w-8 h-[18px] rounded-full relative transition-colors duration-200 shrink-0"
                            style={{ background: isActive ? `${cat.color}50` : `${C.sage}20` }}
                        >
                            <motion.div
                                className="absolute top-[3px] w-3 h-3 rounded-full"
                                style={{ background: isActive ? cat.color : C.sage }}
                                animate={{ left: isActive ? '16px' : '3px' }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </div>

                        <span
                            className="text-[10px] w-5 text-right tabular-nums"
                            style={{ fontFamily: mono, color: isActive ? cat.color : `${C.sage}40` }}
                        >
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

/* ================================================================== */
/*  LOCATION DETAIL PANEL                                              */
/* ================================================================== */
function DetailPanel({ location, onClose }: { location: MapLocation; onClose: () => void }) {
    const cat = CATEGORIES.find(c => c.id === location.category)!;
    const nearby = useMemo(() => getNearby(location, 6), [location]);

    // Group nearby by category for the proximity section
    const nearbyByCategory = useMemo(() => {
        const groups: Record<string, typeof nearby> = {};
        nearby.forEach(n => {
            const key = n.location.category;
            if (!groups[key]) groups[key] = [];
            groups[key].push(n);
        });
        return groups;
    }, [nearby]);

    return (
        <motion.div
            className="absolute right-0 top-0 bottom-0 w-full md:w-[380px] z-30 overflow-y-auto"
            style={{
                background: `${C.groveDark}F5`,
                backdropFilter: 'blur(20px)',
                borderLeft: `1px solid ${C.sage}15`,
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ background: `${C.sage}15` }}
            >
                <span style={{ color: C.sage, fontSize: '18px', lineHeight: 1 }}>×</span>
            </button>

            <div className="p-6 pt-14">
                {/* Category badge */}
                <div className="flex items-center gap-2 mb-4">
                    <span
                        className="text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded-sm"
                        style={{
                            fontFamily: body,
                            color: cat.color,
                            background: `${cat.color}15`,
                            border: `1px solid ${cat.color}25`,
                        }}
                    >
                        {cat.icon} {cat.label}
                    </span>
                </div>

                {/* Title */}
                <h3
                    className="text-3xl font-light leading-[1.1] mb-3"
                    style={{ fontFamily: display, color: C.cream }}
                >
                    {location.name}
                </h3>

                {/* Description */}
                {location.description && (
                    <p
                        className="text-sm leading-[1.7] mb-6"
                        style={{ fontFamily: body, color: C.sage }}
                    >
                        {location.description}
                    </p>
                )}

                {/* Capacity */}
                {location.capacity && (
                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-sm mb-6"
                        style={{ background: `${C.sage}10`, border: `1px solid ${C.sage}15` }}
                    >
                        <span className="text-xs tracking-[0.15em] uppercase" style={{ fontFamily: body, color: C.sage }}>
                            Capacity
                        </span>
                        <span className="text-lg font-light ml-auto" style={{ fontFamily: display, color: C.cream }}>
                            {location.capacity}
                        </span>
                    </div>
                )}

                {/* Divider */}
                <div className="h-[1px] mb-6" style={{ background: `${C.sage}15` }} />

                {/* Nearby */}
                <div className="mb-4">
                    <span
                        className="text-[10px] tracking-[0.25em] uppercase"
                        style={{ fontFamily: body, color: C.wood }}
                    >
                        Nearby
                    </span>
                </div>

                <div className="space-y-2">
                    {nearby.map((n, i) => {
                        const nCat = CATEGORIES.find(c => c.id === n.location.category)!;
                        return (
                            <motion.div
                                key={i}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-sm"
                                style={{ background: `${C.sage}08` }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                            >
                                <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ background: nCat.color }}
                                />
                                <div className="flex-1 min-w-0">
                                    <span
                                        className="text-xs block truncate"
                                        style={{ fontFamily: body, color: C.cream }}
                                    >
                                        {n.location.shortName}
                                    </span>
                                    <span
                                        className="text-[10px] block"
                                        style={{ fontFamily: body, color: `${C.sage}80` }}
                                    >
                                        {nCat.label}
                                    </span>
                                </div>
                                <span
                                    className="text-[10px] tracking-[0.1em] shrink-0"
                                    style={{ fontFamily: mono, color: nCat.color }}
                                >
                                    {distanceToWalkTime(n.distance)}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Proximity summary */}
                <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${C.sage}15` }}>
                    <span
                        className="text-[10px] tracking-[0.25em] uppercase block mb-3"
                        style={{ fontFamily: body, color: C.wood }}
                    >
                        Closest by type
                    </span>
                    <div className="space-y-1.5">
                        {CATEGORIES.filter(c => c.id !== location.category).map(c => {
                            const nearest = getNearby(location, 1, [c.id]);
                            if (nearest.length === 0) return null;
                            return (
                                <div key={c.id} className="flex items-center justify-between">
                                    <span className="text-[11px]" style={{ fontFamily: body, color: `${C.sage}90` }}>
                                        {c.icon} {c.label}
                                    </span>
                                    <span className="text-[10px]" style={{ fontFamily: mono, color: c.color }}>
                                        {nearest[0].location.shortName} · {distanceToWalkTime(nearest[0].distance)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ================================================================== */
/*  DEV DESIGN BOARDS NAV (minimal bottom bar)                         */
/* ================================================================== */
const devBoardPages = [
    { id: 'motion', label: 'Motion', href: '/moodboard/motion' },
    { id: 'fonts', label: 'Type', href: '/moodboard/fonts' },
    { id: 'scrollytelling', label: 'Scroll', href: '/moodboard/scrollytelling' },
    { id: 'animations', label: 'Interact', href: '/moodboard/animations' },
    { id: 'vocabulary', label: 'Vocab', href: '/moodboard/vocabulary' },
    { id: 'easing', label: 'Easing', href: '/moodboard/easing' },
    { id: 'color', label: 'Color', href: '/moodboard/color' },
    { id: 'scrollcraft', label: 'GSAP', href: '/moodboard/scrollcraft' },
    { id: 'snapflow', label: 'Snap', href: '/moodboard/snapflow' },
    { id: 'designs', label: 'Play', href: '/designs' },
];

function DevBoardsNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating bottom-right trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
                style={{
                    background: `${C.groveDark}CC`,
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${C.sage}20`,
                }}
            >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.sage }} />
                <span
                    className="text-[9px] tracking-[0.15em] uppercase"
                    style={{ fontFamily: mono, color: C.sage }}
                >
                    {isOpen ? 'Close' : "Dave's Boards"}
                </span>
            </button>

            {/* Expandable panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-12 right-4 z-[99] p-4 rounded-sm"
                        style={{
                            background: `${C.groveDark}F0`,
                            backdropFilter: 'blur(16px)',
                            border: `1px solid ${C.sage}15`,
                        }}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span
                            className="block text-[9px] tracking-[0.2em] uppercase mb-3"
                            style={{ fontFamily: mono, color: `${C.sage}60` }}
                        >
                            Dev Design Boards
                        </span>
                        <div className="grid grid-cols-2 gap-1" style={{ width: '240px' }}>
                            {devBoardPages.map(page => (
                                <a
                                    key={page.id}
                                    href={page.href}
                                    className="text-[11px] px-2.5 py-1.5 rounded-sm transition-colors"
                                    style={{
                                        fontFamily: body,
                                        color: C.sage,
                                        background: `${C.sage}08`,
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = `${C.sage}18`;
                                        e.currentTarget.style.color = C.cream;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = `${C.sage}08`;
                                        e.currentTarget.style.color = C.sage;
                                    }}
                                >
                                    {page.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ================================================================== */
/*  HERO SECTION                                                       */
/* ================================================================== */
function HeroSection() {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;
        const tl = gsap.timeline({ delay: 0.3 });

        tl.fromTo(ref.current.querySelector('.hero-label'),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 0.5, duration: 0.8, ease: 'power2.out' }
        );
        tl.fromTo(ref.current.querySelectorAll('.hero-word'),
            { y: 80, opacity: 0, skewY: 5 },
            { y: 0, opacity: 1, skewY: 0, duration: 1, stagger: 0.08, ease: 'power4.out' },
            '-=0.5'
        );
        tl.fromTo(ref.current.querySelector('.hero-line'),
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, ease: 'power2.inOut' },
            '-=0.6'
        );
        tl.fromTo(ref.current.querySelector('.hero-sub'),
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
            '-=0.8'
        );
        tl.fromTo(ref.current.querySelector('.hero-cta'),
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.4'
        );
    }, { scope: ref });

    const scrollToMap = () => {
        const mapEl = document.getElementById('venue-map');
        if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
            <TopographicContours opacity={0.06} />

            {/* Horizontal accent line */}
            <div
                className="hero-line absolute left-0 right-0 origin-left"
                style={{ top: '58%', height: '1px', background: `${C.sand}20` }}
            />

            <div className="relative z-10 text-center px-8 max-w-4xl">
                <span
                    className="hero-label block text-[10px] tracking-[0.4em] uppercase mb-8"
                    style={{ fontFamily: mono, color: C.sage }}
                >
                    Interactive Venue Guide
                </span>

                <h1 className="overflow-hidden mb-6">
                    {'Calamigos Ranch'.split(' ').map((word, i) => (
                        <span
                            key={i}
                            className="hero-word inline-block text-[clamp(3rem,10vw,8rem)] font-light leading-[0.92] tracking-tight mx-[0.06em]"
                            style={{ fontFamily: display, color: C.cream }}
                        >
                            {word}
                        </span>
                    ))}
                </h1>

                <p
                    className="hero-sub text-base md:text-lg tracking-wide max-w-xl mx-auto leading-relaxed mb-10"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    A luxury digital property guide. Explore 34 spaces across the ranch —
                    find your venue, discover what's nearby, and navigate with ease.
                </p>

                <button
                    onClick={scrollToMap}
                    className="hero-cta inline-flex items-center gap-3 px-6 py-3 rounded-full transition-all group"
                    style={{
                        background: `${C.sage}15`,
                        border: `1px solid ${C.sage}25`,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = `${C.sage}25`;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = `${C.sage}15`;
                    }}
                >
                    <span
                        className="text-xs tracking-[0.15em] uppercase"
                        style={{ fontFamily: body, color: C.cream }}
                    >
                        Explore the map
                    </span>
                    <motion.span
                        style={{ color: C.sage }}
                        animate={{ y: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        ↓
                    </motion.span>
                </button>
            </div>
        </section>
    );
}

/* ================================================================== */
/*  MAIN MAP SECTION                                                   */
/* ================================================================== */
function VenueMap() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [activeCategories, setActiveCategories] = useState<Set<Category>>(
        new Set(CATEGORIES.map(c => c.id))
    );
    const [filterUI, setFilterUI] = useState<'accordion' | 'toggles'>('toggles');
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const mapRef = useRef<HTMLDivElement>(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMapReady(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const selectedLocation = selectedIndex !== null ? LOCATIONS[selectedIndex] : null;

    const nearbyLocations = useMemo(() => {
        if (!selectedLocation) return [];
        return getNearby(selectedLocation, 5);
    }, [selectedLocation]);

    const nearbyIndices = useMemo(
        () => new Set(nearbyLocations.map(n => n.index)),
        [nearbyLocations]
    );

    const handleToggleCategory = useCallback((cat: Category) => {
        setActiveCategories(prev => {
            const next = new Set(prev);
            if (next.has(cat)) {
                next.delete(cat);
            } else {
                next.add(cat);
            }
            return next;
        });
    }, []);

    const handlePinClick = useCallback((index: number) => {
        setSelectedIndex(prev => prev === index ? null : index);
    }, []);

    return (
        <section id="venue-map" className="relative min-h-screen py-16 md:py-24">
            {/* Section header */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
                <span
                    className="block text-[10px] tracking-[0.3em] uppercase mb-3"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Property Map
                </span>
                <h2
                    className="text-4xl md:text-5xl font-light leading-[1.05] mb-4"
                    style={{ fontFamily: display, color: C.cream }}
                >
                    Explore the Ranch
                </h2>
                <p
                    className="text-sm max-w-xl leading-relaxed"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    Select a location to see details and discover what's nearby.
                    Use the category filters to focus on what matters to you.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex gap-6 relative">
                    {/* LEFT SIDEBAR — Category filters */}
                    <div className="hidden lg:block w-[220px] shrink-0">
                        {/* Filter UI switcher */}
                        <div className="flex items-center gap-2 mb-4">
                            <span
                                className="text-[9px] tracking-[0.2em] uppercase"
                                style={{ fontFamily: mono, color: `${C.sage}60` }}
                            >
                                Filter
                            </span>
                            <div className="flex-1" />
                            {(['toggles', 'accordion'] as const).map(ui => (
                                <button
                                    key={ui}
                                    className="text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm transition-colors"
                                    style={{
                                        fontFamily: mono,
                                        color: filterUI === ui ? C.cream : `${C.sage}50`,
                                        background: filterUI === ui ? `${C.sage}15` : 'transparent',
                                    }}
                                    onClick={() => setFilterUI(ui)}
                                >
                                    {ui}
                                </button>
                            ))}
                        </div>

                        {/* Show/hide all */}
                        <div className="flex gap-2 mb-4">
                            <button
                                className="text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded-sm transition-colors"
                                style={{ fontFamily: mono, color: C.sage, background: `${C.sage}10` }}
                                onClick={() => setActiveCategories(new Set(CATEGORIES.map(c => c.id)))}
                            >
                                All on
                            </button>
                            <button
                                className="text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded-sm transition-colors"
                                style={{ fontFamily: mono, color: C.sage, background: `${C.sage}10` }}
                                onClick={() => setActiveCategories(new Set())}
                            >
                                All off
                            </button>
                        </div>

                        {filterUI === 'accordion' ? (
                            <CategoryAccordion activeCategories={activeCategories} onToggle={handleToggleCategory} />
                        ) : (
                            <CategoryToggles activeCategories={activeCategories} onToggle={handleToggleCategory} />
                        )}

                        {/* Legend */}
                        <div className="mt-8 pt-4" style={{ borderTop: `1px solid ${C.sage}15` }}>
                            <span
                                className="text-[9px] tracking-[0.2em] uppercase block mb-3"
                                style={{ fontFamily: mono, color: `${C.sage}40` }}
                            >
                                {LOCATIONS.filter(l => activeCategories.has(l.category)).length} / {LOCATIONS.length} visible
                            </span>
                        </div>
                    </div>

                    {/* MAP CONTAINER */}
                    <div
                        ref={mapRef}
                        className="flex-1 relative rounded-sm overflow-hidden"
                        style={{
                            aspectRatio: '10 / 7',
                            background: C.grove,
                            border: `1px solid ${C.sage}15`,
                        }}
                    >
                        {/* Topographic background */}
                        <TopographicContours opacity={0.1} />

                        {/* Grid overlay */}
                        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03 }}>
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={`v${i}`}
                                    className="absolute top-0 bottom-0"
                                    style={{ left: `${(i + 1) * 10}%`, width: '1px', background: C.sage }}
                                />
                            ))}
                            {[...Array(7)].map((_, i) => (
                                <div
                                    key={`h${i}`}
                                    className="absolute left-0 right-0"
                                    style={{ top: `${(i + 1) * 14.28}%`, height: '1px', background: C.sage }}
                                />
                            ))}
                        </div>

                        {/* Path connectors for selected location */}
                        <AnimatePresence>
                            {selectedLocation && nearbyLocations.map((n, i) => (
                                <PathConnector
                                    key={`${selectedIndex}-${n.index}`}
                                    from={selectedLocation}
                                    to={n.location}
                                    color={CATEGORY_MAP[n.location.category]}
                                    delay={i * 0.08}
                                />
                            ))}
                        </AnimatePresence>

                        {/* Pins */}
                        {mapReady && LOCATIONS.map((loc, i) => {
                            const isVisible = activeCategories.has(loc.category);
                            if (!isVisible) return null;

                            return (
                                <MapPin
                                    key={i}
                                    location={loc}
                                    index={i}
                                    isSelected={selectedIndex === i}
                                    isHighlighted={nearbyIndices.has(i)}
                                    isDimmed={selectedIndex !== null && selectedIndex !== i && !nearbyIndices.has(i)}
                                    isNearby={nearbyIndices.has(i)}
                                    onClick={handlePinClick}
                                />
                            );
                        })}

                        {/* Detail panel overlay */}
                        <AnimatePresence>
                            {selectedLocation && (
                                <DetailPanel
                                    location={selectedLocation}
                                    onClose={() => setSelectedIndex(null)}
                                />
                            )}
                        </AnimatePresence>

                        {/* Empty state */}
                        {activeCategories.size === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p
                                    className="text-sm tracking-[0.1em]"
                                    style={{ fontFamily: body, color: `${C.sage}60` }}
                                >
                                    Enable a category to see locations
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile category pills (visible on small screens) */}
                <div className="lg:hidden mt-4 flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => {
                        const isActive = activeCategories.has(cat.id);
                        return (
                            <button
                                key={cat.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] tracking-[0.08em] uppercase transition-all"
                                style={{
                                    fontFamily: body,
                                    background: isActive ? `${cat.color}20` : `${C.sage}10`,
                                    color: isActive ? cat.color : `${C.sage}60`,
                                    border: `1px solid ${isActive ? cat.color + '30' : 'transparent'}`,
                                }}
                                onClick={() => handleToggleCategory(cat.id)}
                            >
                                <span>{cat.icon}</span>
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ================================================================== */
/*  STATS BAR                                                          */
/* ================================================================== */
function StatsBar() {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;
        gsap.fromTo(
            ref.current.querySelectorAll('.stat-item'),
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { trigger: ref.current, start: 'top 85%' },
            },
        );
    }, { scope: ref });

    const stats = [
        { value: '34', label: 'Locations' },
        { value: '7', label: 'Event Venues' },
        { value: '7', label: 'Cottage Suites' },
        { value: '5', label: 'Pools' },
        { value: '220', label: 'Acres' },
    ];

    return (
        <section ref={ref} className="py-20">
            <div className="max-w-5xl mx-auto px-6 md:px-12">
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    {stats.map((s, i) => (
                        <div key={i} className="stat-item text-center">
                            <span
                                className="block text-3xl md:text-4xl font-light mb-1"
                                style={{ fontFamily: display, color: C.cream }}
                            >
                                {s.value}
                            </span>
                            <span
                                className="text-[10px] tracking-[0.2em] uppercase"
                                style={{ fontFamily: body, color: C.sage }}
                            >
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ================================================================== */
/*  CONCEPT SECTION                                                    */
/* ================================================================== */
function ConceptSection() {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;
        gsap.fromTo(
            ref.current.querySelectorAll('[data-reveal]'),
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: { trigger: ref.current, start: 'top 75%' },
            },
        );
    }, { scope: ref });

    return (
        <section ref={ref} className="py-24" style={{ borderTop: `1px solid ${C.sage}10` }}>
            <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
                <span
                    data-reveal
                    className="block text-[10px] tracking-[0.3em] uppercase mb-6"
                    style={{ fontFamily: body, color: C.wood }}
                >
                    Design Vision
                </span>
                <h2
                    data-reveal
                    className="text-3xl md:text-5xl font-light leading-[1.1] mb-8"
                    style={{ fontFamily: display, color: C.cream }}
                >
                    Not a map. Not a tour.<br />
                    <em style={{ color: C.sand }}>A property guide.</em>
                </h2>
                <p
                    data-reveal
                    className="text-base leading-[1.8] max-w-2xl mx-auto"
                    style={{ fontFamily: body, color: C.sage }}
                >
                    The strongest concept gives prospective guests something beautiful to explore
                    and on-site guests something genuinely useful to navigate with. Every interaction
                    is designed to feel like the ranch itself — warm, considered, and effortlessly elegant.
                </p>
            </div>
        </section>
    );
}

/* ================================================================== */
/*  FOOTER                                                             */
/* ================================================================== */
function Footer() {
    return (
        <footer className="py-16 text-center" style={{ borderTop: `1px solid ${C.sage}10` }}>
            <p
                className="text-xs tracking-[0.2em] uppercase"
                style={{ fontFamily: body, color: `${C.sage}50` }}
            >
                Calamigos Ranch — Interactive Venue Guide Proposal
            </p>
            <p
                className="text-[10px] tracking-[0.15em] mt-2"
                style={{ fontFamily: mono, color: `${C.sage}30` }}
            >
                Design & Development by Dave Peloso
            </p>
        </footer>
    );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export default function Calamigos() {
    useFonts();

    useEffect(() => {
        const timeout = setTimeout(() => ScrollTrigger.refresh(), 150);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <SmoothScroll lerp={0.09} duration={1.3}>
            <div className="min-h-screen" style={{ background: C.groveDark, color: C.cream }}>
                <DevBoardsNav />
                <HeroSection />
                <StatsBar />
                <VenueMap />
                <ConceptSection />
                <Footer />
            </div>
        </SmoothScroll>
    );
}
