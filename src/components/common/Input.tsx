import { type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = ({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2 border rounded-lg
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-danger' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            placeholder:text-gray-400
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `.trim()}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
};
