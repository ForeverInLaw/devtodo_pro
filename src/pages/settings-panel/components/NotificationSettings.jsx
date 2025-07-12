import React, { useState, useEffect } from 'react';
import SettingsSection from './SettingsSection';
import Button from '../../../components/ui/Button';


const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    dueDateReminders: true,
    completionCelebrations: true,
    browserNotifications: false,
    emailDigest: true,
    taskAssignments: true,
    commentUpdates: false,
    priorityChanges: true,
    systemAnnouncements: true
  });

  const [reminderTiming, setReminderTiming] = useState('1day');
  const [digestFrequency, setDigestFrequency] = useState('daily');

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notificationSettings');
    const savedReminderTiming = localStorage.getItem('reminderTiming');
    const savedDigestFrequency = localStorage.getItem('digestFrequency');

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedReminderTiming) {
      setReminderTiming(savedReminderTiming);
    }
    if (savedDigestFrequency) {
      setDigestFrequency(savedDigestFrequency);
    }
  }, []);

  const updateNotificationSetting = (key, value) => {
    const updatedNotifications = { ...notifications, [key]: value };
    setNotifications(updatedNotifications);
    localStorage.setItem('notificationSettings', JSON.stringify(updatedNotifications));
  };

  const updateReminderTiming = (timing) => {
    setReminderTiming(timing);
    localStorage.setItem('reminderTiming', timing);
  };

  const updateDigestFrequency = (frequency) => {
    setDigestFrequency(frequency);
    localStorage.setItem('digestFrequency', frequency);
  };

  const requestBrowserPermissions = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      updateNotificationSetting('browserNotifications', permission === 'granted');
    }
  };

  const notificationOptions = [
    {
      key: 'dueDateReminders',
      title: 'Due Date Reminders',
      description: 'Get notified before tasks are due'
    },
    {
      key: 'completionCelebrations',
      title: 'Completion Celebrations',
      description: 'Celebrate when you complete tasks'
    },
    {
      key: 'browserNotifications',
      title: 'Browser Notifications',
      description: 'Allow browser push notifications'
    },
    {
      key: 'emailDigest',
      title: 'Email Digest',
      description: 'Receive periodic email summaries'
    },
    {
      key: 'taskAssignments',
      title: 'Task Assignments',
      description: 'Get notified when tasks are assigned to you'
    },
    {
      key: 'commentUpdates',
      title: 'Comment Updates',
      description: 'Notifications for task comments and updates'
    },
    {
      key: 'priorityChanges',
      title: 'Priority Changes',
      description: 'Alert when task priorities are modified'
    },
    {
      key: 'systemAnnouncements',
      title: 'System Announcements',
      description: 'Important updates about the application'
    }
  ];

  const reminderOptions = [
    { value: '15min', label: '15 minutes before' },
    { value: '1hour', label: '1 hour before' },
    { value: '1day', label: '1 day before' },
    { value: '3days', label: '3 days before' },
    { value: '1week', label: '1 week before' }
  ];

  const digestOptions = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  return (
    <SettingsSection
      title="Notification Settings"
      description="Configure how and when you receive notifications"
      icon="Bell"
    >
      <div className="space-y-6">
        {/* Notification Types */}
        <div className="space-y-4">
          {notificationOptions?.map((option) => (
            <div key={option.key} className="flex items-start justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground block">
                  {option.title}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {option.description}
                </p>
              </div>
              <div className="ml-4">
                {option.key === 'browserNotifications' ? (
                  <Button
                    variant={notifications[option.key] ? 'default' : 'outline'}
                    size="sm"
                    onClick={requestBrowserPermissions}
                    disabled={notifications[option.key]}
                  >
                    {notifications[option.key] ? 'Enabled' : 'Enable'}
                  </Button>
                ) : (
                  <button
                    onClick={() => updateNotificationSetting(option.key, !notifications[option.key])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      notifications[option.key] ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                        notifications[option.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Reminder Timing */}
        {notifications.dueDateReminders && (
          <div>
            <label className="text-sm font-medium text-foreground block mb-3">
              Reminder Timing
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {reminderOptions?.map((option) => (
                <Button
                  key={option.value}
                  variant={reminderTiming === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateReminderTiming(option.value)}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Email Digest Frequency */}
        {notifications.emailDigest && (
          <div>
            <label className="text-sm font-medium text-foreground block mb-3">
              Email Digest Frequency
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {digestOptions?.map((option) => (
                <Button
                  key={option.value}
                  variant={digestFrequency === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateDigestFrequency(option.value)}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Test Notification */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (notifications.browserNotifications && 'Notification' in window) {
                new Notification('Test Notification', {
                  body: 'Your notification settings are working correctly!',
                  icon: '/favicon.ico'
                });
              }
            }}
            disabled={!notifications.browserNotifications}
            iconName="TestTube"
          >
            Test Notification
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
};

export default NotificationSettings;