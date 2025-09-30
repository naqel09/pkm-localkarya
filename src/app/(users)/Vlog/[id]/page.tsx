import VlogDetail from '@/components/users/pages/vlog/VlogDetail'
import TourHeader from '@/components/TourHeader'
import React from 'react'

interface VlogDetailPageProps {
  params: Promise<{ id: string }>
}

const page = async ({ params }: VlogDetailPageProps) => {
  const { id } = await params
  
  return (
    <>
      <TourHeader
        title="DETAIL VLOG"
        halaman="Video"
        bagian="Wisata"
        image="/images/artikel/headerblog.jpg"
      />
      <VlogDetail id={id} />
    </>
  )
}

export default page