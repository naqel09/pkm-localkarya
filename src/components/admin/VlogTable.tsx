"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Youtube, ExternalLink } from 'lucide-react';

interface Vlog {
  id: number;
  judulVideo: string;
  deskripsiVideo: string;
  linkYoutube: string;
  createdAt: string;
  updatedAt: string;
}

const VlogTable: React.FC = () => {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVlogs();
  }, []);

  const fetchVlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vlog');
      const result = await response.json();
      
      if (result.status === 200) {
        setVlogs(result.data);
      } else {
        setError('Gagal mengambil data vlog');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('Error fetching vlogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, judulVideo: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus vlog "${judulVideo}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/vlog/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.status === 200) {
        alert('Vlog berhasil dihapus!');
        fetchVlogs(); // Refresh the list
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting vlog:', error);
      alert('Terjadi kesalahan saat menghapus vlog');
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchVlogs}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Youtube className="h-6 w-6 text-red-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Vlog</h1>
        </div>
        <Link
          href="/dashboard/Vlog/InputVlog"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Vlog
        </Link>
      </div>

      {/* Content */}
      <div className="p-6">
        {vlogs.length === 0 ? (
          <div className="text-center py-12">
            <Youtube className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Vlog</h3>
            <p className="text-gray-500 mb-4">Mulai tambahkan vlog pertama Anda</p>
            <Link
              href="/dashboard/Vlog/InputVlog"
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Vlog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Video
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul & Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vlogs.map((vlog) => (
                  <tr key={vlog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-20 w-32">
                          {getYouTubeThumbnail(vlog.linkYoutube) ? (
                            <img
                              className="h-20 w-32 rounded object-cover"
                              src={getYouTubeThumbnail(vlog.linkYoutube) || ''}
                              alt={vlog.judulVideo}
                            />
                          ) : (
                            <div className="h-20 w-32 bg-gray-200 rounded flex items-center justify-center">
                              <Youtube className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {truncateText(vlog.judulVideo, 50)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {truncateText(vlog.deskripsiVideo, 100)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{formatDate(vlog.createdAt)}</div>
                      {vlog.updatedAt !== vlog.createdAt && (
                        <div className="text-xs text-gray-400">
                          Diperbarui: {formatDate(vlog.updatedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <a
                          href={vlog.linkYoutube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-700"
                          title="Lihat di YouTube"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <Link
                          href={`/dashboard/Vlog/Edit/${vlog.id}`}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(vlog.id, vlog.judulVideo)}
                          className="text-red-600 hover:text-red-700"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VlogTable;