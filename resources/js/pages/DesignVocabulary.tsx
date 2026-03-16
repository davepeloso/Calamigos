import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
    useInView,
    AnimatePresence,
} from 'motion/react';
import StudyNav from '@/components/StudyNav';

// ─── Colors ───
const colors = {
    grove: '#2F4A3F',
    sand: '#EAE4D8',
    cream: '#F5F2EA',
    sage: '#7A8F82',
    wood: '#8A6B4F',
    charcoal: '#2C2C2C',
    divider: '#DCD6CA',
};

const fontDisplay = "'Cormorant Garamond', Georgia, serif";
const fontBody = "'DM Sans', system-ui, sans-serif";

// ─── Category types ───
type Category = 'all' | 'scroll' | 'motion' | 'typography' | 'layout' | 'visual';

interface Term {
    name: string;
    definition: string;
    category: Category;
    Demo: React.FC;
}

// ─── Micro-Demo Components ───

const ParallaxDemo: React.FC = () => {
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        let raf: number;
        let dir = 1;
        let pos = 0;
        const animate = () => {
            pos += 0.5 * dir;
            if (pos > 30 || pos < -30) dir *= -1;
            setOffset(pos);
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, []);
    return (
        <div className="relative w-full h-full overflow-hidden rounded" style={{ background: colors.sand }}>
            <div
                className="absolute w-8 h-8 rounded-full opacity-20"
                style={{ background: colors.grove, top: 20, left: 30, transform: `translateY(${offset * 0.3}px)` }}
            />
            <div
                className="absolute w-5 h-5 rounded opacity-40"
                style={{ background: colors.sage, top: 50, left: 80, transform: `translateY(${offset * 0.7}px)` }}
            />
            <div
                className="absolute w-6 h-6 opacity-70"
                style={{
                    background: colors.wood,
                    top: 30,
                    left: 140,
                    transform: `translateY(${offset}px)`,
                    borderRadius: 2,
                }}
            />
            <span
                className="absolute bottom-2 left-2 text-[8px] tracking-wider uppercase opacity-40"
                style={{ fontFamily: fontBody, color: colors.charcoal }}
            >
                3 layers / 3 speeds
            </span>
        </div>
    );
};

const ScrollytellingDemo: React.FC = () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const handler = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
        };
        window.addEventListener('scroll', handler, { passive: true });
        handler();
        return () => window.removeEventListener('scroll', handler);
    }, []);
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-2 rounded" style={{ background: colors.sand }}>
            <div className="w-3/4 h-2 rounded-full overflow-hidden" style={{ background: colors.divider }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: colors.grove, width: `${progress * 100}%` }}
                />
            </div>
            <span className="text-[9px] tracking-wider opacity-50" style={{ fontFamily: fontBody, color: colors.charcoal }}>
                {Math.round(progress * 100)}% scrolled
            </span>
        </div>
    );
};

const StickyDemo: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollPos, setScrollPos] = useState(0);
    useEffect(() => {
        let raf: number;
        let dir = 1;
        let pos = 0;
        const animate = () => {
            pos += 0.4 * dir;
            if (pos > 40 || pos < 0) dir *= -1;
            setScrollPos(pos);
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, []);
    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded" style={{ background: colors.sand }}>
            <div className="absolute left-3 top-2 w-5 h-5 rounded-sm flex items-center justify-center text-[7px] font-bold z-10" style={{ background: colors.grove, color: colors.cream }}>
                S
            </div>
            <div
                className="absolute left-12 right-3 flex flex-col gap-1"
                style={{ top: -scrollPos + 20 }}
            >
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-2 rounded-full opacity-30" style={{ background: colors.sage, width: `${60 + (i % 3) * 15}%` }} />
                ))}
            </div>
            <span className="absolute bottom-2 right-2 text-[8px] tracking-wider uppercase opacity-40" style={{ fontFamily: fontBody, color: colors.charcoal }}>
                fixed in place
            </span>
        </div>
    );
};

