import React, { useState } from 'react';
import { FormInput } from '../forms/FormInput';
import { Education } from '../../types/cv';
import { useTranslation } from '../../i18n';

interface EducationStepProps {
  initialData?: Education[];
  onSubmit: (data: Education[]) => void;
  language: string;
}

export const EducationStep: React.FC<EducationStepProps> = ({
  initialData = [],
  onSubmit,
  language,
}) => {
  const { t } = useTranslation(language, 'common');
  const [educations, setEducations] = useState<Education[]>(initialData);
  const [currentEducation, setCurrentEducation] = useState<Partial<Education>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof Education, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEducation((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Education]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Education, string>> = {};
    
    if (!currentEducation.institution) {
      newErrors.institution = t('errors.required');
    }
    if (!currentEducation.degree) {
      newErrors.degree = t('errors.required');
    }
    if (!currentEducation.field) {
      newErrors.field = t('errors.required');
    }
    if (!currentEducation.startDate) {
      newErrors.startDate = t('errors.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEducation = () => {
    if (validate() && currentEducation.institution) {
      setEducations((prev) => [...prev, currentEducation as Education]);
      setCurrentEducation({});
      setErrors({});
    }
  };

  const handleRemoveEducation = (index: number) => {
    setEducations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(educations);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormInput
          label={t('cv_wizard.institution')}
          name="institution"
          value={currentEducation.institution || ''}
          onChange={handleChange}
          error={errors.institution}
          required
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={t('cv_wizard.degree')}
            name="degree"
            value={currentEducation.degree || ''}
            onChange={handleChange}
            error={errors.degree}
            required
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          <FormInput
            label={t('cv_wizard.field')}
            name="field"
            value={currentEducation.field || ''}
            onChange={handleChange}
            error={errors.field}
            required
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={t('cv_wizard.start_date')}
            name="startDate"
            type="date"
            value={currentEducation.startDate || ''}
            onChange={handleChange}
            error={errors.startDate}
            required
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          <FormInput
            label={t('cv_wizard.end_date')}
            name="endDate"
            type="date"
            value={currentEducation.endDate || ''}
            onChange={handleChange}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <FormInput
          label={t('cv_wizard.gpa')}
          name="gpa"
          value={currentEducation.gpa || ''}
          onChange={handleChange}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('cv_wizard.description')}
          </label>
          <textarea
            name="description"
            value={currentEducation.description || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <button
          type="button"
          onClick={handleAddEducation}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {t('cv_wizard.add_education')}
        </button>
      </div>

      {educations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">{t('cv_wizard.education_list')}</h3>
          <div className="space-y-4">
            {educations.map((edu, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-md flex justify-between items-start"
              >
                <div>
                  <h4 className="font-medium">{edu.institution}</h4>
                  <p className="text-sm text-gray-600">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate || t('cv_wizard.present')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  {t('cv_wizard.remove')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('next')}
        </button>
      </div>
    </form>
  );
}; 