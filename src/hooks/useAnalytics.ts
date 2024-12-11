import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from '../utils/analytics/gtag';
import { GAEventName, GA_EVENTS } from '../config/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  const trackEvent = (
    eventName: GAEventName,
    params: Record<string, any> = {}
  ) => {
    const eventKey = GA_EVENTS[eventName];
    if (eventKey) {
      event(eventKey, params);
    }
  };

  return { trackEvent };
};