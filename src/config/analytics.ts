export const GA_TRACKING_ID = 'G-WLLZKG8TP9';

export const GA_EVENTS = {
  QUIZ_START: 'quiz_start',
  QUIZ_COMPLETE: 'quiz_complete',
  VIDEO_ANALYZE: 'video_analyze',
  AUTH_SUCCESS: 'auth_success',
  PROFILE_UPDATE: 'profile_update'
} as const;

export type GAEventName = keyof typeof GA_EVENTS;