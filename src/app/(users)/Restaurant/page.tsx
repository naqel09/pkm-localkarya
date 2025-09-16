import TourHeader from '@/components/TourHeader'
import RestaurantList from '@/components/users/pages/Restaurant/RestaurantList'
import React from 'react'

const page = () => {
  return (
    <>
      <TourHeader title='Kuliner' halaman='Kuliner Asik' bagian='Food Ranger' image="/makanan1.webp"/>
      <RestaurantList />
    </>
  )
}

export default page
