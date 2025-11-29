import React from 'react';
import { cn } from '@/lib/utils';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import { useGlobalAvatar } from '@/hooks/useGlobalAvatar';
import { Avatar as RadixAvatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AvatarProps {
  userId?: string;
  src?: string | null; // ignored intentionally (avatar photos disabled)
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  style?: React.CSSProperties;
  enableUpload?: boolean; // ignored
  showCameraOverlay?: boolean; // ignored
  isOwnProfile?: boolean; // ignored
}

const sizePixels: Record<NonNullable<AvatarProps['size']>, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
};

const textSizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'text-[10px]',
  sm: 'text-[11px]',
  md: 'text-[12px]',
  lg: 'text-[14px]',
  xl: 'text-[16px]',
  '2xl': 'text-[20px]',
};

// Avatar with image support: resolves URLs and falls back to initials.
const Avatar: React.FC<AvatarProps> = ({
  userId,
  initials,
  size = 'md',
  className,
  style,
}) => {
  const { firstName, lastName, initials: derivedInitials } = useUniversalUser(userId);
  const { avatarUrl } = useGlobalAvatar(userId);

  const nameInitials = firstName && lastName
    ? `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`
    : '';

  const finalInitials = (initials || derivedInitials || nameInitials || '??').trim();

  const pixelSize = sizePixels[size] || sizePixels.md;
  const textClass = textSizeClasses[size] || textSizeClasses.md;

  return (
    <RadixAvatar
      className={cn(
        'rounded-full bg-muted text-muted-foreground flex items-center justify-center select-none img-locked-wrapper',
        textClass,
        className
      )}
      style={{
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        minWidth: `${pixelSize}px`,
        minHeight: `${pixelSize}px`,
        ...style,
      }}
      aria-label="User avatar"
    >
      {avatarUrl ? (
        <AvatarImage src={avatarUrl as any} alt="User avatar photo" />
      ) : null}
      <AvatarFallback className={cn('font-semibold', textClass)} style={{ lineHeight: 1 }}>
        {finalInitials}
      </AvatarFallback>
    </RadixAvatar>
  );
};

export default React.memo(Avatar);
