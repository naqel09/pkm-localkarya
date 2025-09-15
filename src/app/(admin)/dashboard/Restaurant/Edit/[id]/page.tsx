"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RestaurantInput } from '@/components/admin/Input/RestaurantInput/RestaurantInput';

export default function EditRestaurantPage() {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      fetchRestaurant();
    }
  }, [id]);

  const fetchRestaurant = async () => {
    setFetchLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/restaurant/${id}`);
      const result = await response.json();

      if (result.success) {
        setRestaurant(result.data);
      } else {
        setError(result.message || 'Restaurant tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setError('Terjadi kesalahan saat mengambil data restaurant');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/restaurant/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert('Restaurant berhasil diupdate!');
        router.push('/dashboard/Restaurant');
      } else {
        alert(`Error: ${result.message}`);
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      alert('Terjadi kesalahan saat mengupdate restaurant');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-lg">Loading restaurant data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error: {error}</div>
          <button 
            onClick={() => router.push('/dashboard/Restaurant')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kembali ke Daftar Restaurant
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-4">Restaurant tidak ditemukan</div>
          <button 
            onClick={() => router.push('/dashboard/Restaurant')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kembali ke Daftar Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <RestaurantInput 
          onSubmit={handleSubmit}
          loading={loading}
          initialData={restaurant}
        />
      </div>
    </div>
  );
}
