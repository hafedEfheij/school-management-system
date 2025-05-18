# School Management System Database Schema

## Tables

### Users
- id (uuid, primary key)
- email (string, unique)
- password (string, hashed)
- role (enum: admin, teacher, student, parent)
- created_at (timestamp)
- updated_at (timestamp)

### Students
- id (uuid, primary key)
- user_id (uuid, foreign key to users.id)
- first_name (string)
- last_name (string)
- date_of_birth (date)
- grade_level (integer)
- address (string)
- phone (string)
- parent_id (uuid, foreign key to parents.id)
- created_at (timestamp)
- updated_at (timestamp)

### Teachers
- id (uuid, primary key)
- user_id (uuid, foreign key to users.id)
- first_name (string)
- last_name (string)
- subject_specialty (string)
- phone (string)
- created_at (timestamp)
- updated_at (timestamp)

### Parents
- id (uuid, primary key)
- user_id (uuid, foreign key to users.id)
- first_name (string)
- last_name (string)
- phone (string)
- address (string)
- created_at (timestamp)
- updated_at (timestamp)

### Courses
- id (uuid, primary key)
- name (string)
- description (text)
- grade_level (integer)
- teacher_id (uuid, foreign key to teachers.id)
- created_at (timestamp)
- updated_at (timestamp)

### Enrollments
- id (uuid, primary key)
- student_id (uuid, foreign key to students.id)
- course_id (uuid, foreign key to courses.id)
- enrollment_date (date)
- created_at (timestamp)
- updated_at (timestamp)

### Attendance
- id (uuid, primary key)
- student_id (uuid, foreign key to students.id)
- course_id (uuid, foreign key to courses.id)
- date (date)
- status (enum: present, absent, late)
- created_at (timestamp)
- updated_at (timestamp)

### Grades
- id (uuid, primary key)
- student_id (uuid, foreign key to students.id)
- course_id (uuid, foreign key to courses.id)
- assignment_name (string)
- score (float)
- max_score (float)
- date (date)
- created_at (timestamp)
- updated_at (timestamp)

### Schedules
- id (uuid, primary key)
- course_id (uuid, foreign key to courses.id)
- day_of_week (enum: monday, tuesday, wednesday, thursday, friday)
- start_time (time)
- end_time (time)
- room (string)
- created_at (timestamp)
- updated_at (timestamp)
