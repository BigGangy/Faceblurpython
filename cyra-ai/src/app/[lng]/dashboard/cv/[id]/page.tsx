import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { getCVById, updateCV } from '@/lib/api/cv';
import { CV } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { CVWizard } from '@/components/cv/CVWizard';

interface CVPageProps {
  params: {
    lng: string;
    id: string;
  };
}

export default function CVPage({ params: { lng, id } }: CVPageProps) {
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [cv, setCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${lng}/auth/login`);
      return;
    }

    if (user) {
      loadCV();
    }
  }, [user, authLoading, id]);

  const loadCV = async () => {
    try {
      const cvData = await getCVById(id);
      if (cvData.userId !== user?.uid) {
        toast.error(t('errors.unauthorized'));
        router.push(`/${lng}/dashboard`);
        return;
      }
      setCV(cvData);
    } catch (error) {
      console.error('Error loading CV:', error);
      toast.error(t('errors.load_failed'));
      router.push(`/${lng}/dashboard`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (cvData: any) => {
    setIsSaving(true);
    try {
      await updateCV(id, cvData);
      setCV({ ...cv!, ...cvData });
      toast.success(t('cv_wizard.cv_updated'));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating CV:', error);
      toast.error(t('errors.update_failed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/${lng}/dashboard`);
  };

  const handleDownload = async (format: 'pdf' | 'docx') => {
    try {
      const response = await fetch('/api/cv/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvId: id,
          format,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate CV');
      }

      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cv.title}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(t('cv_wizard.download_success'));
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error(t('errors.download_failed'));
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!cv) {
    return null;
  }

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
              {isEditing ? t('cv_wizard.edit_cv') : cv.title}
            </h1>
            {!isEditing && (
              <div className="flex space-x-4">
                <button
                  onClick={() => handleDownload('pdf')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {t('cv_wizard.download_pdf')}
                </button>
                <button
                  onClick={() => handleDownload('docx')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {t('cv_wizard.download_docx')}
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {t('dashboard.edit')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEditing ? (
          <CVWizard
            language={lng}
            region={cv.region}
            initialData={cv}
            onComplete={handleSave}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Personal Information */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('cv_wizard.personal_info')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('cv_wizard.name')}</p>
                  <p className="text-gray-900">
                    {cv.personalInfo.firstName} {cv.personalInfo.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('cv_wizard.email')}</p>
                  <p className="text-gray-900">{cv.personalInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('cv_wizard.phone')}</p>
                  <p className="text-gray-900">{cv.personalInfo.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('cv_wizard.location')}</p>
                  <p className="text-gray-900">{cv.personalInfo.location}</p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('cv_wizard.education')}
              </h2>
              {cv.education.map((edu, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {edu.institution}
                      </h3>
                      <p className="text-gray-600">
                        {edu.degree} in {edu.field}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {edu.startDate} - {edu.endDate || t('cv_wizard.present')}
                    </div>
                  </div>
                  {edu.gpa && (
                    <p className="mt-1 text-sm text-gray-600">
                      GPA: {edu.gpa}
                    </p>
                  )}
                  {edu.description && (
                    <p className="mt-2 text-gray-600">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Experience */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('cv_wizard.experience')}
              </h2>
              {cv.experience.map((exp, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {exp.company}
                      </h3>
                      <p className="text-gray-600">{exp.position}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {exp.startDate} - {exp.endDate || t('cv_wizard.present')}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{exp.location}</p>
                  {exp.description && (
                    <p className="mt-2 text-gray-600">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-gray-600">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('cv_wizard.skills')}
              </h2>
              {Object.entries(cv.skills).map(([category, skills]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('cv_wizard.summary')}
              </h2>
              <p className="text-gray-600 whitespace-pre-line">{cv.summary}</p>
            </div>
          </div>
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