const ViewportDemo: React.FC = () => (
    <div className="relative w-full h-full flex items-center justify-center rounded" style={{ background: colors.sand }}>
        <div className="relative" style={{ width: 120, height: 80 }}>
            <div className="absolute inset-0 rounded border-2 opacity-20" style={{ borderColor: colors.charcoal }} />
            <div className="absolute rounded border-2" style={{ borderColor: colors.grove, top: 10, left: 10, width: 60, height: 40 }}>
                <span className="absolute top-1 left-1 text-[6px] font-bold" style={{ color: colors.grove, fontFamily: fontBody }}>
                    viewport
                </span>
            </div>
            <div className="absolute w-1 h-1 rounded-full" style={{ background: colors.wood, top: 55, left: 80 }} />
            <div className="absolute w-2 h-1 rounded-sm opacity-50" style={{ background: colors.sage, top: 65, left: 15 }} />
        </div>
    </div>
);

const ScrollSnappingDemo: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    return (
        <div className="relative w-full h-full flex items-center justify-center rounded" style={{ background: colors.sand }}>
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto px-2 w-full"
                style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
            >
                {['A', 'B', 'C', 'D'].map((label) => (
                    <div
                        key={label}
                        className="shrink-0 w-16 h-20 rounded flex items-center justify-center text-sm font-semibold"
                        style={{
                            scrollSnapAlign: 'center',
                            background: colors.grove,
                            color: colors.cream,
                            fontFamily: fontDisplay,
                            fontSize: 18,
                        }}
                    >
                        {label}
                    </div>
                ))}
            </div>
            <span className="absolute bottom-1 text-[7px] tracking-wider opacity-40" style={{ fontFamily: fontBody, color: colors.charcoal }}>
                swipe to snap
            </span>
        </div>
    );
};

const EasingDemo: React.FC = () => {
    const [play, setPlay] = useState(false);
    useEffect(() => {
        const id = setInterval(() => setPlay((p) => !p), 2000);
        return () => clearInterval(id);
    }, []);
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-3 rounded" style={{ background: colors.sand }}>
            <div className="relative w-4/5 h-1 rounded-full" style={{ background: colors.divider }}>
                <motion.div
                    className="absolute top-1/2 w-3 h-3 rounded-full -translate-y-1/2"
                    style={{ background: colors.grove }}
                    animate={{ left: play ? 'calc(100% - 12px)' : '0%' }}
                    transition={{ duration: 1.4, ease: [0.42, 0, 0.58, 1] }}
                />
            </div>
            <svg viewBox="0 0 100 40" width="80" height="32" className="opacity-30">
                <path d="M 5 35 C 40 35, 60 5, 95 5" stroke={colors.grove} fill="none" strokeWidth="1.5" />
            </svg>
        </div>
    );
};

const KeyframesDemo: React.FC = () => {
    const [step, setStep] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setStep((s) => (s + 1) % 5), 800);
        return () => clearInterval(id);
    }, []);
    return (
        <div className="relative w-full h-full flex items-center justify-center gap-2 rounded" style={{ background: colors.sand }}>
            {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full"
                    animate={{
                        scale: step === i ? 1.5 : 1,
                        background: step === i ? colors.grove : colors.divider,
                    }}
                    transition={{ duration: 0.3 }}
                />
            ))}
            <div className="absolute bottom-1 left-0 right-0 h-[1px] mx-4" style={{ background: colors.divider }} />
        </div>
    );
};

const SpringPhysicsDemo: React.FC = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 200, damping: 10 });
    const springY = useSpring(y, { stiffness: 200, damping: 10 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            x.set(e.clientX - rect.left - rect.width / 2);
            y.set(e.clientY - rect.top - rect.height / 2);
        },
        [x, y],
    );

    const handlePointerLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center rounded cursor-pointer"
            style={{ background: colors.sand }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            <motion.div
                className="w-6 h-6 rounded-full"
                style={{ background: colors.grove, x: springX, y: springY }}
            />
            <span className="absolute bottom-1 text-[7px] tracking-wider opacity-40" style={{ fontFamily: fontBody, color: colors.charcoal }}>
                move pointer
            </span>
        </div>
    );
};

