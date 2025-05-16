import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/enrollments/[id] - Get an enrollment by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: params.id },
      include: {
        student: true,
        course: {
          include: {
            teacher: true
          }
        }
      }
    });
    
    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(enrollment);
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollment' },
      { status: 500 }
    );
  }
}

// DELETE /api/enrollments/[id] - Delete an enrollment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if enrollment exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id: params.id }
    });
    
    if (!existingEnrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }
    
    // Delete the enrollment
    await prisma.enrollment.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to delete enrollment' },
      { status: 500 }
    );
  }
}
