export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  photo?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements?: string[];
}

export interface Skill {
  category: string;
  items: string[];
}

export interface CVData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  summary: string;
  language: string;
  region: string;
  template: string;
}

export interface CVFormData extends Omit<CVData, 'education' | 'experience' | 'skills'> {
  education: string;
  experience: string;
  skills: string;
} 