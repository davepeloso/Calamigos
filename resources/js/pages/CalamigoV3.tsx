import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SmoothScroll from '@/components/SmoothScroll';
import DeckNav from '@/components/DeckNav';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================== */
/*  CANOPY TOKENS                                                      */
/* ================================================================== */
const C = {
    canopyDark: '#243A32',
    canopy: '#2F4A3F',
    canopyLight: '#3D6152',
    groveDark: '#1A2E25',
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
const mono = "'JetBrains Mono', 'Fira Code', monospace";

/* ================================================================== */
/*  FONT LOADER                                                        */
/* ================================================================== */
function useFonts(): void {
    useEffect(() => {
        const id = '__v3-fonts';
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
/*  CATEGORY SYSTEM                                                    */
/* ================================================================== */
type Category = 'venues' | 'stay' | 'dining' | 'wellness' | 'services';

interface CategoryDef {
    id: Category;
    label: string;
    color: string;
    colorFull: string;
    description: string;
    count?: number;
}

const CATEGORIES: CategoryDef[] = [
    { id: 'venues', label: 'Event Venues', color: '#847963', colorFull: '#A4956E', description: 'Ceremony & reception spaces' },
    { id: 'stay', label: 'Accommodations', color: '#bdc2b6', colorFull: '#D4D9CE', description: 'Cottages & lodging' },
    { id: 'dining', label: 'Dine & Drink', color: '#4d665a', colorFull: '#5E7D6E', description: 'Restaurants, bars & market' },
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

/* Coordinates aligned to the illustrated site map (map.jpg) */
const LOCATIONS: MapLocation[] = [
    // VENUES
    { name: 'The Barn', shortName: 'Barn', x: 0.60, y: 0.51, category: 'venues', description: 'Rustic elegance beneath vaulted timber ceilings.', capacity: '300' },
    { name: 'The Pavilion', shortName: 'Pavilion', x: 0.522, y: 0.631, category: 'venues', description: 'Open-air grandeur beside the creek.', capacity: '400' },
    { name: 'The Oak Room', shortName: 'Oak Room', x: 0.65, y: 0.38, category: 'venues', description: 'Intimate garden setting framed by heritage oaks.', capacity: '150' },
    { name: 'The Redwood Room', shortName: 'Redwood Room', x: 0.78, y: 0.07, category: 'venues', description: 'Cathedral-scale redwood hall.', capacity: '250' },
    { name: 'The Grove', shortName: 'Grove', x: 0.392, y: 0.531, category: 'venues', description: 'Shaded ceremony meadow under a living canopy.', capacity: '200' },
    { name: 'The Meadows', shortName: 'Meadows', x: 0.69, y: 0.46, category: 'venues', description: 'Sweeping hillside lawn with mountain views.', capacity: '500' },
    { name: 'The North 40', shortName: 'North 40', x: 0.402, y: 0.661, category: 'venues', description: 'Expansive outdoor space for large gatherings.', capacity: '800' },
    // STAY
    { name: 'Falling Oaks Cottages', shortName: 'Falling Oaks', x: 0.292, y: 0.400, category: 'stay', description: 'Secluded woodland cottages with private porches.' },
    { name: 'Butterfly Lane Cottage', shortName: 'Butterfly Ln', x: 0.362, y: 0.381, category: 'stay', description: 'Garden-view cottage along the butterfly corridor.' },
    { name: 'Sunset Meadows Cottages', shortName: 'Sunset Mdws', x: 0.372, y: 0.501, category: 'stay', description: 'West-facing suites with golden-hour views.' },
    { name: 'Pavilion Cottage Suites', shortName: 'Pavilion Cts', x: 0.442, y: 0.741, category: 'stay', description: 'Premium suites steps from the main pavilion.' },
    { name: 'Calamigos Camper', shortName: 'Camper', x: 0.75, y: 0.27, category: 'stay', description: 'Members-only glamping lodge.' },
    { name: 'The Red Cottage', shortName: 'Red Cottage', x: 0.62, y: 0.45, category: 'stay', description: 'The original ranch cottage, fully restored.' },
    { name: 'Tree House', shortName: 'Tree House', x: 0.63, y: 0.51, category: 'stay', description: 'Elevated retreat with canopy views.' },
    // DINING
    { name: 'Members Clubhouse & Pizza Bar', shortName: 'Clubhouse', x: 0.232, y: 0.381, category: 'dining', description: 'Wood-fired pizza and craft cocktails.' },
    { name: 'The House Bar', shortName: 'House Bar', x: 0.522, y: 0.301, category: 'dining', description: 'Ranch signature cocktails.' },
    { name: 'Gentry Market', shortName: 'Market', x: 0.582, y: 0.400, category: 'dining', description: 'Artisan provisions and coffee.' },
    { name: 'BOOTHILL Little Shop', shortName: 'Boothill', x: 0.73, y: 0.32, category: 'dining', description: 'Ranch merchandise and curated gifts.' },
    // WELLNESS
    { name: 'Spa Calamigos', shortName: 'Spa', x: 0.592, y: 0.321, category: 'wellness', description: 'Full-service spa with canyon views.' },
    { name: 'Resort Pool & Pickleball', shortName: 'Resort Pool', x: 0.502, y: 0.351, category: 'wellness', description: 'Main resort pool with lounge deck.' },
    { name: 'Members Pool & Studio', shortName: 'Members Pool', x: 0.252, y: 0.501, category: 'wellness', description: 'Private pool with yoga studio.' },
    { name: 'Pavilion Pool', shortName: 'Pvln Pool', x: 0.382, y: 0.771, category: 'wellness', description: 'Adults-only infinity pool.' },
    { name: 'Estate Pool', shortName: 'Estate Pool', x: 0.78, y: 0.16, category: 'wellness', description: 'Hillside pool with panoramic views.' },
    { name: 'The Beach Club', shortName: 'Beach Club', x: 0.67, y: 0.06, category: 'wellness', description: 'Sandy oasis with cabanas.' },
    { name: 'Ferris Wheel', shortName: 'Ferris Whl', x: 0.552, y: 0.721, category: 'wellness', description: 'Iconic ranch landmark.' },
    { name: 'Stables', shortName: 'Stables', x: 0.102, y: 0.381, category: 'wellness', description: 'Equestrian center with guided rides.' },
    { name: 'The Vineyards', shortName: 'Vineyards', x: 0.142, y: 0.351, category: 'wellness', description: 'Estate vineyard with tastings.' },
    // SERVICES
    { name: 'Lobby & Valet', shortName: 'Lobby', x: 0.192, y: 0.471, category: 'services', description: 'Main entrance with concierge.' },
    { name: 'Events Office', shortName: 'Events', x: 0.73, y: 0.15, category: 'services', description: 'Event coordination office.' },
    { name: 'Star C / Ranch Club Lot', shortName: 'Ranch Lot', x: 0.65, y: 0.26, category: 'services', description: 'Primary guest parking.' },
    { name: 'Pavilion Lot', shortName: 'Pvln Lot', x: 0.362, y: 0.711, category: 'services', description: 'Pavilion and cottage parking.' },
    { name: 'North 40 Lot', shortName: 'N40 Lot', x: 0.202, y: 0.730, category: 'services', description: 'Overflow and event parking.' },
    { name: 'Pavilion & Cottages Area', shortName: 'Cottage Area', x: 0.62, y: 0.68, category: 'services', description: 'Cottage check-in hub.' },
    { name: 'VARIANT3D Office', shortName: 'V3D', x: 0.582, y: 0.461, category: 'services', description: 'Creative technology studio.' },
];

const ENTRANCE: MapLocation = {
    name: 'Main Entrance',
    shortName: 'Entrance',
    x: 0.192, y: 0.471,
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

function getWaypoints(from: MapLocation, to: MapLocation): MapLocation[] {
    const d = dist(from, to);
    return LOCATIONS
        .filter(l => l.name !== from.name && l.name !== to.name)
        .filter(l => {
            const dFromStart = dist(from, l);
            const dFromEnd = dist(to, l);
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
            <path d="M200 480 C280 450,360 420,440 440 S560 490,640 460 S740 430,820 450" stroke={C.sage} strokeWidth="0.7" />
            <path d="M100 600 C180 560,260 530,340 520 S450 510,530 490 S650 460,750 440 S860 410,950 380" stroke={C.sage} strokeWidth="1" strokeDasharray="8 6" />
        </svg>
    );
}

/* ================================================================== */
/*  ROAD NETWORK SVG — traced from the illustrated site map            */
/*  Coordinates are in 0–1000 x 0–700 viewBox (matching 10:7 ratio)   */
/* ================================================================== */

/* Road segment data — shifted to align with illustrated map (+10x, -42y) */
const ROADS = {
    /* Mulholland Highway — runs along the far-west edge of the property */
    mulholland: 'M 40 658 C 40 578, 55 498, 65 438 S 75 358, 80 298 S 85 218, 90 158 S 95 98, 90 48 L 85 -22',

    /* Main Entry Road — curves from Mulholland east to the lobby */
    entry: 'M 65 438 C 90 433, 120 426, 150 418 Q 175 413, 190 408 Q 205 403, 220 398',

    /* Ranch Road — main east-west artery through the property core */
    ranchRoad: 'M 220 398 C 260 388, 310 373, 360 358 Q 410 343, 450 333 Q 490 323, 520 316 Q 550 308, 580 303 Q 610 298, 640 293',

    /* Central Loop — connects pools, spa, market, and gathering spaces */
    centralLoop: 'M 450 333 C 460 353, 470 378, 480 398 Q 490 418, 510 433 Q 530 448, 560 453 Q 590 458, 610 448 Q 630 436, 640 418 Q 650 398, 655 378 Q 658 358, 650 338 Q 642 318, 630 303',

    /* North Fork — from ranch road up to Redwood, Beach Club, Estate */
    northFork: 'M 640 293 C 655 268, 670 238, 690 208 Q 710 178, 730 153 Q 750 128, 765 103 Q 780 78, 785 53',

    /* South Loop — from central area down to Pavilion, North 40 */
    southLoop: 'M 450 333 C 440 368, 430 408, 425 443 Q 420 478, 410 503 Q 400 528, 395 548 Q 390 568, 400 588 Q 410 608, 430 618',

    /* Pavilion Spur — from south loop to the pavilion area */
    pavilionSpur: 'M 410 503 C 440 506, 470 510, 500 513 Q 520 516, 540 518',

    /* Cottage Path West — from entry area to falling oaks & butterfly lane */
    cottagePath: 'M 220 398 C 240 383, 270 368, 290 358 Q 310 348, 330 343 Q 350 338, 365 336',

    /* Ferris Wheel Road — curves down to the ferris wheel area */
    ferrisRoad: 'M 430 618 C 460 623, 500 628, 530 626 Q 555 623, 570 616 Q 585 608, 590 593',

    /* Creek — runs east-west through the property, dashed */
    creek: 'M 50 478 C 130 468, 210 463, 290 458 Q 370 453, 450 458 Q 530 463, 610 456 Q 690 448, 770 443 Q 850 438, 930 428',

    /* Vineyard Lane — from stables/entrance to vineyards */
    vineyardLane: 'M 65 438 C 70 418, 85 398, 100 378 Q 115 358, 130 343 Q 145 328, 140 313',

    /* Estate Road — from north fork to estate pool and events office */
    estateRoad: 'M 730 153 C 745 148, 760 143, 780 138 Q 800 133, 810 123',
} as const;

/** Styled SVG road network — overlays on the map */
function RoadNetwork({ opacity = 0.15, showCreek = true }: { opacity?: number; showCreek?: boolean }) {
    return (
        <svg viewBox="0 0 1000 700" fill="none" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
            {/* Mulholland Hwy — slightly heavier as the main public road */}
            <path d={ROADS.mulholland} stroke={`${C.sage}`} strokeWidth="2.5" opacity={opacity * 1.2} strokeLinecap="round" />
            {/* "Mulholland" label along the road */}
            <text x="35" y="560" fill={C.sage} opacity={opacity * 0.8} fontSize="9"
                  fontFamily="'JetBrains Mono', monospace" letterSpacing="2" transform="rotate(-80, 35, 560)">
                MULHOLLAND HWY
            </text>

            {/* Main roads — medium weight */}
            <path d={ROADS.entry} stroke={C.sage} strokeWidth="1.8" opacity={opacity} strokeLinecap="round" />
            <path d={ROADS.ranchRoad} stroke={C.sage} strokeWidth="1.8" opacity={opacity} strokeLinecap="round" />
            <path d={ROADS.northFork} stroke={C.sage} strokeWidth="1.5" opacity={opacity} strokeLinecap="round" />
            <path d={ROADS.southLoop} stroke={C.sage} strokeWidth="1.5" opacity={opacity} strokeLinecap="round" />

            {/* Secondary roads — lighter */}
            <path d={ROADS.centralLoop} stroke={C.sage} strokeWidth="1.2" opacity={opacity * 0.8} strokeLinecap="round" />
            <path d={ROADS.pavilionSpur} stroke={C.sage} strokeWidth="1.2" opacity={opacity * 0.8} strokeLinecap="round" />
            <path d={ROADS.cottagePath} stroke={C.sage} strokeWidth="1.0" opacity={opacity * 0.7} strokeLinecap="round" />
            <path d={ROADS.ferrisRoad} stroke={C.sage} strokeWidth="1.0" opacity={opacity * 0.7} strokeLinecap="round" />
            <path d={ROADS.vineyardLane} stroke={C.sage} strokeWidth="1.0" opacity={opacity * 0.7} strokeLinecap="round" />
            <path d={ROADS.estateRoad} stroke={C.sage} strokeWidth="1.0" opacity={opacity * 0.7} strokeLinecap="round" />

            {/* Creek — dashed blue-green line */}
            {showCreek && (
                <path d={ROADS.creek} stroke="#6B9FAF" strokeWidth="1.5" opacity={opacity * 0.6}
                      strokeLinecap="round" strokeDasharray="6 4" />
            )}

            {/* Road intersection dots */}
            {[
                [220, 398], // Entry/Ranch Road junction
                [450, 333], // Ranch Road/Central Loop/South Loop junction
                [640, 293], // Ranch Road/North Fork junction
                [410, 503], // South Loop/Pavilion Spur junction
                [730, 153], // North Fork/Estate Road junction
            ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="2.5" fill={C.sage} opacity={opacity * 0.5} />
            ))}
        </svg>
    );
}

/**
 * Find the nearest road node and build a path along roads from A to B.
 * Returns an SVG path string that follows the road network rather than a straight line.
 */
/* Road nodes shifted to match illustrated map coordinates (+0.01x, -0.06y) */
const ROAD_NODES: [number, number][] = [
    [0.065, 0.626], // Mulholland south
    [0.065, 0.426], // Mulholland @ entry
    [0.085, 0.283], // Mulholland mid
    [0.090, 0.140], // Mulholland north
    [0.140, 0.295], // Vineyard lane end
    [0.190, 0.397], // Entry road mid
    [0.220, 0.380], // Entry/Ranch junction
    [0.290, 0.340], // Cottage path
    [0.365, 0.318], // Cottage path end
    [0.360, 0.340], // Ranch road mid-west
    [0.450, 0.315], // Ranch/Central/South junction
    [0.520, 0.298], // Ranch road mid
    [0.580, 0.285], // Ranch road mid-east
    [0.640, 0.275], // Ranch/North junction
    [0.655, 0.360], // Central loop east
    [0.610, 0.430], // Central loop south
    [0.510, 0.415], // Central loop south-west
    [0.480, 0.380], // Central loop west
    [0.440, 0.350], // South loop entry
    [0.425, 0.425], // South loop mid-north
    [0.410, 0.485], // South loop/pavilion junction
    [0.395, 0.530], // South loop mid-south
    [0.400, 0.570], // South loop near ferris
    [0.430, 0.600], // South loop bottom
    [0.540, 0.500], // Pavilion spur end
    [0.500, 0.495], // Pavilion spur mid
    [0.590, 0.575], // Ferris road
    [0.690, 0.190], // North fork mid
    [0.730, 0.135], // North fork/estate junction
    [0.765, 0.085], // North fork upper
    [0.785, 0.055], // North fork top (beach club)
    [0.810, 0.105], // Estate road end
];

/** Map graph edges — indices into ROAD_NODES, defining which nodes are connected */
const ROAD_EDGES: [number, number][] = [
    [0, 1], [1, 2], [2, 3],         // Mulholland
    [1, 4],                          // Vineyard lane
    [1, 5], [5, 6],                  // Entry road
    [6, 7], [7, 8],                  // Cottage path
    [6, 9], [9, 10],                 // Ranch road west
    [10, 11], [11, 12], [12, 13],   // Ranch road east
    [13, 14], [14, 15], [15, 16], [16, 17], [17, 10], // Central loop
    [10, 18], [18, 19], [19, 20],   // South loop upper
    [20, 21], [21, 22], [22, 23],   // South loop lower
    [20, 25], [25, 24],             // Pavilion spur
    [23, 26],                        // Ferris road
    [13, 27], [27, 28],             // North fork
    [28, 29], [29, 30],             // North fork upper
    [28, 31],                        // Estate road
];

/** Find the closest road node to a map location */
function nearestNode(loc: MapLocation): number {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < ROAD_NODES.length; i++) {
        const d = Math.sqrt((loc.x - ROAD_NODES[i][0]) ** 2 + (loc.y - ROAD_NODES[i][1]) ** 2);
        if (d < bestDist) {
            bestDist = d;
            best = i;
        }
    }
    return best;
}

/** BFS shortest path on the road graph */
function bfsPath(startNode: number, endNode: number): number[] {
    if (startNode === endNode) return [startNode];

    const adj: Map<number, number[]> = new Map();
    for (const [a, b] of ROAD_EDGES) {
        if (!adj.has(a)) adj.set(a, []);
        if (!adj.has(b)) adj.set(b, []);
        adj.get(a)!.push(b);
        adj.get(b)!.push(a);
    }

    const visited = new Set<number>([startNode]);
    const parent = new Map<number, number>();
    const queue = [startNode];

    while (queue.length > 0) {
        const current = queue.shift()!;
        for (const neighbor of (adj.get(current) || [])) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                parent.set(neighbor, current);
                if (neighbor === endNode) {
                    // Reconstruct path
                    const path: number[] = [endNode];
                    let node = endNode;
                    while (parent.has(node)) {
                        node = parent.get(node)!;
                        path.unshift(node);
                    }
                    return path;
                }
                queue.push(neighbor);
            }
        }
    }
    return [startNode, endNode]; // fallback
}

/** Build a smooth SVG path along the road network between two locations */
function buildRoadPath(from: MapLocation, to: MapLocation): string {
    const startNode = nearestNode(from);
    const endNode = nearestNode(to);
    const nodePath = bfsPath(startNode, endNode);

    // Build path: from location → nearest node → road nodes → nearest node → to location
    const points: [number, number][] = [
        [from.x * 1000, from.y * 700],
        ...nodePath.map(n => [ROAD_NODES[n][0] * 1000, ROAD_NODES[n][1] * 700] as [number, number]),
        [to.x * 1000, to.y * 700],
    ];

    if (points.length < 2) return '';

    let d = `M ${points[0][0]} ${points[0][1]}`;

    if (points.length === 2) {
        d += ` L ${points[1][0]} ${points[1][1]}`;
    } else {
        // Catmull-Rom-ish smooth curves through points
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const mx = (prev[0] + curr[0]) / 2;
            const my = (prev[1] + curr[1]) / 2;
            d += ` Q ${prev[0] + (curr[0] - prev[0]) * 0.5} ${prev[1]} ${mx} ${my}`;
        }
        const last = points[points.length - 1];
        d += ` L ${last[0]} ${last[1]}`;
    }

    return d;
}

/* ================================================================== */
/*  DEV BOARDS NAV                                                     */
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
        { label: 'v1.2', href: '/v2' },
        { label: 'Cover', href: '/' },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: `${C.canopyDark}CC`, backdropFilter: 'blur(8px)', border: `1px solid ${C.sage}20` }}
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
                        style={{ background: `${C.canopyDark}F0`, backdropFilter: 'blur(16px)', border: `1px solid ${C.sage}15` }}
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
/*  HERO HEADER — v1.0 style with new copy                            */
/* ================================================================== */
function HeroHeader({ onExplore }: { onExplore: () => void }) {
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

    return (
        <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden"
                 style={{ background: `linear-gradient(180deg, ${C.canopyDark} 0%, ${C.canopy} 60%, ${C.canopyLight}40 100%)` }}>
            <TopoLines opacity={0.05} />

            {/* Horizontal accent line */}
            <div
                className="hero-line absolute left-0 right-0 origin-left"
                style={{ top: '58%', height: '1px', background: `${C.sand}15` }}
            />

            <div className="relative z-10 text-center px-8 max-w-4xl">
                <span
                    className="hero-label block text-[10px] tracking-[0.4em] uppercase mb-8"
                    style={{ fontFamily: mono, color: C.sage }}
                >
                    Calamigos Ranch
                </span>

                <h1 className="overflow-hidden mb-6">
                    {'Guided Tour'.split(' ').map((word, i) => (
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
                    Explore 34 spaces across the ranch — find your venue, discover
                    what's nearby, and navigate with ease.
                </p>

                <button
                    onClick={onExplore}
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
/*  CATEGORY PANELS + MAP — panels overlay the map & slide away        */
/* ================================================================== */
/* Canopy gradient palette for the 5 panels — subtle differentiation */
const panelGradients = [
    `linear-gradient(135deg, ${C.canopyDark} 0%, #2A4238 50%, ${C.canopy}D0 100%)`,
    `linear-gradient(135deg, #28403A 0%, ${C.canopy} 50%, ${C.canopyLight}C0 100%)`,
    `linear-gradient(135deg, ${C.canopy} 0%, #345548 50%, ${C.canopyLight}D0 100%)`,
    `linear-gradient(135deg, #2D4840 0%, ${C.canopyLight}E0 50%, #4A7264C0 100%)`,
    `linear-gradient(135deg, ${C.canopyLight}D0 0%, #4A7264 50%, #537A6CC0 100%)`,
];

interface CategoryMapProps {
    onSelectCategory: (cat: Category) => void;
    onSelectLocation: (index: number) => void;
    selectedCategory: Category | null;
    isRevealed: boolean;
}

function CategoryMap({ onSelectCategory, onSelectLocation, selectedCategory, isRevealed }: CategoryMapProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const cat = selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)! : null;
    const categoryLocations = useMemo(
        () => selectedCategory
            ? LOCATIONS.map((l, i) => ({ ...l, globalIndex: i })).filter(l => l.category === selectedCategory)
            : [],
        [selectedCategory],
    );
    const otherLocations = useMemo(
        () => selectedCategory
            ? LOCATIONS.map((l, i) => ({ ...l, globalIndex: i })).filter(l => l.category !== selectedCategory)
            : LOCATIONS.map((l, i) => ({ ...l, globalIndex: i })),
        [selectedCategory],
    );

    return (
        <section className="relative" id="category-map">
            <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
                {/* Category filter bar when map is revealed */}
                <AnimatePresence>
                    {isRevealed && (
                        <motion.div
                            className="flex items-center justify-center gap-2 mb-8 flex-wrap"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {CATEGORIES.map(c => {
                                const isActive = selectedCategory === c.id;
                                const count = LOCATIONS.filter(l => l.category === c.id).length;
                                return (
                                    <button
                                        key={c.id}
                                        onClick={() => onSelectCategory(c.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
                                        style={{
                                            background: isActive ? `${c.color}25` : `${C.sage}08`,
                                            border: `1px solid ${isActive ? c.color + '40' : 'transparent'}`,
                                        }}
                                    >
                                        <span className="w-2 h-2 rounded-full" style={{ background: c.color, opacity: isActive ? 1 : 0.5 }} />
                                        <span className="text-[10px] tracking-[0.1em] uppercase" style={{ fontFamily: body, color: isActive ? C.cream : C.sage }}>
                                            {c.label}
                                        </span>
                                        <span className="text-[9px]" style={{ fontFamily: mono, color: `${C.sage}60` }}>{count}</span>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Map container — always rendered, panels overlay it */}
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

                    {/* All pins — shown when map is revealed */}
                    <AnimatePresence>
                        {isRevealed && (
                            <>
                                {/* Dimmed pins (other categories or all when no filter) */}
                                {otherLocations.map((loc, i) => (
                                    <motion.div
                                        key={`other-${loc.globalIndex}`}
                                        className="absolute -translate-x-1/2 -translate-y-1/2"
                                        style={{ left: `${loc.x * 100}%`, top: `${loc.y * 100}%` }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3 + i * 0.02 }}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${C.sage}25` }} />
                                    </motion.div>
                                ))}

                                {/* Active category pins with labels */}
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
                                        <div className="w-3 h-3 rounded-full transition-shadow group-hover:shadow-lg"
                                             style={{ background: cat!.color, boxShadow: `0 0 0 2px ${C.groveDark}` }} />
                                        <span
                                            className="mt-1 text-[9px] tracking-[0.08em] uppercase whitespace-nowrap px-1.5 py-0.5 rounded-sm opacity-70 group-hover:opacity-100 transition-opacity"
                                            style={{ fontFamily: body, color: C.cream, background: `${C.groveDark}B0` }}
                                        >
                                            {loc.shortName}
                                        </span>
                                    </motion.button>
                                ))}

                                {/* Entrance pin */}
                                <motion.div
                                    className="absolute -translate-x-1/2 -translate-y-1/2 z-5"
                                    style={{ left: `${ENTRANCE.x * 100}%`, top: `${ENTRANCE.y * 100}%` }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: C.cream, background: `${C.groveDark}80` }} />
                                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.1em] uppercase whitespace-nowrap"
                                          style={{ fontFamily: mono, color: `${C.cream}80` }}>
                                        Entrance
                                    </span>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* ===== CATEGORY PANELS OVERLAY ===== */}
                    {/* 5 horizontal panels sitting on top of the map — they slide away when a category is selected */}
                    <AnimatePresence>
                        {!isRevealed && (
                            <motion.div
                                className="absolute inset-0 z-20 flex"
                                exit={{ opacity: 0, transition: { duration: 0.1, delay: 0.5 } }}
                            >
                                {CATEGORIES.map((c, i) => {
                                    const isHovered = hoveredIndex === i;
                                    const otherHovered = hoveredIndex !== null && hoveredIndex !== i;
                                    const count = LOCATIONS.filter(l => l.category === c.id).length;

                                    return (
                                        <motion.button
                                            key={c.id}
                                            className="relative h-full flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                                            style={{
                                                background: panelGradients[i],
                                                borderRight: i < 4 ? `1px solid ${C.canopyDark}40` : 'none',
                                            }}
                                            onMouseEnter={() => setHoveredIndex(i)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                            onClick={() => onSelectCategory(c.id)}
                                            initial={{ opacity: 0, flex: 1 }}
                                            animate={{
                                                opacity: 1,
                                                flex: isHovered ? 1.5 : otherHovered ? 0.88 : 1,
                                            }}
                                            exit={{
                                                y: i % 2 === 0 ? '-100%' : '100%',
                                                opacity: 0,
                                                transition: { duration: 0.5, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] },
                                            }}
                                            transition={{
                                                opacity: { duration: 0.5, delay: i * 0.08 },
                                                flex: { type: 'spring', stiffness: 300, damping: 30 },
                                            }}
                                        >
                                            {/* Topo texture */}
                                            <div className="absolute inset-0 opacity-[0.04]">
                                                <TopoLines opacity={1} />
                                            </div>

                                            {/* Content */}
                                            <div className="relative z-10 text-center px-3">
                                                <motion.span
                                                    className="block text-[10px] tracking-[0.3em] uppercase mb-4"
                                                    style={{ fontFamily: mono, color: `${C.cream}40` }}
                                                    animate={{ opacity: isHovered ? 0.8 : 0.4 }}
                                                >
                                                    0{i + 1}
                                                </motion.span>

                                                <motion.h2
                                                    className="text-lg md:text-xl lg:text-2xl font-light tracking-wide"
                                                    style={{
                                                        fontFamily: display,
                                                        color: `${C.cream}D0`,
                                                        writingMode: isHovered ? 'horizontal-tb' : 'vertical-rl',
                                                        textOrientation: 'mixed',
                                                        transition: 'writing-mode 0.3s',
                                                    }}
                                                    animate={{
                                                        opacity: isHovered ? 1 : 0.65,
                                                        scale: isHovered ? 1.05 : 1,
                                                    }}
                                                >
                                                    {c.label}
                                                </motion.h2>

                                                <AnimatePresence>
                                                    {isHovered && (
                                                        <motion.p
                                                            className="mt-3 text-xs tracking-wide max-w-[160px]"
                                                            style={{ fontFamily: body, color: `${C.cream}80` }}
                                                            initial={{ opacity: 0, y: 8 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 4 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {c.description}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>

                                                <motion.span
                                                    className="block mt-4 text-[9px] tracking-[0.2em]"
                                                    style={{ fontFamily: mono, color: `${C.cream}30` }}
                                                    animate={{ opacity: isHovered ? 0.7 : 0.3 }}
                                                >
                                                    {count} spaces
                                                </motion.span>

                                                {/* Category swatch dot */}
                                                <motion.div
                                                    className="mt-3 mx-auto w-3 h-3 rounded-full"
                                                    style={{ background: c.color }}
                                                    animate={{ scale: isHovered ? 1.3 : 1, opacity: isHovered ? 1 : 0.5 }}
                                                />
                                            </div>

                                            {/* Bottom accent */}
                                            <motion.div
                                                className="absolute bottom-0 left-0 right-0 origin-left"
                                                style={{ height: '2px', background: c.color }}
                                                animate={{ scaleX: isHovered ? 1 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </motion.button>
                                    );
                                })}

                                {/* "Select a category" prompt at bottom */}
                                <motion.div
                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    transition={{ delay: 1.2, duration: 1 }}
                                >
                                    <span className="text-[10px] tracking-[0.2em] uppercase px-4 py-2 rounded-full"
                                          style={{ fontFamily: body, color: C.cream, background: `${C.canopyDark}80`, backdropFilter: 'blur(8px)' }}>
                                        Select a category to explore the map
                                    </span>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Instruction below map when revealed */}
                <AnimatePresence>
                    {isRevealed && selectedCategory && (
                        <motion.div
                            className="mt-6 text-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="text-xs tracking-[0.15em]" style={{ fontFamily: body, color: `${C.sage}80` }}>
                                Select a destination to begin your journey
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

/* ================================================================== */
/*  LOCATION DETAIL — scrollytelling with vector line (from v1.2)      */
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

    const lineContainerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: lineContainerRef, offset: ['start center', 'end center'] });
    const lineScale = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

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

            {/* VECTOR LINE + SPLIT LAYOUT */}
            <div ref={lineContainerRef} className="relative">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px]" style={{ background: `${C.sage}15` }}>
                    <motion.div className="w-full origin-top" style={{ background: cat.color, height: '100%', scaleY: lineScale, opacity: 0.4 }} />
                </div>

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

                <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                        {/* LEFT: Media / Route Map */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {!startPoint ? (
                                    <motion.div
                                        key="media"
                                        className="aspect-[4/3] rounded-sm overflow-hidden relative"
                                        style={{ background: `linear-gradient(135deg, ${cat.color}20, ${C.canopy}40)`, border: `1px solid ${C.sage}15` }}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <TopoLines opacity={0.06} />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
                                                 style={{ border: `1px solid ${C.sage}30` }}>
                                                <span className="text-xl" style={{ color: `${C.sage}60` }}>▶</span>
                                            </div>
                                            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: body, color: `${C.sage}60` }}>
                                                Media — Images & Video
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                                            {CATEGORIES.map((c, i) => (
                                                <div key={i} className="flex-1 h-8 rounded-sm" style={{ background: c.color, opacity: c.id === location.category ? 0.8 : 0.2 }} />
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="route-map"
                                        className="aspect-[4/3] rounded-sm overflow-hidden relative"
                                        style={{ background: C.canopy, border: `1px solid ${C.sage}15` }}
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
                                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
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

                                        {/* Walking time */}
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

                            {/* Waypoint narration */}
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

                        {/* RIGHT: Popout Data */}
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
                                        <span className="text-sm block" style={{ fontFamily: display, color: C.cream }}>Main Entrance</span>
                                        <span className="text-[10px]" style={{ fontFamily: body, color: `${C.sage}80` }}>Lobby & Valet</span>
                                    </div>
                                    <span className="text-[10px] tracking-[0.1em]" style={{ fontFamily: mono, color: C.sage }}>
                                        {walkTime(entranceDist)}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Divider */}
                            <div className="my-3 flex items-center gap-3 px-4">
                                <div className="flex-1 h-[1px]" style={{ background: `${C.sage}15` }} />
                                <span className="text-[9px] tracking-[0.25em] uppercase" style={{ fontFamily: body, color: C.wood }}>Nearby</span>
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
/*  ROUTE PATH SVG — now follows the road network                      */
/* ================================================================== */
function RoutePathSVG({ from, to, color }: { from: MapLocation; to: MapLocation; waypoints: MapLocation[]; color: string }) {
    const pathRef = useRef<SVGPathElement>(null);
    const glowRef = useRef<SVGPathElement>(null);

    /* Build the route along actual roads */
    const d = useMemo(() => buildRoadPath(from, to), [from, to]);

    useEffect(() => {
        if (!pathRef.current) return;
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(pathRef.current, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', delay: 0.3 });

        if (glowRef.current) {
            gsap.set(glowRef.current, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(glowRef.current, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', delay: 0.35 });
        }
    }, [from, to, d]);

    return (
        /* Use 1000x700 viewBox to match road network coordinates */
        <>
            {/* Glow layer */}
            <path
                ref={glowRef}
                d={d}
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity="0.15"
            />
            {/* Main path */}
            <path
                ref={pathRef}
                d={d}
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
            />
        </>
    );
}

/* ================================================================== */
/*  PAGE STATE MACHINE                                                 */
/* ================================================================== */
type Phase = 'hero' | 'explore' | 'location';

export default function CalamigoV3() {
    useFonts();

    const [phase, setPhase] = useState<Phase>('hero');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [mapRevealed, setMapRevealed] = useState(false);
    const [selectedLocationIndex, setSelectedLocationIndex] = useState<number | null>(null);
    const [startPointIndex, setStartPointIndex] = useState<number | null>(null);

    const handleExplore = useCallback(() => {
        setPhase('explore');
        setTimeout(() => {
            const el = document.getElementById('category-map');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, []);

    const handleSelectCategory = useCallback((cat: Category) => {
        setSelectedCategory(cat);
        setMapRevealed(true);
    }, []);

    const handleSelectLocation = useCallback((index: number) => {
        setSelectedLocationIndex(index);
        setStartPointIndex(null);
        setPhase('location');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleBackToMap = useCallback(() => {
        setPhase('explore');
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
                <DeckNav currentDeck="v1.3" />
                <DevBoardsNav />

                <AnimatePresence mode="wait">
                    {phase === 'location' && selectedLocationIndex !== null ? (
                        <motion.div key="location" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                            <LocationDetail
                                locationIndex={selectedLocationIndex}
                                onBack={handleBackToMap}
                                onSelectStartPoint={setStartPointIndex}
                                startPointIndex={startPointIndex}
                            />
                        </motion.div>
                    ) : (
                        <motion.div key="hero-explore" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                            <HeroHeader onExplore={handleExplore} />
                            <CategoryMap
                                onSelectCategory={handleSelectCategory}
                                onSelectLocation={handleSelectLocation}
                                selectedCategory={selectedCategory}
                                isRevealed={mapRevealed}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer */}
                <footer className="py-12 text-center" style={{ borderTop: `1px solid ${C.sage}08` }}>
                    <p className="text-[10px] tracking-[0.15em]" style={{ fontFamily: mono, color: `${C.sage}30` }}>
                        Calamigos Ranch · Deck v1.3 · Design & Development by Dave Peloso
                    </p>
                </footer>
            </div>
        </SmoothScroll>
    );
}
