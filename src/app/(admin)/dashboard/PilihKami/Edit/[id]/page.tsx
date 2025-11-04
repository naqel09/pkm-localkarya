"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PilihKamiEdit from '@/components/admin/Input/PilihKamiInput/PilihKamiEdit'

export default function EditPilihKamiPage({ params }: { params: Promise<{ id: string }> }) {
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Fitur Pilih Kami</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <PilihKamiEdit id={parseInt(resolvedParams.id)} />
    </div>
  );
}