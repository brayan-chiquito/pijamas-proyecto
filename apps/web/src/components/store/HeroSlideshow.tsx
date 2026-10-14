'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const INTERVAL_MS = 4000

export function HeroSlideshow({ images }: { images: { url: string; alt: string }[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length)
    }, INTERVAL_MS)
    const stop = () => window.clearInterval(timer)
    media.addEventListener('change', stop)
    return () => {
      window.clearInterval(timer)
      media.removeEventListener('change', stop)
    }
  }, [images.length])

  if (images.length === 0) {
    return <div className="aspect-[4/5] rounded-lg bg-plum-100" />
  }

  return (
    <figure className="relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-cream-100">
        {images.map((image, imageIndex) => {
          const active = imageIndex === index
          return (
            <Image
              key={image.url}
              src={image.url}
              alt={active ? image.alt : ''}
              fill
              priority={imageIndex === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              aria-hidden={active ? undefined : true}
              className={`object-cover hero-photo ${active ? 'hero-photo-active opacity-100' : 'opacity-0'}`}
            />
          )
        })}
      </div>
      {images.length > 1 ? (
        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          {images.map((image, imageIndex) => {
            const active = imageIndex === index
            return (
              <button
                key={image.url}
                type="button"
                aria-label={`Foto ${imageIndex + 1} de ${images.length}`}
                aria-current={active ? 'true' : undefined}
                onClick={() => setIndex(imageIndex)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center"
              >
                <span className={`block h-2.5 w-2.5 rounded-full ${active ? 'bg-plum-700' : 'bg-cream-50'}`} />
              </button>
            )
          })}
        </div>
      ) : null}
    </figure>
  )
}
