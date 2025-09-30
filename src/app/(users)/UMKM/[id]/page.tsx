import UmkmDetail from '@/components/users/pages/UMKM/UmkmDetail'
import React from 'react'

interface UmkmDetailPageProps {
  params: Promise<{ id: string }>
}

const page = async ({ params }: UmkmDetailPageProps) => {
  const { id } = await params
  
  return (
    <UmkmDetail id={id} />
  )
}

export default page