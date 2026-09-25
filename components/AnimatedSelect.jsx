import { motion } from 'framer-motion';
import { useState } from 'react';
import { Icons } from './ui/Icons';

export default function AnimatedSelect({ label, name, options, value, onChange, error, required }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{
          borderColor: error ? '#ef4444' : isOpen ? '#007C7A' : '#d1d5db',
          boxShadow: isOpen ? '0 0 0 3px rgba(0, 124, 122, 0.1)' : 'none',
        }}
        className={`
          w-full
          px-4
          py-2
          border-2
          rounded-lg
          text-left
          font-medium
          bg-white
          flex
          justify-between
          items-center
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      >
        <span>{value ? options.find(o => o.value === value)?.label : 'Select...'}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
        >
          {options.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => {
                onChange({ target: { name, value: option.value } });
                setIsOpen(false);
              }}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500 flex items-center gap-1"
        >
          <Icons.AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </motion.p>
      )}
    </div>
  );
}
