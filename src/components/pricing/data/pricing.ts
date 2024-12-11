export const tiers = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started with basic quiz generation',
    features: [
      '10 MCQ generations per month',
      'Basic text analysis',
      'Standard question types',
      'Community support'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline'
  },
  {
    name: 'Pro',
    price: '19',
    description: 'Ideal for educators and content creators',
    features: [
      'Unlimited MCQ generations',
      'Advanced AI analysis',
      'Custom question templates',
      'Priority support',
      'Video content analysis',
      'Detailed analytics'
    ],
    buttonText: 'Start Free Trial',
    buttonVariant: 'solid',
    popular: true
  },
  {
    name: 'Team',
    price: '49',
    description: 'Best for organizations and educational institutions',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Advanced analytics',
      'Custom branding',
      'API access',
      'Dedicated support'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline'
  }
] as const;

export const features = [
  {
    name: 'MCQ Generation',
    free: '10/month',
    pro: 'Unlimited',
    team: 'Unlimited'
  },
  {
    name: 'Video Analysis',
    free: false,
    pro: true,
    team: true
  },
  {
    name: 'Custom Templates',
    free: false,
    pro: true,
    team: true
  },
  {
    name: 'Analytics',
    free: 'Basic',
    pro: 'Advanced',
    team: 'Enterprise'
  },
  {
    name: 'Team Members',
    free: '1',
    pro: '1',
    team: 'Unlimited'
  },
  {
    name: 'API Access',
    free: false,
    pro: false,
    team: true
  }
] as const;

export const faqs = [
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.'
  },
  {
    question: 'Can I switch plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, we offer a 14-day free trial on our Pro plan with full access to all features. No credit card required.'
  },
  {
    question: 'What happens when I reach my monthly limit?',
    answer: 'You\'ll be notified when you\'re close to your limit. You can upgrade your plan at any time to continue generating quizzes.'
  },
  {
    question: 'Do you offer educational discounts?',
    answer: 'Yes, we offer special pricing for educational institutions. Please contact our sales team for more information.'
  }
] as const;