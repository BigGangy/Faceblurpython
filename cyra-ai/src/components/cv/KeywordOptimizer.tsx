import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import { optimizeKeywords } from '@/lib/services/ai';
import { CVData } from '@/types/cv';
import { toast } from 'react-hot-toast';

interface KeywordOptimizerProps {
  cvData: CVData;
  language: string;
  region: string;
}

export default function KeywordOptimizer({
  cvData,
  language,
  region,
}: KeywordOptimizerProps) {
  const { t } = useTranslation(language, 'common');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    setIsLoading(true);
    try {
      const response = await optimizeKeywords(cvData, jobDescription, {
        language,
        region,
      });
      setAnalysis(response);
    } catch (error) {
      console.error('Error optimizing keywords:', error);
      toast.error(t('errors.keyword_optimization_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {t('keyword_optimizer.title')}
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label
            htmlFor="jobDescription"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t('keyword_optimizer.job_description')}
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder={t('keyword_optimizer.placeholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              {t('keyword_optimizer.analyzing')}
            </div>
          ) : (
            t('keyword_optimizer.analyze')
          )}
        </button>
      </form>

      {analysis && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('keyword_optimizer.results')}
          </h3>
          <div className="prose max-w-none">
            {analysis.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          {t('keyword_optimizer.tips')}
        </h3>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>{t('keyword_optimizer.tip1')}</li>
          <li>{t('keyword_optimizer.tip2')}</li>
          <li>{t('keyword_optimizer.tip3')}</li>
          <li>{t('keyword_optimizer.tip4')}</li>
        </ul>
      </div>
    </div>
  );
} 