"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface TestimonialData {
  id?: number;
  name: string;
  location: string;
  comment: string;
  imageUrl: string;
  orderIndex: number;
  isActive: boolean;
}

export default function TestimonialForm() {
  const router = useRouter();
  const params = useParams();
  const isEditMode = !!params.id;
  
  const [formData, setFormData] = useState<TestimonialData>({
    name: "",
    location: "",
    comment: "",
    imageUrl: "/testimonials.jpg",
    orderIndex: 0,
    isActive: true
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      fetchTestimonial();
    } else {
      setLoading(false);
    }
  }, [isEditMode]);

  const fetchTestimonial = async () => {
    try {
      const res = await fetch(`/api/admin/testimonials`);
      if (!res.ok) throw new Error("Failed to fetch testimonial");
      const response = await res.json();
      
      const testimonial = response.data.find((t: TestimonialData) => t.id === parseInt(params.id as string));
      if (testimonial) {
        setFormData(testimonial);
        setImagePreview(testimonial.imageUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("comment", formData.comment);
      formDataToSend.append("orderIndex", formData.orderIndex.toString());
      formDataToSend.append("isActive", formData.isActive.toString());
      
      // Append image if selected
      const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (imageInput && imageInput.files && imageInput.files[0]) {
        formDataToSend.append("image", imageInput.files[0]);
      }

      const url = isEditMode 
        ? `/api/admin/testimonials` 
        : `/api/admin/testimonials`;
        
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || `Failed to ${isEditMode ? 'update' : 'create'} testimonial`);
      }

      alert(`✅ Testimonial ${isEditMode ? 'updated' : 'created'} successfully!`);
      router.push("/dashboard/testimonials");
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} testimonial`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? "Edit Testimonial" : "Create Testimonial"}
        </h2>
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Edit Testimonial" : "Create Testimonial"}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            rows={5}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Order Index */}
        <div>
          <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700 mb-1">
            Order Index
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

        {/* Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange as any}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/testimonials")}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : (isEditMode ? "Update Testimonial" : "Create Testimonial")}
          </button>
        </div>
      </form>
    </div>
  );
}