"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

interface ProdukForm {
  namaProduk: string;
  deskripsiProduk: string;
  hargaProduk: number;
  gambarProduk?: FileList;
  linkShopee?: string;
  linkTokopedia?: string;
}

interface UmkmForm {
  namaUmkm: string;
  alamatUmkm: string;
  deskripsiUmkm: string;
  linkGmaps?: string;
  nomorWhatsapp?: string;
  gambar?: FileList;
  produk: ProdukForm[];
}

interface UmkmInputProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
  initialData?: any;
}

export const UmkmInput: React.FC<UmkmInputProps> = ({ 
  onSubmit, 
  loading = false, 
  initialData 
}) => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<UmkmForm>({
    defaultValues: {
      namaUmkm: initialData?.namaUmkm || '',
      alamatUmkm: initialData?.alamatUmkm || '',
      deskripsiUmkm: initialData?.deskripsiUmkm || '',
      linkGmaps: initialData?.linkGmaps || '',
      nomorWhatsapp: initialData?.nomorWhatsapp || '',
      produk: initialData?.produk || []
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "produk"
  });

  const [imagePreview, setImagePreview] = useState<{[key: string]: string}>({});
  const [selectedFiles, setSelectedFiles] = useState<{[key: string]: File}>({});
  const [produkImages, setProdukImages] = useState<{[key: string]: {[field: string]: File}}>({});

  // Initialize existing image previews when component mounts
  React.useEffect(() => {
    if (initialData) {
      const existingPreviews: {[key: string]: string} = {};
      
      if (initialData.gambar) {
        // If it's already a full URL, use it directly, otherwise prepend /uploads/
        if (initialData.gambar.startsWith('http') || initialData.gambar.startsWith('/uploads/')) {
          existingPreviews['gambar'] = initialData.gambar;
        } else {
          existingPreviews['gambar'] = `/uploads/${initialData.gambar}`;
        }
      }
      
      // Handle produk images if produk exist
      if (initialData.produk && Array.isArray(initialData.produk)) {
        initialData.produk.forEach((produk: any, index: number) => {
          if (produk.gambarProduk) {
            const key = `produk-${index}-gambarProduk`;
            existingPreviews[key] = produk.gambarProduk.startsWith('http') || produk.gambarProduk.startsWith('/uploads/') 
              ? produk.gambarProduk 
              : `/uploads/${produk.gambarProduk}`;
          }
        });
      }
      
      setImagePreview(existingPreviews);
    }
  }, [initialData]);

  const handleImagePreview = (file: File, key: string) => {
    // Store the selected file
    setSelectedFiles(prev => ({
      ...prev,
      [key]: file
    }));
    
    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(prev => ({
        ...prev,
        [key]: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleProdukImagePreview = (file: File, produkIndex: number, field: string) => {
    const key = `produk-${produkIndex}-${field}`;
    
    // Store the selected file for produk
    setProdukImages(prev => ({
      ...prev,
      [produkIndex]: {
        ...prev[produkIndex],
        [field]: file
      }
    }));
    
    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(prev => ({
        ...prev,
        [key]: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
    
    console.log(`📱 Produk image selected for produk ${produkIndex} ${field}:`, file.name);
  };

  const addProduk = () => {
    append({
      namaProduk: '',
      deskripsiProduk: '',
      hargaProduk: 0
    });
  };

  const submitForm = async (data: UmkmForm) => {
    console.log('🚀 Starting form submission...');
    console.log('Form data received:', {
      namaUmkm: data.namaUmkm,
      alamatUmkm: data.alamatUmkm,
      deskripsiUmkm: data.deskripsiUmkm,
      produkCount: data.produk.length
    });
    
    const formData = new FormData();
    
    // Validate required fields
    if (!data.namaUmkm || !data.namaUmkm.trim()) {
      alert('Nama UMKM harus diisi');
      return;
    }
    
    if (!data.alamatUmkm || !data.alamatUmkm.trim()) {
      alert('Alamat UMKM harus diisi');
      return;
    }
    
    if (!data.deskripsiUmkm || !data.deskripsiUmkm.trim()) {
      alert('Deskripsi UMKM harus diisi');
      return;
    }
    
    // Validate WhatsApp number format
    if (data.nomorWhatsapp && data.nomorWhatsapp.trim()) {
      const cleanedNumber = data.nomorWhatsapp.trim().replace(/\D/g, '');
      if (!cleanedNumber.startsWith('62')) {
        alert('Nomor WhatsApp harus dimulai dengan 62 (contoh: 628123456789)');
        return;
      }
      if (cleanedNumber.length < 10 || cleanedNumber.length > 15) {
        alert('Nomor WhatsApp harus antara 10-15 digit');
        return;
      }
    }
    
    // Add UMKM data
    formData.append('namaUmkm', data.namaUmkm.trim());
    formData.append('alamatUmkm', data.alamatUmkm.trim());
    formData.append('deskripsiUmkm', data.deskripsiUmkm.trim());
    
    if (data.linkGmaps && data.linkGmaps.trim()) {
      formData.append('linkGmaps', data.linkGmaps.trim());
    }

    if (data.nomorWhatsapp && data.nomorWhatsapp.trim()) {
      const cleanedNumber = data.nomorWhatsapp.trim().replace(/\D/g, '');
      formData.append('nomorWhatsapp', cleanedNumber);
    }

    // Add UMKM image from selectedFiles state
    const file = selectedFiles['gambar'];
    if (file) {
      console.log(`📎 Adding gambar to FormData:`, file.name, file.size, 'bytes');
      formData.append('gambar', file);
    }

    // Add produk data
    const produkData = data.produk.map((produk, index) => {
      const produkImageFile = produkImages[index]?.gambarProduk;
      return {
        namaProduk: produk.namaProduk.trim(),
        deskripsiProduk: produk.deskripsiProduk.trim(),
        hargaProduk: Number(produk.hargaProduk),
        linkShopee: produk.linkShopee?.trim() || '',
        linkTokopedia: produk.linkTokopedia?.trim() || '',
        hasImage: !!produkImageFile
      };
    });

    formData.append('produk', JSON.stringify(produkData));
    console.log('📦 Produk data added to FormData:', produkData);

    // Add produk images
    Object.keys(produkImages).forEach(produkIndex => {
      const produkImageFiles = produkImages[produkIndex];
      Object.keys(produkImageFiles).forEach(field => {
        const file = produkImageFiles[field];
        if (file) {
          console.log(`📎 Adding produk image ${produkIndex}-${field} to FormData:`, file.name);
          formData.append(`produk-${produkIndex}-${field}`, file);
        }
      });
    });

    console.log('📤 Calling onSubmit with FormData...');
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {initialData ? 'Edit UMKM' : 'Tambah UMKM Baru'}
        </h1>
        <p className="text-gray-600">
          {initialData ? 'Edit informasi UMKM' : 'Masukkan informasi UMKM baru'}
        </p>
      </div>

      <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
        {/* Informasi Dasar UMKM */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Informasi Dasar UMKM</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama UMKM *
              </label>
              <input
                type="text"
                {...register('namaUmkm', { required: 'Nama UMKM harus diisi' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama UMKM"
              />
              {errors.namaUmkm && (
                <p className="text-red-500 text-sm mt-1">{errors.namaUmkm.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat UMKM *
              </label>
              <input
                type="text"
                {...register('alamatUmkm', { required: 'Alamat UMKM harus diisi' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan alamat UMKM"
              />
              {errors.alamatUmkm && (
                <p className="text-red-500 text-sm mt-1">{errors.alamatUmkm.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi UMKM *
            </label>
            <textarea
              {...register('deskripsiUmkm', { required: 'Deskripsi UMKM harus diisi' })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan deskripsi UMKM"
            />
            {errors.deskripsiUmkm && (
              <p className="text-red-500 text-sm mt-1">{errors.deskripsiUmkm.message}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Google Maps (Opsional)
            </label>
            <input
              type="url"
              {...register('linkGmaps')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor WhatsApp (Opsional)
            </label>
            <input
              type="tel"
              {...register('nomorWhatsapp', {
                pattern: {
                  value: /^62\d{8,13}$/,
                  message: 'Nomor WhatsApp harus dimulai dengan 62 dan berisi 10-15 digit (contoh: 628123456789)'
                },
                validate: (value) => {
                  if (!value || !value.trim()) return true;
                  const cleanedNumber = value.trim().replace(/\D/g, '');
                  if (!cleanedNumber.startsWith('62')) {
                    return 'Nomor WhatsApp harus dimulai dengan 62';
                  }
                  if (cleanedNumber.length < 10 || cleanedNumber.length > 15) {
                    return 'Nomor WhatsApp harus antara 10-15 digit';
                  }
                  return true;
                }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.nomorWhatsapp 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="628123456789"
            />
            {errors.nomorWhatsapp && (
              <p className="mt-1 text-sm text-red-600">
                {errors.nomorWhatsapp.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Format: 62 diikuti nomor HP tanpa 0 di depan (contoh: 628123456789)
            </p>
          </div>

          {/* Upload Gambar UMKM */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar UMKM
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                <Upload size={16} className="mr-2" />
                Upload Gambar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImagePreview(file, 'gambar');
                    }
                  }}
                />
              </label>
              {imagePreview['gambar'] && (
                <div className="relative">
                  <img
                    src={imagePreview['gambar']}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Daftar Produk */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Daftar Produk</h2>
            <button
              type="button"
              onClick={addProduk}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Plus size={16} className="mr-1" />
              Tambah Produk
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="bg-white p-4 rounded-lg border mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Produk {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="flex items-center px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  <Trash2 size={14} className="mr-1" />
                  Hapus
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    {...register(`produk.${index}.namaProduk`, { required: 'Nama produk harus diisi' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama produk"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Produk *
                  </label>
                  <input
                    type="number"
                    {...register(`produk.${index}.hargaProduk`, { 
                      required: 'Harga produk harus diisi',
                      min: { value: 0, message: 'Harga tidak boleh negatif' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Produk *
                </label>
                <textarea
                  {...register(`produk.${index}.deskripsiProduk`, { required: 'Deskripsi produk harus diisi' })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan deskripsi produk"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Shopee (Opsional)
                  </label>
                  <input
                    type="url"
                    {...register(`produk.${index}.linkShopee`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://shopee.co.id/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Tokopedia (Opsional)
                  </label>
                  <input
                    type="url"
                    {...register(`produk.${index}.linkTokopedia`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://tokopedia.com/..."
                  />
                </div>
              </div>

              {/* Upload Gambar Produk */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Produk
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                    <ImageIcon size={16} className="mr-2" />
                    Upload Gambar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleProdukImagePreview(file, index, 'gambarProduk');
                        }
                      }}
                    />
                  </label>
                  {imagePreview[`produk-${index}-gambarProduk`] && (
                    <div className="relative">
                      <img
                        src={imagePreview[`produk-${index}-gambarProduk`]}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada produk yang ditambahkan</p>
              <p className="text-sm">Klik "Tambah Produk" untuk menambah produk baru</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Menyimpan...' : (initialData ? 'Update UMKM' : 'Simpan UMKM')}
          </button>
        </div>
      </form>
    </div>
  );
};