import OpenAI from 'openai';
import { Question } from '../types';
import { fetchVideoDetails } from './youtube.service';
import { VideoSummary } from '../types/video';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
  dangerouslyAllowBrowser: true
});

export async function generateQuestionsFromText(text: string, numQuestions: number): Promise<Question[]> {
  if (!import.meta.env.VITE_GROK_API_KEY) {
    throw new Error('API key is not configured. Please check your environment variables.');
  }

  if (!text.trim()) {
    throw new Error('Please provide some text to generate questions from');
  }

  if (numQuestions < 1 || numQuestions > 10) {
    throw new Error('Number of questions must be between 1 and 10');
  }

  try {
    const prompt = `Generate ${numQuestions} multiple choice questions based on this text: "${text}". 
    Return ONLY a raw JSON array without any markdown formatting or code blocks. Each question must have:
    - A question string
    - An array of exactly 4 options as simple strings (no A, B, C, D prefixes)
    - A correctAnswer that exactly matches one of the options
    
    Example format:
    [{"question": "What is...?", "options": ["First option", "Second option", "Third option", "Fourth option"], "correctAnswer": "First option"}]`;

    const completion = await openai.chat.completions.create({
      model: 'grok-beta',
      messages: [
        {
          role: 'system',
          content: 'You are a quiz generator that returns only raw JSON arrays without any markdown formatting or explanation.'
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
      throw new Error('The AI service returned an empty response');
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
      throw new Error('The AI service returned an invalid JSON response');
    }

    if (!Array.isArray(parsedQuestions)) {
      throw new Error('Expected an array of questions but received a different format');
    }

    return parsedQuestions.map((q, index) => {
      if (!q.question || typeof q.question !== 'string') {
        throw new Error(`Question ${index + 1} is missing or invalid`);
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${index + 1} must have exactly 4 options`);
      }
      if (!q.options.includes(q.correctAnswer)) {
        throw new Error(`Question ${index + 1} has a correct answer that doesn't match any option`);
      }

      const cleanOptions = q.options.map(opt => 
        opt.replace(/^[A-D]\.\s*/, '').trim()
      );

      const cleanCorrectAnswer = q.correctAnswer.replace(/^[A-D]\.\s*/, '').trim();

      return {
        id: index + 1,
        question: q.question.trim(),
        options: cleanOptions,
        correctAnswer: cleanCorrectAnswer
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Quiz generation error details:', error);
      throw new Error(
        error.message.includes('API key') ? error.message : 
        'Failed to generate quiz questions. Please try again with different text or number of questions.'
      );
    }
    throw new Error('An unexpected error occurred while generating the quiz');
  }
}

export async function summarizeVideo(videoId: string): Promise<VideoSummary> {
  if (!import.meta.env.VITE_GROK_API_KEY) {
    throw new Error('API key is not configured');
  }

  try {
    const videoDetails = await fetchVideoDetails(videoId);
    
    const prompt = `Provide a comprehensive analysis and summary of this YouTube video:

Title: ${videoDetails.title}
Channel: ${videoDetails.channelTitle}
Published: ${videoDetails.publishedAt}
Duration: ${videoDetails.duration}
Description: ${videoDetails.description}

Please structure your response in the following format:

1. Title and Context
- Video title and creator
- Target audience
- Purpose of the video

2. Introduction
- Brief overview of the main topic
- Why this topic is important
- What viewers will learn

3. Main Content Analysis
- Key concepts and themes covered
- Important definitions or terminology
- Step-by-step breakdown of any processes
- Examples or case studies presented

4. Technical Details
- Tools, technologies, or methods discussed
- Specific techniques or approaches mentioned
- Any code, formulas, or technical specifications

5. Practical Applications
- Real-world examples
- How to apply the knowledge
- Common use cases or scenarios

6. Key Takeaways
- Main points to remember
- Critical insights
- Best practices mentioned

7. Additional Resources
- Related topics mentioned
- Referenced materials
- Suggested further learning

Please provide detailed information for each section while maintaining clarity and coherence.`;

    const completion = await openai.chat.completions.create({
      model: 'grok-beta',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content analyst specializing in creating detailed, well-structured video summaries. Focus on accuracy, clarity, and maintaining a logical flow of information. Use clear headings and bullet points for better readability.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const summary = completion.choices[0]?.message?.content;
    if (!summary) {
      throw new Error('Failed to generate video summary');
    }

    return {
      videoDetails,
      summary: summary.trim()
    };
  } catch (error) {
    console.error('Video summarization error:', error);
    if (error instanceof Error) {
      throw new Error(
        error.message.includes('API key') ? 'API key is not configured' :
        error.message.includes('quota') ? 'YouTube API quota exceeded. Please try again later.' :
        error.message.includes('Video not found') ? 'Could not find the YouTube video. Please check the URL and try again.' :
        'Failed to summarize the video. Please try again.'
      );
    }
    throw new Error('An unexpected error occurred');
  }
}
