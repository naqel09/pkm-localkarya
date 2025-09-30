"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { VlogInput } from '@/components/admin/Input/VlogInput/VlogInput';

interface VlogData {
  judulVideo: string;
  deskripsiVideo: string;
  linkYoutube: string;
}

export default function EditVlogPage() {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [vlog, setVlog] = useState<VlogData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchVlogData = async () => {
      if (!id) return;
      
      setFetchLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/vlog/${id}`);
        const result = await response.json();

        if (result.status === 200) {
          setVlog(result.data);
        } else {
          setError(result.message || 'Vlog tidak ditemukan');
        }
      } catch (error) {
        console.error('Error fetching Vlog:', error);
        setError('Terjadi kesalahan saat mengambil data Vlog');
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchVlogData();
  }, [id]);

  const handleSubmit = async (formData: VlogData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/vlog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === 200) {
        alert('Vlog berhasil diupdate!');
        router.push('/dashboard/Vlog');
      } else {
        alert(`Error: ${result.message}`);
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (error) {
      console.error('Error updating Vlog:', error);
      alert('Terjadi kesalahan saat mengupdate Vlog');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-lg">Loading Vlog data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error: {error}</div>
          <button 
            onClick={() => router.push('/dashboard/Vlog')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kembali ke Daftar Vlog
          </button>
        </div>
      </div>
    );
  }

  if (!vlog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-4">Vlog tidak ditemukan</div>
          <button 
            onClick={() => router.push('/dashboard/Vlog')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kembali ke Daftar Vlog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <VlogInput 
          onSubmit={handleSubmit}
          loading={loading}
          initialData={vlog}
        />
      </div>
    </div>
  );
}