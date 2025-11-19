import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
    label?: string;
    id?: string;
    type?: string;
    error?: string;
    helperText?: string;
    className?: string;
    disabled?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    id,
    type = 'text',
    error,
    helperText,
    className = '',
    disabled = false,
    ...props
}, ref) => {

    return (
        <div className="w-full">
            {/* Label Section */}
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-black mb-1.5"
                >
                    {label}
                </label>
            )}

            {/* Input Wrapper */}
            <div className="relative">
                <input
                    ref={ref}
                    id={id}
                    type={type}
                    disabled={disabled}
                    className={`
            block w-full px-3 py-2 text-sm 
            bg-white text-black placeholder:text-neutral-400
            border rounded-sm transition-colors duration-200 ease-in-out
            focus:outline-none 
            disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400 disabled:border-neutral-200
            ${error
                            ? 'border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-red-900'
                            : 'border-neutral-300 hover:border-neutral-400 focus:border-black focus:ring-1 focus:ring-black'
                        }
            ${className}
          `}
                    {...props}
                />
            </div>

            {/* Helper Text & Error Message */}
            {error ? (
                <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center">
                    {error}
                </p>
            ) : helperText ? (
                <p className="mt-1.5 text-xs text-neutral-500">
                    {helperText}
                </p>
            ) : null}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;