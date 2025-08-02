import { create } from 'zustand';

export interface TrailerData {
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface MovieData {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: string;
  runtime?: number;
  episode_run_time?: number[];
}

interface TrailerModalState {
  isOpen: boolean;
  currentMovie: MovieData | null;
  trailerData: TrailerData | null;
  isLoading: boolean;
  error: string | null;
  actions: {
    openModal: (movie: MovieData) => void;
    closeModal: () => void;
    setTrailerData: (trailer: TrailerData | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  };
}

export const useTrailerModalStore = create<TrailerModalState>((set) => ({
  isOpen: false,
  currentMovie: null,
  trailerData: null,
  isLoading: false,
  error: null,
  actions: {
    openModal: (movie: MovieData) => {
      set({
        isOpen: true,
        currentMovie: movie,
        trailerData: null,
        isLoading: true,
        error: null,
      });
    },
    closeModal: () => {
      set({
        isOpen: false,
        currentMovie: null,
        trailerData: null,
        isLoading: false,
        error: null,
      });
    },
    setTrailerData: (trailer: TrailerData | null) => {
      set({
        trailerData: trailer,
        isLoading: false,
        error: null,
      });
    },
    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },
    setError: (error: string | null) => {
      set({
        error,
        isLoading: false,
      });
    },
    reset: () => {
      set({
        isOpen: false,
        currentMovie: null,
        trailerData: null,
        isLoading: false,
        error: null,
      });
    },
  },
})); 