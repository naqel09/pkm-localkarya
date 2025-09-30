"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye } from "lucide-react"

interface ProdukUmkm {
  id: number;
  namaProduk: string;
  hargaProduk: number;
  gambarProduk?: string;
  linkShopee?: string;
  linkTokopedia?: string;
}

interface Umkm {
  id: number;
  namaUmkm: string;
  alamatUmkm: string;
  deskripsiUmkm: string;
  linkGmaps?: string;
  nomorWhatsapp?: string;
  gambar?: string;
  produk: ProdukUmkm[];
  createdAt: string;
}

const UmkmTable = () => {
  const [search, setSearch] = useState("")
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const itemPerPage = 5

  useEffect(() => {
    fetchUmkm();
  }, [])

  const fetchUmkm = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/umkm");
      if (!res.ok) throw new Error("Failed to fetch UMKM");
      const data = await res.json();
      if (data.success) {
        setUmkmList(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message || "Failed to fetch UMKM");
      }
    } catch (error) {
      console.error("Error fetching UMKM:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
      setUmkmList([]);
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus UMKM "${nama}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/umkm/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        alert('UMKM berhasil dihapus!');
        fetchUmkm(); // Refresh the list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting UMKM:', error);
      alert('Terjadi kesalahan saat menghapus UMKM');
    }
  }

  const filterUmkm = umkmList.filter(
    (umkm) => umkm.namaUmkm.toLowerCase().includes(search.toLowerCase())
  )

  // pagination logic
  const lastItem = currentPage * itemPerPage;
  const firstItem = lastItem - itemPerPage;
  const currentItems = filterUmkm.slice(firstItem, lastItem)

  const totalPages = Math.ceil(filterUmkm.length / itemPerPage)

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
          <div className='text-lg'>Loading UMKM...</div>
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
        <h2 className='text-xl font-semibold'>Daftar UMKM</h2>
      </div>
      <div className='flex justify-between mb-4'>
        <Link href="/dashboard/UMKM/InputUmkm" className='bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 cursor-pointer'>
          <Plus size={18} /> Input UMKM
        </Link>
        <input 
          type="text" 
          placeholder='Cari UMKM...' 
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
              <th className='p-3 capitalize'>Nama UMKM</th>
              <th className='p-3 capitalize'>Alamat</th>
              <th className='p-3 capitalize'>WhatsApp</th>
              <th className='p-3 capitalize'>Jumlah Produk</th>
              <th className='p-3 capitalize'>Tanggal Dibuat</th>
              <th className='p-3 capitalize'>Aksi</th>
            </tr>
          </thead>
          <tbody className='xl:text-lg text-sm text-center'>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} className='p-8 text-gray-500'>
                  {search ? 'Tidak ada UMKM yang ditemukan' : 'Data UMKM belum diinput'}
                </td>
              </tr>
            ) : (
              currentItems.map((umkm: Umkm) => (
                <tr key={umkm.id} className='border-t hover:bg-gray-50'>
                  <td className='p-2'>
                    {umkm.gambar ? (
                      <img 
                        src={umkm.gambar.startsWith('http') || umkm.gambar.startsWith('/uploads/') ? umkm.gambar : `/uploads/${umkm.gambar}`} 
                        alt="umkm" 
                        className="w-20 h-12 object-cover mx-auto rounded" 
                      />
                    ) : (
                      <div className="w-20 h-12 bg-gray-200 flex items-center justify-center mx-auto rounded">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className='p-3 font-medium'>{umkm.namaUmkm}</td>
                  <td className='p-3 text-sm'>
                    {umkm.alamatUmkm.length > 30 
                      ? `${umkm.alamatUmkm.substring(0, 30)}...` 
                      : umkm.alamatUmkm
                    }
                  </td>
                  <td className='p-3 text-sm'>
                    {umkm.nomorWhatsapp ? (
                      <a 
                        href={`https://wa.me/${umkm.nomorWhatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800"
                      >
                        {umkm.nomorWhatsapp}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className='p-3'>
                    <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm'>
                      {umkm.produk?.length || 0} produk
                    </span>
                  </td>
                  <td className='p-3 text-sm'>
                    {new Date(umkm.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className='p-3'>
                    <div className='flex justify-center items-center gap-2'>
                      <Link 
                        href={`/dashboard/UMKM/Edit/${umkm.id}`} 
                        className='flex items-center text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md'
                      >
                        <Pencil size={14} className='mr-1' /> Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(umkm.id, umkm.namaUmkm)}
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
        Menampilkan {currentItems.length} dari {filterUmkm.length} UMKM
        {search && ` (hasil pencarian: "${search}")`}
      </div>
    </section>
  )
}

export default UmkmTable