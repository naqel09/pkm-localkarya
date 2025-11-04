'use client';

import SpecialPackageForm from '@/components/admin/SpecialPackageForm';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const EditSpecialPackagePage = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/special-packages/${id}`);
        if (!res.ok) throw new Error('Failed to fetch package');
        const response = await res.json();
        setInitialData(response.data);
      } catch (error) {
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackage();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SpecialPackageForm initialData={initialData} />
    </div>
  );
};

export default EditSpecialPackagePage;