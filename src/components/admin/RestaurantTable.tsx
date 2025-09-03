// "use client"
// import React,{useEffect, useState} from 'react'
// import Link from 'next/link'
// import {Plus,Pencil, Trash2} from "lucide-react"

// const RestaurantTable = () => {
//   const [search,setSearch]= useState("")
//   const [restaurants,setRestaurants] = useState<any[]>([]);
//   const [currentPage,setCurrentPage]=useState(1)
//   const itemperPage=5
  

//   // useEffect(()=>{
//   //   async function fetchRestaurant(){
//   //     try{
//   //       const res = await fetch("/api/restaurant");
//   //       if(!res.ok) throw new Error("Gagal mengambil data");
//   //       const data = await res.json();
//   //       setRestaurants(Array.isArray(data)?data:data.data||[]);
//   //     }catch(error){
//   //       console.error("Error tidak bisa mendapatkan data restaurant",error)
//   //     }
//   //   }
//   //   fetchRestaurant();
//   // },[])

//   const filterRestaurant= restaurants.filter(
//     (resto)=> resto.nama.toLowerCase().includes(search.toLowerCase())
//   )

//   // pagination logic
//   const lastItem= currentPage * itemperPage;
//   const firstItem = lastItem - itemperPage;
//   const currentItems=filterRestaurant.slice(firstItem,lastItem)

//   const totalPages = Math.ceil(filterRestaurant.length/itemperPage)


//   return (
//     <section>
//       <div className='flex items-center justify-between mb-4 border-b-2'>
//         <h2 className='text-xl font-semibold'>Daftar Restaurant</h2>
//       </div>
//       <div className='flex justify-between mb-4'>
//         <Link href="/Dashboard/Restaurant/InputRestaurant" className='bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 cursor-pointer'>
//         <Plus size={18}/> Input Restaurant
//         </Link>
//         <input type="text" placeholder='Cari Restaurant...' className='w-1/4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
//       </div>
//       <div className='overflow-x-auto'>
//         <table className='w-full text-center border rounded-lg overflow-hidden'>
//           <thead className='bg-green-500 text-gray-700'>
//             <tr>
//               <th className='p-3 capitalize'>Gambar</th>
//               <th className='p-3 capitalize'>nama restaurant</th>
//               <th className='p-3 capitalize'>telefon</th>
//               <th className='p-3 capitalize'>kategori</th>
//               <th className='p-3 capitalize'>hari</th>
//               <th className='p-3 capitalize'>Jam</th>
//               <th className='p-3 capitalize'>menu</th>
//               <th className='p-3 capitalize'>action</th>
//             </tr>
//           </thead>
//           <tbody className='xl:text-lg text-sm text-center'>
//             {filterRestaurant.length === 0?(

//             <tr>
//               <td>
//                 data restaurant belum di input
//               </td>
//             </tr>
//             ):(

//             currentItems.map((resto:any)=>(

//             <tr key={resto.id} className='border-t hover:bg-gray-50'>
//               <td className='p-2'>
//                 <img src={resto.gambar} alt="artikel" className="w-20 h-12 object-cover mx-auto" />
//               </td>
//               <td className='p-3'>{resto.nama}</td>
//               <td className='p-3'>{resto.telefon}</td>
//               <td className='p-3'>{resto.kategory}</td>
//               <td className='p-3'>{resto.hari}</td>
//               <td className='p-3'>{resto.waktubuka} - {resto.waktututup}</td>
//               <td className='p-3'>{resto.menu.length || 0}</td>
//               <td className='p-3'>
//                 <div className='flex justify-center items-center gap-3 mx-auto'>
//                   <Link href={`/Restaurant/Edit/${resto.id}`} className='flex items-center text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md'>
//                     <Pencil size={16}/> Edit
//                   </Link>
//                   <button className='flex items-center text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 text-sm rounded-md'>
//                     <Trash2 size={16}/> Hapus
//                   </button>
//                 </div>
//               </td>
//             </tr>
//             ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   )
// }

// export default RestaurantTable
