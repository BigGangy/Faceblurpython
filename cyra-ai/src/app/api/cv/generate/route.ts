import { NextRequest, NextResponse } from 'next/server';
import { getCVById } from '@/lib/api/cv';
import { generateCV } from '@/lib/services/cvGenerator';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { cvId, format } = await req.json();

    // Get CV data
    const cv = await getCVById(cvId);
    if (!cv || cv.userId !== userId) {
      return NextResponse.json(
        { error: 'CV not found or unauthorized' },
        { status: 404 }
      );
    }

    // Generate CV
    const buffer = await generateCV(cv, { format });

    // Return the generated file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${cv.title}.${format}"`,
      },
    });
  } catch (error) {
    console.error('Error generating CV:', error);
    return NextResponse.json(
      { error: 'Failed to generate CV' },
      { status: 500 }
    );
  }
} 