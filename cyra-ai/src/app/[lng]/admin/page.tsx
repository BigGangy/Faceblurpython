import React from 'react';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { User, CV, Template } from '@prisma/client';

interface AdminPageProps {
  params: {
    lng: string;
  };
}

export default async function AdminPage({ params: { lng } }: AdminPageProps) {
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();
  const { user, loading } = useAuth();

  // Check if user is admin
  if (!user?.isAdmin) {
    router.push(`/${lng}/dashboard`);
    return null;
  }

  // Fetch admin data
  const [users, cvs, templates] = await Promise.all([
    prisma.user.findMany({
      include: {
        cvs: true,
        coverLetters: true,
      },
    }),
    prisma.cV.findMany({
      include: {
        user: true,
        coverLetters: true,
      },
    }),
    prisma.template.findMany(),
  ]);

  const stats = {
    totalUsers: users.length,
    totalCVs: cvs.length,
    totalTemplates: templates.length,
    activeUsers: users.filter(u => u.cvs.length > 0).length,
    totalCoverLetters: cvs.reduce((acc, cv) => acc + cv.coverLetters.length, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('admin.title')}
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                {t(`admin.stats.${key}`)}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('admin.users.title')}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.users.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.users.email')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.users.cvs')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.users.cover_letters')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.users.joined')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.cvs.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.coverLetters.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Templates Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('admin.templates.title')}
            </h2>
            <button
              onClick={() => router.push(`/${lng}/admin/templates/new`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {t('admin.templates.add')}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {template.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {template.language} / {template.region}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/${lng}/admin/templates/${template.id}/edit`)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {t('admin.templates.edit')}
                    </button>
                    <button
                      onClick={() => router.push(`/${lng}/admin/templates/${template.id}/preview`)}
                      className="text-green-600 hover:text-green-700"
                    >
                      {t('admin.templates.preview')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 