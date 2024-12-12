import { Database } from '../types';

export interface Topic {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export type TopicInsert = Omit<Topic, 'id' | 'created_at' | 'updated_at'>;
export type TopicUpdate = Partial<TopicInsert>;