import React from 'react';
import { useTranslation } from '@/i18n';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function LandingPage({ params: { lng } }: { params: { lng: string } }) {
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();
  const { user, loading } = useAuth();

  const features = [
    {
      title: t('features.ai_cv.title'),
      description: t('features.ai_cv.description'),
      icon: '🤖'
    },
    {
      title: t('features.templates.title'),
      description: t('features.templates.description'),
      icon: '📄'
    },
    {
      title: t('features.cover_letter.title'),
      description: t('features.cover_letter.description'),
      icon: '✍️'
    },
    {
      title: t('features.keywords.title'),
      description: t('features.keywords.description'),
      icon: '🔍'
    }
  ];

  const handleGetStarted = () => {
    if (user) {
      router.push(`/${lng}/dashboard`);
    } else {
      router.push(`/${lng}/create`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {t('landing.hero.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('landing.hero.subtitle')}
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {t('landing.hero.cta')}
        </button>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('landing.features.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('landing.cta.description')}
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('landing.cta.button')}
          </button>
        </div>
      </div>
    </div>
  );
} 