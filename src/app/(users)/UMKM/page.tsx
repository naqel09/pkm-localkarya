import TourHeader from '@/components/TourHeader'
import UmkmList from '@/components/users/pages/UMKM/UmkmList'
import React from 'react'

const page = () => {
  return (
    <>
      <TourHeader 
        title='UMKM Lokal' 
        halaman='Produk UMKM' 
        bagian='Local Business' 
        image="/cultural.jpg"
      />
      <UmkmList />
    </>
  )
}

export default page