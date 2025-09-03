import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { restaurants } from '@/data/restaurant'
import TourHeader from '@/components/TourHeader'

const page = ({params}:{params:{slug:string}}) => {
    const restaurant=restaurants.find((r)=>r.slug === params.slug)

    if(!restaurant){
        return notFound();
    }
  return (
    <>
        <TourHeader title='restaurant' halaman='Home' bagian="Restaurant | Detail-Restaurant" image="/bedroom.jpg"/>
        <section className='max-w-8xl mx-auto p-6'>
            <div className='relative w-full h-[400px] rounded-2xl overflow-hidden shadow-md mb-6'>
                <Image src={restaurant.gambar} alt={restaurant.nama} fill className='object-cover'/>
            </div>

            <h1 className='text-3xl font-bold mb-2 uppercase'>{restaurant.nama}</h1>
            <p className='text-gray-600 text-lg mb-4'>{restaurant.kategory}</p>

            <div className='my-3'>
                <h2 className='text-2xl font-bold'>Deskripsi:</h2>
                <p>{restaurant.Deskripsi}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700 mb-6">
                <p><span className='font-semibold'>Telepon:</span> {" "}<a href="" className='text-blue-600 hover:underline'>{restaurant.telefon}</a></p>
                <p><span className='font-semibold'>Jam Buka:</span> {restaurant.waktubuka} - {restaurant.waktututup}</p>
                <p className='capitalize'><span className='font-semibold'>Hari Buka:</span> {restaurant.hari}</p>
            </div>

            <div className='mt-8'>
                <h3 className='text-2xl font-bold mb-2'>Menu</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Menu Makanan */}
                    <div>
                        <h3 className='text-xl font-semibold mb-2'>Makanan</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {restaurant.menu.makanan.map((food,index)=>(
                                <li key={index}>{food.nama}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Minuman */}
                    <div>
                        <h3 className='text-xl font-semibold mb-2'>Minuman</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {restaurant.menu.minuman.map((drink,index)=>(
                                <li key={index}>{drink.nama}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default page
