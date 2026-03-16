import { motion, useScroll, useTransform } from 'motion/react';
import React, { useEffect, useRef } from 'react';
import StudyNav from '@/components/StudyNav';

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', system-ui, sans-serif";

const colors = {
    grove: '#2F4A3F',
    sand: '#EAE4D8',
    cream: '#F5F2EA',
    sage: '#7A8F82',
    wood: '#8A6B4F',
    charcoal: '#2C2C2C',
    divider: '#DCD6CA',
};

interface FontSpec {
    name: string;
    family: string;
    category: string;
    weights: { label: string; weight: number }[];
    editorial: string;
    pangram: string;
}

const fonts: FontSpec[] = [
    {
        name: 'Cormorant Garamond',
        family: "'Cormorant Garamond', Georgia, serif",
        category: 'Display Serif',
        weights: [
            { label: 'Light', weight: 300 },
            { label: 'Regular', weight: 400 },
            { label: 'Medium', weight: 500 },
            { label: 'SemiBold', weight: 600 },
            { label: 'Bold', weight: 700 },
        ],
        editorial:
            'The anchor of our typographic system. Cormorant Garamond carries the gravitas of Garamond with a display-forward sensibility -- tall ascenders, sharp contrast, and a romantic elegance that speaks to the heritage of Calamigos.',
        pangram: 'Where dusk settles over ancient oaks, quiet joy begins.',
    },
    {
        name: 'DM Sans',
        family: "'DM Sans', system-ui, sans-serif",
        category: 'Geometric Sans',
        weights: [
            { label: 'Light', weight: 300 },
            { label: 'Regular', weight: 400 },
            { label: 'Medium', weight: 500 },
            { label: 'SemiBold', weight: 600 },
            { label: 'Bold', weight: 700 },
        ],
        editorial:
            'Our workhorse. DM Sans provides clarity and neutrality in body text, navigation, and UI elements. Its geometric forms complement the organic curves of Cormorant without competing for attention.',
        pangram: 'Every detail matters when crafting unforgettable moments.',
    },
    {
        name: 'Libre Baskerville',
        family: "'Libre Baskerville', Georgia, serif",
        category: 'Transitional Serif',
        weights: [
            { label: 'Regular', weight: 400 },
            { label: 'Bold', weight: 700 },
        ],
        editorial:
            'Rooted in the Baskerville tradition, this face brings a bookish warmth suited for long-form storytelling. Ideal for venue descriptions, editorial features, and print collateral where readability at small sizes is paramount.',
        pangram: 'A gathering beneath the sycamores, lit by lanterns and laughter.',
    },
    {
        name: 'Syne',
        family: "'Syne', sans-serif",
        category: 'Experimental Display',
        weights: [
            { label: 'Regular', weight: 400 },
            { label: 'Medium', weight: 500 },
            { label: 'SemiBold', weight: 600 },
            { label: 'Bold', weight: 700 },
            { label: 'ExtraBold', weight: 800 },
        ],
        editorial:
            'For when the brand needs to shout. Syne is unapologetically geometric and bold -- perfect for event titles, campaign headers, and moments that demand presence. Use sparingly for maximum impact.',
        pangram: 'Bold visions take root in unexpected places.',
    },
    {
        name: 'Instrument Serif',
        family: "'Instrument Serif', Georgia, serif",
        category: 'Transitional Serif',
        weights: [{ label: 'Regular', weight: 400 }],
        editorial:
            'A single-weight gem with remarkable presence. Instrument Serif occupies the space between editorial and utilitarian -- its subtle inktraps and open apertures give it a contemporary refinement ideal for pull quotes and accent text.',
        pangram: 'In the stillness between courses, conversation blooms.',
    },
    {
        name: 'Outfit',
        family: "'Outfit', sans-serif",
        category: 'Geometric Sans',
        weights: [
            { label: 'Thin', weight: 100 },
            { label: 'Light', weight: 300 },
            { label: 'Regular', weight: 400 },
            { label: 'Medium', weight: 500 },
            { label: 'SemiBold', weight: 600 },
            { label: 'Bold', weight: 700 },
            { label: 'ExtraBold', weight: 800 },
            { label: 'Black', weight: 900 },
        ],
        editorial:
            'Outfit brings a modern geometric clarity with just enough softness to feel approachable. An excellent alternative to DM Sans when the design calls for a broader range of weights or a slightly warmer personality.',
        pangram: 'From vineyard to table, every element is curated with intention.',
    },
];

