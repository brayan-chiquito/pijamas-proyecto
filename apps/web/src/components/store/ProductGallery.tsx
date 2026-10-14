'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { StoreImage } from '@/lib/catalog/types'

export function ProductGallery({ images }: { images: StoreImage[] }) {
  const [index, setIndex] = useState(0)
  const selected = images[index] ?? images[0]

  if (!selected) {
    return <div className="aspect-[4/5] rounded-lg bg-cream-100" />
  }

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-cream-100">
        {images.map((image, imageIndex) => (
          <Image
            key={image.url}
            src={image.url}
            alt={imageIndex === index ? image.alt : ''}
            fill
            priority={imageIndex === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={`object-cover motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-out ${
              imageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2" role="group" aria-label="Imágenes del producto">
          {images.map((image, imageIndex) => (
            <button
              key={image.url}
              type="button"
              aria-pressed={imageIndex === index}
              aria-label={`Ver imagen ${imageIndex + 1} de ${images.length}`}
              onClick={() => setIndex(imageIndex)}
              className="relative h-16 w-14 overflow-hidden rounded-sm border border-cream-200 aria-pressed:border-plum-700"
            >
              <Image src={image.url} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
