import { CVData } from '@/types/cv';
import { prisma } from '@/lib/prisma';

export async function saveCV(cvData: CVData & { userId: string }) {
  try {
    const cv = await prisma.cV.create({
      data: {
        userId: cvData.userId,
        title: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}'s CV`,
        language: cvData.language,
        region: cvData.region,
        personalInfo: cvData.personalInfo,
        education: cvData.education,
        experience: cvData.experience,
        skills: cvData.skills,
        summary: cvData.summary,
        template: cvData.template,
        isPublic: false,
      },
    });

    return cv;
  } catch (error) {
    console.error('Error saving CV:', error);
    throw new Error('Failed to save CV');
  }
}

export async function getCVById(id: string) {
  try {
    const cv = await prisma.cV.findUnique({
      where: { id },
      include: {
        coverLetters: true,
      },
    });

    if (!cv) {
      throw new Error('CV not found');
    }

    return cv;
  } catch (error) {
    console.error('Error fetching CV:', error);
    throw new Error('Failed to fetch CV');
  }
}

export async function getUserCVs(userId: string) {
  try {
    const cvs = await prisma.cV.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        coverLetters: true,
      },
    });

    return cvs;
  } catch (error) {
    console.error('Error fetching user CVs:', error);
    throw new Error('Failed to fetch user CVs');
  }
}

export async function updateCV(id: string, cvData: Partial<CVData>) {
  try {
    const cv = await prisma.cV.update({
      where: { id },
      data: {
        ...cvData,
        updatedAt: new Date(),
      },
    });

    return cv;
  } catch (error) {
    console.error('Error updating CV:', error);
    throw new Error('Failed to update CV');
  }
}

export async function deleteCV(id: string) {
  try {
    await prisma.cV.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    console.error('Error deleting CV:', error);
    throw new Error('Failed to delete CV');
  }
}

export async function toggleCVVisibility(id: string, isPublic: boolean) {
  try {
    const cv = await prisma.cV.update({
      where: { id },
      data: { isPublic },
    });

    return cv;
  } catch (error) {
    console.error('Error toggling CV visibility:', error);
    throw new Error('Failed to toggle CV visibility');
  }
} 