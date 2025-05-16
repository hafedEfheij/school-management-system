import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  });
  console.log('Admin user created:', admin.email);
  
  // Create teachers
  const teacher1 = await prisma.teacher.upsert({
    where: { email: 'john.doe@school.com' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@school.com',
      phone: '123-456-7890',
      subject: 'Mathematics'
    }
  });
  
  const teacher2 = await prisma.teacher.upsert({
    where: { email: 'jane.smith@school.com' },
    update: {},
    create: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@school.com',
      phone: '123-456-7891',
      subject: 'Science'
    }
  });
  
  const teacher3 = await prisma.teacher.upsert({
    where: { email: 'robert.johnson@school.com' },
    update: {},
    create: {
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@school.com',
      phone: '123-456-7892',
      subject: 'History'
    }
  });
  
  console.log('Teachers created:', [teacher1, teacher2, teacher3].map(t => t.email).join(', '));
  
  // Create teacher users
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  
  const teacher1User = await prisma.user.upsert({
    where: { email: 'john.doe@school.com' },
    update: {},
    create: {
      email: 'john.doe@school.com',
      name: 'John Doe',
      password: teacherPassword,
      role: 'TEACHER',
      teacherId: teacher1.id
    }
  });
  
  const teacher2User = await prisma.user.upsert({
    where: { email: 'jane.smith@school.com' },
    update: {},
    create: {
      email: 'jane.smith@school.com',
      name: 'Jane Smith',
      password: teacherPassword,
      role: 'TEACHER',
      teacherId: teacher2.id
    }
  });
  
  console.log('Teacher users created:', [teacher1User, teacher2User].map(u => u.email).join(', '));
  
  // Create students
  const students = [];
  
  for (let i = 1; i <= 20; i++) {
    const gradeLevel = Math.floor(Math.random() * 12) + 1; // Random grade 1-12
    const student = await prisma.student.create({
      data: {
        firstName: `Student${i}`,
        lastName: `Last${i}`,
        email: `student${i}@school.com`,
        phone: `123-456-${1000 + i}`,
        gradeLevel
      }
    });
    students.push(student);
  }
  
  console.log(`${students.length} students created`);
  
  // Create courses
  const mathCourse = await prisma.course.create({
    data: {
      name: 'Algebra I',
      description: 'Introduction to algebraic concepts',
      credits: 3,
      teacherId: teacher1.id
    }
  });
  
  const scienceCourse = await prisma.course.create({
    data: {
      name: 'Biology',
      description: 'Study of living organisms',
      credits: 4,
      teacherId: teacher2.id
    }
  });
  
  const historyCourse = await prisma.course.create({
    data: {
      name: 'World History',
      description: 'Overview of world history',
      credits: 3,
      teacherId: teacher3.id
    }
  });
  
  console.log('Courses created:', [mathCourse, scienceCourse, historyCourse].map(c => c.name).join(', '));
  
  // Create schedules
  const mathSchedule = await prisma.schedule.create({
    data: {
      dayOfWeek: 1, // Monday
      startTime: '09:00',
      endTime: '10:30',
      room: 'Room 101',
      courseId: mathCourse.id,
      teacherId: teacher1.id
    }
  });
  
  const scienceSchedule = await prisma.schedule.create({
    data: {
      dayOfWeek: 2, // Tuesday
      startTime: '11:00',
      endTime: '12:30',
      room: 'Room 102',
      courseId: scienceCourse.id,
      teacherId: teacher2.id
    }
  });
  
  const historySchedule = await prisma.schedule.create({
    data: {
      dayOfWeek: 3, // Wednesday
      startTime: '13:00',
      endTime: '14:30',
      room: 'Room 103',
      courseId: historyCourse.id,
      teacherId: teacher3.id
    }
  });
  
  console.log('Schedules created');
  
  // Enroll students in courses
  for (const student of students) {
    // Randomly enroll in 1-3 courses
    const numCourses = Math.floor(Math.random() * 3) + 1;
    const courses = [mathCourse, scienceCourse, historyCourse];
    
    for (let i = 0; i < numCourses; i++) {
      if (i < courses.length) {
        await prisma.enrollment.create({
          data: {
            studentId: student.id,
            courseId: courses[i].id
          }
        });
      }
    }
  }
  
  console.log('Students enrolled in courses');
  
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
