import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/grades - Get all grades
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const courseId = searchParams.get('courseId');
    const type = searchParams.get('type');
    
    let whereClause: any = {};
    
    if (studentId) {
      whereClause.studentId = studentId;
    }
    
    if (courseId) {
      whereClause.courseId = courseId;
    }
    
    if (type) {
      whereClause.type = type;
    }
    
    const grades = await prisma.grade.findMany({
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
        date: 'desc'
      }
    });
    
    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grades' },
      { status: 500 }
    );
  }
}

// POST /api/grades - Create a new grade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.studentId || !body.courseId || body.value === undefined || !body.type || !body.date) {
      return NextResponse.json(
        { error: 'Student ID, course ID, value, type, and date are required' },
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
    
    // Check if student is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: body.studentId,
          courseId: body.courseId
        }
      }
    });
    
    if (!enrollment) {
      return NextResponse.json(
        { error: 'Student is not enrolled in this course' },
        { status: 400 }
      );
    }
    
    // Validate grade value
    const value = parseFloat(body.value);
    if (isNaN(value) || value < 0 || value > 100) {
      return NextResponse.json(
        { error: 'Grade value must be a number between 0 and 100' },
        { status: 400 }
      );
    }
    
    // Create the grade
    const grade = await prisma.grade.create({
      data: {
        studentId: body.studentId,
        courseId: body.courseId,
        value,
        type: body.type,
        date: new Date(body.date)
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
    
    return NextResponse.json(grade, { status: 201 });
  } catch (error) {
    console.error('Error creating grade:', error);
    return NextResponse.json(
      { error: 'Failed to create grade' },
      { status: 500 }
    );
  }
}
