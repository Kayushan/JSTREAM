-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tmdb_id INTEGER NOT NULL,
    media_type TEXT CHECK (media_type IN ('movie', 'tv')) NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    overview TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, tmdb_id, media_type)
);

-- Create continue_watching table
CREATE TABLE IF NOT EXISTS public.continue_watching (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tmdb_id INTEGER NOT NULL,
    media_type TEXT CHECK (media_type IN ('movie', 'tv')) NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    last_watched TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, tmdb_id, media_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_tmdb_id ON public.favorites(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_continue_watching_user_id ON public.continue_watching(user_id);
CREATE INDEX IF NOT EXISTS idx_continue_watching_tmdb_id ON public.continue_watching(tmdb_id); 