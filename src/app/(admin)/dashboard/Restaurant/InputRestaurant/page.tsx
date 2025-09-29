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
      console.log('📤 Submitting restaurant data...');
      
      // Log form data contents for debugging
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      const response = await fetch('/api/restaurant', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('🔄 API Response:', result);

      if (result.success) {
        alert('Restaurant berhasil ditambahkan!');
        router.push('/dashboard/Restaurant');
      } else {
        console.error('❌ API Error:', result);
        alert(`Error: ${result.message || 'Gagal menyimpan restaurant'}`);
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      alert('Terjadi kesalahan saat menyimpan restaurant. Silakan coba lagi.');
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