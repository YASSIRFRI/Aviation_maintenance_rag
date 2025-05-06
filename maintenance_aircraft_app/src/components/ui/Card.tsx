import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  footer,
  children,
}) => {
  return (
    <div className={cn('bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden', className)}>
      {(title || description) && (
        <div className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', headerClassName)}>
          {title && typeof title === 'string' ? (
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
          ) : (
            title
          )}
          {description && typeof description === 'string' ? (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          ) : (
            description
          )}
        </div>
      )}
      <div className={cn('px-6 py-4', bodyClassName)}>{children}</div>
      {footer && (
        <div className={cn('px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700', footerClassName)}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;