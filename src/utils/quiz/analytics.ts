import { GAEventName } from '../../types/analytics';
import { event } from '../analytics/gtag';

export const trackQuizEvent = (
  eventName: GAEventName,
  quizType: 'text' | 'video' | 'true-false',
  data: Record<string, any>
) => {
  event(eventName, {
    quiz_type: quizType,
    ...data
  });
};