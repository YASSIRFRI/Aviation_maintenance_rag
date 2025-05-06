import React from 'react';
import { cn } from '../../utils/cn';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
  fallbackClassName?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className,
  fallbackClassName,
}) => {
  const [imgError, setImgError] = React.useState(false);
  
  const sizeClasses: Record<AvatarSize, string> = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  const handleImgError = () => {
    setImgError(true);
  };
  
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center flex-shrink-0 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700',
        sizeClasses[size],
        className
      )}
    >
      {!imgError && src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleImgError}
        />
      ) : name ? (
        <span className={cn('font-medium text-gray-600 dark:text-gray-300', fallbackClassName)}>
          {getInitials(name)}
        </span>
      ) : (
        <span className={cn('font-medium text-gray-600 dark:text-gray-300', fallbackClassName)}>
          ?
        </span>
      )}
    </div>
  );
};

export default Avatar;