import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SmoothScroll from '@/components/SmoothScroll';
import DeckNav from '@/components/DeckNav';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================== */
/*  TOKENS                                                             */
/* ================================================================== */
const C = {
    bg: '#1A2E25',
    bgDeep: '#141F1A',
    grove: '#2F4A3F',
    groveLight: '#3D6152',
    sand: '#EAE4D8',
    cream: '#F5F2EA',
    sage: '#7A8F82',
    wood: '#8A6B4F',
    woodLight: '#A4845E',
    charcoal: '#2C2C2C',
    water: '#96acac',
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
/*  TOPO LINES                                                         */
/* ================================================================== */
function TopoLines({ opacity = 0.05 }: { opacity?: number }) {
    return (
        <svg viewBox="0 0 1000 700" fill="none" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ opacity }}>
            <path d="M-50 350 C100 280,200 200,350 220 S550 300,650 250 S800 180,950 220" stroke={C.sage} strokeWidth="0.8" />
            <path d="M-30 380 C80 320,180 250,320 260 S520 330,620 290 S780 220,930 250" stroke={C.sage} strokeWidth="0.7" />
            <path d="M-60 420 C60 370,160 300,300 310 S490 370,600 340" stroke={C.sage} strokeWidth="0.7" />
            <path d="M200 480 C280 450,360 420,440 440 S560 490,640 460 S740 430,820 450" stroke={C.sage} strokeWidth="0.6" />
            <path d="M100 600 C180 560,260 530,340 520 S450 510,530 490 S650 460,750 440" stroke={C.sage} strokeWidth="0.9" strokeDasharray="8 6" />
        </svg>
    );
}

/* ================================================================== */
/*  NARRATIVE CHAPTERS                                                 */
/* ================================================================== */
const chapters = [
    {
        number: '01',
        title: 'The Approach',
        subtitle: 'Where the outside world falls away',
        body: 'You turn off Mulholland Highway and the road narrows. Sycamores arch overhead, their canopy filtering the light into soft, moving patterns. Each curve in the drive is deliberate — a decompression chamber designed to shed the pace of the city. By the time you reach the gate, you\'ve already begun to slow down.',
        accent: '#4d665a',
        location: 'Lobby & Valet',
    },
    {
        number: '02',
        title: 'The Oaks',
        subtitle: 'Two hundred years of quiet witness',
        body: 'The valley oaks are the first thing you notice and the last thing you forget. Their canopies span sixty feet, casting shade that moves like water across the ceremony meadow. These trees were here before the ranch, before the road, before the name. They set the scale for everything that follows — not grand, but ancient.',
        accent: '#847963',
        location: 'The Oak Room · The Grove',
    },
    {
        number: '03',
        title: 'The Garden',
        subtitle: 'Terraced stories written in landscape',
        body: 'The property descends in terraces toward the creek bed. Each level reveals a different texture: wild lavender on the upper slopes, heritage David Austin roses framing stone pathways, sculptural agave standing sentinel at the turns. The garden is both sanctuary and stage — a place where every line of sight has been considered.',
        accent: '#96acac',
        location: 'Rose Garden · Butterfly Lane',
    },
    {
        number: '04',
        title: 'The Gathering',
        subtitle: 'Where voices become a single chord',
        body: 'Scattered paths converge at the long tables beneath the oaks. String lights trace the roofline, mirroring the constellations above. The Barn opens its timber doors. The Pavilion extends over the creek, water murmuring beneath the dining floor. Laughter layers into the canyon acoustics. The evening takes on its own gentle rhythm.',
        accent: '#8A6B4F',
        location: 'The Barn · The Pavilion',
    },
    {
        number: '05',
        title: 'The Ceremony',
        subtitle: 'The threshold between before and after',
        body: 'Golden hour arrives not as a moment but as a slow suffusion. The meadow glows. A floral arch frames the far ridge. Every eye is drawn to the same point. The only sound is heartbeat and birdsong. This is what the entire property was designed for — a single, luminous threshold that everything before has been building toward.',
        accent: '#D4A574',
        location: 'The Meadows · The North 40',
    },
    {
        number: '06',
        title: 'The Farewell',
        subtitle: 'What cannot be replicated — only remembered',
        body: 'Lanterns line the path back through the oaks. The night air carries jasmine and embers. Guests leave slowly, reluctantly, tracing the same winding drive that brought them in — but seeing it differently now. The ranch holds its breath and waits. Tomorrow it will begin again.',
        accent: '#bdc2b6',
        location: 'All of Calamigos',
    },
];

