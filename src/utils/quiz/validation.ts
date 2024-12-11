export const validateQuizInput = (text: string, minLength: number = 50): string | null => {
  if (!text.trim()) {
    return 'Please enter some text to generate questions';
  }

  if (text.trim().length < minLength) {
    return `Please enter at least ${minLength} characters of text to generate meaningful questions`;
  }

  return null;
};

export const validateQuestionCount = (count: number): string | null => {
  if (count < 1 || count > 10) {
    return 'Number of questions must be between 1 and 10';
  }

  return null;
};