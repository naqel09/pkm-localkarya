import React from 'react'
import HeroCarousel from './HeroCarousel'
import SearchBox from './SearchBox'

function Carousel() {
  return (
    <section className="relative h-screen w-full overflow-hidden border border-black z-0">
        <HeroCarousel/>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
                <p className="lg:text-3xl md:text-xl text-sm tracking-widest uppercase text-white">
                    ini adalah tampilan dari hero
                </p>
                <h1 className="md:text-9xl lg:text-[10rem] text-6xl font-bold text-white">
                    ADVENTURE
                </h1>
                <p className="text-center text-white max-w-xl mt-4 text-xl">
                    mari menciptakan perjalan yang indah dan dapat di lakukan di
                    saat anda memiliki waktu luang yang sedang langka terjadwal
                    dan sedang dinanti-nanti.
                </p>
                <SearchBox />
            </div>
    </section>
  )
}

export default Carousel
