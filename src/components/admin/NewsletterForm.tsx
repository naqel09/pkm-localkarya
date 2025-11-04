"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface NewsletterData {
  id: number;
  title: string;
  backgroundImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const NewsletterForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<NewsletterData>({
    id: 0,
    title: "",
    backgroundImageUrl: null,
    isActive: true,
    createdAt: "",
    updatedAt: ""
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const res = await fetch("/api/admin/newsletter");
        if (!res.ok) throw new Error("Failed to fetch newsletter data");
        const response = await res.json();
        setData(response.data);
        if (response.data.backgroundImageUrl) {
          setImagePreview(response.data.backgroundImageUrl);
        }
      } catch (error) {
        console.error("Error fetching newsletter:", error);
        alert("Failed to load newsletter data");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox separately
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setData(prev => ({
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

    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append("title", data.title);
      
      // Append image if selected
      const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (imageInput && imageInput.files && imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
      }

      const res = await fetch("/api/admin/newsletter", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update newsletter");

      const response = await res.json();
      alert("✅ Newsletter updated successfully!");
      
      // Update the data with the response
      setData(response.data);
      if (response.data.backgroundImageUrl) {
        setImagePreview(response.data.backgroundImageUrl);
      }
    } catch (error) {
      console.error("Error updating newsletter:", error);
      alert("❌ Failed to update newsletter");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Loading Newsletter...</h2>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Newsletter Section</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Background Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background Image
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
                className="w-64 h-48 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={data.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={data.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsletterForm;