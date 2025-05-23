import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type ReuseableCarouselProps = {
  slides: React.ReactNode[]
  options?: {
    loop?: boolean
    align?: 'start' | 'center'
    slidesToScroll?: number
  }
}

export default function ReuseableCarousel({
  slides,
  options = {
    loop: false,
    align: 'start',
    slidesToScroll: 1,
  },
}: ReuseableCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...options,
    dragFree: true,
    containScroll: 'trimSnaps',
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className="relative px-4">
      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white p-2 transition-all duration-300 rounded-full shadow-lg hover:bg-gray-100 z-10"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white transition-all duration-300 p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
      >
        <ArrowRight className="w-6 h-6" />
      </button>

      {/* Carousel Content */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] p-2"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
