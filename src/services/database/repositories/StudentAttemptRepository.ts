import { supabase } from '../../../lib/supabase';
import { StudentAttempt, StudentAttemptInsert } from '../models/StudentAttempt';
import { DatabaseError } from '../errors/DatabaseError';

export class StudentAttemptRepository {
  static async create(attempt: StudentAttemptInsert): Promise<StudentAttempt> {
    try {
      const { data, error } = await supabase
        .from('student_attempts')
        .insert(attempt)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new DatabaseError('Failed to record attempt', error);
    }
  }

  static async getUserAttempts(userId: string): Promise<StudentAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('student_attempts')
        .select(`
          *,
          questions (
            question_text,
            topic_id,
            difficulty_level
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new DatabaseError('Failed to fetch user attempts', error);
    }
  }
}