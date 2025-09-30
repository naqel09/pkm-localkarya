"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UmkmInput } from '@/components/admin/Input/UmkmInput/UmkmInput';

export default function EditUmkmPage() {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [umkm, setUmkm] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      fetchUmkm();
    }
  }, [id]);

  const fetchUmkm = async () => {
    setFetchLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/umkm/${id}`);
      const result = await response.json();

      if (result.success) {
        setUmkm(result.data);
      } else {
        setError(result.message || 'UMKM tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching UMKM:', error);
      setError('Terjadi kesalahan saat mengambil data UMKM');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/umkm/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert('UMKM berhasil diupdate!');
        router.push('/dashboard/UMKM');
      } else {
        alert(`Error: ${result.message}`);
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (error) {
      console.error('Error updating UMKM:', error);
      alert('Terjadi kesalahan saat mengupdate UMKM');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-lg">Loading UMKM data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error: {error}</div>
          <button 
            onClick={() => router.push('/dashboard/UMKM')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kembali ke Daftar UMKM
          </button>
        </div>
      </div>
    );
  }

  if (!umkm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-4">UMKM tidak ditemukan</div>
          <button 
            onClick={() => router.push('/dashboard/UMKM')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kembali ke Daftar UMKM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <UmkmInput 
          onSubmit={handleSubmit}
          loading={loading}
          initialData={umkm}
        />
      </div>
    </div>
  );
}