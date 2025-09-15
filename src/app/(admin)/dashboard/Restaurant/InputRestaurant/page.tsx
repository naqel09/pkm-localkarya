'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RestaurantInput } from '@/components/admin/Input/RestaurantInput/RestaurantInput';

export default function InputRestaurantPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/restaurant', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert('Restaurant berhasil ditambahkan!');
        router.push('/dashboard/Restaurant');
      } else {
        alert(`Error: ${result.message}`);
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (error) {
      console.error('Error submitting restaurant:', error);
      alert('Terjadi kesalahan saat menyimpan restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <RestaurantInput 
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}