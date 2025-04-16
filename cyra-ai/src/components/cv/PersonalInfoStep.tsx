import React, { useState } from 'react';
import { FormInput } from '../forms/FormInput';
import { PersonalInfo } from '../../types/cv';
import { useTranslation } from '../../i18n';

interface PersonalInfoStepProps {
  initialData?: Partial<PersonalInfo>;
  onSubmit: (data: PersonalInfo) => void;
  language: string;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  initialData = {},
  onSubmit,
  language,
}) => {
  const { t } = useTranslation(language, 'common');
  const [data, setData] = useState<Partial<PersonalInfo>>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfo, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PersonalInfo]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalInfo, string>> = {};
    
    if (!data.firstName) {
      newErrors.firstName = t('errors.required');
    }
    if (!data.lastName) {
      newErrors.lastName = t('errors.required');
    }
    if (!data.email) {
      newErrors.email = t('errors.required');
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = t('errors.invalid_email');
    }
    if (!data.phone) {
      newErrors.phone = t('errors.required');
    }
    if (!data.location) {
      newErrors.location = t('errors.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(data as PersonalInfo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label={t('cv_wizard.first_name')}
          name="firstName"
          value={data.firstName || ''}
          onChange={handleChange}
          error={errors.firstName}
          required
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
        <FormInput
          label={t('cv_wizard.last_name')}
          name="lastName"
          value={data.lastName || ''}
          onChange={handleChange}
          error={errors.lastName}
          required
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <FormInput
        label={t('cv_wizard.email')}
        name="email"
        type="email"
        value={data.email || ''}
        onChange={handleChange}
        error={errors.email}
        required
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      />

      <FormInput
        label={t('cv_wizard.phone')}
        name="phone"
        type="tel"
        value={data.phone || ''}
        onChange={handleChange}
        error={errors.phone}
        required
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      />

      <FormInput
        label={t('cv_wizard.location')}
        name="location"
        value={data.location || ''}
        onChange={handleChange}
        error={errors.location}
        required
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      />

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