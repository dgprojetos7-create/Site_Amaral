import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  to?: string;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  to, 
  href,
  target,
  rel,
  onClick, 
  className = '',
  type = 'button',
  fullWidth = false,
  style,
  disabled = false,
}) => {
  const baseClass = `btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${disabled ? 'btn-disabled' : ''} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={baseClass} style={style} aria-disabled={disabled || undefined} onClick={disabled ? (event) => event.preventDefault() : undefined}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        className={baseClass}
        style={style}
        target={disabled ? undefined : target}
        rel={disabled ? undefined : rel}
        aria-disabled={disabled || undefined}
        onClick={disabled ? (event) => event.preventDefault() : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={baseClass} onClick={onClick} style={style} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