/* ================================================================== */
/*  HERO                                                               */
/* ================================================================== */
function Hero() {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;
        const tl = gsap.timeline({ delay: 0.3 });

        tl.fromTo(ref.current.querySelector('.hero-label'),
            { y: 20, opacity: 0 }, { y: 0, opacity: 0.5, duration: 0.8, ease: 'power2.out' });
        tl.fromTo(ref.current.querySelectorAll('.hero-word'),
            { y: 100, opacity: 0, skewY: 6 },
            { y: 0, opacity: 1, skewY: 0, duration: 1.2, stagger: 0.08, ease: 'power4.out' }, '-=0.5');
        tl.fromTo(ref.current.querySelector('.hero-rule'),
            { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.inOut' }, '-=0.7');
        tl.fromTo(ref.current.querySelector('.hero-sub'),
            { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5');
        tl.fromTo(ref.current.querySelector('.scroll-cue'),
            { opacity: 0 }, { opacity: 0.3, duration: 1 }, '-=0.2');

        gsap.to(ref.current.querySelector('.hero-content'), {
            y: -120, opacity: 0,
            scrollTrigger: { trigger: ref.current, start: 'top top', end: '70% top', scrub: 1.5 },
        });
    }, { scope: ref });

    return (
        <section ref={ref} className="relative h-[140vh] overflow-hidden">
            <TopoLines opacity={0.04} />

            <div className="sticky top-0 h-screen flex items-center justify-center">
                <div className="hero-content text-center px-8 max-w-4xl">
                    <span className="hero-label block text-[10px] tracking-[0.4em] uppercase mb-10"
                          style={{ fontFamily: mono, color: C.sage }}>
                        Deck v1.3 — Narrative Journey
                    </span>

                    <h1 className="overflow-hidden mb-0">
                        {'A Walk Through Calamigos'.split(' ').map((word, i) => (
                            <span key={i} className="hero-word inline-block text-[clamp(2.5rem,8vw,6.5rem)] font-light leading-[0.92] tracking-tight mx-[0.05em]"
                                  style={{ fontFamily: display, color: C.cream }}>{word}</span>
                        ))}
                    </h1>

                    <div className="hero-rule h-[1px] w-32 mx-auto my-8 origin-center" style={{ background: `${C.sage}40` }} />

                    <p className="hero-sub text-sm tracking-wide max-w-md mx-auto leading-relaxed"
                       style={{ fontFamily: body, color: C.sage, opacity: 0 }}>
                        Six chapters. One evening. A scrollytelling experience that guides you
                        through the ranch as if you were there.
                    </p>

                    <div className="scroll-cue mt-20 flex flex-col items-center gap-2">
                        <span className="text-[9px] tracking-[0.3em] uppercase" style={{ fontFamily: mono, color: C.sage }}>Begin</span>
                        <div className="w-[1px] h-14 overflow-hidden" style={{ background: `${C.sage}25` }}>
                            <div className="w-full h-4" style={{ background: C.cream, animation: 'v3pulse 2.2s ease-in-out infinite' }} />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`@keyframes v3pulse { 0% { transform: translateY(-16px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(48px); opacity: 0; } }`}</style>
        </section>
    );
}

/* ================================================================== */
/*  CHAPTER SECTION — sticky narrative with scroll-driven line         */
/* ================================================================== */
function ChapterSection({ chapter, index }: { chapter: typeof chapters[0]; index: number }) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
    const lineScale = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
    const textY = useTransform(scrollYProgress, [0.1, 0.4], [60, 0]);
    const textOpacity = useTransform(scrollYProgress, [0.1, 0.35, 0.7, 0.9], [0, 1, 1, 0]);

    const isEven = index % 2 === 0;

    return (
        <section ref={sectionRef} className="relative min-h-[120vh] flex items-center py-24 md:py-32">
            {/* Vertical accent line — center */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px]" style={{ background: `${C.sage}10` }}>
                <motion.div className="w-full origin-top" style={{ background: chapter.accent, height: '100%', scaleY: lineScale, opacity: 0.3 }} />
            </div>

            {/* Chapter number watermark */}
            <motion.span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
                style={{
                    fontFamily: display,
                    fontSize: 'clamp(12rem, 25vw, 22rem)',
                    fontWeight: 300,
                    color: chapter.accent,
                    opacity: useTransform(scrollYProgress, [0.2, 0.4, 0.7, 0.85], [0, 0.03, 0.03, 0]),
                }}
            >
                {chapter.number}
            </motion.span>

            {/* Content — alternating left/right alignment */}
            <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 w-full">
                <motion.div
                    className={`max-w-lg ${isEven ? '' : 'ml-auto text-right'}`}
                    style={{ y: textY, opacity: textOpacity }}
                >
                    <span className="block text-[10px] tracking-[0.3em] uppercase mb-4"
                          style={{ fontFamily: mono, color: chapter.accent }}>
                        Chapter {chapter.number}
                    </span>

                    <span className="block text-xs tracking-[0.15em] uppercase mb-3"
                          style={{ fontFamily: body, color: `${C.sage}80` }}>
                        {chapter.subtitle}
                    </span>

                    <h2 className="text-4xl md:text-6xl font-light leading-[1.0] mb-8"
                        style={{ fontFamily: display, color: C.cream }}>
                        {chapter.title}
                    </h2>

                    <p className="text-sm leading-[2.0] mb-6"
                       style={{ fontFamily: body, color: C.sage }}>
                        {chapter.body}
                    </p>

                    {/* Location tag */}
                    <div className={`flex items-center gap-2 ${isEven ? '' : 'justify-end'}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: chapter.accent }} />
                        <span className="text-[10px] tracking-[0.15em] uppercase"
                              style={{ fontFamily: mono, color: `${C.sage}60` }}>
                            {chapter.location}
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

/* ================================================================== */
/*  JOURNEY PROGRESS — visual chapter markers                          */
/* ================================================================== */
function JourneyProgress() {
    const [activeChapter, setActiveChapter] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const vh = window.innerHeight;
            const scrolled = window.scrollY - vh; // subtract hero
            const chapterHeight = vh * 1.2;
            const idx = Math.max(0, Math.min(chapters.length - 1, Math.floor(scrolled / chapterHeight)));
            setActiveChapter(idx);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-3">
            {chapters.map((ch, i) => (
                <div key={i} className="flex items-center gap-2">
                    <motion.div
                        className="w-2 h-2 rounded-full transition-all duration-300"
                        style={{
                            background: i === activeChapter ? ch.accent : `${C.sage}25`,
                            transform: i === activeChapter ? 'scale(1.4)' : 'scale(1)',
                        }}
                    />
                    <motion.span
                        className="text-[8px] tracking-[0.1em] uppercase transition-opacity duration-300"
                        style={{
                            fontFamily: mono,
                            color: i === activeChapter ? ch.accent : 'transparent',
                        }}
                    >
                        {ch.number}
                    </motion.span>
                </div>
            ))}
        </div>
    );
}

/* ================================================================== */
/*  CLOSING                                                            */
/* ================================================================== */
function Closing() {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;
        gsap.fromTo(ref.current.querySelectorAll('[data-reveal]'),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out',
              scrollTrigger: { trigger: ref.current, start: 'top 70%' } }
        );
    }, { scope: ref });

    return (
        <section ref={ref} className="py-32 md:py-40 text-center relative">
            <TopoLines opacity={0.03} />

            <div className="relative z-10 max-w-3xl mx-auto px-8">
                <div data-reveal className="flex justify-center gap-1.5 mb-12">
                    {chapters.map((ch, i) => (
                        <div key={i} className="w-6 h-[3px] rounded-full" style={{ background: ch.accent, opacity: 0.5 }} />
                    ))}
                </div>

                <h2 data-reveal className="text-4xl md:text-6xl font-light leading-[1.0] mb-6"
                    style={{ fontFamily: display, color: C.cream }}>
                    Not a map. Not a tour.<br />
                    <em style={{ color: C.sand }}>A story.</em>
                </h2>

                <p data-reveal className="text-sm leading-[1.9] max-w-lg mx-auto mb-10"
                   style={{ fontFamily: body, color: C.sage }}>
                    The strongest digital property guide isn't a list of amenities.
                    It's a narrative that makes guests feel what it's like to be there
                    before they arrive.
                </p>

                <div data-reveal className="flex flex-wrap justify-center gap-3">
                    <a href="/v1" className="text-[10px] tracking-[0.12em] uppercase px-4 py-2 rounded-full transition-colors hover:bg-white/5"
                       style={{ fontFamily: mono, color: C.sage, border: `1px solid ${C.sage}20` }}>
                        ← Deck v1.0
                    </a>
                    <a href="/v2" className="text-[10px] tracking-[0.12em] uppercase px-4 py-2 rounded-full transition-colors hover:bg-white/5"
                       style={{ fontFamily: mono, color: C.sage, border: `1px solid ${C.sage}20` }}>
                        Deck v1.2
                    </a>
                    <a href="/" className="text-[10px] tracking-[0.12em] uppercase px-4 py-2 rounded-full transition-colors hover:bg-white/5"
                       style={{ fontFamily: mono, color: C.sage, border: `1px solid ${C.sage}20` }}>
                        Cover →
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ================================================================== */
/*  FOOTER                                                             */
/* ================================================================== */
function Footer() {
    return (
        <footer className="py-12 text-center" style={{ borderTop: `1px solid ${C.sage}08` }}>
            <p className="text-[10px] tracking-[0.15em]" style={{ fontFamily: mono, color: `${C.sage}30` }}>
                Calamigos Ranch · Deck v1.3 · Design & Development by Dave Peloso
            </p>
        </footer>
    );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export default function CalamigoV3() {
    useFonts();

    useEffect(() => {
        const t = setTimeout(() => ScrollTrigger.refresh(), 200);
        return () => clearTimeout(t);
    }, []);

    return (
        <SmoothScroll lerp={0.08} duration={1.4}>
            <div className="min-h-screen" style={{ background: C.bg, color: C.cream }}>
                <DeckNav currentDeck="v1.3" />
                <Hero />
                <JourneyProgress />
                {chapters.map((ch, i) => (
                    <ChapterSection key={ch.number} chapter={ch} index={i} />
                ))}
                <Closing />
                <Footer />
            </div>
        </SmoothScroll>
    );
}
