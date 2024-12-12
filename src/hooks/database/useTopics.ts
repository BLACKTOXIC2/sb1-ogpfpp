import { useState, useEffect } from 'react';
import { Topic } from '../../services/database/models/Topic';
import { TopicRepository } from '../../services/database/repositories/TopicRepository';
import { DatabaseError } from '../../services/database/errors/DatabaseError';

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTopics() {
      try {
        const data = await TopicRepository.getAll();
        setTopics(data);
        setError(null);
      } catch (err) {
        setError(DatabaseError.getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, []);

  return { topics, loading, error };
}