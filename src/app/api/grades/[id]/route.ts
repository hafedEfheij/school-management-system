import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/grades/[id] - Get a grade by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const grade = await prisma.grade.findUnique({
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
    
    if (!grade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(grade);
  } catch (error) {
    console.error('Error fetching grade:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grade' },
      { status: 500 }
    );
  }
}

// PUT /api/grades/[id] - Update a grade
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Check if grade exists
    const existingGrade = await prisma.grade.findUnique({
      where: { id: params.id }
    });
    
    if (!existingGrade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      );
    }
    
    // Validate grade value if provided
    let value;
    if (body.value !== undefined) {
      value = parseFloat(body.value);
      if (isNaN(value) || value < 0 || value > 100) {
        return NextResponse.json(
          { error: 'Grade value must be a number between 0 and 100' },
          { status: 400 }
        );
      }
    }
    
    // Update the grade
    const updatedGrade = await prisma.grade.update({
      where: { id: params.id },
      data: {
        value: value !== undefined ? value : undefined,
        type: body.type,
        date: body.date ? new Date(body.date) : undefined
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
    
    return NextResponse.json(updatedGrade);
  } catch (error) {
    console.error('Error updating grade:', error);
    return NextResponse.json(
      { error: 'Failed to update grade' },
      { status: 500 }
    );
  }
}

// DELETE /api/grades/[id] - Delete a grade
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if grade exists
    const existingGrade = await prisma.grade.findUnique({
      where: { id: params.id }
    });
    
    if (!existingGrade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      );
    }
    
    // Delete the grade
    await prisma.grade.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Error deleting grade:', error);
    return NextResponse.json(
      { error: 'Failed to delete grade' },
      { status: 500 }
    );
  }
}
