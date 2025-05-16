import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/courses - Get all courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const search = searchParams.get('search');
    
    let whereClause: any = {};
    
    if (teacherId) {
      whereClause.teacherId = teacherId;
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    const courses = await prisma.course.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
      include: {
        teacher: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.teacherId) {
      return NextResponse.json(
        { error: 'Course name and teacher ID are required' },
        { status: 400 }
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
    
    // Create the course
    const course = await prisma.course.create({
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
    
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
