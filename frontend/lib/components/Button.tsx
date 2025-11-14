import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

type ButtonMode = 'contained' | 'outlined';

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  mode?: ButtonMode;
  loading?: boolean;
}

export default function Button({
  children,
  className,
  mode = 'contained',
  loading = false,
  disabled,
  ...rest
}: ButtonProps) {
  const baseStyles =
    'text-sm font-medium rounded-xl transition duration-150 flex items-center justify-center px-4 py-2';

  const containedStyles =
    'bg-primary text-white border border-transparent shadow-md hover:bg-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary';

  const outlinedStyles =
    'bg-white text-accentForeground border border-input hover:bg-gray-200';

  return (
    <button
      className={clsx(
        baseStyles,
        {
          [containedStyles]: mode === 'contained',
          [outlinedStyles]: mode === 'outlined',
          'opacity-50 cursor-not-allowed': disabled || loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
