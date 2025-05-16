import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/teachers/[id] - Get a teacher by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: params.id },
      include: {
        courses: true,
        schedules: {
          include: {
            course: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      }
    });
    
    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teacher' },
      { status: 500 }
    );
  }
}

// PUT /api/teachers/[id] - Update a teacher
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }
    
    // Check if teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id: params.id }
    });
    
    if (!existingTeacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    // Update the teacher
    const updatedTeacher = await prisma.teacher.update({
      where: { id: params.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        subject: body.subject
      }
    });
    
    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    return NextResponse.json(
      { error: 'Failed to update teacher' },
      { status: 500 }
    );
  }
}

// DELETE /api/teachers/[id] - Delete a teacher
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id: params.id },
      include: {
        courses: true,
        user: true
      }
    });
    
    if (!existingTeacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    // Check if teacher has courses
    if (existingTeacher.courses.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete teacher with assigned courses' },
        { status: 400 }
      );
    }
    
    // Delete the teacher
    await prisma.teacher.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json(
      { error: 'Failed to delete teacher' },
      { status: 500 }
    );
  }
}
