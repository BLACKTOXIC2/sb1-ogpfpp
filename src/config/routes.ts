export const ROUTES = {
  HOME: '/',
  AUTH: {
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password'
  },
  QUIZ: {
    TEXT: '/text-quiz',
    VIDEO: '/video',
    TRUE_FALSE: '/true-false'
  },
  PROFILE: '/profile',
  PRICING: '/pricing'
} as const;