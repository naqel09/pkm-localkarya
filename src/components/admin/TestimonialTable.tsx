"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  comment: string;
  imageUrl: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TestimonialTable() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/testimonials");
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      const response = await res.json();
      setTestimonials(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete testimonial");
      
      // Refresh the list
      fetchTestimonials();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete testimonial");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Testimonials</h2>
          <button
            onClick={() => router.push("/admin/testimonials/create")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Testimonials</h2>
          <button
            onClick={() => router.push("/admin/testimonials/create")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
          </button>
        </div>
        <div className="text-red-500 p-4 text-center">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Testimonials</h2>
        <button
          onClick={() => router.push("/dashboard/testimonials/create")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No testimonials found</p>
          <button
            onClick={() => router.push("/dashboard/testimonials/create")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Create your first testimonial
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.imageUrl} 
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/testimonials.jpg';
                  }}
                />
                <div>
                  <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!testimonial.isActive && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
                <button
                  onClick={() => router.push(`/dashboard/testimonials/edit/${testimonial.id}`)}
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-md"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}