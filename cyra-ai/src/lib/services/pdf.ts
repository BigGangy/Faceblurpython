import html2pdf from 'html2pdf.js';
import { CVData } from '@/types/cv';

interface PDFOptions {
  language: string;
  region: string;
  template: string;
}

export async function generatePDF(
  cvData: CVData,
  options: PDFOptions
): Promise<Blob> {
  const element = document.createElement('div');
  element.id = 'cv-preview';
  element.className = `cv-template ${options.template} ${
    options.language === 'ar' ? 'rtl' : 'ltr'
  }`;
  document.body.appendChild(element);

  // Apply RTL/LTR styles
  element.style.direction = options.language === 'ar' ? 'rtl' : 'ltr';
  element.style.textAlign = options.language === 'ar' ? 'right' : 'left';

  // Generate CV HTML content
  const html = generateCVHTML(cvData, options);
  element.innerHTML = html;

  // Configure PDF options
  const pdfOptions = {
    margin: 10,
    filename: `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
  };

  try {
    // Generate PDF
    const pdf = await html2pdf().set(pdfOptions).from(element).output('blob');
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    // Clean up
    document.body.removeChild(element);
  }
}

function generateCVHTML(cvData: CVData, options: PDFOptions): string {
  const { language, region, template } = options;
  const isRTL = language === 'ar';

  return `
    <div class="cv-container ${template}">
      <header class="cv-header">
        <h1>${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}</h1>
        <div class="contact-info">
          <p>${cvData.personalInfo.email}</p>
          <p>${cvData.personalInfo.phone}</p>
          <p>${cvData.personalInfo.location}</p>
        </div>
      </header>

      <section class="cv-section">
        <h2>${isRTL ? 'ملخص مهني' : 'Professional Summary'}</h2>
        <p>${cvData.summary}</p>
      </section>

      <section class="cv-section">
        <h2>${isRTL ? 'الخبرة العملية' : 'Work Experience'}</h2>
        ${cvData.experiences
          .map(
            (exp) => `
          <div class="experience">
            <h3>${exp.position}</h3>
            <p class="company">${exp.company}</p>
            <p class="period">${exp.startDate} - ${exp.endDate || 'Present'}</p>
            <p class="description">${exp.description}</p>
            ${exp.achievements
              .map((achievement) => `<li>${achievement}</li>`)
              .join('')}
          </div>
        `
          )
          .join('')}
      </section>

      <section class="cv-section">
        <h2>${isRTL ? 'التعليم' : 'Education'}</h2>
        ${cvData.education
          .map(
            (edu) => `
          <div class="education">
            <h3>${edu.degree}</h3>
            <p class="institution">${edu.institution}</p>
            <p class="period">${edu.startDate} - ${edu.endDate || 'Present'}</p>
            <p class="field">${edu.field}</p>
            ${edu.gpa ? `<p class="gpa">GPA: ${edu.gpa}</p>` : ''}
            ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
          </div>
        `
          )
          .join('')}
      </section>

      <section class="cv-section">
        <h2>${isRTL ? 'المهارات' : 'Skills'}</h2>
        ${Object.entries(cvData.skills)
          .map(
            ([category, skills]) => `
          <div class="skill-category">
            <h3>${category}</h3>
            <div class="skills">
              ${skills.map((skill) => `<span class="skill">${skill}</span>`).join('')}
            </div>
          </div>
        `
          )
          .join('')}
      </section>
    </div>
  `;
} 