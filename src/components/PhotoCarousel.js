"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PhotoCarousel({ photos }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), 4500);
    return () => clearInterval(id);
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl shadow-md md:max-w-5xl">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
        {photos.map((url, i) => (
          <Image
            key={url}
            src={url}
            alt=""
            fill
            sizes="(min-width: 768px) 1024px, 100vw"
            priority={i === 0}
            className={`object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>

      {photos.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1}`}
              className={`h-1.5 rounded-full shadow transition-all ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