const StaggerDemo: React.FC = () => {
    const [play, setPlay] = useState(false);
    useEffect(() => {
        const id = setInterval(() => setPlay((p) => !p), 2500);
        return () => clearInterval(id);
    }, []);
    return (
        <div className="relative w-full h-full flex items-end justify-center gap-2 pb-6 pt-4 rounded" style={{ background: colors.sand }}>
            {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    className="w-4 rounded-sm"
                    style={{ background: colors.grove }}
                    animate={{ height: play ? [8, 40 + i * 10, 24] : 8 }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                />
            ))}
        </div>
    );
};

const OrchestrationDemo: React.FC = () => {
    const [play, setPlay] = useState(false);
    useEffect(() => {
        const id = setInterval(() => setPlay((p) => !p), 3000);
        return () => clearInterval(id);
    }, []);
    return (
        <div className="relative w-full h-full flex items-center justify-center rounded" style={{ background: colors.sand }}>
            <motion.div
                className="w-8 h-8 rounded-full absolute"
                style={{ background: colors.grove }}
                animate={play ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : { scale: 1, opacity: 1 }}
                transition={{ duration: 1.2 }}
            />
            <motion.div
                className="w-14 h-14 rounded-full absolute border-2"
                style={{ borderColor: colors.sage }}
                animate={play ? { scale: [0.8, 1.2, 1], opacity: [0, 1, 0.6] } : { scale: 0.8, opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
            />
            <motion.div
                className="w-20 h-20 rounded-full absolute border"
                style={{ borderColor: colors.divider }}
                animate={play ? { scale: [0.6, 1.1, 1], opacity: [0, 0.8, 0.3] } : { scale: 0.6, opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.4 }}
            />
        </div>
    );
};

const KerningDemo: React.FC = () => {
    const [tight, setTight] = useState(false);
    useEffect(() => {
        const id = setInterval(() => setTight((t) => !t), 2000);
        return () => clearInterval(id);
    }, []);
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-1 rounded" style={{ background: colors.sand }}>
            <motion.span
                className="text-3xl font-light"
                style={{ fontFamily: fontDisplay, color: colors.charcoal }}
                animate={{ letterSpacing: tight ? '-0.08em' : '0.04em' }}
                transition={{ duration: 0.8 }}
            >
                AV
            </motion.span>
            <span className="text-[8px] tracking-wider opacity-40" style={{ fontFamily: fontBody, color: colors.charcoal }}>
                {tight ? 'tight kerning' : 'loose kerning'}
            </span>
        </div>
    );
};

const LeadingDemo: React.FC = () => (
    <div className="relative w-full h-full flex items-center justify-around px-2 rounded" style={{ background: colors.sand }}>
        {[1.0, 1.5, 2.0].map((lh) => (
            <div key={lh} className="flex flex-col items-center">
                <div className="text-[7px] leading-none mb-1 opacity-40" style={{ fontFamily: fontBody, color: colors.charcoal }}>
                    {lh}
                </div>
                <div className="text-[8px] w-12" style={{ fontFamily: fontBody, color: colors.charcoal, lineHeight: lh }}>
                    Line one text here now
                </div>
            </div>
        ))}
    </div>
);

const TrackingDemo: React.FC = () => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="relative w-full h-full flex items-center justify-center rounded cursor-pointer"
            style={{ background: colors.sand }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <motion.span
                className="text-xs uppercase font-medium"
                style={{ fontFamily: fontBody, color: colors.charcoal }}
                animate={{ letterSpacing: hovered ? '0.4em' : '0.1em' }}
                transition={{ duration: 0.5 }}
            >
                Tracking
            </motion.span>
            <span className="absolute bottom-1 text-[7px] tracking-wider opacity-40" style={{ fontFamily: fontBody, color: colors.charcoal }}>
                hover me
            </span>
        </div>
    );
};

