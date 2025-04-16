import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import { Template } from '@/types/cv';

interface TemplateSelectorProps {
  language: string;
  region: string;
  onSelect: (template: Template) => void;
}

export default function TemplateSelector({
  language,
  region,
  onSelect,
}: TemplateSelectorProps) {
  const { t } = useTranslation(language, 'common');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates: Template[] = [
    {
      id: 'classic',
      name: t('templates.classic.name'),
      description: t('templates.classic.description'),
      image: '/templates/classic.png',
      isATS: true,
      regions: ['KSA', 'UAE', 'Tunisia'],
      languages: ['ar', 'en']
    },
    {
      id: 'modern',
      name: t('templates.modern.name'),
      description: t('templates.modern.description'),
      image: '/templates/modern.png',
      isATS: true,
      regions: ['KSA', 'UAE', 'Tunisia', 'France', 'Canada'],
      languages: ['ar', 'en', 'fr']
    },
    {
      id: 'professional',
      name: t('templates.professional.name'),
      description: t('templates.professional.description'),
      image: '/templates/professional.png',
      isATS: true,
      regions: ['France', 'Canada'],
      languages: ['en', 'fr']
    },
    {
      id: 'creative',
      name: t('templates.creative.name'),
      description: t('templates.creative.description'),
      image: '/templates/creative.png',
      isATS: false,
      regions: ['KSA', 'UAE', 'Tunisia'],
      languages: ['ar', 'en']
    }
  ];

  const filteredTemplates = templates.filter(
    (template) =>
      template.regions.includes(region) && template.languages.includes(language)
  );

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template.id);
    onSelect(template);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('templates.title')}
        </h2>
        <p className="text-gray-600">
          {t('templates.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
              selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="relative">
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-48 object-cover"
              />
              {template.isATS && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  ATS
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {template.regions.map((region) => (
                  <span
                    key={region}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {t('templates.no_templates')}
          </p>
        </div>
      )}
    </div>
  );
} 