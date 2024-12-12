import { supabase } from '../../../lib/supabase';
import { Question, QuestionInsert, QuestionUpdate } from '../models/Question';
import { DatabaseError } from '../errors/DatabaseError';

export class QuestionRepository {
  static async getByTopic(topicId: string): Promise<Question[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topicId)
        .eq('is_active', true)
        .order('created_at');

      if (error) throw error;
      return data;
    } catch (error) {
      throw new DatabaseError('Failed to fetch questions', error);
    }
  }

  static async create(question: QuestionInsert): Promise<Question> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(question)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new DatabaseError('Failed to create question', error);
    }
  }

  static async update(id: string, question: QuestionUpdate): Promise<Question> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update(question)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new DatabaseError('Failed to update question', error);
    }
  }
}