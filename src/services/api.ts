/**
 * API service for making requests to the backend
 */

// Base URL for API requests
const API_BASE_URL = '/api';

// Default headers for API requests
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Get the authentication token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Add authentication token to headers if available
const getHeaders = (): HeadersInit => {
  const headers = { ...defaultHeaders };
  const token = getAuthToken();
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic fetch function with error handling
const fetchAPI = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `API request failed with status ${response.status}`
    );
  }
  
  return response.json();
};

// API methods
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      fetchAPI<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    register: (userData: any) =>
      fetchAPI<any>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
  },
  
  // Students endpoints
  students: {
    getAll: (params?: Record<string, string>) => {
      const queryString = params
        ? `?${new URLSearchParams(params).toString()}`
        : '';
      return fetchAPI<any[]>(`/students${queryString}`);
    },
    
    getById: (id: string) =>
      fetchAPI<any>(`/students/${id}`),
    
    create: (studentData: any) =>
      fetchAPI<any>('/students', {
        method: 'POST',
        body: JSON.stringify(studentData),
      }),
    
    update: (id: string, studentData: any) =>
      fetchAPI<any>(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(studentData),
      }),
    
    delete: (id: string) =>
      fetchAPI<any>(`/students/${id}`, {
        method: 'DELETE',
      }),
  },
  
  // Teachers endpoints
  teachers: {
    getAll: (params?: Record<string, string>) => {
      const queryString = params
        ? `?${new URLSearchParams(params).toString()}`
        : '';
      return fetchAPI<any[]>(`/teachers${queryString}`);
    },
    
    getById: (id: string) =>
      fetchAPI<any>(`/teachers/${id}`),
    
    create: (teacherData: any) =>
      fetchAPI<any>('/teachers', {
        method: 'POST',
        body: JSON.stringify(teacherData),
      }),
    
    update: (id: string, teacherData: any) =>
      fetchAPI<any>(`/teachers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(teacherData),
      }),
    
    delete: (id: string) =>
      fetchAPI<any>(`/teachers/${id}`, {
        method: 'DELETE',
      }),
  },
  
  // Courses endpoints
  courses: {
    getAll: (params?: Record<string, string>) => {
      const queryString = params
        ? `?${new URLSearchParams(params).toString()}`
        : '';
      return fetchAPI<any[]>(`/courses${queryString}`);
    },
    
    getById: (id: string) =>
      fetchAPI<any>(`/courses/${id}`),
    
    create: (courseData: any) =>
      fetchAPI<any>('/courses', {
        method: 'POST',
        body: JSON.stringify(courseData),
      }),
    
    update: (id: string, courseData: any) =>
      fetchAPI<any>(`/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(courseData),
      }),
    
    delete: (id: string) =>
      fetchAPI<any>(`/courses/${id}`, {
        method: 'DELETE',
      }),
  },
  
  // Enrollments endpoints
  enrollments: {
    getAll: (params?: Record<string, string>) => {
      const queryString = params
        ? `?${new URLSearchParams(params).toString()}`
        : '';
      return fetchAPI<any[]>(`/enrollments${queryString}`);
    },
    
    create: (enrollmentData: any) =>
      fetchAPI<any>('/enrollments', {
        method: 'POST',
        body: JSON.stringify(enrollmentData),
      }),
    
    delete: (id: string) =>
      fetchAPI<any>(`/enrollments/${id}`, {
        method: 'DELETE',
      }),
  },
  
  // Schedules endpoints
  schedules: {
    getAll: (params?: Record<string, string>) => {
      const queryString = params
        ? `?${new URLSearchParams(params).toString()}`
        : '';
      return fetchAPI<any[]>(`/schedules${queryString}`);
    },
    
    getById: (id: string) =>
      fetchAPI<any>(`/schedules/${id}`),
    
    create: (scheduleData: any) =>
      fetchAPI<any>('/schedules', {
        method: 'POST',
        body: JSON.stringify(scheduleData),
      }),
    
    update: (id: string, scheduleData: any) =>
      fetchAPI<any>(`/schedules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(scheduleData),
      }),
    
    delete: (id: string) =>
      fetchAPI<any>(`/schedules/${id}`, {
        method: 'DELETE',
      }),
  },
  
  // Attendances endpoints
  attendances: {
    getAll: (params?: Record<string, string>) => {
      const queryString = params
        ? `?${new URLSearchParams(params).toString()}`
        : '';
      return fetchAPI<any[]>(`/attendances${queryString}`);
    },
    
    create: (attendanceData: any) =>
      fetchAPI<any>('/attendances', {
        method: 'POST',
        body: JSON.stringify(attendanceData),
      }),
    
    update: (id: string, attendanceData: any) =>
      fetchAPI<any>(`/attendances/${id}`, {
        method: 'PUT',
        body: JSON.stringify(attendanceData),
      }),
    
    delete: (id: string) =>
      fetchAPI<any>(`/attendances/${id}`, {
        method: 'DELETE',
      }),
  },
  
  // Grades endpoints
  grades: {
    getAll: (params?: Record<string, string>) => {
      const queryString = params
        ? `?${new URLSearchParams(params).toString()}`
        : '';
      return fetchAPI<any[]>(`/grades${queryString}`);
    },
    
    create: (gradeData: any) =>
      fetchAPI<any>('/grades', {
        method: 'POST',
        body: JSON.stringify(gradeData),
      }),
    
    update: (id: string, gradeData: any) =>
      fetchAPI<any>(`/grades/${id}`, {
        method: 'PUT',
        body: JSON.stringify(gradeData),
      }),
    
    delete: (id: string) =>
      fetchAPI<any>(`/grades/${id}`, {
        method: 'DELETE',
      }),
  },
};
