import OpenAI from 'openai';
import { TrueFalseQuestion } from '../types/trueFalse';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
  dangerouslyAllowBrowser: true
});

export async function generateTrueFalseQuestions(text: string, numQuestions: number): Promise<TrueFalseQuestion[]> {
  if (!import.meta.env.VITE_GROK_API_KEY) {
    throw new Error('API key is not configured');
  }

  if (!text.trim()) {
    throw new Error('Please provide some text to generate questions from');
  }

  if (numQuestions < 1 || numQuestions > 10) {
    throw new Error('Number of questions must be between 1 and 10');
  }

  try {
    const prompt = `Generate ${numQuestions} true/false questions based on this text: "${text}". 
    Return ONLY a raw JSON array without any markdown formatting or code blocks. Each question must have:
    - A clear statement that is either true or false
    - A boolean indicating if the statement is true
    - A brief explanation of why it's true or false
    
    Example format:
    [{"statement": "The Earth is flat", "isTrue": false, "explanation": "The Earth is actually spherical, as proven by numerous scientific observations and space photographs."}]`;

    const completion = await openai.chat.completions.create({
      model: 'grok-beta',
      messages: [
        {
          role: 'system',
          content: 'You are a quiz generator that returns only raw JSON arrays of true/false questions without any markdown formatting or explanation.'
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      temperature: 0.7,
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

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse the generated questions');
    }

    if (!Array.isArray(parsedQuestions)) {
      throw new Error('Expected an array of questions but received a different format');
    }

    return parsedQuestions.map((q, index) => ({
      id: index + 1,
      statement: q.statement.trim(),
      isTrue: q.isTrue,
      explanation: q.explanation.trim()
    }));
  } catch (error) {
    console.error('True/False question generation error:', error);
    throw error;
  }
}