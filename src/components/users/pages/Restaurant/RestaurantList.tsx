"use client"
import React,{useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { restaurants } from '@/data/restaurant'
import Pagination from '../../pagination/Pagination'

const RestaurantList = () => {
  const [currentPage,setCurrentPage]= useState(1);
  const itemsPerPage=3;
  const totalPages = Math.ceil(restaurants.length/itemsPerPage);
  const startIndex = (currentPage -1 )* itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = restaurants.slice(startIndex,endIndex)
  return (
    <section>
        <div className='max-w-8xl bg-gray-50 p-6'>
          <h1 className='text-2xl font-bold mb-6 capitalize'>daftar restaurant</h1>
          <div className='flex flex-wrap justify-between'>
            <p>
              lihat tempat makan yang dapat membuat anda melanjutkan kesaharian dalam wisata kami nantinya
            </p>
            <div className='w-full md:w-1/4 relative'>
              <input type="text" placeholder='search' className='w-full border rounded-full py-2 px-4  text-sm focus:outline-none focus:ring-2 focus:ring-blue-400' />
            </div>
          </div>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {currentItems.map((resto,index)=>(
            <div key={index} className='rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-300'>
              <Image src={resto.gambar} alt="restaurant" width={400} height={250} className='w-full h-80 object-cover'/>
              <div className='p-4 capitalize'>
                <h2 className='text-2xl font-semibold uppercase'>{resto.nama}</h2>
                <p className='text-lg text-gray-600 '>kategori: {resto.kategory}</p>
                <p className='text-lg text-gray-600'>telepon:{" "} <a href="" className='text-blue-600 hover:underline'>{resto.telefon}</a></p>
                <p className='text-lg text-gray-600'>Hari: senin - jumat</p>
                <p className='text-lg text-gray-600'>jam: 9:00 - 21:00</p>

                <div className='mt-4 flex justify-end'>
                  <Link href={`/Restaurant/${resto.slug}`} className='inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition'>
                  Detail Restaurant
                  </Link>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>

        {totalPages > 1 &&(
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
        )}
    </section>
  )
}

export default RestaurantList
