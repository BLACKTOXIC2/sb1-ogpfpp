export interface StudentAttempt {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  time_taken_seconds: number | null;
  attempt_number: number;
  created_at: string;
}

export type StudentAttemptInsert = Omit<StudentAttempt, 'id' | 'created_at'>;