import React, { useState } from 'react';
import { FormInput } from '../forms/FormInput';
import { Experience } from '../../types/cv';
import { useTranslation } from '../../i18n';

interface ExperienceStepProps {
  initialData?: Experience[];
  onSubmit: (data: Experience[]) => void;
  language: string;
}

export const ExperienceStep: React.FC<ExperienceStepProps> = ({
  initialData = [],
  onSubmit,
  language,
}) => {
  const { t } = useTranslation(language, 'common');
  const [experiences, setExperiences] = useState<Experience[]>(initialData);
  const [currentExperience, setCurrentExperience] = useState<Partial<Experience>>({});
  const [currentAchievement, setCurrentAchievement] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof Experience, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentExperience((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Experience]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAchievementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentAchievement(e.target.value);
  };

  const handleAddAchievement = () => {
    if (currentAchievement.trim()) {
      setCurrentExperience((prev) => ({
        ...prev,
        achievements: [...(prev.achievements || []), currentAchievement.trim()],
      }));
      setCurrentAchievement('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setCurrentExperience((prev) => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Experience, string>> = {};
    
    if (!currentExperience.company) {
      newErrors.company = t('errors.required');
    }
    if (!currentExperience.position) {
      newErrors.position = t('errors.required');
    }
    if (!currentExperience.location) {
      newErrors.location = t('errors.required');
    }
    if (!currentExperience.startDate) {
      newErrors.startDate = t('errors.required');
    }
    if (!currentExperience.description) {
      newErrors.description = t('errors.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddExperience = () => {
    if (validate() && currentExperience.company) {
      setExperiences((prev) => [...prev, currentExperience as Experience]);
      setCurrentExperience({});
      setCurrentAchievement('');
      setErrors({});
    }
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(experiences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormInput
          label={t('cv_wizard.company')}
          name="company"
          value={currentExperience.company || ''}
          onChange={handleChange}
          error={errors.company}
          required
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={t('cv_wizard.position')}
            name="position"
            value={currentExperience.position || ''}
            onChange={handleChange}
            error={errors.position}
            required
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          <FormInput
            label={t('cv_wizard.location')}
            name="location"
            value={currentExperience.location || ''}
            onChange={handleChange}
            error={errors.location}
            required
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={t('cv_wizard.start_date')}
            name="startDate"
            type="date"
            value={currentExperience.startDate || ''}
            onChange={handleChange}
            error={errors.startDate}
            required
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          <FormInput
            label={t('cv_wizard.end_date')}
            name="endDate"
            type="date"
            value={currentExperience.endDate || ''}
            onChange={handleChange}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('cv_wizard.description')}
          </label>
          <textarea
            name="description"
            value={currentExperience.description || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('cv_wizard.achievements')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentAchievement}
              onChange={handleAchievementChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            <button
              type="button"
              onClick={handleAddAchievement}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {t('cv_wizard.add')}
            </button>
          </div>
          {currentExperience.achievements && currentExperience.achievements.length > 0 && (
            <div className="mt-2 space-y-2">
              {currentExperience.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <span className="text-sm">{achievement}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAchievement(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t('cv_wizard.remove')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddExperience}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {t('cv_wizard.add_experience')}
        </button>
      </div>

      {experiences.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">{t('cv_wizard.experience_list')}</h3>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{exp.company}</h4>
                    <p className="text-sm text-gray-600">{exp.position}</p>
                    <p className="text-sm text-gray-500">
                      {exp.startDate} - {exp.endDate || t('cv_wizard.present')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t('cv_wizard.remove')}
                  </button>
                </div>
                <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
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