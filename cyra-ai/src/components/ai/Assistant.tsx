import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import { getAIAssistance } from '@/lib/services/ai';
import { CVData } from '@/types/cv';
import { toast } from 'react-hot-toast';

interface AssistantProps {
  cvData: CVData;
  language: string;
  region: string;
}

export default function Assistant({ cvData, language, region }: AssistantProps) {
  const { t } = useTranslation(language, 'common');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const response = await getAIAssistance(question, cvData, {
        language,
        region,
      });
      setAnswer(response);
    } catch (error) {
      console.error('Error getting AI assistance:', error);
      toast.error(t('errors.ai_assistance_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {t('assistant.title')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t('assistant.placeholder')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              t('assistant.ask')
            )}
          </button>
        </div>
      </form>

      {answer && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="prose max-w-none">
            {answer.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          {t('assistant.suggestions')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            t('assistant.suggestion1'),
            t('assistant.suggestion2'),
            t('assistant.suggestion3'),
            t('assistant.suggestion4'),
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setQuestion(suggestion)}
              className="text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 