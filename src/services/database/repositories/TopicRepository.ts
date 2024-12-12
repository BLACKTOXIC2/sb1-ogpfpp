import { supabase } from '../../../lib/supabase';
import { Topic, TopicInsert, TopicUpdate } from '../models/Topic';
import { DatabaseError } from '../errors/DatabaseError';

export class TopicRepository {
  static async getAll(): Promise<Topic[]> {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      throw new DatabaseError('Failed to fetch topics', error);
    }
  }

  static async getById(id: string): Promise<Topic | null> {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new DatabaseError('Failed to fetch topic', error);
    }
  }

  static async create(topic: TopicInsert): Promise<Topic> {
    try {
      const { data, error } = await supabase
        .from('topics')
        .insert(topic)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new DatabaseError('Failed to create topic', error);
    }
  }

  static async update(id: string, topic: TopicUpdate): Promise<Topic> {
    try {
      const { data, error } = await supabase
        .from('topics')
        .update(topic)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new DatabaseError('Failed to update topic', error);
    }
  }
}