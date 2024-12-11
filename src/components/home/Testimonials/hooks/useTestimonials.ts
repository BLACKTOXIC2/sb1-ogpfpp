import { useMemo } from 'react';
import { Testimonial } from '../types';

export const useTestimonials = () => {
  const testimonials: Testimonial[] = useMemo(() => [
    {
      name: 'Sarah Johnson',
      role: 'High School Teacher',
      organization: 'Lincoln High School',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
      quote: 'MCQGEN has transformed how I create assessments. The AI-powered generation saves me hours of work every week, and the quality of questions is consistently high.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Education Consultant',
      organization: 'EduTech Solutions',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
      quote: 'The quality of questions generated is impressive. It\'s like having a team of expert educators at your fingertips. The video analysis feature is particularly innovative.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'University Professor',
      organization: 'State University',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
      quote: 'As a professor, I need reliable tools that save time without compromising quality. MCQGEN delivers exactly that. The true/false question generation is particularly useful for quick assessments.',
      rating: 5
    }
  ], []);

  return { testimonials };
};