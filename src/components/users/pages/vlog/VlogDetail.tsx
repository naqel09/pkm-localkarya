"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Youtube, Share2 } from 'lucide-react'

interface Vlog {
  id: number;
  judulVideo: string;
  deskripsiVideo: string;
  linkYoutube: string;
  createdAt: string;
  updatedAt: string;
}

interface VlogDetailProps {
  id: string;
}

const VlogDetail: React.FC<VlogDetailProps> = ({ id }) => {
  const [vlog, setVlog] = useState<Vlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVlogDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/vlog/${id}`);
        const data = await response.json();
        
        if (data.status === 200) {
          setVlog(data.data);
        } else {
          setError('Video tidak ditemukan');
        }
      } catch (err) {
        setError('Error loading video data');
        console.error('Error fetching vlog detail:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVlogDetail();
  }, [id]);

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  // Function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0` : null;
  };

  // Function to get YouTube thumbnail
  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
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

  const shareVideo = async () => {
    if (navigator.share && vlog) {
      try {
        await navigator.share({
          title: vlog.judulVideo,
          text: vlog.deskripsiVideo,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Memuat video...</p>
        </div>
      </div>
    );
  }

  if (error || !vlog) {
    return (
      <div className="flex items-center justify-center py-20 bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <Link
            href="/Vlog"
            className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Video
          </Link>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(vlog.linkYoutube);
  const thumbnail = getYouTubeThumbnail(vlog.linkYoutube);

  return (
    <div className="bg-gray-50">
      {/* Breadcrumb and Title Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/Vlog"
            className="inline-flex items-center text-gray-600 hover:text-red-600 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali ke Daftar Video
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {vlog.judulVideo}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(vlog.createdAt)}</span>
            </div>
            <button
              onClick={shareVideo}
              className="flex items-center hover:text-red-600 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              {embedUrl ? (
                <div className="relative w-full pb-[56.25%] h-0">
                  <iframe
                    src={embedUrl}
                    title={vlog.judulVideo}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Video tidak dapat dimuat</p>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tentang Video Ini</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {vlog.deskripsiVideo}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a
                  href={vlog.linkYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  <Youtube className="h-5 w-5 mr-2" />
                  Tonton di YouTube
                </a>
                <button
                  onClick={shareVideo}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Bagikan Video
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Video Thumbnail */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Preview</h3>
              {thumbnail && (
                <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={thumbnail}
                    alt={vlog.judulVideo}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
            </div>

            {/* Video Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Informasi Video</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dipublikasikan</span>
                  <span className="font-semibold text-gray-800">
                    {formatDate(vlog.createdAt)}
                  </span>
                </div>
                {vlog.updatedAt !== vlog.createdAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Diperbarui</span>
                    <span className="font-semibold text-gray-800">
                      {formatDate(vlog.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VlogDetail;