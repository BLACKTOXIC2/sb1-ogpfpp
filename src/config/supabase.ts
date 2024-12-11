// Supabase configuration
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
} as const;

// Validation
if (!SUPABASE_CONFIG.url.startsWith('https://')) {
  throw new Error('Invalid Supabase URL. Must start with https://');
}

if (!SUPABASE_CONFIG.anonKey) {
  throw new Error('Missing Supabase anonymous key');
}