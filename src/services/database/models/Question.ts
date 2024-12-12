import { Database } from '../types';

export interface Question {
  id: string;
  topic_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  difficulty_level: number;
  explanation: string | null;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type QuestionInsert = Omit<Question, 'id' | 'created_at' | 'updated_at'>;
export type QuestionUpdate = Partial<QuestionInsert>;