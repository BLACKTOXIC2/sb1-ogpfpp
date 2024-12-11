import React from 'react';
import FAQItem from './FAQItem';
import { useFAQData } from './hooks/useFAQData';

const FAQList = () => {
  const { faqs } = useFAQData();

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
        />
      ))}
    </div>
  );
};

export default FAQList;