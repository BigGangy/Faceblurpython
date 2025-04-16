import React from 'react';
import { CVData } from '../../types/cv';
import { useTranslation } from '../../i18n';

interface SummaryStepProps {
  data: CVData;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  language: string;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  data,
  onEdit,
  onSubmit,
  language,
}) => {
  const { t } = useTranslation(language, 'common');
  const isRTL = language === 'ar';

  return (
    <div className="space-y-8">
      {/* Personal Information Section */}
      <section className="border-b pb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('cv_wizard.personal_info')}</h2>
          <button
            onClick={() => onEdit(0)}
            className="text-blue-600 hover:text-blue-800"
          >
            {t('cv_wizard.edit')}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">{t('cv_wizard.name')}</p>
            <p className="font-medium">
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </p>
          </div>
          <div>
            <p className="text-gray-600">{t('cv_wizard.email')}</p>
            <p className="font-medium">{data.personalInfo.email}</p>
          </div>
          <div>
            <p className="text-gray-600">{t('cv_wizard.phone')}</p>
            <p className="font-medium">{data.personalInfo.phone}</p>
          </div>
          <div>
            <p className="text-gray-600">{t('cv_wizard.location')}</p>
            <p className="font-medium">{data.personalInfo.location}</p>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="border-b pb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('cv_wizard.education')}</h2>
          <button
            onClick={() => onEdit(1)}
            className="text-blue-600 hover:text-blue-800"
          >
            {t('cv_wizard.edit')}
          </button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium">{edu.institution}</h3>
              <p className="text-gray-600">
                {edu.degree} in {edu.field}
              </p>
              <p className="text-sm text-gray-500">
                {edu.startDate} - {edu.endDate || t('cv_wizard.present')}
              </p>
              {edu.gpa && (
                <p className="text-sm text-gray-500">
                  {t('cv_wizard.gpa')}: {edu.gpa}
                </p>
              )}
              {edu.description && (
                <p className="mt-2 text-sm text-gray-700">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="border-b pb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('cv_wizard.experience')}</h2>
          <button
            onClick={() => onEdit(2)}
            className="text-blue-600 hover:text-blue-800"
          >
            {t('cv_wizard.edit')}
          </button>
        </div>
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium">{exp.company}</h3>
              <p className="text-gray-600">{exp.position}</p>
              <p className="text-sm text-gray-500">
                {exp.location} | {exp.startDate} - {exp.endDate || t('cv_wizard.present')}
              </p>
              <p className="mt-2 text-sm text-gray-700">{exp.description}</p>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="border-b pb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('cv_wizard.skills')}</h2>
          <button
            onClick={() => onEdit(3)}
            className="text-blue-600 hover:text-blue-800"
          >
            {t('cv_wizard.edit')}
          </button>
        </div>
        <div className="space-y-4">
          {data.skills.map((skill, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">{skill.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('cv_wizard.summary')}</h2>
          <button
            onClick={() => onEdit(4)}
            className="text-blue-600 hover:text-blue-800"
          >
            {t('cv_wizard.edit')}
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700 whitespace-pre-line">{data.summary}</p>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => onEdit(0)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          {t('cv_wizard.back_to_edit')}
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {t('cv_wizard.generate_cv')}
        </button>
      </div>
    </div>
  );
}; 