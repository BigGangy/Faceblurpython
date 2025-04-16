import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import { generatePDF } from '@/lib/services/pdf';
import { CVData } from '@/types/cv';
import { toast } from 'react-hot-toast';

interface PDFExportProps {
  cvData: CVData;
  language: string;
  region: string;
  template: string;
}

export default function PDFExport({
  cvData,
  language,
  region,
  template,
}: PDFExportProps) {
  const { t } = useTranslation(language, 'common');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      const pdfBlob = await generatePDF(cvData, {
        language,
        region,
        template,
      });

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(t('pdf.export_success'));
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error(t('pdf.export_error'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        {t('pdf.title')}
      </h2>
      <p className="text-gray-600">
        {t('pdf.description')}
      </p>
      <button
        onClick={handleExport}
        disabled={isGenerating}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            {t('pdf.generating')}
          </div>
        ) : (
          t('pdf.export')
        )}
      </button>
    </div>
  );
} 