"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface QualitySectionData {
  id: number;
  title: string;
  description: string;
  backgroundImageUrl: string | null;
  tag1Quantity: string;
  tag1Description: string;
  tag2Quantity: string;
  tag2Description: string;
  tag3Quantity: string;
  tag3Description: string;
  tag4Quantity: string;
  tag4Description: string;
}

const QualitySectionForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<QualitySectionData>({
    id: 0,
    title: "",
    description: "",
    backgroundImageUrl: null,
    tag1Quantity: "",
    tag1Description: "",
    tag2Quantity: "",
    tag2Description: "",
    tag3Quantity: "",
    tag3Description: "",
    tag4Quantity: "",
    tag4Description: ""
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchQualitySection = async () => {
      try {
        const res = await fetch("/api/quality-section");
        if (!res.ok) throw new Error("Failed to fetch quality section data");
        const response = await res.json();
        setData(response.data);
        if (response.data.backgroundImageUrl) {
          setImagePreview(response.data.backgroundImageUrl);
        }
      } catch (error) {
        console.error("Error fetching quality section:", error);
        alert("Failed to load quality section data");
      } finally {
        setLoading(false);
      }
    };

    fetchQualitySection();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
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
      formData.append("tag1Quantity", data.tag1Quantity);
      formData.append("tag1Description", data.tag1Description);
      formData.append("tag2Quantity", data.tag2Quantity);
      formData.append("tag2Description", data.tag2Description);
      formData.append("tag3Quantity", data.tag3Quantity);
      formData.append("tag3Description", data.tag3Description);
      formData.append("tag4Quantity", data.tag4Quantity);
      formData.append("tag4Description", data.tag4Description);
      
      // Append image if selected
      const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (imageInput && imageInput.files && imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
      }

      const res = await fetch("/api/quality-section", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update quality section");

      const response = await res.json();
      alert("✅ Quality section updated successfully!");
      
      // Update the data with the response
      setData(response.data);
      if (response.data.backgroundImageUrl) {
        setImagePreview(response.data.backgroundImageUrl);
      }
    } catch (error) {
      console.error("Error updating quality section:", error);
      alert("❌ Failed to update quality section");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Loading Quality Section...</h2>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Quality Section</h2>
      
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
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tag 1 */}
          <div className="border p-4 rounded">
            <h3 className="font-medium text-gray-800 mb-3">Tag 1</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="tag1Quantity" className="block text-sm text-gray-600 mb-1">
                  Quantity
                </label>
                <input
                  type="text"
                  id="tag1Quantity"
                  name="tag1Quantity"
                  value={data.tag1Quantity}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="tag1Description" className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="tag1Description"
                  name="tag1Description"
                  value={data.tag1Description}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tag 2 */}
          <div className="border p-4 rounded">
            <h3 className="font-medium text-gray-800 mb-3">Tag 2</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="tag2Quantity" className="block text-sm text-gray-600 mb-1">
                  Quantity
                </label>
                <input
                  type="text"
                  id="tag2Quantity"
                  name="tag2Quantity"
                  value={data.tag2Quantity}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="tag2Description" className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="tag2Description"
                  name="tag2Description"
                  value={data.tag2Description}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tag 3 */}
          <div className="border p-4 rounded">
            <h3 className="font-medium text-gray-800 mb-3">Tag 3</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="tag3Quantity" className="block text-sm text-gray-600 mb-1">
                  Quantity
                </label>
                <input
                  type="text"
                  id="tag3Quantity"
                  name="tag3Quantity"
                  value={data.tag3Quantity}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="tag3Description" className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="tag3Description"
                  name="tag3Description"
                  value={data.tag3Description}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tag 4 */}
          <div className="border p-4 rounded">
            <h3 className="font-medium text-gray-800 mb-3">Tag 4</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="tag4Quantity" className="block text-sm text-gray-600 mb-1">
                  Quantity
                </label>
                <input
                  type="text"
                  id="tag4Quantity"
                  name="tag4Quantity"
                  value={data.tag4Quantity}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="tag4Description" className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="tag4Description"
                  name="tag4Description"
                  value={data.tag4Description}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
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

export default QualitySectionForm;