const MeasureDemo: React.FC = () => (
    <div className="relative w-full h-full flex items-center justify-center gap-3 px-2 rounded" style={{ background: colors.sand }}>
        <div className="flex flex-col items-center">
            <div className="text-[6px] w-16 leading-relaxed" style={{ fontFamily: fontBody, color: colors.charcoal }}>
                A paragraph set at the ideal reading measure for comfortable reading.
            </div>
            <div className="text-[6px] mt-1 opacity-40" style={{ fontFamily: fontBody, color: colors.sage }}>ideal</div>
        </div>
        <div className="flex flex-col items-center">
            <div className="text-[6px] w-32 leading-relaxed opacity-50" style={{ fontFamily: fontBody, color: colors.charcoal }}>
                This paragraph is much too wide for comfortable reading and the eye struggles to track back.
            </div>
            <div className="text-[6px] mt-1 opacity-40" style={{ fontFamily: fontBody, color: colors.sage }}>too wide</div>
        </div>
    </div>
);

const HierarchyDemo: React.FC = () => (
    <div className="relative w-full h-full flex flex-col items-start justify-center gap-1 px-4 rounded" style={{ background: colors.sand }}>
        <span className="text-lg font-light" style={{ fontFamily: fontDisplay, color: colors.charcoal }}>Title</span>
        <span className="text-xs" style={{ fontFamily: fontDisplay, color: colors.sage }}>Subtitle here</span>
        <span className="text-[8px] leading-relaxed opacity-60" style={{ fontFamily: fontBody, color: colors.charcoal }}>
            Body text lorem ipsum dolor sit amet.
        </span>
    </div>
);

const WhitespaceDemo: React.FC = () => (
    <div className="relative w-full h-full flex items-center justify-center gap-3 rounded" style={{ background: colors.sand }}>
        <div className="flex flex-col items-center p-1 rounded" style={{ background: colors.cream }}>
            <div className="w-8 h-1 mb-[2px] rounded-full" style={{ background: colors.grove }} />
            <div className="w-6 h-1 mb-[2px] rounded-full opacity-50" style={{ background: colors.sage }} />
            <div className="w-7 h-1 rounded-full opacity-30" style={{ background: colors.sage }} />
            <div className="text-[5px] mt-1 opacity-40" style={{ fontFamily: fontBody }}>cramped</div>
        </div>
        <div className="flex flex-col items-center p-3 rounded" style={{ background: colors.cream }}>
            <div className="w-8 h-1 mb-2 rounded-full" style={{ background: colors.grove }} />
            <div className="w-6 h-1 mb-2 rounded-full opacity-50" style={{ background: colors.sage }} />
            <div className="w-7 h-1 rounded-full opacity-30" style={{ background: colors.sage }} />
            <div className="text-[5px] mt-2 opacity-40" style={{ fontFamily: fontBody }}>spacious</div>
        </div>
    </div>
);

