import React from 'react'
import { Metadata } from 'next'
import TourHeader from '../components/TourHeader'
import PilihKami from '../components/PilihKami'
import { PiAirplaneTiltFill } from "react-icons/pi";
import ContactInfo from './components/ContactInfo'

export const metadata:Metadata={
    title:"Tentang Kami",
    description:"memeberi informasi tentang team"
}

const page = () => {
  return (
    <>
    <TourHeader title="Tentang Kami" halaman='Home' bagian='Tentang' image="/bgImage.jpg"/>
    <div className='py-16 px-4 text-center'>
        <div className="flex justify-center mb-6">
        <span className="text-3xl"><PiAirplaneTiltFill /></span>
      </div>
        <p className='max-w-3xl mx-auto text-gray-600 leading-relaxed mb-16'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque id laudantium quisquam nobis voluptatum excepturi laborum itaque quia. Dolores beatae possimus optio nesciunt quis iste nemo perspiciatis, mollitia repudiandae reiciendis.</p> 
        <PilihKami/>
    </div>
    <ContactInfo/>
    </>
  )
}

export default page
