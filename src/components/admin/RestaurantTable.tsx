"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye } from "lucide-react"

interface Menu {
  id: number;
  namaMenu: string;
  harga: number;
  fotoMakanan1?: string;
  fotoMakanan2?: string;
}

interface Restaurant {
  id: number;
  namaRestaurant: string;
  alamatRestaurant: string;
  deskripsiRestaurant: string;
  gmaps?: string;
  noWa?: string;
  gambar1?: string;
  gambar2?: string;
  gambar3?: string;
  gambar4?: string;
  gambar5?: string;
  gambar6?: string;
  fotoMenu1?: string;
  fotoMenu2?: string;
  fotoMenu3?: string;
  menus: Menu[];
  createdAt: string;
}

const RestaurantTable = () => {
  const [search, setSearch] = useState("")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const itemPerPage = 5

  useEffect(() => {
    fetchRestaurants();
  }, [])

  const fetchRestaurants = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/restaurant");
      if (!res.ok) throw new Error("Failed to fetch restaurants");
      const data = await res.json();
      if (data.success) {
        setRestaurants(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message || "Failed to fetch restaurants");
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
      setRestaurants([]);
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus restaurant "${nama}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/restaurant/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        alert('Restaurant berhasil dihapus!');
        fetchRestaurants(); // Refresh the list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Terjadi kesalahan saat menghapus restaurant');
    }
  }

  const filterRestaurants = restaurants.filter(
    (resto) => resto.namaRestaurant.toLowerCase().includes(search.toLowerCase())
  )

  // pagination logic
  const lastItem = currentPage * itemPerPage;
  const firstItem = lastItem - itemPerPage;
  const currentItems = filterRestaurants.slice(firstItem, lastItem)

  const totalPages = Math.ceil(filterRestaurants.length / itemPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  }

  if (loading) {
    return (
      <section>
        <div className='flex items-center justify-center py-8'>
          <div className='text-lg'>Loading restaurants...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <div className='flex items-center justify-center py-8'>
          <div className='text-lg text-red-600'>Error: {error}</div>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className='flex items-center justify-between mb-4 border-b-2'>
        <h2 className='text-xl font-semibold'>Daftar Restaurant</h2>
      </div>
      <div className='flex justify-between mb-4'>
        <Link href="/dashboard/Restaurant/InputRestaurant" className='bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 cursor-pointer'>
          <Plus size={18} /> Input Restaurant
        </Link>
        <input 
          type="text" 
          placeholder='Cari Restaurant...' 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-1/4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
        />
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-center border rounded-lg overflow-hidden'>
          <thead className='bg-green-500 text-white'>
            <tr>
              <th className='p-3 capitalize'>Gambar</th>
              <th className='p-3 capitalize'>Nama Restaurant</th>
              <th className='p-3 capitalize'>Alamat</th>
              <th className='p-3 capitalize'>Jumlah Menu</th>
              <th className='p-3 capitalize'>Tanggal Dibuat</th>
              <th className='p-3 capitalize'>Aksi</th>
            </tr>
          </thead>
          <tbody className='xl:text-lg text-sm text-center'>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-8 text-gray-500'>
                  {search ? 'Tidak ada restaurant yang ditemukan' : 'Data restaurant belum diinput'}
                </td>
              </tr>
            ) : (
              currentItems.map((resto: Restaurant) => (
                <tr key={resto.id} className='border-t hover:bg-gray-50'>
                  <td className='p-2'>
                    {resto.gambar1 ? (
                      <img 
                        src={resto.gambar1.startsWith('http') || resto.gambar1.startsWith('/uploads/') ? resto.gambar1 : `/uploads/${resto.gambar1}`} 
                        alt="restaurant" 
                        className="w-20 h-12 object-cover mx-auto rounded" 
                      />
                    ) : (
                      <div className="w-20 h-12 bg-gray-200 flex items-center justify-center mx-auto rounded">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className='p-3 font-medium'>{resto.namaRestaurant}</td>
                  <td className='p-3 text-sm'>
                    {resto.alamatRestaurant.length > 30 
                      ? `${resto.alamatRestaurant.substring(0, 30)}...` 
                      : resto.alamatRestaurant
                    }
                  </td>
                  <td className='p-3'>
                    <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm'>
                      {resto.menus?.length || 0} menu
                    </span>
                  </td>
                  <td className='p-3 text-sm'>
                    {new Date(resto.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className='p-3'>
                    <div className='flex justify-center items-center gap-2'>
                      <Link 
                        href={`/dashboard/Restaurant/Edit/${resto.id}`} 
                        className='flex items-center text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md'
                      >
                        <Pencil size={14} className='mr-1' /> Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(resto.id, resto.namaRestaurant)}
                        className='flex items-center text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 text-sm rounded-md'
                      >
                        <Trash2 size={14} className='mr-1' /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-4 space-x-2'>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'
          >
            Next
          </button>
        </div>
      )}

      {/* Summary */}
      <div className='mt-4 text-sm text-gray-600 text-center'>
        Menampilkan {currentItems.length} dari {filterRestaurants.length} restaurant
        {search && ` (hasil pencarian: "${search}")`}
      </div>
    </section>
  )
}

export default RestaurantTable
