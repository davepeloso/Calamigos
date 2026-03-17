import { motion } from 'motion/react';
import React from 'react';

const display = "'Cormorant Garamond', Georgia, serif";
const body = "'DM Sans', system-ui, sans-serif";
const mono = "'JetBrains Mono', 'Fira Code', monospace";

const C = {
    groveDark: '#1A2E25',
    sage: '#7A8F82',
    cream: '#F5F2EA',
};

interface DeckNavProps {
    /** Which deck is currently active, e.g. 'v1.0' */
    currentDeck?: string;
}

const decks = [
    { version: 'v1.0', label: 'Deck v1.0', href: '/v1', accent: '#4d665a' },
    { version: 'v1.2', label: 'Deck v1.2', href: '/v2', accent: '#847963' },
    { version: 'v1.3', label: 'Deck v1.3', href: '/v3', accent: '#96acac' },
];

const DeckNav = ({ currentDeck }: DeckNavProps) => (
    <nav
        className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-12 py-3"
        style={{
            background: `${C.groveDark}E0`,
            backdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${C.sage}12`,
        }}
    >
        {/* Home link */}
        <a href="/" className="flex items-center gap-2 group">
            <span
                className="text-[10px] tracking-[0.15em] uppercase group-hover:text-white transition-colors"
                style={{ fontFamily: body, color: C.sage }}
            >
                ← Cover
            </span>
        </a>

        {/* Deck links */}
        <div className="flex items-center gap-1">
            {decks.map((d) => {
                const isActive = currentDeck === d.version;
                return (
                    <motion.a
                        key={d.version}
                        href={d.href}
                        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] tracking-[0.1em] uppercase transition-colors"
                        style={{
                            fontFamily: mono,
                            color: isActive ? C.cream : `${C.sage}80`,
                            background: isActive ? `${d.accent}20` : 'transparent',
                        }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: d.accent, opacity: isActive ? 1 : 0.4 }}
                        />
                        {d.label}
                    </motion.a>
                );
            })}
        </div>
    </nav>
);

export default DeckNav;
