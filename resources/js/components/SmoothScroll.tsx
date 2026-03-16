import { ReactLenis } from 'lenis/react';
import React from 'react';

interface SmoothScrollProps {
    children: React.ReactNode;
    /** Override default lerp (0.1). Lower = smoother, higher = snappier */
    lerp?: number;
    /** Duration multiplier. Default 1.2 */
    duration?: number;
}

/**
 * Lenis smooth-scroll wrapper.
 * Drop this around page content to enable buttery-smooth inertial scrolling.
 *
 * Usage:
 *   <SmoothScroll>
 *     <YourPageContent />
 *   </SmoothScroll>
 */
const SmoothScroll = ({ children, lerp = 0.1, duration = 1.2 }: SmoothScrollProps) => (
    <ReactLenis
        root
        options={{
            lerp,
            duration,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        }}
    >
        {children}
    </ReactLenis>
);

export default SmoothScroll;
