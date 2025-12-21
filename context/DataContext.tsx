import React, { createContext, useState, useContext, ReactNode } from 'react';
import { NewsItem, VideoItem } from '../types';

interface DataContextType {
  newsItems: NewsItem[];
  videoItems: VideoItem[];
  addNews: (formData: FormData) => Promise<boolean>;
  deleteNews: (id: number) => Promise<boolean>;
  addVideo: (formData: FormData) => Promise<boolean>;
  deleteVideo: (id: number) => Promise<boolean>;
  login: (password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Static site - no backend API. Using placeholder data.
// If you need a backend, deploy it separately and update API_URL.

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Static placeholder data - no backend API calls
  const [newsItems] = useState<NewsItem[]>([]);
  const [videoItems] = useState<VideoItem[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // Static site stubs - these require a backend to function
  const login = async (_password: string) => {
    console.warn('Backend not configured. Admin features require a backend API.');
    return false;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('ichr_token');
  };

  const addNews = async (_formData: FormData) => {
    console.warn('Backend not configured. Cannot add news.');
    return false;
  };

  const deleteNews = async (_id: number) => {
    console.warn('Backend not configured. Cannot delete news.');
    return false;
  };

  const addVideo = async (_formData: FormData) => {
    console.warn('Backend not configured. Cannot add video.');
    return false;
  };

  const deleteVideo = async (_id: number) => {
    console.warn('Backend not configured. Cannot delete video.');
    return false;
  };

  return (
    <DataContext.Provider value={{
      newsItems,
      videoItems,
      addNews,
      deleteNews,
      addVideo,
      deleteVideo,
      login,
      isAuthenticated: !!token,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};