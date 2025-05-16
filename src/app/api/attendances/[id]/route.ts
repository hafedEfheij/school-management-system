import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/attendances/[id] - Get an attendance by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attendance = await prisma.attendance.findUnique({
      where: { id: params.id },
      include: {
        student: true,
        schedule: {
          include: {
            course: true,
            teacher: true
          }
        }
      }
    });
    
    if (!attendance) {
      return NextResponse.json(
        { error: 'Attendance not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}

// PUT /api/attendances/[id] - Update an attendance
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }
    
    // Check if attendance exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id: params.id }
    });
    
    if (!existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance not found' },
        { status: 404 }
      );
    }
    
    // Validate status
    const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Status must be one of: PRESENT, ABSENT, LATE, EXCUSED' },
        { status: 400 }
      );
    }
    
    // Update the attendance
    const updatedAttendance = await prisma.attendance.update({
      where: { id: params.id },
      data: {
        status: body.status,
        date: body.date ? new Date(body.date) : undefined
      },
      include: {
        student: true,
        schedule: {
          include: {
            course: true,
            teacher: true
          }
        }
      }
    });
    
    return NextResponse.json(updatedAttendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json(
      { error: 'Failed to update attendance' },
      { status: 500 }
    );
  }
}

// DELETE /api/attendances/[id] - Delete an attendance
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if attendance exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: { id: params.id }
    });
    
    if (!existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance not found' },
        { status: 404 }
      );
    }
    
    // Delete the attendance
    await prisma.attendance.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return NextResponse.json(
      { error: 'Failed to delete attendance' },
      { status: 500 }
    );
  }
}
