"use client";

import React, { useEffect, useState } from 'react';
import { 
  UserGroupIcon, 
  MapPinIcon, 
  BuildingOfficeIcon,
  DocumentTextIcon,
  PhotoIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { name: 'Total Pengguna', value: '0', icon: UserGroupIcon, color: 'bg-blue-500', change: '+12%' },
    { name: 'Destinasi', value: '0', icon: MapPinIcon, color: 'bg-green-500', change: '+5%' },
    { name: 'Hotel', value: '0', icon: BuildingOfficeIcon, color: 'bg-purple-500', change: '+8%' },
    { name: 'Artikel', value: '0', icon: DocumentTextIcon, color: 'bg-orange-500', change: '+15%' },
  ]);
  
  const [loading, setLoading] = useState(true);
  const [recentData, setRecentData] = useState({
    users: [],
    destinations: [],
    hotels: [],
    articles: []
  });

  const menuItems = [
    { title: 'Kelola Pengguna', description: 'Tambah, edit, dan kelola akun pengguna', href: '/dashboard/users' },
    { title: 'Destinasi', description: 'Kelola destinasi wisata dan atraksi', href: '/dashboard/destinations' },
    { title: 'Hotel', description: 'Daftar hotel dan manajemen kamar', href: '/dashboard/hotels' },
    { title: 'Artikel', description: 'Buat dan kelola artikel blog', href: '/dashboard/articles' },
    { title: 'Carousel', description: 'Kelola gambar carousel halaman utama', href: '/dashboard/carousel' },
    { title: 'Pilih Kami', description: 'Kelola fitur mengapa pilih kami', href: '/dashboard/PilihKami' },
    { title: 'Paket Wisata', description: 'Kelola tampilan paket wisata spesial', href: '/dashboard/special-packages' },
    { title: 'Bagian Kualitas', description: 'Kelola konten bagian kualitas', href: '/dashboard/QualitySection' },
    { title: 'FAQ', description: 'Kelola pertanyaan yang sering diajukan', href: '/dashboard/FAQ' },
    { title: 'Newsletter', description: 'Kelola bagian newsletter', href: '/dashboard/Newsletter' },
    { title: 'Halaman About', description: 'Kelola konten halaman tentang kami', href: '/dashboard/AboutPage' },
    { title: 'Pengaturan', description: 'Pengaturan sistem dan konfigurasi', href: '/dashboard/settings' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users data
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        const usersCount = usersData.success ? usersData.data.length : 0;
        const recentUsers = usersData.success ? usersData.data.slice(0, 3) : [];

        // Fetch destinations data
        const destinationsResponse = await fetch('/api/destinations');
        const destinationsData = await destinationsResponse.json();
        const destinationsCount = destinationsData.data ? destinationsData.data.length : 0;
        const recentDestinations = destinationsData.data ? destinationsData.data.slice(0, 3) : [];

        // Fetch hotels data
        const hotelsResponse = await fetch('/api/hotel');
        const hotelsData = await hotelsResponse.json();
        const hotelsCount = hotelsData.success ? hotelsData.data.length : 0;
        const recentHotels = hotelsData.success ? hotelsData.data.slice(0, 3) : [];

        // Fetch articles data
        const articlesResponse = await fetch('/api/blog');
        const articlesData = await articlesResponse.json();
        const articlesCount = articlesData.data ? articlesData.data.length : 0;
        const recentArticles = articlesData.data ? articlesData.data.slice(0, 3) : [];

        // Update stats with real data
        setStats([
          { name: 'Total Pengguna', value: usersCount.toString(), icon: UserGroupIcon, color: 'bg-blue-500', change: '+12%' },
          { name: 'Destinasi', value: destinationsCount.toString(), icon: MapPinIcon, color: 'bg-green-500', change: '+5%' },
          { name: 'Hotel', value: hotelsCount.toString(), icon: BuildingOfficeIcon, color: 'bg-purple-500', change: '+8%' },
          { name: 'Artikel', value: articlesCount.toString(), icon: DocumentTextIcon, color: 'bg-orange-500', change: '+15%' },
        ]);

        // Update recent data
        setRecentData({
          users: recentUsers,
          destinations: recentDestinations,
          hotels: recentHotels,
          articles: recentArticles
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selamat datang kembali, Admin! 👋
        </h1>
        <p className="text-gray-600">
          Berikut adalah perkembangan platform LocalKarya Anda hari ini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg border hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} p-3 rounded-md`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {loading ? (
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        stat.value
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span>{stat.change} dari bulan lalu</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Data and Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Aksi Cepat</h3>
            <p className="text-sm text-gray-600">Kelola konten dan pengaturan platform Anda</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {menuItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="block p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors hover:shadow-md"
                >
                  <h4 className="text-md font-medium text-gray-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="bg-white shadow rounded-lg border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pembaruan Terbaru</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Pengguna Baru</h4>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : recentData.users.length > 0 ? (
                  recentData.users.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <UserGroupIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500">Pengguna</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Tidak ada pengguna baru</p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Artikel Terbaru</h4>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : recentData.articles.length > 0 ? (
                  recentData.articles.map((article: any) => (
                    <div key={article.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <div className="bg-orange-100 p-2 rounded-full mr-3">
                          <DocumentTextIcon className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{article.judul || 'Tanpa Judul'}</p>
                          <p className="text-xs text-gray-500">Artikel</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {new Date(article.createdAt || article.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Tidak ada artikel baru</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}