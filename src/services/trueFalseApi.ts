import OpenAI from 'openai';
import { TrueFalseQuestion } from '../types/trueFalse';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
  dangerouslyAllowBrowser: true
});

export async function generateTrueFalseQuestions(
  text: string,
  numQuestions: number
): Promise<TrueFalseQuestion[]> {
  if (!import.meta.env.VITE_GROK_API_KEY) {
    throw new Error('API key is not configured');
  }

  try {
    const prompt = `Generate ${numQuestions} true/false questions based on this text: "${text}". 
    Return ONLY a raw JSON array without any markdown formatting. Each question should have:
    - A statement that is either true or false based on the text
    - A correctAnswer boolean value
    
    Example format:
    [{"statement": "This statement is based on the text...", "correctAnswer": true}]`;

    const completion = await openai.chat.completions.create({
      model: 'grok-beta',
      messages: [
        {
          role: 'system',
          content: 'You are a quiz generator that returns only raw JSON arrays of true/false questions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Failed to generate questions');
    }

    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const questions = JSON.parse(cleanedContent);

    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format');
    }

    return questions.map((q, index) => ({
      id: index + 1,
      statement: q.statement.trim(),
      correctAnswer: q.correctAnswer
    }));
  } catch (error) {
    console.error('True/False generation error:', error);
    throw new Error('Failed to generate true/false questions');
  }
}
