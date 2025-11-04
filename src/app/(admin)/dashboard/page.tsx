"use client";

import React from 'react';
import { 
  UserGroupIcon, 
  MapPinIcon, 
  BuildingOfficeIcon,
  DocumentTextIcon,
  PhotoIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Users', value: '12', icon: UserGroupIcon, color: 'bg-blue-500' },
    { name: 'Destinations', value: '8', icon: MapPinIcon, color: 'bg-green-500' },
    { name: 'Hotels', value: '15', icon: BuildingOfficeIcon, color: 'bg-purple-500' },
    { name: 'Articles', value: '23', icon: DocumentTextIcon, color: 'bg-orange-500' },
  ];

  const menuItems = [
    { title: 'Manage Users', description: 'Add, edit, and manage user accounts', href: '/dashboard/users' },
    { title: 'Destinations', description: 'Manage tourist destinations and attractions', href: '/dashboard/destinations' },
    { title: 'Hotels', description: 'Hotel listings and room management', href: '/dashboard/hotels' },
    { title: 'Articles', description: 'Create and manage blog articles', href: '/dashboard/articles' },
    { title: 'Carousel', description: 'Manage homepage carousel images and content', href: '/dashboard/carousel' },
    { title: 'Pilih Kami', description: 'Manage why choose us features', href: '/dashboard/PilihKami' },
    { title: 'Special Packages', description: 'Manage special package displays', href: '/dashboard/special-packages' },
    { title: 'Quality Section', description: 'Manage quality section content', href: '/dashboard/QualitySection' },
    { title: 'FAQ Management', description: 'Manage frequently asked questions', href: '/dashboard/FAQ' },
    { title: 'Newsletter', description: 'Manage newsletter section', href: '/dashboard/Newsletter' },
    { title: 'About Page', description: 'Manage about page content', href: '/dashboard/AboutPage' },
    { title: 'Settings', description: 'System settings and configuration', href: '/dashboard/settings' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Admin! 👋
        </h1>
        <p className="text-gray-600">
          Here&apos;s what&apos;s happening with your LocalKarya platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg border">
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
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-600">Manage your platform content and settings</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="block p-6 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 className="text-lg font-medium text-gray-900 mb-2">
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

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <UserGroupIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <DocumentTextIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New article published</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <BuildingOfficeIcon className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Hotel listing updated</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <PhotoIcon className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Carousel item updated</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <HeartIcon className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Pilih Kami feature updated</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <MapPinIcon className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Special Packages updated</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}