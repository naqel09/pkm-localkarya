"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

interface MenuForm {
  namaMenu: string;
  harga: number;
  fotoMakanan1?: FileList;
  fotoMakanan2?: FileList;
}

interface RestaurantForm {
  namaRestaurant: string;
  alamatRestaurant: string;
  deskripsiRestaurant: string;
  gambar1?: FileList;
  gambar2?: FileList;
  gambar3?: FileList;
  gambar4?: FileList;
  gambar5?: FileList;
  gambar6?: FileList;
  fotoMenu1?: FileList;
  fotoMenu2?: FileList;
  fotoMenu3?: FileList;
  menus: MenuForm[];
}

interface RestaurantInputProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
  initialData?: any;
}

export const RestaurantInput: React.FC<RestaurantInputProps> = ({ 
  onSubmit, 
  loading = false, 
  initialData 
}) => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<RestaurantForm>({
    defaultValues: {
      namaRestaurant: initialData?.namaRestaurant || '',
      alamatRestaurant: initialData?.alamatRestaurant || '',
      deskripsiRestaurant: initialData?.deskripsiRestaurant || '',
      menus: initialData?.menus || []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "menus"
  });

  const [imagePreview, setImagePreview] = useState<{[key: string]: string}>({});
  const [selectedFiles, setSelectedFiles] = useState<{[key: string]: File}>({});
  const [menuImages, setMenuImages] = useState<{[key: string]: {[field: string]: File}}>({});

  // Initialize existing image previews when component mounts
  React.useEffect(() => {
    if (initialData) {
      const existingPreviews: {[key: string]: string} = {};
      const imageFields = ['gambar1', 'gambar2', 'gambar3', 'gambar4', 'gambar5', 'gambar6', 'fotoMenu1', 'fotoMenu2', 'fotoMenu3'];
      
      imageFields.forEach(field => {
        if (initialData[field]) {
          // If it's already a full URL, use it directly, otherwise prepend /uploads/
          if (initialData[field].startsWith('http') || initialData[field].startsWith('/uploads/')) {
            existingPreviews[field] = initialData[field];
          } else {
            existingPreviews[field] = `/uploads/${initialData[field]}`;
          }
        }
      });
      
      // Handle menu images if menus exist
      if (initialData.menus && Array.isArray(initialData.menus)) {
        initialData.menus.forEach((menu: any, index: number) => {
          if (menu.fotoMakanan1) {
            const key = `menu-${index}-fotoMakanan1`;
            existingPreviews[key] = menu.fotoMakanan1.startsWith('http') || menu.fotoMakanan1.startsWith('/uploads/') 
              ? menu.fotoMakanan1 
              : `/uploads/${menu.fotoMakanan1}`;
          }
          if (menu.fotoMakanan2) {
            const key = `menu-${index}-fotoMakanan2`;
            existingPreviews[key] = menu.fotoMakanan2.startsWith('http') || menu.fotoMakanan2.startsWith('/uploads/') 
              ? menu.fotoMakanan2 
              : `/uploads/${menu.fotoMakanan2}`;
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

  const handleMenuImagePreview = (file: File, menuIndex: number, field: string) => {
    const key = `menu-${menuIndex}-${field}`;
    
    // Store the selected file for menu
    setMenuImages(prev => ({
      ...prev,
      [menuIndex]: {
        ...prev[menuIndex],
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
    
    console.log(`📱 Menu image selected for menu ${menuIndex} ${field}:`, file.name);
  };

  const addMenu = () => {
    append({
      namaMenu: '',
      harga: 0
    });
  };

  const submitForm = async (data: RestaurantForm) => {
    const formData = new FormData();
    
    // Add restaurant data
    formData.append('namaRestaurant', data.namaRestaurant);
    formData.append('alamatRestaurant', data.alamatRestaurant);
    formData.append('deskripsiRestaurant', data.deskripsiRestaurant);

    // Add restaurant images from selectedFiles state
    const imageFields = ['gambar1', 'gambar2', 'gambar3', 'gambar4', 'gambar5', 'gambar6'];
    imageFields.forEach(field => {
      const file = selectedFiles[field];
      if (file) {
        console.log(`📎 Adding ${field} to FormData:`, file.name, file.size, 'bytes');
        formData.append(field, file);
      }
    });

    // Add menu photos from selectedFiles state
    const menuPhotoFields = ['fotoMenu1', 'fotoMenu2', 'fotoMenu3'];
    menuPhotoFields.forEach(field => {
      const file = selectedFiles[field];
      if (file) {
        console.log(`📎 Adding ${field} to FormData:`, file.name, file.size, 'bytes');
        formData.append(field, file);
      }
    });

    // Add menu item images
    Object.keys(menuImages).forEach(menuIndex => {
      const menuImageFiles = menuImages[menuIndex];
      Object.keys(menuImageFiles).forEach(field => {
        const file = menuImageFiles[field];
        if (file) {
          const fieldName = `menu-${menuIndex}-${field}`;
          console.log(`🍴 Adding ${fieldName} to FormData:`, file.name, file.size, 'bytes');
          formData.append(fieldName, file);
        }
      });
    });

    // Add menus data - filter out empty menu items
    const validMenus = data.menus.filter(menu => 
      menu.namaMenu && menu.namaMenu.trim() !== '' && 
      menu.harga && !isNaN(Number(menu.harga)) && Number(menu.harga) > 0
    );
    console.log('🍽️ Valid menus to submit:', validMenus.length, 'out of', data.menus.length);
    formData.append('menus', JSON.stringify(validMenus));
    
    console.log('📤 Submitting FormData with files:', Object.keys(selectedFiles));
    onSubmit(formData);
  };

  const ImageUploadField = ({ name, label, required = false }: { name: string; label: string; required?: boolean }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id={name}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              console.log(`📎 File selected for ${name}:`, e.target.files[0].name);
              handleImagePreview(e.target.files[0], name);
            }
          }}
        />
        <label htmlFor={name} className="cursor-pointer">
          <div className="text-center">
            {imagePreview[name] ? (
              <img 
                src={imagePreview[name]} 
                alt="Preview" 
                className="mx-auto h-20 w-20 object-cover rounded-lg mb-2"
              />
            ) : (
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            )}
            <p className="text-sm text-gray-600">Klik untuk upload gambar</p>
            {selectedFiles[name] && (
              <p className="text-xs text-green-600 mt-1">
                ✅ {selectedFiles[name].name}
              </p>
            )}
          </div>
        </label>
      </div>
    </div>
  );

  const MenuImageUploadField = ({ menuIndex, field, label }: { menuIndex: number; field: string; label: string }) => {
    const inputId = `menu-${menuIndex}-${field}`;
    const previewKey = `menu-${menuIndex}-${field}`;
    const selectedFile = menuImages[menuIndex]?.[field];
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id={inputId}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleMenuImagePreview(e.target.files[0], menuIndex, field);
              }
            }}
          />
          <label htmlFor={inputId} className="cursor-pointer">
            <div className="text-center">
              {imagePreview[previewKey] ? (
                <img 
                  src={imagePreview[previewKey]} 
                  alt="Preview" 
                  className="mx-auto h-16 w-16 object-cover rounded-lg mb-2"
                />
              ) : (
                <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              )}
              <p className="text-xs text-gray-600">Klik untuk upload</p>
              {selectedFile && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ {selectedFile.name}
                </p>
              )}
            </div>
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {initialData ? 'Edit Restaurant' : 'Tambah Restaurant Baru'}
      </h2>

      <form onSubmit={handleSubmit(submitForm)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Informasi Dasar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Restaurant <span className="text-red-500">*</span>
              </label>
              <input
                {...register('namaRestaurant', { required: 'Nama restaurant harus diisi' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama restaurant"
              />
              {errors.namaRestaurant && (
                <p className="text-red-500 text-sm mt-1">{errors.namaRestaurant.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Restaurant <span className="text-red-500">*</span>
              </label>
              <input
                {...register('alamatRestaurant', { required: 'Alamat restaurant harus diisi' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan alamat restaurant"
              />
              {errors.alamatRestaurant && (
                <p className="text-red-500 text-sm mt-1">{errors.alamatRestaurant.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Restaurant <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('deskripsiRestaurant', { required: 'Deskripsi restaurant harus diisi' })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan deskripsi restaurant"
              />
              {errors.deskripsiRestaurant && (
                <p className="text-red-500 text-sm mt-1">{errors.deskripsiRestaurant.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Restaurant Images */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Gambar Restaurant (Maksimal 6)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ImageUploadField name="gambar1" label="Gambar 1" />
            <ImageUploadField name="gambar2" label="Gambar 2" />
            <ImageUploadField name="gambar3" label="Gambar 3" />
            <ImageUploadField name="gambar4" label="Gambar 4" />
            <ImageUploadField name="gambar5" label="Gambar 5" />
            <ImageUploadField name="gambar6" label="Gambar 6" />
          </div>
        </div>

        {/* Menu Photos */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Foto Menu (Maksimal 3)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ImageUploadField name="fotoMenu1" label="Foto Menu 1" />
            <ImageUploadField name="fotoMenu2" label="Foto Menu 2" />
            <ImageUploadField name="fotoMenu3" label="Foto Menu 3" />
          </div>
        </div>

        {/* Menus */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Daftar Menu</h3>
            <button
              type="button"
              onClick={addMenu}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Plus size={16} className="mr-1" />
              Tambah Menu
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-300 p-4 rounded-md mb-4 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-semibold">Menu #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Trash2 size={14} className="mr-1" />
                  Hapus
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Menu <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`menus.${index}.namaMenu`, { 
                      required: 'Nama menu harus diisi',
                      validate: value => value.trim() !== '' || 'Nama menu tidak boleh kosong'
                    })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama menu"
                  />
                  {errors.menus?.[index]?.namaMenu && (
                    <p className="text-red-500 text-sm mt-1">{errors.menus[index]?.namaMenu?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`menus.${index}.harga`, { 
                      required: 'Harga harus diisi',
                      min: { value: 1, message: 'Harga harus lebih besar dari 0' },
                      validate: value => !isNaN(Number(value)) || 'Harga harus berupa angka'
                    })}
                    type="number"
                    min="1"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan harga"
                  />
                  {errors.menus?.[index]?.harga && (
                    <p className="text-red-500 text-sm mt-1">{errors.menus[index]?.harga?.message}</p>
                  )}
                </div>

                <MenuImageUploadField 
                  menuIndex={index} 
                  field="fotoMakanan1" 
                  label="Foto Makanan 1" 
                />

                <MenuImageUploadField 
                  menuIndex={index} 
                  field="fotoMakanan2" 
                  label="Foto Makanan 2" 
                />
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <p className="text-gray-500 text-center py-8">Belum ada menu. Klik "Tambah Menu" untuk menambahkan menu pertama.</p>
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
            {loading ? 'Menyimpan...' : (initialData ? 'Update Restaurant' : 'Simpan Restaurant')}
          </button>
        </div>
      </form>
    </div>
  );
};