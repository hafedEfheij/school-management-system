import * as z from 'zod';

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
};

// Custom validation messages
export const ValidationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  strongPassword: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character',
  minLength: (min: number) => `Must be at least ${min} characters long`,
  maxLength: (max: number) => `Must be no more than ${max} characters long`,
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must be no more than ${max}`,
  url: 'Please enter a valid URL',
  alphanumeric: 'Only letters and numbers are allowed',
  numeric: 'Only numbers are allowed',
};

// Common Zod schemas
export const CommonSchemas = {
  email: z.string()
    .min(1, ValidationMessages.required)
    .email(ValidationMessages.email),
    
  password: z.string()
    .min(8, ValidationMessages.minLength(8))
    .regex(ValidationPatterns.strongPassword, ValidationMessages.strongPassword),
    
  phone: z.string()
    .min(1, ValidationMessages.required)
    .regex(ValidationPatterns.phone, ValidationMessages.phone),
    
  url: z.string()
    .url(ValidationMessages.url),
    
  name: z.string()
    .min(1, ValidationMessages.required)
    .min(2, ValidationMessages.minLength(2))
    .max(50, ValidationMessages.maxLength(50)),
    
  username: z.string()
    .min(1, ValidationMessages.required)
    .min(3, ValidationMessages.minLength(3))
    .max(20, ValidationMessages.maxLength(20))
    .regex(ValidationPatterns.alphanumeric, ValidationMessages.alphanumeric),
    
  age: z.number()
    .min(1, ValidationMessages.min(1))
    .max(120, ValidationMessages.max(120)),
    
  grade: z.string()
    .min(1, ValidationMessages.required),
    
  studentId: z.string()
    .min(1, ValidationMessages.required)
    .regex(ValidationPatterns.alphanumeric, ValidationMessages.alphanumeric),
};

// School-specific validation schemas
export const SchoolSchemas = {
  student: z.object({
    firstName: CommonSchemas.name,
    lastName: CommonSchemas.name,
    email: CommonSchemas.email,
    phone: CommonSchemas.phone.optional(),
    dateOfBirth: z.string().min(1, ValidationMessages.required),
    grade: CommonSchemas.grade,
    studentId: CommonSchemas.studentId,
    address: z.string().min(1, ValidationMessages.required),
    parentName: CommonSchemas.name,
    parentPhone: CommonSchemas.phone,
    parentEmail: CommonSchemas.email,
  }),
  
  teacher: z.object({
    firstName: CommonSchemas.name,
    lastName: CommonSchemas.name,
    email: CommonSchemas.email,
    phone: CommonSchemas.phone,
    employeeId: z.string().min(1, ValidationMessages.required),
    department: z.string().min(1, ValidationMessages.required),
    subjects: z.array(z.string()).min(1, 'At least one subject is required'),
    qualifications: z.string().min(1, ValidationMessages.required),
    experience: z.number().min(0, ValidationMessages.min(0)),
  }),
  
  course: z.object({
    name: z.string().min(1, ValidationMessages.required),
    code: z.string().min(1, ValidationMessages.required),
    description: z.string().min(1, ValidationMessages.required),
    credits: z.number().min(1, ValidationMessages.min(1)),
    duration: z.number().min(1, ValidationMessages.min(1)),
    prerequisites: z.array(z.string()).optional(),
    teacherId: z.string().min(1, ValidationMessages.required),
  }),
  
  class: z.object({
    name: z.string().min(1, ValidationMessages.required),
    courseId: z.string().min(1, ValidationMessages.required),
    teacherId: z.string().min(1, ValidationMessages.required),
    schedule: z.object({
      dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
      startTime: z.string().min(1, ValidationMessages.required),
      endTime: z.string().min(1, ValidationMessages.required),
    }),
    room: z.string().min(1, ValidationMessages.required),
    capacity: z.number().min(1, ValidationMessages.min(1)),
  }),
  
  attendance: z.object({
    studentId: z.string().min(1, ValidationMessages.required),
    classId: z.string().min(1, ValidationMessages.required),
    date: z.string().min(1, ValidationMessages.required),
    status: z.enum(['present', 'absent', 'late', 'excused']),
    notes: z.string().optional(),
  }),
  
  grade: z.object({
    studentId: z.string().min(1, ValidationMessages.required),
    courseId: z.string().min(1, ValidationMessages.required),
    assignmentName: z.string().min(1, ValidationMessages.required),
    score: z.number().min(0, ValidationMessages.min(0)).max(100, ValidationMessages.max(100)),
    maxScore: z.number().min(1, ValidationMessages.min(1)),
    date: z.string().min(1, ValidationMessages.required),
    type: z.enum(['assignment', 'quiz', 'exam', 'project', 'participation']),
  }),
};

// Validation helper functions
export const ValidationHelpers = {
  // Check if email is from allowed domains
  isAllowedEmailDomain: (email: string, allowedDomains: string[]) => {
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  },
  
  // Check if password meets complexity requirements
  checkPasswordStrength: (password: string) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    return {
      ...checks,
      score,
      strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong',
    };
  },
  
  // Validate file upload
  validateFile: (file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  }) => {
    const errors: string[] = [];
    
    if (options.maxSize && file.size > options.maxSize) {
      errors.push(`File size must be less than ${options.maxSize / 1024 / 1024}MB`);
    }
    
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }
    
    if (options.allowedExtensions) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !options.allowedExtensions.includes(extension)) {
        errors.push(`File extension .${extension} is not allowed`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
  
  // Validate date range
  validateDateRange: (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return {
        isValid: false,
        error: 'End date must be after start date',
      };
    }
    
    return { isValid: true };
  },
  
  // Validate time range
  validateTimeRange: (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    
    if (start >= end) {
      return {
        isValid: false,
        error: 'End time must be after start time',
      };
    }
    
    return { isValid: true };
  },
  
  // Sanitize input
  sanitizeInput: (input: string) => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  },
};

// Form validation hook helper
export const createFormValidator = <T>(schema: z.ZodSchema<T>) => {
  return {
    validate: (data: unknown) => {
      try {
        const result = schema.parse(data);
        return { success: true, data: result, errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const path = err.path.join('.');
            errors[path] = err.message;
          });
          return { success: false, data: null, errors };
        }
        return { success: false, data: null, errors: { general: 'Validation failed' } };
      }
    },
    
    validateField: (fieldName: string, value: unknown) => {
      try {
        const fieldSchema = schema.shape[fieldName as keyof typeof schema.shape];
        if (fieldSchema) {
          fieldSchema.parse(value);
          return { isValid: true, error: null };
        }
        return { isValid: true, error: null };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { isValid: false, error: error.errors[0]?.message || 'Invalid value' };
        }
        return { isValid: false, error: 'Validation failed' };
      }
    },
  };
};
