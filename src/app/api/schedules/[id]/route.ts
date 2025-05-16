import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/schedules/[id] - Get a schedule by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id: params.id },
      include: {
        teacher: true,
        course: true,
        attendances: {
          include: {
            student: true
          }
        }
      }
    });
    
    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

// PUT /api/schedules/[id] - Update a schedule
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.courseId || !body.teacherId || !body.dayOfWeek || !body.startTime || !body.endTime) {
      return NextResponse.json(
        { error: 'Course ID, teacher ID, day of week, start time, and end time are required' },
        { status: 400 }
      );
    }
    
    // Check if schedule exists
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id: params.id }
    });
    
    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
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
    
    // Validate day of week (0-6, where 0 is Sunday)
    const dayOfWeek = parseInt(body.dayOfWeek);
    if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json(
        { error: 'Day of week must be a number between 0 and 6' },
        { status: 400 }
      );
    }
    
    // Validate time format (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(body.startTime) || !timeRegex.test(body.endTime)) {
      return NextResponse.json(
        { error: 'Start time and end time must be in HH:MM format' },
        { status: 400 }
      );
    }
    
    // Check if end time is after start time
    const [startHour, startMinute] = body.startTime.split(':').map(Number);
    const [endHour, endMinute] = body.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    if (endMinutes <= startMinutes) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      );
    }
    
    // Update the schedule
    const updatedSchedule = await prisma.schedule.update({
      where: { id: params.id },
      data: {
        dayOfWeek,
        startTime: body.startTime,
        endTime: body.endTime,
        room: body.room,
        courseId: body.courseId,
        teacherId: body.teacherId
      },
      include: {
        teacher: true,
        course: true
      }
    });
    
    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

// DELETE /api/schedules/[id] - Delete a schedule
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if schedule exists
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id: params.id },
      include: {
        attendances: true
      }
    });
    
    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }
    
    // Delete the schedule
    await prisma.schedule.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}
