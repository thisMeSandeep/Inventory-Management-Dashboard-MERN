import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'outline' | 'ghost';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className = '',
    children,
    isLoading = false,
    variant = 'primary',
    disabled,
    type = 'button',
    ...props
}, ref) => {

    //  Base Styles: Layout, Focus, Radius
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-70";

    // Variants: Colors & Borders
    const variantStyles = {
        primary: "bg-black text-white hover:bg-neutral-800 focus:ring-black border border-transparent",
        outline: "bg-white text-black border border-neutral-200 hover:border-black focus:ring-black",
        ghost: "bg-transparent text-black hover:bg-neutral-100 focus:ring-black",
    };

    return (
        <button
            ref={ref}
            type={type}
            disabled={isLoading || disabled}
            className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${className}
      `}
            {...props}
        >
            {/* Conditionally render the Spinner */}
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;