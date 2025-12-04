"use client";

import EditFaqForm from '@/components/admin/Input/EditFaqForm';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Faq {
  id: number;
  question: string;
  answer: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const EditFaqPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [faq, setFaq] = useState<Faq | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await fetch(`/api/admin/faqs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch FAQ");
        const response = await res.json();
        setFaq(response.data);
      } catch (error) {
        console.error("Error fetching FAQ:", error);
        alert("Failed to load FAQ");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFaq();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit FAQ</h2>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit FAQ</h2>
        <div className="text-center py-8 text-gray-500">
          FAQ not found
        </div>
      </div>
    );
  }

  return (
    <div>
      <EditFaqForm faq={faq} />
    </div>
  );
};

export default EditFaqPage;