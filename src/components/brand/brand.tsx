'use client';
import Link from 'next/link';
import { useState } from 'react';

/** Uses public/logo.png when it exists, otherwise the built-in STUDYCORE mark. */
export function BrandMark({ size = 36 }: { size?: number }) {
  const [fallback, setFallback] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={fallback ? '/brand-mark.svg' : '/logo.png'} onError={() => setFallback(true)} alt="" width={size} height={size} className="brand-mark" />
  );
}

export function Brand({ compact = false, href = '/dashboard', inverse = false }: { compact?: boolean; href?: string; inverse?: boolean }) {
  return (
    <Link href={href} className={`brand ${inverse ? 'brand-inverse' : ''}`} aria-label="STUDYCORE, accueil">
      <BrandMark />
      {!compact && <span className="brand-word">studycore<span className="brand-dot">.</span></span>}
    </Link>
  );
}

export function Avatar({ firstName, lastName, size = 'default' }: { firstName: string; lastName: string; size?: 'default' | 'large' }) {
  const initials = `${firstName.charAt(0) || 'S'}${lastName.charAt(0) || 'C'}`.toUpperCase();
  return <span className={`avatar avatar-${size}`} aria-label={`Avatar de ${firstName} ${lastName}`}>{initials}</span>;
}
