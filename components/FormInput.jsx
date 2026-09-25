import { useState } from 'react';
import { Icons } from './ui/Icons';

export default function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  autoComplete,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onFocus={() => setIsFocused(true)}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`
          w-full
          px-4
          py-2
          border
          rounded-lg
          font-medium
          transition-all
          duration-200
          focus:outline-none
          focus:ring-2
          focus:ring-offset-0
          disabled:bg-gray-100
          disabled:cursor-not-allowed
          ${error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-[#007C7A] focus:border-[#007C7A]'
          }
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <Icons.AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
