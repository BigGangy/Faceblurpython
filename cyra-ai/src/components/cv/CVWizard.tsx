import React, { useState } from 'react';
import { PersonalInfoStep } from './PersonalInfoStep';
import { EducationStep } from './EducationStep';
import { ExperienceStep } from './ExperienceStep';
import { SkillsStep } from './SkillsStep';
import { SummaryStep } from './SummaryStep';
import { CVData, PersonalInfo, Education, Experience, Skill } from '../../types/cv';
import { useTranslation } from '../../i18n';
import { generateCVSection } from '../../lib/ai';

interface CVWizardProps {
  language: string;
  region: string;
  onComplete: (cvData: CVData) => void;
}

export const CVWizard: React.FC<CVWizardProps> = ({
  language,
  region,
  onComplete,
}) => {
  const { t } = useTranslation(language, 'common');
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
    },
    education: [],
    experience: [],
    skills: [],
    summary: '',
    language,
    region,
    template: 'modern',
  });

  const steps = [
    {
      title: t('cv_wizard.personal_info'),
      component: (
        <PersonalInfoStep
          initialData={cvData.personalInfo}
          onSubmit={(data) => {
            setCvData((prev) => ({ ...prev, personalInfo: data }));
            setCurrentStep(1);
          }}
          language={language}
        />
      ),
    },
    {
      title: t('cv_wizard.education'),
      component: (
        <EducationStep
          initialData={cvData.education}
          onSubmit={(data) => {
            setCvData((prev) => ({ ...prev, education: data }));
            setCurrentStep(2);
          }}
          language={language}
        />
      ),
    },
    {
      title: t('cv_wizard.experience'),
      component: (
        <ExperienceStep
          initialData={cvData.experience}
          onSubmit={(data) => {
            setCvData((prev) => ({ ...prev, experience: data }));
            setCurrentStep(3);
          }}
          language={language}
        />
      ),
    },
    {
      title: t('cv_wizard.skills'),
      component: (
        <SkillsStep
          initialData={cvData.skills}
          onSubmit={(data) => {
            setCvData((prev) => ({ ...prev, skills: data }));
            setCurrentStep(4);
          }}
          language={language}
        />
      ),
    },
    {
      title: t('cv_wizard.summary'),
      component: (
        <SummaryStep
          data={cvData}
          onEdit={setCurrentStep}
          onSubmit={handleGenerateCV}
          language={language}
        />
      ),
    },
  ];

  const handleGenerateCV = async () => {
    setIsGenerating(true);
    try {
      // Generate professional summary using AI
      const summary = await generateCVSection('summary', cvData, language, region);
      const updatedCvData = { ...cvData, summary };
      setCvData(updatedCvData);
      onComplete(updatedCvData);
    } catch (error) {
      console.error('Error generating CV:', error);
      // Handle error appropriately
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                } text-white`}
              >
                {index + 1}
              </div>
              <span className="text-sm mt-1">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
            <p className="text-gray-600">{t('cv_wizard.generating_cv')}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6">{steps[currentStep].title}</h2>
            {steps[currentStep].component}
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStep < steps.length - 1 && (
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-md ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('back')}
          </button>
        </div>
      )}
    </div>
  );
}; 