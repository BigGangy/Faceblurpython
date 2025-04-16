import OpenAI from 'openai';
import { CVData } from '../types/cv';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCVSection(
  section: keyof CVData,
  data: Partial<CVData>,
  language: string,
  region: string
): Promise<string> {
  const prompt = await getAIPrompt(section, language, region);
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: JSON.stringify(data),
      },
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content || '';
}

export async function optimizeCVKeywords(
  cvContent: string,
  jobDescription: string,
  language: string
): Promise<string[]> {
  const prompt = `Analyze the following CV content and job description. 
  Identify the most important keywords from the job description that are missing from the CV.
  Language: ${language}
  
  CV Content:
  ${cvContent}
  
  Job Description:
  ${jobDescription}
  
  Return only a JSON array of the missing keywords.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  try {
    return JSON.parse(completion.choices[0].message.content || '[]');
  } catch (error) {
    return [];
  }
}

export async function generateCoverLetter(
  cvData: CVData,
  jobTitle: string,
  company: string,
  language: string,
  region: string
): Promise<string> {
  const prompt = await getAIPrompt('cover_letter', language, region);
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: JSON.stringify({
          cvData,
          jobTitle,
          company,
        }),
      },
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content || '';
}

async function getAIPrompt(
  section: string,
  language: string,
  region: string
): Promise<string> {
  // In a real implementation, this would fetch from the database
  const prompts: Record<string, Record<string, Record<string, string>>> = {
    personal_info: {
      en: {
        ksa: "Generate a professional personal information section for a CV targeting the Saudi Arabian job market...",
        uae: "Generate a professional personal information section for a CV targeting the UAE job market...",
      },
      ar: {
        ksa: "قم بإنشاء قسم المعلومات الشخصية المهنية لسيرة ذاتية تستهدف سوق العمل السعودي...",
        uae: "قم بإنشاء قسم المعلومات الشخصية المهنية لسيرة ذاتية تستهدف سوق العمل الإماراتي...",
      },
    },
    // Add more prompts for other sections
  };

  return prompts[section]?.[language]?.[region] || '';
} 