"use client";

import { useLiveNotifications } from '@/hooks/use-live-notifications';

export function LiveNotificationsWrapper() {
  useLiveNotifications();
  return null; // This component just runs the hook
}
