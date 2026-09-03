"use client";

import Image from "next/image";
import { useState } from "react";

function placeholderFor(name: string): string {
  const initial = (name.trim()[0] ?? "N").toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#312e81'/><stop offset='50%' stop-color='#7e22ce'/><stop offset='100%' stop-color='#0e7490'/></linearGradient></defs><rect width='800' height='800' fill='url(#g)'/><text x='400' y='430' font-family='Arial, sans-serif' font-size='300' font-weight='bold' text-anchor='middle' fill='rgba(255,255,255,0.28)'>${initial}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

interface ProductImageProps {
  src: string;
  alt: string;
  name: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Wraps next/image with a graceful neon-gradient fallback when the remote
 * image fails to load or is unreachable.
 */
export function ProductImage({
  src,
  alt,
  name,
  fill = true,
  width,
  height,
  sizes,
  priority,
  className,
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);

  // Data URLs (from admin image uploads) can't go through next/image optimizer.
  if (imgSrc.startsWith("data:")) {
    return <img src={imgSrc} alt={alt} className={className} loading={priority ? "eager" : "lazy"} />;
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setImgSrc(placeholderFor(name))}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
