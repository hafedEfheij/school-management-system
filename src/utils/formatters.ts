import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

// Locale mapping
const localeMap = {
  en: enUS,
  ar: ar,
};

// Date formatting utilities
export const DateFormatters = {
  // Format date with locale support
  formatDate: (date: Date | string, formatStr: string = 'PPP', locale: string = 'en') => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Invalid Date';
      
      return format(dateObj, formatStr, {
        locale: localeMap[locale as keyof typeof localeMap] || enUS,
      });
    } catch (error) {
      return 'Invalid Date';
    }
  },
  
  // Format relative time
  formatRelativeTime: (date: Date | string, locale: string = 'en') => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Invalid Date';
      
      return formatDistanceToNow(dateObj, {
        addSuffix: true,
        locale: localeMap[locale as keyof typeof localeMap] || enUS,
      });
    } catch (error) {
      return 'Invalid Date';
    }
  },
  
  // Format time only
  formatTime: (date: Date | string, format24h: boolean = true, locale: string = 'en') => {
    const formatStr = format24h ? 'HH:mm' : 'h:mm a';
    return DateFormatters.formatDate(date, formatStr, locale);
  },
  
  // Format date for input fields
  formatDateForInput: (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return '';
      
      return format(dateObj, 'yyyy-MM-dd');
    } catch (error) {
      return '';
    }
  },
  
  // Format datetime for input fields
  formatDateTimeForInput: (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return '';
      
      return format(dateObj, "yyyy-MM-dd'T'HH:mm");
    } catch (error) {
      return '';
    }
  },
};

// Number formatting utilities
export const NumberFormatters = {
  // Format currency
  formatCurrency: (amount: number, currency: string = 'USD', locale: string = 'en-US') => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(amount);
    } catch (error) {
      return `${currency} ${amount.toFixed(2)}`;
    }
  },
  
  // Format percentage
  formatPercentage: (value: number, decimals: number = 1, locale: string = 'en-US') => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value / 100);
    } catch (error) {
      return `${value.toFixed(decimals)}%`;
    }
  },
  
  // Format number with thousands separator
  formatNumber: (value: number, decimals?: number, locale: string = 'en-US') => {
    try {
      const options: Intl.NumberFormatOptions = {};
      if (decimals !== undefined) {
        options.minimumFractionDigits = decimals;
        options.maximumFractionDigits = decimals;
      }
      
      return new Intl.NumberFormat(locale, options).format(value);
    } catch (error) {
      return decimals !== undefined ? value.toFixed(decimals) : value.toString();
    }
  },
  
  // Format file size
  formatFileSize: (bytes: number, decimals: number = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  },
  
  // Format duration in seconds to human readable
  formatDuration: (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  },
  
  // Format grade/score
  formatGrade: (score: number, maxScore: number, showPercentage: boolean = true) => {
    const percentage = (score / maxScore) * 100;
    const baseFormat = `${score}/${maxScore}`;
    
    if (showPercentage) {
      return `${baseFormat} (${percentage.toFixed(1)}%)`;
    }
    
    return baseFormat;
  },
};

// Text formatting utilities
export const TextFormatters = {
  // Capitalize first letter
  capitalize: (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },
  
  // Title case
  titleCase: (text: string) => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },
  
  // Truncate text
  truncate: (text: string, maxLength: number, suffix: string = '...') => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - suffix.length) + suffix;
  },
  
  // Format phone number
  formatPhoneNumber: (phone: string, format: 'international' | 'national' = 'national') => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    if (format === 'international') {
      // Format as +1 (234) 567-8900
      if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      } else if (cleaned.length === 10) {
        return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
    } else {
      // Format as (234) 567-8900
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
    }
    
    return phone; // Return original if can't format
  },
  
  // Format student ID
  formatStudentId: (id: string, prefix: string = 'STU') => {
    const cleaned = id.replace(/\D/g, '');
    return `${prefix}${cleaned.padStart(6, '0')}`;
  },
  
  // Format employee ID
  formatEmployeeId: (id: string, prefix: string = 'EMP') => {
    const cleaned = id.replace(/\D/g, '');
    return `${prefix}${cleaned.padStart(4, '0')}`;
  },
  
  // Extract initials
  getInitials: (name: string, maxInitials: number = 2) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, maxInitials)
      .join('');
  },
  
  // Format address
  formatAddress: (address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }) => {
    const parts = [
      address.street,
      address.city,
      address.state && address.zipCode ? `${address.state} ${address.zipCode}` : address.state || address.zipCode,
      address.country,
    ].filter(Boolean);
    
    return parts.join(', ');
  },
};

// School-specific formatters
export const SchoolFormatters = {
  // Format grade level
  formatGradeLevel: (grade: string | number) => {
    const gradeNum = typeof grade === 'string' ? parseInt(grade) : grade;
    
    if (gradeNum >= 1 && gradeNum <= 12) {
      return `Grade ${gradeNum}`;
    } else if (gradeNum === 0) {
      return 'Kindergarten';
    } else if (gradeNum < 0) {
      return `Pre-K ${Math.abs(gradeNum)}`;
    }
    
    return grade.toString();
  },
  
  // Format class schedule
  formatClassSchedule: (schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room?: string;
  }) => {
    const day = TextFormatters.capitalize(schedule.dayOfWeek);
    const timeRange = `${schedule.startTime} - ${schedule.endTime}`;
    const room = schedule.room ? ` (Room ${schedule.room})` : '';
    
    return `${day} ${timeRange}${room}`;
  },
  
  // Format attendance status
  formatAttendanceStatus: (status: string) => {
    const statusMap: Record<string, string> = {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      excused: 'Excused',
    };
    
    return statusMap[status.toLowerCase()] || TextFormatters.capitalize(status);
  },
  
  // Format semester
  formatSemester: (semester: string, year: number) => {
    const semesterMap: Record<string, string> = {
      fall: 'Fall',
      spring: 'Spring',
      summer: 'Summer',
      winter: 'Winter',
    };
    
    const formattedSemester = semesterMap[semester.toLowerCase()] || TextFormatters.capitalize(semester);
    return `${formattedSemester} ${year}`;
  },
  
  // Format course code
  formatCourseCode: (department: string, number: string, section?: string) => {
    const code = `${department.toUpperCase()}${number}`;
    return section ? `${code}-${section}` : code;
  },
  
  // Format GPA
  formatGPA: (gpa: number, scale: number = 4.0) => {
    return `${gpa.toFixed(2)}/${scale.toFixed(1)}`;
  },
  
  // Format academic year
  formatAcademicYear: (startYear: number) => {
    return `${startYear}-${(startYear + 1).toString().slice(-2)}`;
  },
};

// Utility functions
export const FormatUtils = {
  // Check if value needs formatting
  needsFormatting: (value: any) => {
    return value !== null && value !== undefined && value !== '';
  },
  
  // Safe format - returns fallback if formatting fails
  safeFormat: <T>(
    value: any,
    formatter: (value: any) => T,
    fallback: T
  ): T => {
    try {
      if (!FormatUtils.needsFormatting(value)) return fallback;
      return formatter(value);
    } catch (error) {
      console.warn('Formatting error:', error);
      return fallback;
    }
  },
  
  // Format with locale fallback
  formatWithLocale: (
    value: any,
    formatter: (value: any, locale: string) => string,
    locale: string = 'en',
    fallback: string = ''
  ) => {
    return FormatUtils.safeFormat(
      value,
      (val) => formatter(val, locale),
      fallback
    );
  },
};
