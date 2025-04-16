import React, { useState } from 'react';
import { CVWizard } from '@/components/cv/CVWizard';
import { CVData } from '@/types/cv';
import { useTranslation } from '@/i18n';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { saveCV } from '@/lib/api/cv';
import { toast } from 'react-hot-toast';

interface CreateCVPageProps {
  params: {
    lng: string;
  };
}

export default function CreateCVPage({ params: { lng } }: CreateCVPageProps) {
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleCVComplete = async (cvData: CVData) => {
    if (!user) {
      toast.error(t('errors.auth_required'));
      router.push(`/${lng}/auth/login`);
      return;
    }

    setIsSaving(true);
    try {
      const savedCV = await saveCV({
        ...cvData,
        userId: user.uid,
      });

      toast.success(t('cv_wizard.cv_saved'));
      router.push(`/${lng}/dashboard/cv/${savedCV.id}`);
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error(t('errors.save_failed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/${lng}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {t('back')}
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              {t('cv_wizard.create_cv')}
            </h1>
            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isSaving ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
            <p className="text-gray-600">{t('cv_wizard.saving_cv')}</p>
          </div>
        ) : (
          <CVWizard
            language={lng}
            region="ksa" // Default to KSA, can be made dynamic based on user preferences
            onComplete={handleCVComplete}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {t('footer.powered_by')} Cyra AI
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                {t('footer.terms')}
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                {t('footer.privacy')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 