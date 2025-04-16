import React from 'react';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { getUserCVs } from '@/lib/api/cv';
import { CV } from '@prisma/client';

export default function DashboardPage({ params: { lng } }: { params: { lng: string } }) {
  const { t } = useTranslation(lng, 'common');
  const { user, loading } = useAuth();
  const router = useRouter();
  const [cvs, setCVs] = React.useState<CV[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      loadCVs();
    }
  }, [user]);

  const loadCVs = async () => {
    try {
      const userCVs = await getUserCVs(user!.id);
      setCVs(userCVs);
    } catch (error) {
      console.error('Error loading CVs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      title: t('dashboard.features.create_cv.title'),
      description: t('dashboard.features.create_cv.description'),
      icon: '📝',
      path: '/create'
    },
    {
      title: t('dashboard.features.cover_letter.title'),
      description: t('dashboard.features.cover_letter.description'),
      icon: '✍️',
      path: '/cover-letter'
    },
    {
      title: t('dashboard.features.keywords.title'),
      description: t('dashboard.features.keywords.description'),
      icon: '🔍',
      path: '/keywords'
    },
    {
      title: t('dashboard.features.templates.title'),
      description: t('dashboard.features.templates.description'),
      icon: '📄',
      path: '/templates'
    }
  ];

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    router.push(`/${lng}/login`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('dashboard.title')}
          </h1>
          <button
            onClick={() => router.push(`/${lng}/create`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('dashboard.create_new')}
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => router.push(`/${lng}${feature.path}`)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CV List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {t('dashboard.my_cvs')}
          </h2>
          {cvs.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              {t('dashboard.no_cvs')}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => (
                <div
                  key={cv.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-2">{cv.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {new Date(cv.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/${lng}/edit/${cv.id}`)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {t('dashboard.edit')}
                    </button>
                    <button
                      onClick={() => router.push(`/${lng}/preview/${cv.id}`)}
                      className="text-green-600 hover:text-green-700"
                    >
                      {t('dashboard.preview')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 