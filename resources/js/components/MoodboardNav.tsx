import { motion } from 'motion/react';
import React from 'react';

interface MoodboardNavProps {
  currentPage?: string;
}

const MoodboardNav = ({ currentPage }: MoodboardNavProps) => {
  const moodboards = [
    { 
      id: 'motion', 
      name: 'Motion Animations', 
      description: 'Interactive Motion.js examples',
      href: '/moodboard/motion',
      color: 'from-blue-500 to-purple-500'
    },
    { 
      id: 'fonts', 
      name: 'Google Fonts', 
      description: 'Typography inspiration',
      href: '/moodboard/fonts',
      color: 'from-indigo-500 to-blue-500'
    },
    { 
      id: 'scrollytelling', 
      name: 'Scrollytelling', 
      description: 'Narrative scroll patterns',
      href: '/moodboard/scrollytelling',
      color: 'from-cyan-500 to-blue-500'
    },
    { 
      id: 'animations', 
      name: 'Design Animations', 
      description: 'UI animation patterns',
      href: '/moodboard/animations',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        className="bg-white/90 backdrop-blur-lg rounded-full shadow-2xl border border-gray-200 px-4 py-3"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          {moodboards.map((board, index) => (
            <motion.a
              key={board.id}
              href={board.href}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentPage === board.id
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{
                background: currentPage === board.id 
                  ? `linear-gradient(135deg, ${board.color.split(' ').join(', ')})`
                  : 'transparent'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={board.description}
            >
              {board.name}
              {currentPage === board.id && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${board.color.split(' ').join(', ')})`
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MoodboardNav;
