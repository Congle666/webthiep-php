import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  'aria-label'?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}: ButtonProps) {
  const classNames = `btn btn--${variant} btn--${size} ${className}`.trim();

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:');
    
    if (isExternal) {
      return (
        <a href={href} className={classNames} {...props}>
          {children}
        </a>
      );
    }

    return (
      <Link to={href} className={classNames} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
