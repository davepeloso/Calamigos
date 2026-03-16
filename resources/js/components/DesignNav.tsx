import { motion } from 'motion/react';
import React from 'react';

interface DesignNavProps {
  currentDesign: string;
  designs: Array<{ id: string; name: string; description: string }>;
  onDesignChange: (designId: string) => void;
}

const DesignNav = ({ currentDesign, designs, onDesignChange }: DesignNavProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-xs">
      <div className="text-sm font-semibold text-gray-900 mb-3">Design Variations</div>
      <div className="space-y-2">
        {designs.map((design) => (
          <motion.button
            key={design.id}
            onClick={() => onDesignChange(design.id)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              currentDesign === design.id
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="font-medium text-sm">{design.name}</div>
            <div className="text-xs mt-1 opacity-75">{design.description}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DesignNav;
