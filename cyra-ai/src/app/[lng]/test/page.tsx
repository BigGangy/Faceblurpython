'use client';

import React, { useState } from 'react';
import { generateCVContent } from '@/lib/services/ai';
import { useTranslation } from '@/i18n';

export default function TestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('common');

  const testAI = async () => {
    setLoading(true);
    try {
      const testData = {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com'
        },
        education: [
          {
            institution: 'University of Technology',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2018-09-01',
            endDate: '2022-06-01'
          }
        ],
        experience: [
          {
            company: 'Tech Corp',
            position: 'Software Developer',
            startDate: '2022-07-01',
            endDate: '2023-12-31',
            description: 'Developed web applications using React and Node.js'
          }
        ],
        skills: [
          {
            category: 'Programming',
            skills: ['JavaScript', 'TypeScript', 'Python']
          }
        ]
      };

      const response = await generateCVContent(testData, {
        language: 'en',
        region: 'ksa',
        tone: 'professional'
      });

      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Service Test</h1>
        
        <button
          onClick={testAI}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test AI Service'}
        </button>

        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Result:</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 