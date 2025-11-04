"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AboutPageData {
  id: number;
  title: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  googleMapsUrl: string;
  backgroundImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
}

const AboutPageForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<AboutPageData>({
    id: 0,
    title: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    whatsappNumber: "",
    googleMapsUrl: "",
    backgroundImageUrl: null,
    isActive: true,
    createdAt: "",
    updatedAt: "",
    instagramUrl: null,
    facebookUrl: null,
    tiktokUrl: null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        const res = await fetch("/api/admin/about-page");
        if (!res.ok) throw new Error("Failed to fetch about page data");
        const response = await res.json();
        setData(response.data);
        if (response.data.backgroundImageUrl) {
          setImagePreview(response.data.backgroundImageUrl);
        }
      } catch (error) {
        console.error("Error fetching about page:", error);
        alert("Failed to load about page data");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      formData.append("description", data.description);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("whatsappNumber", data.whatsappNumber);
      formData.append("googleMapsUrl", data.googleMapsUrl);
      
      // Append social media fields if they exist
      if (data.instagramUrl) formData.append("instagramUrl", data.instagramUrl);
      if (data.facebookUrl) formData.append("facebookUrl", data.facebookUrl);
      if (data.tiktokUrl) formData.append("tiktokUrl", data.tiktokUrl);
      
      // Append image if selected
      const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (imageInput && imageInput.files && imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
      }

      const res = await fetch("/api/admin/about-page", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update about page");

      const response = await res.json();
      alert("✅ About page updated successfully!");
      
      // Update the data with the response
      setData(response.data);
      if (response.data.backgroundImageUrl) {
        setImagePreview(response.data.backgroundImageUrl);
      }
    } catch (error) {
      console.error("Error updating about page:", error);
      alert("❌ Failed to update about page");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Loading About Page...</h2>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit About Page</h2>
      
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
            Page Title
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

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact Information Section */}
        <div className="border p-4 rounded">
          <h3 className="font-medium text-gray-800 mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={data.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Google Maps URL */}
            <div>
              <label htmlFor="googleMapsUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps Link (goo.gl format)
              </label>
              <input
                type="text"
                id="googleMapsUrl"
                name="googleMapsUrl"
                value={data.googleMapsUrl}
                onChange={handleChange}
                required
                placeholder="https://maps.app.goo.gl/..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the goo.gl link for Google Maps (will be used for both embed and preview)
              </p>
            </div>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* WhatsApp Number */}
            <div>
              <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number (without +)
              </label>
              <input
                type="text"
                id="whatsappNumber"
                name="whatsappNumber"
                value={data.whatsappNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Social Media Links */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h4 className="font-medium text-gray-700 mb-3">Social Media Links (Optional)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Instagram */}
                <div>
                  <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    id="instagramUrl"
                    name="instagramUrl"
                    value={data.instagramUrl || ""}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Facebook */}
                <div>
                  <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    id="facebookUrl"
                    name="facebookUrl"
                    value={data.facebookUrl || ""}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* TikTok */}
                <div>
                  <label htmlFor="tiktokUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    TikTok URL
                  </label>
                  <input
                    type="text"
                    id="tiktokUrl"
                    name="tiktokUrl"
                    value={data.tiktokUrl || ""}
                    onChange={handleChange}
                    placeholder="https://tiktok.com/..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={data.isActive}
            onChange={handleChange as any}
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

export default AboutPageForm;