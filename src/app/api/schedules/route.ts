import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/schedules - Get all schedules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const courseId = searchParams.get('courseId');
    const dayOfWeek = searchParams.get('dayOfWeek');
    
    let whereClause: any = {};
    
    if (teacherId) {
      whereClause.teacherId = teacherId;
    }
    
    if (courseId) {
      whereClause.courseId = courseId;
    }
    
    if (dayOfWeek) {
      whereClause.dayOfWeek = parseInt(dayOfWeek);
    }
    
    const schedules = await prisma.schedule.findMany({
      where: whereClause,
      include: {
        teacher: true,
        course: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
    
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}

// POST /api/schedules - Create a new schedule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.courseId || !body.teacherId || !body.dayOfWeek || !body.startTime || !body.endTime) {
      return NextResponse.json(
        { error: 'Course ID, teacher ID, day of week, start time, and end time are required' },
        { status: 400 }
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
    
    // Create the schedule
    const schedule = await prisma.schedule.create({
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
    
    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    );
  }
}
