"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PilihKamiFeature {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PilihKamiFormData {
  title: string;
  description: string;
  orderIndex: number;
  isActive: boolean;
}

export default function PilihKamiEdit({ id }: { id: number }) {
  const router = useRouter();
  const [formData, setFormData] = useState<PilihKamiFormData>({
    title: "",
    description: "",
    orderIndex: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeature = async () => {
      try {
        const response = await fetch(`/api/pilih-kami/${id}`);
        const result = await response.json();

        if (result.success) {
          const feature = result.data;
          setFormData({
            title: feature.title,
            description: feature.description,
            orderIndex: feature.orderIndex,
            isActive: feature.isActive,
          });
        } else {
          setError("Gagal memuat data fitur");
        }
      } catch (err) {
        console.error("Error fetching feature:", err);
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFeature();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setFormData({
      ...formData,
      [name]: val,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/pilih-kami/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Fitur berhasil diupdate!");
        router.push("/dashboard/PilihKami");
      } else {
        setError(result.message || "Gagal mengupdate fitur");
      }
    } catch (err) {
      console.error("Error updating form:", err);
      setError("Terjadi kesalahan saat menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Fitur Pilih Kami</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Fitur Pilih Kami</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Judul *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan judul fitur"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan deskripsi fitur"
          />
        </div>

        <div>
          <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700 mb-1">
            Urutan
          </label>
          <input
            type="number"
            id="orderIndex"
            name="orderIndex"
            value={formData.orderIndex}
            onChange={handleChange}
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Aktif
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/PilihKami")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}