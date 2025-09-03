import TourHeader from '@/components/TourHeader'
import RestaurantList from '@/components/users/pages/Restaurant/RestaurantList'
import Pagination from '@/components/users/pagination/Pagination'
import React from 'react'

const page = () => {
  return (
    <>
      <TourHeader title='Restaurant' halaman='Beranda' bagian='Restaurant' image="/bedroom.jpg"/>
      <RestaurantList></RestaurantList>
    </>
  )
}

export default page
