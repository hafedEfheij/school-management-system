// Base API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User and Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  emergencyContact?: EmergencyContact;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse extends ApiResponse<{
  user: User;
  tokens: AuthTokens;
}> {}

// Student types
export interface Student extends User {
  studentId: string;
  grade: string;
  section?: string;
  enrollmentDate: string;
  graduationDate?: string;
  parentIds: string[];
  guardianId?: string;
  academicRecord?: AcademicRecord;
  medicalInfo?: MedicalInfo;
}

export interface AcademicRecord {
  gpa: number;
  credits: number;
  rank?: number;
  honors?: string[];
  disciplinaryActions?: DisciplinaryAction[];
}

export interface MedicalInfo {
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  emergencyMedicalContact?: EmergencyContact;
}

export interface DisciplinaryAction {
  id: string;
  type: string;
  description: string;
  date: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  resolved: boolean;
}

// Teacher types
export interface Teacher extends User {
  employeeId: string;
  department: string;
  subjects: string[];
  qualifications: string[];
  experience: number;
  hireDate: string;
  salary?: number;
  schedule?: TeacherSchedule[];
}

export interface TeacherSchedule {
  id: string;
  courseId: string;
  courseName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
}

// Course types
export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  duration: number; // in weeks
  prerequisites?: string[];
  teacherId: string;
  teacherName: string;
  department: string;
  grade: string;
  maxStudents: number;
  currentEnrollment: number;
  schedule: CourseSchedule[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseSchedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
}

// Class/Session types
export interface Class {
  id: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  type: 'LECTURE' | 'LAB' | 'SEMINAR' | 'EXAM' | 'FIELD_TRIP';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  attendanceRecorded: boolean;
  notes?: string;
  materials?: ClassMaterial[];
}

export interface ClassMaterial {
  id: string;
  name: string;
  type: 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'LINK' | 'IMAGE';
  url: string;
  size?: number;
  uploadedAt: string;
}

// Attendance types
export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  courseId: string;
  courseName: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  arrivalTime?: string;
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface AttendanceReport {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

// Grade types
export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  assignmentName: string;
  assignmentType: 'HOMEWORK' | 'QUIZ' | 'EXAM' | 'PROJECT' | 'PARTICIPATION';
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade?: string;
  date: string;
  gradedBy: string;
  gradedAt: string;
  feedback?: string;
}

export interface GradeReport {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  grades: Grade[];
  averageScore: number;
  averagePercentage: number;
  letterGrade: string;
  gpa: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

// Assignment types
export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  teacherId: string;
  title: string;
  description: string;
  type: 'HOMEWORK' | 'QUIZ' | 'EXAM' | 'PROJECT' | 'ESSAY';
  maxScore: number;
  dueDate: string;
  assignedDate: string;
  instructions?: string;
  attachments?: AssignmentAttachment[];
  submissions?: AssignmentSubmission[];
  isPublished: boolean;
  allowLateSubmission: boolean;
  latePenalty?: number;
}

export interface AssignmentAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  isLate: boolean;
  content?: string;
  attachments?: AssignmentAttachment[];
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

// Schedule types
export interface Schedule {
  id: string;
  title: string;
  description?: string;
  type: 'CLASS' | 'EXAM' | 'MEETING' | 'EVENT' | 'HOLIDAY';
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  participants?: ScheduleParticipant[];
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  createdBy: string;
  createdAt: string;
}

export interface ScheduleParticipant {
  id: string;
  name: string;
  type: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PARENT';
  isRequired: boolean;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export interface RecurrencePattern {
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;
  daysOfWeek?: string[];
  endDate?: string;
  occurrences?: number;
}

// Notification types
export interface Notification {
  id: string;
  recipientId: string;
  recipientType: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  category: 'ACADEMIC' | 'ATTENDANCE' | 'GRADE' | 'SCHEDULE' | 'SYSTEM' | 'ANNOUNCEMENT';
  isRead: boolean;
  isArchived: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
}

// Report types
export interface ReportRequest {
  type: 'ATTENDANCE' | 'GRADES' | 'STUDENT_PROGRESS' | 'TEACHER_PERFORMANCE' | 'COURSE_ANALYTICS';
  filters: {
    startDate?: string;
    endDate?: string;
    studentIds?: string[];
    teacherIds?: string[];
    courseIds?: string[];
    grades?: string[];
    departments?: string[];
  };
  format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON';
  includeCharts?: boolean;
  includeDetails?: boolean;
}

export interface ReportResponse extends ApiResponse<{
  reportId: string;
  downloadUrl: string;
  expiresAt: string;
}> {}

// Search and filter types
export interface SearchRequest {
  query: string;
  type?: 'STUDENT' | 'TEACHER' | 'COURSE' | 'ALL';
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface SearchResult<T> {
  type: string;
  score: number;
  item: T;
  highlights?: Record<string, string[]>;
}

export interface SearchResponse<T> extends PaginatedResponse<SearchResult<T>> {}

// File upload types
export interface FileUploadRequest {
  file: File;
  category: 'PROFILE_PICTURE' | 'DOCUMENT' | 'ASSIGNMENT' | 'MATERIAL' | 'REPORT';
  metadata?: Record<string, any>;
}

export interface FileUploadResponse extends ApiResponse<{
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}> {}

// Dashboard types
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalClasses: number;
  attendanceRate: number;
  averageGrade: number;
  activeUsers: number;
  recentActivities: DashboardActivity[];
  upcomingEvents: DashboardEvent[];
}

export interface DashboardActivity {
  id: string;
  type: 'USER_LOGIN' | 'GRADE_ADDED' | 'ATTENDANCE_RECORDED' | 'ASSIGNMENT_SUBMITTED' | 'COURSE_CREATED';
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface DashboardEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: 'CLASS' | 'EXAM' | 'MEETING' | 'EVENT' | 'DEADLINE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