const GridDemo: React.FC = () => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const id = setInterval(() => setShow((s) => !s), 2000);
        return () => clearInterval(id);
    }, []);
    return (
        <div className="relative w-full h-full flex items-center justify-center rounded overflow-hidden" style={{ background: colors.sand }}>
            <div className="grid grid-cols-3 grid-rows-3 gap-1 w-24 h-20">
                <div className="rounded-sm" style={{ background: colors.grove, gridColumn: '1 / 3' }} />
                <div className="rounded-sm" style={{ background: colors.sage }} />
                <div className="rounded-sm" style={{ background: colors.wood }} />
                <div className="rounded-sm" style={{ background: colors.sage, gridColumn: '2 / 4' }} />
                <div className="rounded-sm" style={{ background: colors.divider, gridColumn: '1 / 4' }} />
            </div>
            <AnimatePresence>
                {show && (
                    <motion.div
                        className="absolute inset-0 grid grid-cols-6 grid-rows-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                    >
                        {[...Array(24)].map((_, i) => (
                            <div key={i} className="border" style={{ borderColor: colors.grove }} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AsymmetryDemo: React.FC = () => (
    <div className="relative w-full h-full flex items-center rounded overflow-hidden" style={{ background: colors.sand }}>
        <div className="w-16 h-24 rounded-sm ml-3 mt-4 self-start" style={{ background: colors.grove }} />
        <div className="w-8 h-8 rounded-full ml-auto mr-6 mb-2 self-end" style={{ background: colors.sage }} />
        <div className="absolute top-3 right-8 w-4 h-12 rounded-sm" style={{ background: colors.wood, opacity: 0.5 }} />
    </div>
);

const BleedDemo: React.FC = () => (
    <div className="relative w-full h-full flex items-center justify-center rounded overflow-hidden" style={{ background: colors.sand }}>
        <div className="relative w-24 h-20 rounded border-2 border-dashed flex items-center justify-center" style={{ borderColor: colors.sage }}>
            <div className="absolute -left-4 top-3 w-12 h-6 rounded-sm" style={{ background: colors.grove }} />
            <span className="text-[7px] opacity-40 z-10" style={{ fontFamily: fontBody, color: colors.charcoal }}>container</span>
        </div>
    </div>
);

const ZIndexDemo: React.FC = () => (
    <div className="relative w-full h-full flex items-center justify-center rounded" style={{ background: colors.sand }}>
        <div className="relative w-28 h-20">
            {[
                { z: 1, bg: colors.divider, x: 0, y: 0, label: '1' },
                { z: 2, bg: colors.sage, x: 20, y: 12, label: '2' },
                { z: 3, bg: colors.grove, x: 40, y: 24, label: '3' },
            ].map((card) => (
                <div
                    key={card.z}
                    className="absolute w-16 h-10 rounded-sm flex items-center justify-center text-[10px] font-bold shadow-sm"
                    style={{
                        background: card.bg,
                        left: card.x,
                        top: card.y,
                        zIndex: card.z,
                        color: card.z === 3 ? colors.cream : colors.charcoal,
                        fontFamily: fontBody,
                    }}
                >
                    z-{card.label}
                </div>
            ))}
        </div>
    </div>
);

const GrainDemo: React.FC = () => (
    <div className="relative w-full h-full flex items-center justify-center rounded overflow-hidden" style={{ background: colors.grove }}>
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <filter id="grain-demo">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain-demo)" opacity="0.5" />
        </svg>
        <span className="relative text-sm font-light z-10" style={{ fontFamily: fontDisplay, color: colors.cream }}>
            Grain
        </span>
    </div>
);

const GradientMeshDemo: React.FC = () => (
    <div
        className="relative w-full h-full rounded overflow-hidden"
        style={{
            background: `
                radial-gradient(ellipse at 20% 50%, ${colors.sage}88 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, ${colors.wood}66 0%, transparent 50%),
                radial-gradient(ellipse at 60% 80%, ${colors.grove}77 0%, transparent 50%),
                ${colors.sand}
            `,
        }}
    />
);

const GlassmorphismDemo: React.FC = () => (
    <div className="relative w-full h-full flex items-center justify-center rounded overflow-hidden">
        <div className="absolute inset-0" style={{
            background: `linear-gradient(135deg, ${colors.sage}, ${colors.wood}, ${colors.grove})`,
        }} />
        <div className="absolute w-6 h-6 rounded-full top-4 left-6" style={{ background: colors.sand }} />
        <div className="absolute w-4 h-4 rounded-full bottom-6 right-4" style={{ background: colors.grove }} />
        <div
            className="relative w-24 h-16 rounded-lg flex items-center justify-center border"
            style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
        >
            <span className="text-[8px] uppercase tracking-widest" style={{ fontFamily: fontBody, color: colors.cream }}>
                Glass
            </span>
        </div>
    </div>
);

const DepthOfFieldDemo: React.FC = () => (
    <div className="relative w-full h-full flex items-center justify-center gap-4 rounded" style={{ background: colors.sand }}>
        <div className="text-lg font-semibold" style={{ fontFamily: fontDisplay, color: colors.grove }}>
            Sharp
        </div>
        <div className="text-lg font-semibold" style={{ fontFamily: fontDisplay, color: colors.sage, filter: 'blur(1.5px)' }}>
            Mid
        </div>
        <div className="text-lg font-semibold" style={{ fontFamily: fontDisplay, color: colors.divider, filter: 'blur(3px)' }}>
            Far
        </div>
    </div>
);

const MaskClipDemo: React.FC = () => (
    <div className="relative w-full h-full flex items-center justify-center rounded" style={{ background: colors.sand }}>
        <div
            className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
            style={{
                background: `linear-gradient(135deg, ${colors.grove}, ${colors.sage}, ${colors.wood})`,
            }}
        >
            <div className="grid grid-cols-3 gap-[2px] w-full h-full p-2">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="rounded-sm" style={{ background: `${colors.cream}${30 + i * 8}` }} />
                ))}
            </div>
        </div>
        <span className="absolute bottom-2 text-[7px] tracking-wider opacity-40" style={{ fontFamily: fontBody, color: colors.charcoal }}>
            circle mask
        </span>
    </div>
);

// ─── Term Definitions ───

const terms: Term[] = [
    { name: 'Asymmetry', definition: 'Intentionally unbalanced layouts that create visual tension and guide the eye through dynamic composition.', category: 'layout', Demo: AsymmetryDemo },
    { name: 'Bleed', definition: 'Content that extends beyond the boundary of its container, breaking the frame to create visual drama and edge-to-edge impact.', category: 'layout', Demo: BleedDemo },
    { name: 'Depth of Field', definition: 'Selective focus using progressive blur to simulate photographic depth, drawing attention to the foreground subject.', category: 'visual', Demo: DepthOfFieldDemo },
    { name: 'Easing', definition: 'The acceleration curve that governs how an animation progresses over time, giving motion a natural, organic feel.', category: 'motion', Demo: EasingDemo },
    { name: 'Glassmorphism', definition: 'A frosted-glass aesthetic achieved through background blur and translucency, creating layered depth with luminous surfaces.', category: 'visual', Demo: GlassmorphismDemo },
    { name: 'Gradient Mesh', definition: 'Multi-point color gradients that blend organically across a surface, producing rich, painterly color fields.', category: 'visual', Demo: GradientMeshDemo },
    { name: 'Grain', definition: 'A film-like noise texture overlaid on surfaces to add warmth, tactility, and analog character to digital designs.', category: 'visual', Demo: GrainDemo },
    { name: 'Grid', definition: 'A structural framework of rows and columns that organizes content into a coherent, rhythmic spatial system.', category: 'layout', Demo: GridDemo },
    { name: 'Hierarchy', definition: 'The visual ranking of elements by importance through scale, weight, and contrast, guiding the reader through content.', category: 'typography', Demo: HierarchyDemo },
    { name: 'Kerning', definition: 'The adjustment of space between specific pairs of letters to achieve optically even spacing and typographic refinement.', category: 'typography', Demo: KerningDemo },
    { name: 'Keyframes', definition: 'Defined states at specific moments in an animation timeline, between which the browser interpolates intermediate values.', category: 'motion', Demo: KeyframesDemo },
    { name: 'Leading', definition: 'The vertical space between lines of text, derived from the lead strips once placed between rows of metal type.', category: 'typography', Demo: LeadingDemo },
    { name: 'Mask & Clip', definition: 'Techniques for revealing or concealing portions of content through geometric or arbitrary shapes, creating sophisticated visual reveals.', category: 'visual', Demo: MaskClipDemo },
    { name: 'Measure', definition: 'The width of a text block, traditionally expressed in characters per line. An ideal measure ensures comfortable, sustained reading.', category: 'typography', Demo: MeasureDemo },
    { name: 'Orchestration', definition: 'The deliberate coordination of multiple animations into a unified, choreographed sequence that tells a coherent visual story.', category: 'motion', Demo: OrchestrationDemo },
    { name: 'Parallax', definition: 'A depth illusion created by moving layered elements at different speeds during scroll, evoking a sense of spatial dimension.', category: 'scroll', Demo: ParallaxDemo },
    { name: 'Scroll Snapping', definition: 'Scroll behavior that magnetically locks content to precise positions, creating a paginated, controlled reading experience.', category: 'scroll', Demo: ScrollSnappingDemo },
    { name: 'Scrollytelling', definition: 'A narrative form where the scroll itself becomes the primary mechanism for advancing a story, revealing content progressively.', category: 'scroll', Demo: ScrollytellingDemo },
    { name: 'Spring Physics', definition: 'Animation driven by a spring simulation with configurable stiffness, damping, and mass, producing lifelike, responsive motion.', category: 'motion', Demo: SpringPhysicsDemo },
    { name: 'Stagger', definition: 'A sequential delay applied between child element animations, creating a cascading, wave-like entrance effect.', category: 'motion', Demo: StaggerDemo },
    { name: 'Sticky', definition: 'An element that toggles between relative and fixed positioning based on scroll, remaining visible within a defined scroll range.', category: 'scroll', Demo: StickyDemo },
    { name: 'Tracking', definition: 'Uniform adjustment of letter spacing across an entire block of text, used to set tone and control density.', category: 'typography', Demo: TrackingDemo },
    { name: 'Viewport', definition: 'The visible area of a web page within the browser window, the frame through which all content is perceived.', category: 'scroll', Demo: ViewportDemo },
    { name: 'Whitespace', definition: 'Empty space used intentionally as a design element to create breathing room, focus, and visual elegance.', category: 'layout', Demo: WhitespaceDemo },
    { name: 'Z-Index', definition: 'The stacking order of overlapping elements along the z-axis, controlling which layers appear in front of others.', category: 'layout', Demo: ZIndexDemo },
];

// ─── Filter Bar ───

const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'scroll', label: 'Scroll' },
    { id: 'motion', label: 'Motion' },
    { id: 'typography', label: 'Typography' },
    { id: 'layout', label: 'Layout' },
    { id: 'visual', label: 'Visual' },
];