const pairings = [
    {
        display: { name: 'Cormorant Garamond', family: "'Cormorant Garamond', Georgia, serif" },
        body: { name: 'DM Sans', family: "'DM Sans', system-ui, sans-serif" },
        headline: 'An Evening Among the Oaks',
        subhead: 'Calamigos Ranch invites you to experience dining reimagined beneath a canopy of century-old sycamores.',
        paragraph:
            'As twilight descends over the Santa Monica Mountains, the Ranch transforms into a stage for the extraordinary. Tables dressed in hand-dyed linens wind along the creek bed. The scent of oak smoke mingles with wild sage. Every gathering here tells a story that begins long before the first guest arrives -- in the careful selection of seasonal blooms, the rehearsal of each course, the tuning of string lights to cast just the right warmth across the canyon.',
    },
    {
        display: { name: 'Instrument Serif', family: "'Instrument Serif', Georgia, serif" },
        body: { name: 'Outfit', family: "'Outfit', sans-serif" },
        headline: 'The Art of Celebration',
        subhead: 'Where nature and intention converge to create moments that transcend the occasion itself.',
        paragraph:
            'Celebration at Calamigos is never merely an event. It is an atmosphere -- a confluence of light, landscape, and human connection orchestrated with the precision of a stage production and the grace of something effortless. The grounds offer a dozen distinct settings, each with its own character: the Birchwood Room with its cathedral ceilings of reclaimed timber, the Garden Terrace where jasmine climbs iron trellises, and the Lakeview Pavilion reflecting the last gold of sunset across still water.',
    },
    {
        display: { name: 'Syne', family: "'Syne', sans-serif" },
        body: { name: 'Libre Baskerville', family: "'Libre Baskerville', Georgia, serif" },
        headline: 'Redefining the Ranch',
        subhead: 'A bold new chapter for a venue that has always known how to surprise.',
        paragraph:
            'There is a tension at the heart of Calamigos -- between the wild and the curated, the rustic and the refined. It is this tension that makes the Ranch extraordinary. New programming embraces it fully: contemporary art installations in the meadow, chef residencies that draw from the property\'s own gardens, and immersive sound experiences in the canyon at dusk. The Ranch is not simply preserving its legacy. It is writing the next one.',
    },
];

const typeScale = [
    { label: 'Display', size: 96, tracking: '-0.03em', leading: '1' },
    { label: 'H1', size: 72, tracking: '-0.025em', leading: '1.05' },
    { label: 'H2', size: 56, tracking: '-0.02em', leading: '1.1' },
    { label: 'H3', size: 40, tracking: '-0.015em', leading: '1.15' },
    { label: 'H4', size: 32, tracking: '-0.01em', leading: '1.2' },
    { label: 'H5', size: 24, tracking: '-0.005em', leading: '1.3' },
    { label: 'Body Large', size: 20, tracking: '0', leading: '1.6' },
    { label: 'Body', size: 16, tracking: '0', leading: '1.7' },
    { label: 'Small', size: 14, tracking: '0.01em', leading: '1.6' },
    { label: 'Caption', size: 12, tracking: '0.04em', leading: '1.5' },
];

const SectionDivider = () => (
    <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="h-px w-full" style={{ backgroundColor: colors.divider }} />
    </div>
);

const ChapterLabel = ({ number, title }: { number: string; title: string }) => (
    <motion.div
        className="flex items-center gap-4 mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
    >
        <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: sans, color: colors.sage }}
        >
            {number}
        </span>
        <div className="h-px w-12" style={{ backgroundColor: colors.divider }} />
        <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: sans, color: colors.sage }}
        >
            {title}
        </span>
    </motion.div>
);

