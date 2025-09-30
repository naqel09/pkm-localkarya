'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VlogInput } from '@/components/admin/Input/VlogInput/VlogInput';

interface VlogFormData {
  judulVideo: string;
  deskripsiVideo: string;
  linkYoutube: string;
}

export default function InputVlogPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: VlogFormData) => {
    setLoading(true);
    
    try {
      console.log('📤 Submitting Vlog data...');
      console.log('FormData contents:', formData);
      
      const response = await fetch('/api/vlog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('🔄 API Response:', result);

      if (result.status === 201) {
        alert('Vlog berhasil ditambahkan!');
        router.push('/dashboard/Vlog');
      } else {
        console.error('❌ API Error:', result);
        alert(`Error: ${result.message || 'Gagal menyimpan Vlog'}`);
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      alert('Terjadi kesalahan saat menyimpan Vlog. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <VlogInput 
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}