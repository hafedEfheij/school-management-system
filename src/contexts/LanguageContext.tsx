'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getNestedValue, formatString } from '@/utils/i18n';

// Define available languages
export type Language = 'ar' | 'en' | 'fr';

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, variables?: Record<string, any>) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  getLocale: () => string;
  isClient: boolean;
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations with nested structure
const translations = {
  ar: {
    app: {
      title: 'نظام إدارة المدرسة',
      name: 'نظام إدارة المدرسة',
      description: 'حل شامل لإدارة الطلاب والمعلمين والدورات والمزيد',
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      signOut: 'تسجيل الخروج',
      dashboard: 'لوحة التحكم',
      students: 'الطلاب',
      teachers: 'المعلمون',
      courses: 'الدورات',
      schedule: 'الجدول',
      attendance: 'الحضور',
      language: 'اللغة',
      english: 'English',
      arabic: 'العربية',
      french: 'Français',
      welcome: 'مرحبًا، {name}!'
    },
    home: {
      title: 'إدارة مدرستك بكفاءة',
      subtitle: 'نظام إدارة شامل للمدارس والمؤسسات التعليمية',
      getStarted: 'ابدأ الآن',
      learnMore: 'اعرف المزيد',
      features: {
        title: 'الميزات الرئيسية',
        studentManagement: {
          title: 'إدارة الطلاب',
          description: 'إدارة معلومات الطلاب والحضور والأداء الأكاديمي بسهولة'
        },
        courseManagement: {
          title: 'إدارة الدورات',
          description: 'إنشاء وإدارة الدورات والواجبات والموارد التعليمية'
        },
        gradeTracking: {
          title: 'تتبع الدرجات',
          description: 'تتبع وتحليل أداء الطلاب وإنشاء تقارير مفصلة'
        }
      },
      footer: {
        allRightsReserved: 'جميع الحقوق محفوظة',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الاستخدام',
        contact: 'اتصل بنا'
      }
    },
    auth: {
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      dontHaveAccount: 'ليس لديك حساب؟',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      signingIn: 'جاري تسجيل الدخول...',
      signingUp: 'جاري إنشاء الحساب...',
      forgotPassword: 'نسيت كلمة المرور؟',
      resetPassword: 'إعادة تعيين كلمة المرور',
      verifyEmail: 'تحقق من بريدك الإلكتروني'
    },
    dashboard: {
      stats: {
        students: 'الطلاب',
        teachers: 'المعلمون',
        courses: 'الدورات',
        classes: 'الفصول'
      },
      recentActivities: 'الأنشطة الأخيرة',
      upcomingEvents: 'الأحداث القادمة',
      quickActions: 'إجراءات سريعة',
      viewAll: 'عرض الكل'
    },
    students: {
      addStudent: 'إضافة طالب',
      searchStudents: 'البحث عن طلاب...',
      name: 'الاسم',
      grade: 'الصف',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      actions: 'الإجراءات',
      gradeLevel: 'الصف',
      deleteConfirm: 'هل أنت متأكد أنك تريد حذف هذا الطالب؟',
      deleteSuccess: 'تم حذف الطالب بنجاح',
      editStudent: 'تعديل بيانات الطالب',
      studentDetails: 'تفاصيل الطالب',
      personalInfo: 'المعلومات الشخصية',
      academicInfo: 'المعلومات الأكاديمية',
      contactInfo: 'معلومات الاتصال',
      dateOfBirth: 'تاريخ الميلاد',
      address: 'العنوان',
      parentInfo: 'معلومات ولي الأمر'
    },
    features: {
      title: 'الميزات الرئيسية',
      studentManagement: 'إدارة الطلاب',
      studentManagement_desc: 'إدارة معلومات الطلاب والحضور والأداء الأكاديمي بسهولة',
      teacherManagement: 'إدارة المعلمين',
      teacherManagement_desc: 'إدارة ملفات المعلمين والجداول وتعيينات الدورات بكفاءة',
      courseManagement: 'إدارة الدورات',
      courseManagement_desc: 'إنشاء وإدارة الدورات والواجبات والموارد التعليمية',
      scheduleManagement: 'إدارة الجداول',
      scheduleManagement_desc: 'تنظيم وتتبع جداول الفصول والأحداث والتقويم الأكاديمي'
    },
    common: {
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      view: 'عرض',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
      loading: 'جاري التحميل...',
      noResults: 'لا توجد نتائج',
      error: 'حدث خطأ',
      success: 'تم بنجاح',
      confirm: 'تأكيد',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      name: 'الاسم',
      first: 'الأول',
      second: 'الثاني',
      third: 'الثالث',
      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح',
      rtlExample: 'هذا مثال على النص المكتوب من اليمين إلى اليسار. يتم عرضه بشكل صحيح في واجهة المستخدم.'
    }
  },
  en: {
    app: {
      title: 'School Management System',
      name: 'School Management System',
      description: 'A comprehensive solution for managing students, teachers, courses, and more',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      dashboard: 'Dashboard',
      students: 'Students',
      teachers: 'Teachers',
      courses: 'Courses',
      schedule: 'Schedule',
      attendance: 'Attendance',
      language: 'Language',
      english: 'English',
      arabic: 'العربية',
      french: 'Français',
      welcome: 'Welcome, {name}!'
    },
    home: {
      title: 'Manage Your School Efficiently',
      subtitle: 'A comprehensive management system for schools and educational institutions',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      features: {
        title: 'Key Features',
        studentManagement: {
          title: 'Student Management',
          description: 'Easily manage student information, attendance, and academic performance'
        },
        courseManagement: {
          title: 'Course Management',
          description: 'Create and manage courses, assignments, and educational resources'
        },
        gradeTracking: {
          title: 'Grade Tracking',
          description: 'Track and analyze student performance and generate detailed reports'
        }
      },
      footer: {
        allRightsReserved: 'All Rights Reserved',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        contact: 'Contact Us'
      }
    },
    auth: {
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      dontHaveAccount: 'Don\'t have an account?',
      alreadyHaveAccount: 'Already have an account?',
      signingIn: 'Signing in...',
      signingUp: 'Signing up...',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      verifyEmail: 'Verify Your Email'
    },
    dashboard: {
      stats: {
        students: 'Students',
        teachers: 'Teachers',
        courses: 'Courses',
        classes: 'Classes'
      },
      recentActivities: 'Recent Activities',
      upcomingEvents: 'Upcoming Events',
      quickActions: 'Quick Actions',
      viewAll: 'View All'
    },
    students: {
      addStudent: 'Add Student',
      searchStudents: 'Search students...',
      name: 'Name',
      grade: 'Grade',
      email: 'Email',
      phone: 'Phone',
      actions: 'Actions',
      gradeLevel: 'Grade',
      deleteConfirm: 'Are you sure you want to delete this student?',
      deleteSuccess: 'Student deleted successfully',
      editStudent: 'Edit Student',
      studentDetails: 'Student Details',
      personalInfo: 'Personal Information',
      academicInfo: 'Academic Information',
      contactInfo: 'Contact Information',
      dateOfBirth: 'Date of Birth',
      address: 'Address',
      parentInfo: 'Parent Information'
    },
    features: {
      title: 'Key Features',
      studentManagement: 'Student Management',
      studentManagement_desc: 'Easily manage student information, attendance, and academic performance',
      teacherManagement: 'Teacher Management',
      teacherManagement_desc: 'Manage teacher profiles, schedules, and course assignments efficiently',
      courseManagement: 'Course Management',
      courseManagement_desc: 'Create and manage courses, assignments, and educational resources',
      scheduleManagement: 'Schedule Management',
      scheduleManagement_desc: 'Organize and track class schedules, events, and academic calendar'
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      loading: 'Loading...',
      noResults: 'No results found',
      error: 'An error occurred',
      success: 'Success',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      name: 'Name',
      first: 'First',
      second: 'Second',
      third: 'Third',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      rtlExample: 'This is an example of left-to-right text. It is displayed correctly in the user interface.'
    }
  },
  fr: {
    app: {
      title: 'Système de Gestion Scolaire',
      name: 'Système de Gestion Scolaire',
      description: 'Une solution complète pour gérer les étudiants, les enseignants, les cours et plus encore',
      signIn: 'Se Connecter',
      signUp: 'S\'inscrire',
      signOut: 'Se Déconnecter',
      dashboard: 'Tableau de Bord',
      students: 'Étudiants',
      teachers: 'Enseignants',
      courses: 'Cours',
      schedule: 'Emploi du Temps',
      attendance: 'Présence',
      language: 'Langue',
      english: 'English',
      arabic: 'العربية',
      french: 'Français',
      welcome: 'Bienvenue, {name}!'
    },
    home: {
      title: 'Gérez Votre École Efficacement',
      subtitle: 'Un système de gestion complet pour les écoles et les établissements d\'enseignement',
      getStarted: 'Commencer',
      learnMore: 'En Savoir Plus',
      features: {
        title: 'Fonctionnalités Clés',
        studentManagement: {
          title: 'Gestion des Étudiants',
          description: 'Gérez facilement les informations des étudiants, la présence et les performances académiques'
        },
        courseManagement: {
          title: 'Gestion des Cours',
          description: 'Créez et gérez des cours, des devoirs et des ressources éducatives'
        },
        gradeTracking: {
          title: 'Suivi des Notes',
          description: 'Suivez et analysez les performances des étudiants et générez des rapports détaillés'
        }
      },
      footer: {
        allRightsReserved: 'Tous Droits Réservés',
        privacy: 'Politique de Confidentialité',
        terms: 'Conditions d\'Utilisation',
        contact: 'Contactez-Nous'
      }
    },
    auth: {
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      dontHaveAccount: 'Vous n\'avez pas de compte?',
      alreadyHaveAccount: 'Vous avez déjà un compte?',
      signingIn: 'Connexion en cours...',
      signingUp: 'Inscription en cours...',
      forgotPassword: 'Mot de passe oublié?',
      resetPassword: 'Réinitialiser le mot de passe',
      verifyEmail: 'Vérifiez votre email'
    },
    dashboard: {
      stats: {
        students: 'Étudiants',
        teachers: 'Enseignants',
        courses: 'Cours',
        classes: 'Classes'
      },
      recentActivities: 'Activités Récentes',
      upcomingEvents: 'Événements à Venir',
      quickActions: 'Actions Rapides',
      viewAll: 'Voir Tout'
    },
    students: {
      addStudent: 'Ajouter un Étudiant',
      searchStudents: 'Rechercher des étudiants...',
      name: 'Nom',
      grade: 'Niveau',
      email: 'Email',
      phone: 'Téléphone',
      actions: 'Actions',
      gradeLevel: 'Niveau',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet étudiant?',
      deleteSuccess: 'Étudiant supprimé avec succès',
      editStudent: 'Modifier l\'Étudiant',
      studentDetails: 'Détails de l\'Étudiant',
      personalInfo: 'Informations Personnelles',
      academicInfo: 'Informations Académiques',
      contactInfo: 'Informations de Contact',
      dateOfBirth: 'Date de Naissance',
      address: 'Adresse',
      parentInfo: 'Informations des Parents'
    },
    features: {
      title: 'Fonctionnalités Clés',
      studentManagement: 'Gestion des Étudiants',
      studentManagement_desc: 'Gérez facilement les informations des étudiants, la présence et les performances académiques',
      teacherManagement: 'Gestion des Enseignants',
      teacherManagement_desc: 'Gérez efficacement les profils des enseignants, les horaires et les affectations de cours',
      courseManagement: 'Gestion des Cours',
      courseManagement_desc: 'Créez et gérez des cours, des devoirs et des ressources éducatives',
      scheduleManagement: 'Gestion des Horaires',
      scheduleManagement_desc: 'Organisez et suivez les horaires de classe, les événements et le calendrier académique'
    },
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      view: 'Voir',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      loading: 'Chargement...',
      noResults: 'Aucun résultat trouvé',
      error: 'Une erreur est survenue',
      success: 'Succès',
      confirm: 'Confirmer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      name: 'Nom',
      first: 'Premier',
      second: 'Deuxième',
      third: 'Troisième',
      darkMode: 'Mode Sombre',
      lightMode: 'Mode Clair',
      rtlExample: 'Ceci est un exemple de texte de gauche à droite. Il est affiché correctement dans l\'interface utilisateur.'
    }
  }
};

