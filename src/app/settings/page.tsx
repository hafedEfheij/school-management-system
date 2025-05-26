'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotification } from '@/contexts/NotificationContext';
import SafeButton from '@/components/ui/safe-button';
import SafeInput from '@/components/ui/safe-input';
import SafeSelect from '@/components/ui/safe-select';
import SafeToggle from '@/components/ui/safe-toggle';
import SafeTabs from '@/components/ui/safe-tabs';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Mail, 
  Globe,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2
} from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

// Profile Settings Component
function ProfileSettings() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    department: '',
    position: user?.role || '',
    bio: '',
  });

  const handleSave = () => {
    addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SafeInput
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            placeholder="Enter first name"
          />
          <SafeInput
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            placeholder="Enter last name"
          />
          <SafeInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email address"
          />
          <SafeInput
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Enter phone number"
          />
          <SafeSelect
            label="Department"
            value={formData.department}
            onChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
            options={[
              { value: 'administration', label: 'Administration' },
              { value: 'mathematics', label: 'Mathematics' },
              { value: 'science', label: 'Science' },
              { value: 'english', label: 'English' },
              { value: 'history', label: 'History' },
              { value: 'art', label: 'Art' },
            ]}
            placeholder="Select department"
          />
          <SafeInput
            label="Position"
            value={formData.position}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            placeholder="Enter position"
          />
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <SafeButton onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </SafeButton>
      </div>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings() {
  const { addNotification } = useNotification();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    attendanceAlerts: true,
    gradeUpdates: true,
    systemUpdates: false,
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = () => {
    addNotification({
      type: 'success',
      title: 'Notifications Updated',
      message: 'Your notification preferences have been saved.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
            </div>
            <SafeToggle
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive browser push notifications</p>
            </div>
            <SafeToggle
              checked={settings.pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">SMS Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via SMS</p>
            </div>
            <SafeToggle
              checked={settings.smsNotifications}
              onChange={() => handleToggle('smsNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Weekly Reports</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly summary reports</p>
            </div>
            <SafeToggle
              checked={settings.weeklyReports}
              onChange={() => handleToggle('weeklyReports')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Attendance Alerts</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about attendance issues</p>
            </div>
            <SafeToggle
              checked={settings.attendanceAlerts}
              onChange={() => handleToggle('attendanceAlerts')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Grade Updates</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Notifications when grades are updated</p>
            </div>
            <SafeToggle
              checked={settings.gradeUpdates}
              onChange={() => handleToggle('gradeUpdates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">System Updates</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Notifications about system maintenance</p>
            </div>
            <SafeToggle
              checked={settings.systemUpdates}
              onChange={() => handleToggle('systemUpdates')}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <SafeButton onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </SafeButton>
      </div>
    </div>
  );
}

// Security Settings Component
function SecuritySettings() {
  const { addNotification } = useNotification();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      addNotification({
        type: 'error',
        title: 'Password Mismatch',
        message: 'New passwords do not match.',
      });
      return;
    }
    
    addNotification({
      type: 'success',
      title: 'Password Updated',
      message: 'Your password has been successfully changed.',
    });
    
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <SafeInput
            label="Current Password"
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
            placeholder="Enter current password"
          />
          <SafeInput
            label="New Password"
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
            placeholder="Enter new password"
          />
          <SafeInput
            label="Confirm New Password"
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
            placeholder="Confirm new password"
          />
        </div>
        <div className="mt-4">
          <SafeButton onClick={handlePasswordChange} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Shield className="h-4 w-4 mr-2" />
            Update Password
          </SafeButton>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Enable 2FA</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
          </div>
          <SafeToggle checked={false} onChange={() => {}} />
        </div>
      </div>
    </div>
  );
}

// System Settings Component
function SystemSettings() {
  const { addNotification } = useNotification();
  
  const handleBackup = () => {
    addNotification({
      type: 'info',
      title: 'Backup Started',
      message: 'System backup has been initiated.',
    });
  };

  const handleRestore = () => {
    addNotification({
      type: 'warning',
      title: 'Restore Initiated',
      message: 'System restore process has started.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Backup Data</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Create a backup of all system data
            </p>
            <SafeButton onClick={handleBackup} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Create Backup
            </SafeButton>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Restore Data</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Restore system from a backup file
            </p>
            <SafeButton onClick={handleRestore} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Restore Backup
            </SafeButton>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Maintenance</h3>
        <div className="space-y-4">
          <SafeButton variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Cache
          </SafeButton>
          
          <SafeButton variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Logs
          </SafeButton>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profile',
      icon: User,
      component: ProfileSettings,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      component: NotificationSettings,
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      component: SecuritySettings,
    },
    {
      id: 'system',
      title: 'System',
      icon: Database,
      component: SystemSettings,
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <SafeTabs
          tabs={settingsSections.map(section => ({
            id: section.id,
            label: section.title,
            icon: section.icon,
            content: <section.component />,
          }))}
          defaultTab="profile"
          className="bg-white dark:bg-gray-800 rounded-lg shadow"
        />
      </div>
    </div>
  );
}
