"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Faq {
  id: number;
  question: string;
  answer: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const FaqTable: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch("/api/admin/faqs");
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        const response = await res.json();
        setFaqs(response.data || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        alert("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete FAQ");

      setFaqs(faqs.filter(faq => faq.id !== id));
      alert("FAQ deleted successfully!");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      alert("Failed to delete FAQ");
    }
  };

  // Filter data based on search
  const filtered = faqs.filter(faq =>
    faq.question?.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage FAQs</h2>
        <Link
          href="/dashboard/FAQ/InputFaq"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={20} />
          Add New FAQ
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search questions or answers..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg">Loading FAQs...</p>
          </div>
        ) : (
          <table className="w-full text-left border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Question</th>
                <th className="p-3">Answer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Order</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((faq) => (
                  <tr key={faq.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium max-w-xs">{faq.question}</td>
                    <td className="p-3 text-left max-w-md">
                      {faq.answer.length > 100 
                        ? faq.answer.substring(0, 100) + "..." 
                        : faq.answer}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        faq.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {faq.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">{faq.orderIndex}</td>
                    <td className="p-3">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          href={`/dashboard/FAQ/Edit/${faq.id}`}
                          className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 text-sm rounded-md"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    {search ? "No FAQs match your search" : "No FAQs available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FaqTable;