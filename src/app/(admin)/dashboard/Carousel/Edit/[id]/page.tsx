"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CarouselEdit from '@/components/admin/Input/CarouselInput/CarouselEdit'

export default function EditCarouselPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  if (!resolvedParams) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Carousel Item</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <CarouselEdit id={parseInt(resolvedParams.id)} />
    </div>
  );
}