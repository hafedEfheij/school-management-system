import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/enrollments - Get all enrollments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const courseId = searchParams.get('courseId');
    
    let whereClause: any = {};
    
    if (studentId) {
      whereClause.studentId = studentId;
    }
    
    if (courseId) {
      whereClause.courseId = courseId;
    }
    
    const enrollments = await prisma.enrollment.findMany({
      where: whereClause,
      include: {
        student: true,
        course: {
          include: {
            teacher: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - Create a new enrollment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.studentId || !body.courseId) {
      return NextResponse.json(
        { error: 'Student ID and course ID are required' },
        { status: 400 }
      );
    }
    
    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: body.studentId }
    });
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: body.courseId }
    });
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Check if enrollment already exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: body.studentId,
          courseId: body.courseId
        }
      }
    });
    
    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Student is already enrolled in this course' },
        { status: 400 }
      );
    }
    
    // Create the enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: body.studentId,
        courseId: body.courseId
      },
      include: {
        student: true,
        course: {
          include: {
            teacher: true
          }
        }
      }
    });
    
    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to create enrollment' },
      { status: 500 }
    );
  }
}
