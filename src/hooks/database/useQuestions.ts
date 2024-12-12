import { useState, useEffect } from 'react';
import { Question } from '../../services/database/models/Question';
import { QuestionRepository } from '../../services/database/repositories/QuestionRepository';
import { DatabaseError } from '../../services/database/errors/DatabaseError';

export function useQuestions(topicId: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await QuestionRepository.getByTopic(topicId);
        setQuestions(data);
        setError(null);
      } catch (err) {
        setError(DatabaseError.getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    if (topicId) {
      loadQuestions();
    }
  }, [topicId]);

  return { questions, loading, error };
}