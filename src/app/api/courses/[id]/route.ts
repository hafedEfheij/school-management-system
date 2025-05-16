import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/courses/[id] - Get a course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        teacher: true,
        enrollments: {
          include: {
            student: true
          }
        },
        schedules: true,
        grades: {
          include: {
            student: true
          }
        }
      }
    });
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Update a course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.teacherId) {
      return NextResponse.json(
        { error: 'Course name and teacher ID are required' },
        { status: 400 }
      );
    }
    
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: params.id }
    });
    
    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Check if teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: body.teacherId }
    });
    
    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    // Update the course
    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        credits: body.credits ? parseInt(body.credits) : 1,
        teacherId: body.teacherId
      },
      include: {
        teacher: true
      }
    });
    
    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete a course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        enrollments: true,
        schedules: true,
        grades: true
      }
    });
    
    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Delete the course
    await prisma.course.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