const MoodboardFonts = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    useEffect(() => {
        const fontUrl =
            'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Sans:ital,wght@0,100..1000;1,100..1000&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Syne:wght@400..800&family=Instrument+Serif:ital@0;1&family=Outfit:wght@100..900&display=swap';

        const existing = document.querySelector('link[data-moodboard-fonts]');
        if (!existing) {
            const preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = 'https://fonts.googleapis.com';
            document.head.appendChild(preconnect);

            const preconnectStatic = document.createElement('link');
            preconnectStatic.rel = 'preconnect';
            preconnectStatic.href = 'https://fonts.gstatic.com';
            preconnectStatic.crossOrigin = 'anonymous';
            document.head.appendChild(preconnectStatic);

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = fontUrl;
            link.setAttribute('data-moodboard-fonts', 'true');
            document.head.appendChild(link);
        }
    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.cream, color: colors.charcoal }}>
            <StudyNav currentPage="fonts" />

            {/* ============================================ */}
            {/* HERO */}
            {/* ============================================ */}
            <div ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    className="text-center px-8"
                    style={{ y: heroY, opacity: heroOpacity }}
                >
                    <motion.p
                        className="text-xs tracking-[0.4em] uppercase mb-8"
                        style={{ fontFamily: sans, color: colors.sage }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Chapter 02 -- Type Specimens
                    </motion.p>
                    <motion.h1
                        className="font-light leading-none"
                        style={{
                            fontFamily: serif,
                            fontSize: 'clamp(72px, 14vw, 200px)',
                            letterSpacing: '-0.04em',
                            color: colors.grove,
                        }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        Typography
                    </motion.h1>
                    <motion.p
                        className="mt-8 max-w-xl mx-auto text-base leading-relaxed"
                        style={{ fontFamily: sans, color: colors.sage }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        Type is the voice of design. Before a single image loads, before color
                        registers, the letterforms speak -- establishing tone, credibility, and
                        emotion in the first fraction of a second.
                    </motion.p>
                </motion.div>

                <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                >
                    <span
                        className="text-[10px] tracking-[0.3em] uppercase"
                        style={{ fontFamily: sans, color: colors.sage }}
                    >
                        Scroll
                    </span>
                    <motion.div
                        className="w-px h-8"
                        style={{ backgroundColor: colors.sage }}
                        animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.div>
            </div>

            {/* ============================================ */}
            {/* 01 -- TYPE SPECIMENS */}
            {/* ============================================ */}
            <section className="py-40">
                <div className="max-w-7xl mx-auto px-8 md:px-16">
                    <ChapterLabel number="01" title="Type Specimens" />
                </div>

                <div className="space-y-0">
                    {fonts.map((font, idx) => (
                        <React.Fragment key={font.name}>
                            {idx > 0 && <SectionDivider />}
                            <FontSpecimen font={font} index={idx} />
                        </React.Fragment>
                    ))}
                </div>
            </section>

            <SectionDivider />

            {/* ============================================ */}
            {/* 02 -- PAIRING SHOWCASE */}
            {/* ============================================ */}
            <section className="py-40">
                <div className="max-w-7xl mx-auto px-8 md:px-16">
                    <ChapterLabel number="02" title="Curated Pairings" />

                    <motion.p
                        className="max-w-2xl text-lg leading-relaxed mb-24"
                        style={{ fontFamily: sans, color: colors.sage }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        The right pairing creates a conversation between voices -- one that guides
                        the reader through hierarchy, tone, and meaning without ever calling
                        attention to itself.
                    </motion.p>
                </div>

                <div className="space-y-32">
                    {pairings.map((pair, idx) => (
                        <PairingShowcase key={idx} pairing={pair} index={idx} />
                    ))}
                </div>
            </section>

            <SectionDivider />

            {/* ============================================ */}
            {/* 03 -- TYPE SCALE */}
            {/* ============================================ */}
            <section className="py-40">
                <div className="max-w-7xl mx-auto px-8 md:px-16">
                    <ChapterLabel number="03" title="Type Scale" />

                    <motion.div
                        className="mb-24 max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2
                            className="text-4xl md:text-5xl font-light mb-6"
                            style={{ fontFamily: serif, color: colors.grove, letterSpacing: '-0.02em' }}
                        >
                            A measured progression
                        </h2>
                        <p
                            className="text-base leading-relaxed"
                            style={{ fontFamily: sans, color: colors.sage }}
                        >
                            Our scale follows a modular ratio, ensuring each step feels
                            proportionally harmonious. From 12px captions to 96px display
                            headings, every size has a purpose.
                        </p>
                    </motion.div>

                    <div className="space-y-0">
                        {typeScale.map((step, idx) => (
                            <motion.div
                                key={step.label}
                                className="flex items-baseline gap-6 md:gap-12 py-5 border-b"
                                style={{ borderColor: colors.divider }}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, delay: idx * 0.04 }}
                            >
                                <div className="w-24 md:w-32 shrink-0 flex items-baseline gap-3">
                                    <span
                                        className="text-[10px] tracking-[0.2em] uppercase"
                                        style={{ fontFamily: sans, color: colors.sage }}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                                <div className="w-16 md:w-20 shrink-0">
                                    <span
                                        className="text-[10px] tracking-[0.1em] tabular-nums"
                                        style={{ fontFamily: sans, color: colors.wood }}
                                    >
                                        {step.size}px
                                    </span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <span
                                        className="font-light whitespace-nowrap"
                                        style={{
                                            fontFamily: serif,
                                            fontSize: `${Math.min(step.size, 64)}px`,
                                            letterSpacing: step.tracking,
                                            lineHeight: step.leading,
                                            color: colors.charcoal,
                                        }}
                                    >
                                        Calamigos
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* ============================================ */}
            {/* 04 -- TYPOGRAPHIC PRINCIPLES */}
            {/* ============================================ */}
            <section className="py-40">
                <div className="max-w-7xl mx-auto px-8 md:px-16">
                    <ChapterLabel number="04" title="Typographic Principles" />

                    <motion.h2
                        className="text-4xl md:text-5xl font-light mb-32 max-w-3xl"
                        style={{ fontFamily: serif, color: colors.grove, letterSpacing: '-0.02em' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        The invisible architecture that makes text breathe, flow, and communicate.
                    </motion.h2>

                    {/* Measure */}
                    <PrincipleBlock
                        number="4.1"
                        title="Measure"
                        subtitle="Line Length"
                        description="The ideal measure for body text falls between 45 and 75 characters per line. Too wide and the eye loses its place; too narrow and the rhythm breaks."
                    >
                        <div className="space-y-8">
                            <div>
                                <div
                                    className="text-[10px] tracking-[0.2em] uppercase mb-3"
                                    style={{ fontFamily: sans, color: colors.wood }}
                                >
                                    Too narrow -- 30ch
                                </div>
                                <p
                                    className="text-base leading-relaxed"
                                    style={{
                                        fontFamily: `'Libre Baskerville', Georgia, serif`,
                                        maxWidth: '30ch',
                                        color: colors.charcoal,
                                    }}
                                >
                                    Beneath the canopy of ancient oaks, where sunlight filters through
                                    leaves in scattered gold, every celebration finds its natural rhythm.
                                </p>
                            </div>
                            <div>
                                <div
                                    className="text-[10px] tracking-[0.2em] uppercase mb-3"
                                    style={{ fontFamily: sans, color: colors.grove }}
                                >
                                    Ideal -- 65ch
                                </div>
                                <p
                                    className="text-base leading-relaxed"
                                    style={{
                                        fontFamily: `'Libre Baskerville', Georgia, serif`,
                                        maxWidth: '65ch',
                                        color: colors.charcoal,
                                    }}
                                >
                                    Beneath the canopy of ancient oaks, where sunlight filters through
                                    leaves in scattered gold, every celebration finds its natural rhythm.
                                    The Ranch has always understood that the setting is not backdrop but participant.
                                </p>
                            </div>
                            <div>
                                <div
                                    className="text-[10px] tracking-[0.2em] uppercase mb-3"
                                    style={{ fontFamily: sans, color: colors.wood }}
                                >
                                    Too wide -- 100ch
                                </div>
                                <p
                                    className="text-base leading-relaxed"
                                    style={{
                                        fontFamily: `'Libre Baskerville', Georgia, serif`,
                                        maxWidth: '100ch',
                                        color: colors.charcoal,
                                    }}
                                >
                                    Beneath the canopy of ancient oaks, where sunlight filters through leaves in scattered gold, every celebration finds its natural rhythm. The Ranch has always understood that the setting is not backdrop but participant in the story being told.
                                </p>
                            </div>
                        </div>
                    </PrincipleBlock>

                    {/* Leading */}
                    <PrincipleBlock
                        number="4.2"
                        title="Leading"
                        subtitle="Line Height"
                        description="Generous leading gives text room to breathe. Display type can be set tight; body text needs air. The difference between cramped and comfortable is often just a few pixels."
                    >
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { label: 'Tight -- 1.2', value: '1.2' },
                                { label: 'Comfortable -- 1.6', value: '1.6' },
                                { label: 'Loose -- 2.0', value: '2.0' },
                            ].map((item) => (
                                <div key={item.value}>
                                    <div
                                        className="text-[10px] tracking-[0.2em] uppercase mb-3"
                                        style={{
                                            fontFamily: sans,
                                            color: item.value === '1.6' ? colors.grove : colors.wood,
                                        }}
                                    >
                                        {item.label}
                                    </div>
                                    <p
                                        className="text-base"
                                        style={{
                                            fontFamily: sans,
                                            lineHeight: item.value,
                                            color: colors.charcoal,
                                        }}
                                    >
                                        The light shifts across the meadow in long golden bands.
                                        Tables are set with hand-thrown ceramics and foraged greenery.
                                        Each detail is placed with quiet intention.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </PrincipleBlock>

                    {/* Tracking */}
                    <PrincipleBlock
                        number="4.3"
                        title="Tracking"
                        subtitle="Letter Spacing"
                        description="Letter spacing controls density and texture. Uppercase text benefits from generous tracking; large display type often needs tightening to maintain cohesion."
                    >
                        <div className="space-y-10">
                            {[
                                { label: 'Tight -- -0.03em', value: '-0.03em', text: 'CALAMIGOS RANCH', size: '36px' },
                                { label: 'Normal -- 0', value: '0em', text: 'CALAMIGOS RANCH', size: '36px' },
                                { label: 'Loose -- 0.15em', value: '0.15em', text: 'CALAMIGOS RANCH', size: '36px' },
                                { label: 'Extended -- 0.3em', value: '0.3em', text: 'CALAMIGOS RANCH', size: '14px' },
                            ].map((item) => (
                                <div key={item.value}>
                                    <div
                                        className="text-[10px] tracking-[0.2em] uppercase mb-3"
                                        style={{ fontFamily: sans, color: colors.sage }}
                                    >
                                        {item.label}
                                    </div>
                                    <span
                                        className="font-light"
                                        style={{
                                            fontFamily: serif,
                                            fontSize: item.size,
                                            letterSpacing: item.value,
                                            color: colors.charcoal,
                                        }}
                                    >
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </PrincipleBlock>

                    {/* Hierarchy */}
                    <PrincipleBlock
                        number="4.4"
                        title="Hierarchy"
                        subtitle="Visual Order"
                        description="A clear hierarchy guides the eye through content in order of importance. Size, weight, color, and spacing work together to create an intuitive reading path."
                    >
                        <div
                            className="p-8 md:p-12"
                            style={{ backgroundColor: 'white', borderRadius: '2px' }}
                        >
                            <p
                                className="text-[10px] tracking-[0.3em] uppercase mb-6"
                                style={{ fontFamily: sans, color: colors.sage }}
                            >
                                Featured Event
                            </p>
                            <h3
                                className="font-light mb-4"
                                style={{
                                    fontFamily: serif,
                                    fontSize: 'clamp(32px, 5vw, 56px)',
                                    letterSpacing: '-0.02em',
                                    lineHeight: '1.1',
                                    color: colors.grove,
                                }}
                            >
                                Harvest Table Dinner
                            </h3>
                            <p
                                className="text-lg mb-6"
                                style={{
                                    fontFamily: sans,
                                    fontWeight: 400,
                                    color: colors.wood,
                                }}
                            >
                                An intimate evening of farm-to-table dining beneath the stars
                            </p>
                            <p
                                className="text-base leading-relaxed max-w-2xl mb-8"
                                style={{
                                    fontFamily: sans,
                                    color: colors.charcoal,
                                    opacity: 0.7,
                                }}
                            >
                                Join us for an evening that celebrates the season's finest offerings,
                                prepared by guest chefs and served at a single communal table stretching
                                through the oak grove. Limited to forty guests.
                            </p>
                            <p
                                className="text-xs tracking-[0.2em] uppercase"
                                style={{ fontFamily: sans, color: colors.sage }}
                            >
                                October 14, 2026 -- Oak Grove -- 6:30 PM
                            </p>
                        </div>
                    </PrincipleBlock>
                </div>
            </section>

            {/* ============================================ */}
            {/* CLOSING */}
            {/* ============================================ */}
            <section className="py-40">
                <div className="max-w-7xl mx-auto px-8 md:px-16 text-center">
                    <motion.p
                        className="text-xs tracking-[0.4em] uppercase mb-8"
                        style={{ fontFamily: sans, color: colors.sage }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        End of Chapter 02
                    </motion.p>
                    <motion.h2
                        className="font-light italic"
                        style={{
                            fontFamily: serif,
                            fontSize: 'clamp(32px, 6vw, 80px)',
                            letterSpacing: '-0.03em',
                            lineHeight: '1.1',
                            color: colors.grove,
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        "Typography is what language looks like."
                    </motion.h2>
                    <motion.p
                        className="mt-6 text-sm"
                        style={{ fontFamily: sans, color: colors.sage }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        -- Ellen Lupton
                    </motion.p>
                </div>
            </section>

            <div className="h-16" />
        </div>
    );
};

/* ============================================ */
/* FONT SPECIMEN COMPONENT */
/* ============================================ */
const FontSpecimen = ({ font, index }: { font: FontSpec; index: number }) => {
    const isEven = index % 2 === 0;

    return (
        <section className="py-32">
            <div className="max-w-7xl mx-auto px-8 md:px-16">
                {/* Font name in itself, large */}
                <motion.div
                    className={`mb-20 ${isEven ? 'text-left' : 'text-right'}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <p
                        className="text-[10px] tracking-[0.3em] uppercase mb-4"
                        style={{ fontFamily: sans, color: colors.sage }}
                    >
                        {font.category}
                    </p>
                    <h2
                        className="font-light"
                        style={{
                            fontFamily: font.family,
                            fontSize: 'clamp(64px, 12vw, 160px)',
                            letterSpacing: '-0.03em',
                            lineHeight: '0.95',
                            color: colors.grove,
                        }}
                    >
                        {font.name}
                    </h2>
                </motion.div>

                {/* Pangram */}
                <motion.div
                    className={`mb-20 max-w-3xl ${isEven ? 'ml-0' : 'ml-auto'}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <p
                        className="text-2xl md:text-3xl font-light leading-relaxed italic"
                        style={{ fontFamily: font.family, color: colors.charcoal }}
                    >
                        "{font.pangram}"
                    </p>
                </motion.div>

                {/* Alphabet + Numbers */}
                <motion.div
                    className="mb-20 space-y-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    <div
                        className="text-2xl md:text-3xl font-light tracking-wide leading-relaxed"
                        style={{ fontFamily: font.family, color: colors.charcoal }}
                    >
                        ABCDEFGHIJKLMNOPQRSTUVWXYZ
                    </div>
                    <div
                        className="text-2xl md:text-3xl font-light tracking-wide leading-relaxed"
                        style={{ fontFamily: font.family, color: colors.charcoal }}
                    >
                        abcdefghijklmnopqrstuvwxyz
                    </div>
                    <div
                        className="text-2xl md:text-3xl font-light tracking-wide leading-relaxed"
                        style={{ fontFamily: font.family, color: colors.sage }}
                    >
                        0123456789 &amp; !? @ # $ % ( ) [ ] : ;
                    </div>
                </motion.div>

                {/* Weight variations */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <p
                        className="text-[10px] tracking-[0.3em] uppercase mb-8"
                        style={{ fontFamily: sans, color: colors.sage }}
                    >
                        Weight Variations
                    </p>
                    <div className="space-y-4">
                        {font.weights.map((w) => (
                            <div key={w.weight} className="flex items-baseline gap-6">
                                <span
                                    className="text-[10px] tracking-[0.15em] uppercase w-20 shrink-0 tabular-nums"
                                    style={{ fontFamily: sans, color: colors.wood }}
                                >
                                    {w.weight}
                                </span>
                                <span
                                    className="text-[10px] tracking-[0.15em] uppercase w-24 shrink-0"
                                    style={{ fontFamily: sans, color: colors.sage }}
                                >
                                    {w.label}
                                </span>
                                <span
                                    className="text-3xl md:text-4xl"
                                    style={{
                                        fontFamily: font.family,
                                        fontWeight: w.weight,
                                        color: colors.charcoal,
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    Calamigos Ranch
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Editorial note */}
                <motion.div
                    className={`max-w-xl ${isEven ? 'ml-0' : 'ml-auto'}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                >
                    <div className="h-px w-16 mb-6" style={{ backgroundColor: colors.divider }} />
                    <p
                        className="text-sm leading-relaxed"
                        style={{ fontFamily: sans, color: colors.sage }}
                    >
                        {font.editorial}
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

/* ============================================ */
/* PAIRING SHOWCASE COMPONENT */
/* ============================================ */
const PairingShowcase = ({
    pairing,
    index,
}: {
    pairing: (typeof pairings)[0];
    index: number;
}) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            className="max-w-7xl mx-auto px-8 md:px-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {/* Pairing label */}
            <div className={`flex items-center gap-4 mb-10 ${isEven ? '' : 'justify-end'}`}>
                <span
                    className="text-[10px] tracking-[0.3em] uppercase"
                    style={{ fontFamily: sans, color: colors.sage }}
                >
                    {pairing.display.name}
                </span>
                <div className="h-px w-8" style={{ backgroundColor: colors.divider }} />
                <span
                    className="text-[10px] tracking-[0.3em] uppercase"
                    style={{ fontFamily: sans, color: colors.sage }}
                >
                    {pairing.body.name}
                </span>
            </div>

            {/* Editorial layout */}
            <div
                className="p-8 md:p-16"
                style={{
                    backgroundColor: 'white',
                    borderRadius: '2px',
                    border: `1px solid ${colors.divider}`,
                }}
            >
                <div className={`max-w-3xl ${isEven ? '' : 'ml-auto'}`}>
                    <h3
                        className="font-light mb-6"
                        style={{
                            fontFamily: pairing.display.family,
                            fontSize: 'clamp(36px, 6vw, 64px)',
                            letterSpacing: '-0.025em',
                            lineHeight: '1.05',
                            color: colors.grove,
                        }}
                    >
                        {pairing.headline}
                    </h3>
                    <p
                        className="text-lg md:text-xl mb-8 leading-relaxed"
                        style={{
                            fontFamily: pairing.display.family,
                            fontWeight: 300,
                            color: colors.wood,
                            fontStyle: 'italic',
                        }}
                    >
                        {pairing.subhead}
                    </p>
                    <div className="h-px w-24 mb-8" style={{ backgroundColor: colors.divider }} />
                    <p
                        className="text-base leading-[1.8]"
                        style={{
                            fontFamily: pairing.body.family,
                            color: colors.charcoal,
                            maxWidth: '65ch',
                        }}
                    >
                        {pairing.paragraph}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

/* ============================================ */
/* PRINCIPLE BLOCK COMPONENT */
/* ============================================ */
const PrincipleBlock = ({
    number,
    title,
    subtitle,
    description,
    children,
}: {
    number: string;
    title: string;
    subtitle: string;
    description: string;
    children: React.ReactNode;
}) => (
    <motion.div
        className="mb-32"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
    >
        <div className="flex items-baseline gap-4 mb-4">
            <span
                className="text-[10px] tracking-[0.2em] tabular-nums"
                style={{ fontFamily: sans, color: colors.wood }}
            >
                {number}
            </span>
            <span
                className="text-[10px] tracking-[0.3em] uppercase"
                style={{ fontFamily: sans, color: colors.sage }}
            >
                {subtitle}
            </span>
        </div>
        <h3
            className="text-3xl md:text-4xl font-light mb-6"
            style={{
                fontFamily: serif,
                letterSpacing: '-0.015em',
                color: colors.grove,
            }}
        >
            {title}
        </h3>
        <p
            className="text-base leading-relaxed mb-12 max-w-2xl"
            style={{ fontFamily: sans, color: colors.sage }}
        >
            {description}
        </p>
        {children}
    </motion.div>
);

export default MoodboardFonts;
