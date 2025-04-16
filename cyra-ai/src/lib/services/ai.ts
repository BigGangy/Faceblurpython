import OpenAI from 'openai';
import { CVData } from '@/types/cv';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AIGenerateOptions {
  language: string;
  region: string;
  tone?: 'formal' | 'professional' | 'casual';
}

export async function generateCVContent(
  cvData: Partial<CVData>,
  options: AIGenerateOptions
) {
  const prompt = `
    Generate a professional CV content for a ${options.region} job market in ${options.language}.
    The tone should be ${options.tone || 'professional'}.
    Use the following information:
    ${JSON.stringify(cvData, null, 2)}
    
    Generate the following sections:
    1. Professional Summary
    2. Skills (categorized)
    3. Experience descriptions
    4. Education descriptions
    
    Format the response as JSON with these sections.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional CV writer specializing in creating ATS-optimized resumes for different regions and languages."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function generateCoverLetter(
  cvData: CVData,
  jobDescription: string,
  options: AIGenerateOptions
) {
  const prompt = `
    Generate a professional cover letter in ${options.language} for a ${options.region} job market.
    The tone should be ${options.tone || 'formal'}.
    
    CV Information:
    ${JSON.stringify(cvData, null, 2)}
    
    Job Description:
    ${jobDescription}
    
    Generate a cover letter that:
    1. Matches the job requirements
    2. Highlights relevant experience
    3. Uses appropriate regional formatting
    4. Maintains professional tone
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional cover letter writer specializing in creating region-specific, ATS-optimized cover letters."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

export async function optimizeKeywords(
  cvData: CVData,
  jobDescription: string,
  options: AIGenerateOptions
) {
  const prompt = `
    Analyze the following CV and job description for ${options.region} in ${options.language}.
    Identify missing keywords and suggest improvements.
    
    CV:
    ${JSON.stringify(cvData, null, 2)}
    
    Job Description:
    ${jobDescription}
    
    Provide:
    1. Missing keywords
    2. Suggested improvements
    3. ATS optimization tips
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an ATS optimization expert specializing in keyword analysis and CV optimization."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

export async function getAIAssistance(
  question: string,
  cvData: CVData,
  options: AIGenerateOptions
) {
  const prompt = `
    You are a CV writing assistant for ${options.region} job market in ${options.language}.
    Answer the following question about CV writing and job applications:
    
    Question: ${question}
    
    CV Context:
    ${JSON.stringify(cvData, null, 2)}
    
    Provide:
    1. Specific advice based on the CV
    2. Regional best practices
    3. Actionable recommendations
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a friendly and knowledgeable CV writing assistant."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
} 