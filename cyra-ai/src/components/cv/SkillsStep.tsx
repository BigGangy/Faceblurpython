import React, { useState } from 'react';
import { FormInput } from '../forms/FormInput';
import { Skill } from '../../types/cv';
import { useTranslation } from '../../i18n';

interface SkillsStepProps {
  initialData?: Skill[];
  onSubmit: (data: Skill[]) => void;
  language: string;
}

export const SkillsStep: React.FC<SkillsStepProps> = ({
  initialData = [],
  onSubmit,
  language,
}) => {
  const { t } = useTranslation(language, 'common');
  const [skills, setSkills] = useState<Skill[]>(initialData);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [errors, setErrors] = useState<{ category?: string; skill?: string }>({});

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCategory(e.target.value);
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSkill(e.target.value);
    if (errors.skill) {
      setErrors((prev) => ({ ...prev, skill: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { category?: string; skill?: string } = {};
    
    if (!currentCategory) {
      newErrors.category = t('errors.required');
    }
    if (!currentSkill) {
      newErrors.skill = t('errors.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSkill = () => {
    if (validate()) {
      const existingCategory = skills.find((s) => s.category === currentCategory);
      
      if (existingCategory) {
        setSkills((prev) =>
          prev.map((skill) =>
            skill.category === currentCategory
              ? { ...skill, items: [...skill.items, currentSkill] }
              : skill
          )
        );
      } else {
        setSkills((prev) => [
          ...prev,
          { category: currentCategory, items: [currentSkill] },
        ]);
      }
      
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (category: string, skillIndex: number) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.category === category
          ? {
              ...skill,
              items: skill.items.filter((_, index) => index !== skillIndex),
            }
          : skill
      )
    );
  };

  const handleRemoveCategory = (category: string) => {
    setSkills((prev) => prev.filter((skill) => skill.category !== category));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(skills);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <FormInput
          label={t('cv_wizard.category')}
          name="category"
          value={currentCategory}
          onChange={handleCategoryChange}
          error={errors.category}
          required
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />

        <div className="flex gap-2">
          <FormInput
            label={t('cv_wizard.skill')}
            name="skill"
            value={currentSkill}
            onChange={handleSkillChange}
            error={errors.skill}
            required
            dir={language === 'ar' ? 'rtl' : 'ltr'}
            className="flex-1"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="self-end px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {t('cv_wizard.add')}
          </button>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">{t('cv_wizard.skills_list')}</h3>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div
                key={skill.category}
                className="p-4 border border-gray-200 rounded-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{skill.category}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(skill.category)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t('cv_wizard.remove_category')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full"
                    >
                      <span className="text-sm">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill.category, index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
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