// ─── Term Card ───

const TermCard: React.FC<{ term: Term; index: number }> = ({ term, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });
    const { Demo } = term;

    return (
        <motion.div
            ref={ref}
            className="flex flex-col sm:flex-row items-start gap-5 py-8 border-b"
            style={{ borderColor: colors.divider }}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {/* Term + Definition */}
            <div className="flex-1 min-w-0">
                <span
                    className="text-[10px] tracking-[0.25em] uppercase block mb-2 opacity-40"
                    style={{ fontFamily: fontBody, color: colors.sage }}
                >
                    {term.category}
                </span>
                <h3
                    className="text-3xl md:text-4xl font-light mb-3 leading-tight"
                    style={{ fontFamily: fontDisplay, color: colors.charcoal }}
                >
                    {term.name}
                </h3>
                <p
                    className="text-sm leading-relaxed max-w-md"
                    style={{ fontFamily: fontBody, color: colors.sage }}
                >
                    {term.definition}
                </p>
            </div>

            {/* Live Demo */}
            <div
                className="shrink-0 w-full sm:w-[200px] h-[150px] rounded-lg overflow-hidden border"
                style={{ borderColor: colors.divider }}
            >
                <Demo />
            </div>
        </motion.div>
    );
};

// ─── Main Page ───

