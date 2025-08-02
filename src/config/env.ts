export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  tmdb: {
    apiKey: import.meta.env.VITE_TMDB_API_KEY || '',
    bearerToken: import.meta.env.VITE_TMDB_TOKEN || '',
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p',
  },
  vidsrc: {
    baseUrl: 'https://vidsrc.cc/v2/embed',
  },
} as const;

export type Config = typeof config; 