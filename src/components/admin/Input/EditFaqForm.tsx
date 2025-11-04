"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Faq {
  id: number;
  question: string;
  answer: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const EditFaqForm: React.FC<{ faq: Faq }> = ({ faq }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    question: faq.question,
    answer: faq.answer,
    orderIndex: faq.orderIndex,
    isActive: faq.isActive
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement;
    
    // Handle checkbox separately
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === "orderIndex" ? parseInt(value) || 0 : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update FAQ");

      const response = await res.json();
      alert("✅ FAQ updated successfully!");
      router.push("/dashboard/FAQ");
    } catch (error) {
      console.error("Error updating FAQ:", error);
      alert("❌ Failed to update FAQ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit FAQ</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question */}
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            Question
          </label>
          <input
            type="text"
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Answer */}
        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
            Answer
          </label>
          <textarea
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            onChange={handleChange}
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
            onClick={() => router.push("/dashboard/FAQ")}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update FAQ"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFaqForm;