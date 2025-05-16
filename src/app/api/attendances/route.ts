import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/attendances - Get all attendances
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const scheduleId = searchParams.get('scheduleId');
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    
    let whereClause: any = {};
    
    if (studentId) {
      whereClause.studentId = studentId;
    }
    
    if (scheduleId) {
      whereClause.scheduleId = scheduleId;
    }
    
    if (date) {
      whereClause.date = new Date(date);
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    const attendances = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: true,
        schedule: {
          include: {
            course: true,
            teacher: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    return NextResponse.json(attendances);
  } catch (error) {
    console.error('Error fetching attendances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendances' },
      { status: 500 }
    );
  }
}

// POST /api/attendances - Create a new attendance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.studentId || !body.scheduleId || !body.date || !body.status) {
      return NextResponse.json(
        { error: 'Student ID, schedule ID, date, and status are required' },
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
    
    // Check if schedule exists
    const schedule = await prisma.schedule.findUnique({
      where: { id: body.scheduleId }
    });
    
    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
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
    
    // Check if attendance already exists for this student, schedule, and date
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        studentId_scheduleId_date: {
          studentId: body.studentId,
          scheduleId: body.scheduleId,
          date: new Date(body.date)
        }
      }
    });
    
    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance record already exists for this student, schedule, and date' },
        { status: 400 }
      );
    }
    
    // Create the attendance
    const attendance = await prisma.attendance.create({
      data: {
        studentId: body.studentId,
        scheduleId: body.scheduleId,
        date: new Date(body.date),
        status: body.status
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
    
    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error('Error creating attendance:', error);
    return NextResponse.json(
      { error: 'Failed to create attendance' },
      { status: 500 }
    );
  }
}