const DesignVocabulary: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>('all');

    // Load Google Fonts
    useEffect(() => {
        const id = 'design-vocab-fonts';
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href =
            'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap';
        document.head.appendChild(link);
    }, []);

    const filteredTerms =
        activeCategory === 'all' ? terms : terms.filter((t) => t.category === activeCategory);

    return (
        <div className="min-h-screen" style={{ background: colors.cream, color: colors.charcoal }}>
            <StudyNav currentPage="vocabulary" />

            {/* Hero */}
            <header className="pt-32 pb-20 px-6 md:px-16 max-w-5xl mx-auto">
                <motion.span
                    className="block text-xs tracking-[0.3em] uppercase mb-6 opacity-50"
                    style={{ fontFamily: fontBody, color: colors.sage }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 0.5, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Chapter 05
                </motion.span>
                <motion.h1
                    className="text-6xl md:text-8xl lg:text-9xl font-light leading-[0.9] mb-8"
                    style={{ fontFamily: fontDisplay, color: colors.charcoal }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    Vocabulary
                </motion.h1>
                <motion.p
                    className="text-lg md:text-xl font-light max-w-lg leading-relaxed"
                    style={{ fontFamily: fontDisplay, color: colors.sage }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    The language of digital storytelling
                </motion.p>
                <motion.div
                    className="mt-10 h-[1px] w-24"
                    style={{ background: colors.divider }}
                    initial={{ width: 0 }}
                    animate={{ width: 96 }}
                    transition={{ duration: 1, delay: 0.5 }}
                />
            </header>

            {/* Filter Bar */}
            <div className="sticky top-0 z-40 border-b" style={{ background: `${colors.cream}ee`, borderColor: colors.divider, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                <div className="max-w-5xl mx-auto px-6 md:px-16 py-4 flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className="relative px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors rounded-full"
                            style={{
                                fontFamily: fontBody,
                                color: activeCategory === cat.id ? colors.cream : colors.sage,
                                background: activeCategory === cat.id ? colors.grove : 'transparent',
                            }}
                        >
                            {cat.label}
                            {activeCategory !== cat.id && (
                                <span
                                    className="absolute inset-0 rounded-full border opacity-30"
                                    style={{ borderColor: colors.sage }}
                                />
                            )}
                        </button>
                    ))}
                    <span
                        className="ml-auto self-center text-xs opacity-40"
                        style={{ fontFamily: fontBody, color: colors.sage }}
                    >
                        {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* Terms Grid */}
            <main className="max-w-5xl mx-auto px-6 md:px-16 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
                    <AnimatePresence mode="wait">
                        {filteredTerms.map((term, i) => (
                            <TermCard key={term.name} term={term} index={i} />
                        ))}
                    </AnimatePresence>
                </div>
            </main>

            {/* Editorial Note */}
            <footer className="max-w-5xl mx-auto px-6 md:px-16 pt-12 pb-32">
                <motion.div
                    className="border-t pt-16 max-w-lg"
                    style={{ borderColor: colors.divider }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <span
                        className="block text-xs tracking-[0.25em] uppercase mb-6 opacity-40"
                        style={{ fontFamily: fontBody, color: colors.sage }}
                    >
                        A note on language
                    </span>
                    <p
                        className="text-xl md:text-2xl font-light leading-relaxed mb-6"
                        style={{ fontFamily: fontDisplay, color: colors.charcoal }}
                    >
                        Shared vocabulary is the foundation of any design collaboration. When teams speak the same language, critique becomes precise, intent becomes communicable, and craft becomes repeatable.
                    </p>
                    <p
                        className="text-sm leading-relaxed"
                        style={{ fontFamily: fontBody, color: colors.sage }}
                    >
                        This glossary is not exhaustive. It is a living document, a starting point for the conversations that shape the work.
                    </p>
                </motion.div>
            </footer>
        </div>
    );
};

export default DesignVocabulary;
