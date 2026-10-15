'use client';

import Image from 'next/image';

type Props = {
  hasGuessed: boolean;                 // kept for future badges if you want
  actualRating: 0 | 1 | 2 | 3 | null;  // kept for future badges if you want
  posterUrl: string | null;            // NEW: real movie poster URL (TMDb)
  title?: string;                      // optional alt text
};

export function PosterCard({ hasGuessed, actualRating, posterUrl, title }: Props) {
  const src = posterUrl ?? 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg';
  
  console.log('🖼️ PosterCard: Rendering with src:', src);
  console.log('🖼️ PosterCard: Title:', title);
  console.log('🖼️ PosterCard: Has guessed:', hasGuessed);

  return (
    <div className="relative inline-block">
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-2">
        <Image
          src={src}
          alt={`${title ?? 'Movie'} poster`}
          width={240}
          height={360}
          className="object-contain rounded-xl sm:rounded-2xl"
          priority
          onLoad={() => console.log('🖼️ Image loaded successfully:', src)}
          onError={(e) => console.error('🖼️ Image failed to load:', src, e)}
        />
      </div>
    </div>
  );
}
