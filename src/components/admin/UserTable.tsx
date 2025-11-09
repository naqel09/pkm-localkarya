"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

// Type definition for User
interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export default function UserTable() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for confirmation popup
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/users`, {
          method: "GET"
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const response = await res.json();
        setUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) => 
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const lastItem = currentPage * itemsPerPage;
  const firstItem = lastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(firstItem, lastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id: number, username: string) => {
    // Prevent deletion of admin user
    if (username === "admin") {
      alert("Cannot delete the main admin user");
      return;
    }
    
    setSelectedId(id);
    setSelectedUsername(username);
    setShowConfirm(true);
  };

  // Handle actual deletion
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE"
      });

      const response = await res.json();

      if (res.ok && response.success) {
        // Remove user from state
        setUsers(users.filter(user => user.id !== id));
        alert("User deleted successfully");
      } else {
        alert(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
      setSelectedUsername("");
    }
  };

  // Handle confirmation response
  const handleConfirmResponse = (answer: boolean) => {
    if (answer && selectedId) {
      handleDelete(selectedId);
    } else {
      setShowConfirm(false);
      setSelectedId(null);
      setSelectedUsername("");
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <p className="text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <p className="text-lg text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        <Link
          href="/dashboard/Users/InputUser"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={20} />
          Add User
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by username or role..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {currentItems.length > 0 ? (
          <table className="w-full text-left border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Username</th>
                <th className="p-3">Role</th>
                <th className="p-3">Created At</th>
                <th className="p-3">Updated At</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3 font-medium">
                    {user.username} 
                    {user.username === "admin" && (
                      <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Main Admin
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-3 text-sm">
                    {new Date(user.updated_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center items-center gap-2">
                      <Link
                        href={`/dashboard/Users/Edit/${user.id}`}
                        className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-sm rounded-md"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteConfirm(user.id, user.username)}
                        className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md ${
                          user.username === "admin" 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "text-white bg-red-600 hover:bg-red-700"
                        }`}
                        disabled={user.username === "admin"}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {firstItem + 1} to {Math.min(lastItem, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1 
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages 
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete user <strong>{selectedUsername}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleConfirmResponse(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmResponse(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}