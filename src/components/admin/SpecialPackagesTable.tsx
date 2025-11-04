"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

// Type definition for Special Package
interface SpecialPackage {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SpecialPackagesTable() {
  const [search, setSearch] = useState("");
  const [packages, setPackages] = useState<SpecialPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // State for confirmation popup
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch data from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`/api/special-packages`, {
          method: "GET"
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const response = await res.json();
        setPackages(response.data || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Filter data based on search
  const filtered = Array.isArray(packages) ? packages.filter(pkg =>
    pkg.title?.toLowerCase().includes(search.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/special-packages/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setPackages(packages.filter(pkg => pkg.id !== id));
        alert("✅ Special package deleted successfully!");
      } else {
        alert("❌ Failed to delete special package");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("❌ An error occurred while deleting");
    }
    setShowConfirm(false);
    setSelectedId(null);
  };

  const handleDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleConfirmResponse = (answer: boolean) => {
    if (answer && selectedId) {
      handleDelete(selectedId);
    } else {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Special Packages Management</h2>
        <Link
          href="/dashboard/special-packages/input"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={20} />
          Add Package
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search title or description..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg">Loading special packages...</p>
          </div>
        ) : (
          <table className="w-full text-left border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3">Image</th>
                <th className="p-3">Status</th>
                <th className="p-3">Order</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((pkg) => (
                  <tr key={pkg.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{pkg.title}</td>
                    <td className="p-3 text-left max-w-xs">
                      {pkg.description.length > 50 
                        ? pkg.description.substring(0, 50) + "..." 
                        : pkg.description}
                    </td>
                    <td className="p-3">
                      {pkg.imageUrl ? (
                        <img 
                          src={pkg.imageUrl.startsWith('http') || pkg.imageUrl.startsWith('/') ? pkg.imageUrl : `/uploads/${pkg.imageUrl}`} 
                          alt={pkg.title} 
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-500">No image</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        pkg.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {pkg.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">{pkg.orderIndex}</td>
                    <td className="p-3">
                      {new Date(pkg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          href={`/dashboard/special-packages/edit/${pkg.id}`}
                          className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteConfirm(pkg.id)}
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
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    {search ? "No data matches your search" : "No special packages available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && filtered.length > itemsPerPage && (
        <div className="mt-6">
          {/* Pagination component would go here if needed */}
        </div>
      )}

      {/* Delete confirmation popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center">
            <p className="text-lg font-medium mb-4">
              Are you sure you want to delete this special package?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Deleted data cannot be recovered.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleConfirmResponse(true)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => handleConfirmResponse(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}