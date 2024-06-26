import React, { memo } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { DirectionAwareHover } from "../components/ui/direction-aware-hover";
import Autoplay from "embla-carousel-autoplay";

interface MyCarouselProps {
    isAutoPlay: boolean,
    files: File[],
    handleMouseEnter: () => void,
    handleMouseLeave: () => void,
    handleImageSelect: (imageUrl: string) => void
    
  }
const MyCarousel = memo(function MyCarousel({isAutoPlay, files, handleMouseEnter, handleMouseLeave, handleImageSelect}: MyCarouselProps)  {
    return (
        <Carousel plugins={isAutoPlay ? [Autoplay({ delay: 1500 })] : []} className="w-full">
            <CarouselContent>
              {files.map((file, index) => (
                <CarouselItem
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  key={index} className="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="relative  flex items-center justify-center">
                    <DirectionAwareHover onClick={()=>handleImageSelect(URL.createObjectURL(file))} imageUrl={URL.createObjectURL(file)}>
                        <></>
                    </DirectionAwareHover>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
    )
})
export default MyCarousel