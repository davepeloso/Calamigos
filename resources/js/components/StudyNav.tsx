import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';

interface StudyNavProps {
    currentPage: string;
}

const pages = [
    {
        id: 'home',
        label: 'Calamigos',
        href: '/',
        chapter: '00',
    },
    {
        id: 'motion',
        label: 'Motion',
        href: '/moodboard/motion',
        chapter: '01',
    },
    {
        id: 'fonts',
        label: 'Typography',
        href: '/moodboard/fonts',
        chapter: '02',
    },
    {
        id: 'scrollytelling',
        label: 'Scrollytelling',
        href: '/moodboard/scrollytelling',
        chapter: '03',
    },
    {
        id: 'animations',
        label: 'Interactions',
        href: '/moodboard/animations',
        chapter: '04',
    },
    {
        id: 'vocabulary',
        label: 'Vocabulary',
        href: '/moodboard/vocabulary',
        chapter: '05',
    },
    {
        id: 'easing',
        label: 'Easing',
        href: '/moodboard/easing',
        chapter: '06',
    },
    {
        id: 'color',
        label: 'Atmosphere',
        href: '/moodboard/color',
        chapter: '07',
    },
    {
        id: 'scrollcraft',
        label: 'Scroll Craft',
        href: '/moodboard/scrollcraft',
        chapter: '08',
    },
    {
        id: 'snapflow',
        label: 'Snap Flow',
        href: '/moodboard/snapflow',
        chapter: '09',
    },
    {
        id: 'designs',
        label: 'Playground',
        href: '/designs',
        chapter: '10',
    },
];

const StudyNav = ({ currentPage }: StudyNavProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentIndex = pages.findIndex(p => p.id === currentPage);

    return (
        <>
            {/* Fixed corner trigger */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-6 right-6 z-[100] flex items-center gap-3 group"
                whileHover={{ x: -4 }}
            >
                <span
                    className="text-xs tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                >
                    {isOpen ? 'Close' : 'Index'}
                </span>
                <div className="flex flex-col gap-[5px] w-6">
                    <motion.div
                        className="h-[1.5px] bg-current origin-right"
                        animate={isOpen ? { rotate: -45, width: '100%' } : { rotate: 0, width: '100%' }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.div
                        className="h-[1.5px] bg-current origin-right"
                        animate={isOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.div
                        className="h-[1.5px] bg-current origin-right"
                        animate={isOpen ? { rotate: 45, width: '100%' } : { rotate: 0, width: '60%' }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </motion.button>

            {/* Full-screen overlay navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-[90] flex"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0"
                            style={{ backgroundColor: '#2F4A3F' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.97 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Navigation content */}
                        <div className="relative z-10 flex flex-col justify-center w-full max-w-5xl mx-auto px-8 md:px-16">
                            <motion.div
                                className="mb-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <span
                                    className="text-[#7A8F82] text-xs tracking-[0.3em] uppercase"
                                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                >
                                    Design Study Index
                                </span>
                            </motion.div>

                            <nav className="space-y-1">
                                {pages.map((page, index) => {
                                    const isActive = page.id === currentPage;
                                    return (
                                        <motion.a
                                            key={page.id}
                                            href={page.href}
                                            className={`group flex items-baseline gap-6 py-3 transition-colors ${
                                                isActive
                                                    ? 'text-[#EAE4D8]'
                                                    : 'text-[#7A8F82] hover:text-[#EAE4D8]'
                                            }`}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * index + 0.15, duration: 0.4 }}
                                        >
                                            <span
                                                className="text-xs tracking-[0.2em] w-8 shrink-0 opacity-40"
                                                style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                            >
                                                {page.chapter}
                                            </span>
                                            <span
                                                className="text-3xl md:text-5xl font-light tracking-tight"
                                                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                                            >
                                                {page.label}
                                            </span>
                                            {isActive && (
                                                <motion.span
                                                    className="text-xs tracking-[0.2em] uppercase opacity-50 ml-4"
                                                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                                    layoutId="current-indicator"
                                                >
                                                    Current
                                                </motion.span>
                                            )}
                                            <motion.div
                                                className="flex-1 h-[1px] bg-current opacity-0 group-hover:opacity-20 transition-opacity origin-left"
                                            />
                                        </motion.a>
                                    );
                                })}
                            </nav>

                            <motion.div
                                className="mt-16 flex items-center gap-8 text-[#7A8F82]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <span
                                    className="text-xs tracking-[0.2em]"
                                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                >
                                    Calamigos Ranch &mdash; Scrollytelling Design Study
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom progress bar */}
            <div className="fixed bottom-0 left-0 right-0 z-[80] h-[2px] bg-black/5">
                <motion.div
                    className="h-full"
                    style={{ backgroundColor: '#2F4A3F' }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentIndex + 1) / pages.length) * 100}%` }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
            </div>
        </>
    );
};

export default StudyNav;
