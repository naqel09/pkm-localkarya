'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UmkmInput } from '@/components/admin/Input/UmkmInput/UmkmInput';

export default function InputUmkmPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    
    try {
      console.log('📤 Submitting UMKM data...');
      
      // Log form data contents for debugging
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      const response = await fetch('/api/umkm', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('🔄 API Response:', result);

      if (result.success) {
        alert('UMKM berhasil ditambahkan!');
        router.push('/dashboard/UMKM');
      } else {
        console.error('❌ API Error:', result);
        alert(`Error: ${result.message || 'Gagal menyimpan UMKM'}`);
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      alert('Terjadi kesalahan saat menyimpan UMKM. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <UmkmInput 
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}