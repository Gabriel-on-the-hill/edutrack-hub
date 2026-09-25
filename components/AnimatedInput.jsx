import { motion } from 'framer-motion';
import { useState } from 'react';
import { Icons } from './ui/Icons';

export default function AnimatedInput({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-6 relative">
      <motion.label
        htmlFor={name}
        animate={{
          y: isFocused || value ? -24 : 0,
          scale: isFocused || value ? 0.85 : 1,
          color: error ? '#ef4444' : isFocused ? '#007C7A' : '#6b7280',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute left-4 top-4 origin-left cursor-text font-medium"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </motion.label>

      <motion.input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        animate={{
          borderColor: error ? '#ef4444' : isFocused ? '#007C7A' : '#d1d5db',
          boxShadow: isFocused
            ? '0 0 0 3px rgba(0, 124, 122, 0.1)'
            : '0 0 0 0px rgba(0, 124, 122, 0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          w-full
          px-4
          pt-6
          pb-2
          border-2
          rounded-lg
          font-medium
          bg-white
          transition-colors
          focus:outline-none
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />

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
