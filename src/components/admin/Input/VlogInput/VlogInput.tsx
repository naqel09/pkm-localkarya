"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Youtube, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface VlogForm {
  judulVideo: string;
  deskripsiVideo: string;
  linkYoutube: string;
}

interface VlogInputProps {
  onSubmit: (data: VlogForm) => void;
  loading?: boolean;
  initialData?: VlogForm;
}

export const VlogInput: React.FC<VlogInputProps> = ({ 
  onSubmit, 
  loading = false, 
  initialData 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<VlogForm>({
    defaultValues: {
      judulVideo: initialData?.judulVideo || '',
      deskripsiVideo: initialData?.deskripsiVideo || '',
      linkYoutube: initialData?.linkYoutube || ''
    }
  });

  const validateYouTubeUrl = (url: string) => {
    if (!url) return true;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url) || 'Format link YouTube tidak valid';
  };

  const submitForm = (data: VlogForm) => {
    // Validate required fields
    if (!data.judulVideo.trim()) {
      alert('Judul video harus diisi');
      return;
    }
    
    if (!data.deskripsiVideo.trim()) {
      alert('Deskripsi video harus diisi');
      return;
    }
    
    if (!data.linkYoutube.trim()) {
      alert('Link YouTube harus diisi');
      return;
    }

    // Submit the form data
    onSubmit({
      judulVideo: data.judulVideo.trim(),
      deskripsiVideo: data.deskripsiVideo.trim(),
      linkYoutube: data.linkYoutube.trim()
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Youtube className="h-6 w-6 text-red-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Edit Vlog' : 'Tambah Vlog Baru'}
          </h1>
        </div>
        <Link
          href="/dashboard/Vlog"
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
        {/* Judul Video */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul Video <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('judulVideo', {
              required: 'Judul video harus diisi',
              minLength: {
                value: 3,
                message: 'Judul video minimal 3 karakter'
              },
              maxLength: {
                value: 200,
                message: 'Judul video maksimal 200 karakter'
              }
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.judulVideo 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Masukkan judul video..."
          />
          {errors.judulVideo && (
            <p className="mt-1 text-sm text-red-600">{errors.judulVideo.message}</p>
          )}
        </div>

        {/* Link YouTube */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link YouTube <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            {...register('linkYoutube', {
              required: 'Link YouTube harus diisi',
              validate: validateYouTubeUrl
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.linkYoutube 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {errors.linkYoutube && (
            <p className="mt-1 text-sm text-red-600">{errors.linkYoutube.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Masukkan URL YouTube yang valid (youtube.com atau youtu.be)
          </p>
        </div>

        {/* Deskripsi Video */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi Video <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('deskripsiVideo', {
              required: 'Deskripsi video harus diisi',
              minLength: {
                value: 10,
                message: 'Deskripsi video minimal 10 karakter'
              },
              maxLength: {
                value: 1000,
                message: 'Deskripsi video maksimal 1000 karakter'
              }
            })}
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none ${
              errors.deskripsiVideo 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Tulis deskripsi video di sini..."
          />
          {errors.deskripsiVideo && (
            <p className="mt-1 text-sm text-red-600">{errors.deskripsiVideo.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4">
          <Link
            href="/dashboard/Vlog"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white rounded-md transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Menyimpan...' : (initialData ? 'Update Vlog' : 'Simpan Vlog')}
          </button>
        </div>
      </form>
    </div>
  );
};