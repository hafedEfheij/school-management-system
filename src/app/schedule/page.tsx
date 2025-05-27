'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotification } from '@/contexts/NotificationContext';
import SafeButton from '@/components/ui/safe-button';
import SafeModal from '@/components/ui/safe-modal';
import SafeSelect from '@/components/ui/safe-select';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Eye
} from 'lucide-react';

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'class' | 'exam' | 'meeting' | 'event' | 'holiday';
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  teacher?: string;
  course?: string;
  participants?: string[];
  description?: string;
  color: string;
}

const mockEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Algebra I - Class',
    type: 'class',
    startTime: '09:00',
    endTime: '10:30',
    date: '2024-01-15',
    location: 'Room 101',
    teacher: 'Dr. Sarah Johnson',
    course: 'MATH101',
    participants: ['STU001', 'STU002', 'STU003'],
    color: 'bg-blue-500',
  },
  {
    id: '2',
    title: 'Physics II - Lab',
    type: 'class',
    startTime: '10:00',
    endTime: '11:30',
    date: '2024-01-15',
    location: 'Lab 201',
    teacher: 'Mr. David Wilson',
    course: 'PHYS201',
    participants: ['STU001', 'STU004'],
    color: 'bg-green-500',
  },
  {
    id: '3',
    title: 'Midterm Exam - Mathematics',
    type: 'exam',
    startTime: '14:00',
    endTime: '16:00',
    date: '2024-01-15',
    location: 'Exam Hall A',
    teacher: 'Dr. Sarah Johnson',
    course: 'MATH101',
    color: 'bg-red-500',
  },
  {
    id: '4',
    title: 'Faculty Meeting',
    type: 'meeting',
    startTime: '15:00',
    endTime: '16:30',
    date: '2024-01-16',
    location: 'Conference Room',
    participants: ['All Faculty'],
    description: 'Monthly faculty meeting to discuss curriculum updates',
    color: 'bg-purple-500',
  },
  {
    id: '5',
    title: 'Science Fair',
    type: 'event',
    startTime: '09:00',
    endTime: '17:00',
    date: '2024-01-17',
    location: 'Main Auditorium',
    description: 'Annual science fair showcasing student projects',
    color: 'bg-yellow-500',
  },
];

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8; // Start from 8 AM
  return `${hour.toString().padStart(2, '0')}:00`;
});

export default function SchedulePage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { addNotification } = useNotification();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'class', label: 'Classes' },
    { value: 'exam', label: 'Exams' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'event', label: 'Events' },
    { value: 'holiday', label: 'Holidays' },
  ];

  const filteredEvents = mockEvents.filter(event => 
    filterType === 'all' || event.type === filterType
  );

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => event.date === dateStr);
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    setShowAddModal(true);
  };

  const handleEditEvent = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setShowAddModal(true);
  };

  const handleDeleteEvent = (event: ScheduleEvent) => {
    addNotification({
      type: 'warning',
      title: 'Delete Event',
      message: `Are you sure you want to delete "${event.title}"?`,
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'class': return <Users className="h-4 w-4" />;
      case 'exam': return <Edit className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'holiday': return <Calendar className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to access this page.</p>
      </div>
    );
  }

  const weekDates = getWeekDates(currentDate);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Schedule Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage classes, exams, meetings, and events
            </p>
          </div>
          <div className="flex space-x-3">
            <SafeButton
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </SafeButton>
            <SafeButton
              onClick={handleAddEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </SafeButton>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SafeButton
                  onClick={handlePrevWeek}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </SafeButton>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white min-w-48 text-center">
                  {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
                </h2>
                <SafeButton
                  onClick={handleNextWeek}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </SafeButton>
              </div>
              
              <SafeButton
                onClick={() => setCurrentDate(new Date())}
                variant="outline"
                size="sm"
              >
                Today
              </SafeButton>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <SafeSelect
                  value={filterType}
                  onChange={setFilterType}
                  options={eventTypes}
                  placeholder="Filter events"
                />
              </div>
              
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    viewMode === 'week'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border-l border-gray-300 dark:border-gray-600 ${
                    viewMode === 'month'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
            <div className="p-4 bg-gray-50 dark:bg-gray-700">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</span>
            </div>
            {weekDates.map((date, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {daysOfWeek[date.getDay()]}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {date.getDate()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </div>
            ))}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 min-h-16">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{formatTime(time)}</span>
                </div>
                {weekDates.map((date, dayIndex) => {
                  const dayEvents = getEventsForDate(date).filter(event => {
                    const eventHour = parseInt(event.startTime.split(':')[0]);
                    const slotHour = parseInt(time.split(':')[0]);
                    return eventHour === slotHour;
                  });

                  return (
                    <div key={dayIndex} className="p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={`${event.color} text-white text-xs p-2 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          <div className="flex items-center mb-1">
                            {getEventTypeIcon(event.type)}
                            <span className="ml-1 font-medium truncate">{event.title}</span>
                          </div>
                          <div className="flex items-center text-white/80">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center text-white/80">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Event Details Modal */}
        <SafeModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          title="Event Details"
          size="lg"
        >
          <div className="p-6">
            {selectedEvent && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedEvent.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                    selectedEvent.type === 'class' ? 'bg-blue-100 text-blue-800' :
                    selectedEvent.type === 'exam' ? 'bg-red-100 text-red-800' :
                    selectedEvent.type === 'meeting' ? 'bg-purple-100 text-purple-800' :
                    selectedEvent.type === 'event' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedEvent.location}</p>
                  </div>
                  {selectedEvent.teacher && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Teacher</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedEvent.teacher}</p>
                    </div>
                  )}
                </div>
                
                {selectedEvent.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedEvent.description}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <SafeButton
                    onClick={() => handleEditEvent(selectedEvent)}
                    variant="outline"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </SafeButton>
                  <SafeButton
                    onClick={() => handleDeleteEvent(selectedEvent)}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </SafeButton>
                  <SafeButton
                    onClick={() => setShowEventModal(false)}
                  >
                    Close
                  </SafeButton>
                </div>
              </div>
            )}
          </div>
        </SafeModal>

        {/* Add/Edit Event Modal */}
        <SafeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={selectedEvent ? 'Edit Event' : 'Add New Event'}
          size="lg"
        >
          <div className="p-6">
            <p>Event form would go here...</p>
            <div className="flex justify-end space-x-3 mt-6">
              <SafeButton
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </SafeButton>
              <SafeButton
                onClick={() => {
                  setShowAddModal(false);
                  addNotification({
                    type: 'success',
                    title: selectedEvent ? 'Event Updated' : 'Event Added',
                    message: selectedEvent ? 'Event has been successfully updated' : 'New event has been successfully added',
                  });
                }}
              >
                {selectedEvent ? 'Update Event' : 'Add Event'}
              </SafeButton>
            </div>
          </div>
        </SafeModal>
      </div>
    </div>
  );
}