// Map languages to locales
const localeMap: Record<Language, string> = {
  ar: 'ar-SA',
  en: 'en-US',
  fr: 'fr-FR'
};

// Provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to English to avoid hydration issues
  const [language, setLanguageState] = useState<Language>('en');
  const [isClient, setIsClient] = useState(false);

  // Set language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }

    // Set the dir attribute on the html element for RTL support
    if (typeof document !== 'undefined') {
      document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';

      // Add or remove RTL class for styling
      if (newLanguage === 'ar') {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }
    }
  };

  // Get translation for a key with variable substitution
  const t = (key: string, variables?: Record<string, any>): string => {
    const translatedText = getNestedValue(translations[language], key, key);
    return variables ? formatString(translatedText, variables) : translatedText;
  };

  // Get current locale
  const getLocale = (): string => {
    return localeMap[language];
  };

  // Format date according to current locale
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return new Intl.DateTimeFormat(getLocale(), options).format(date);
  };

  // Format number according to current locale
  const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(getLocale(), options).format(num);
  };

  // Format currency according to current locale
  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat(getLocale(), {
      style: 'currency',
      currency,
    }).format(amount);
  };

  // Initialize language from localStorage on client side
  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    } else {
      // Default to English
      setLanguage('en');
    }
  }, []);

  const contextValue = {
    language,
    setLanguage,
    t,
    formatDate,
    formatNumber,
    formatCurrency,
    getLocale,
    isClient
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
