import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
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

const API_URL = 'http://localhost:3001/api';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('ichr_token'));

  // Fetch data on mount
  useEffect(() => {
    fetchNews();
    fetchVideos();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_URL}/content/news`);
      if (res.ok) {
        const data = await res.json();
        setNewsItems(data);
      }
    } catch (e) {
      console.error("Failed to fetch news. Is backend running?", e);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API_URL}/content/videos`);
      if (res.ok) {
        const data = await res.json();
        setVideoItems(data);
      }
    } catch (e) {
      console.error("Failed to fetch videos. Is backend running?", e);
    }
  };

  const login = async (password: string) => {
    try {
      // In a real app, you would send username as well. 
      // For this demo context, we assume username 'admin'.
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password })
      });
      
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem('ichr_token', data.token);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('ichr_token');
  };

  const addNews = async (formData: FormData) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_URL}/content/news`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData // Let browser set content-type for multipart
      });
      if (res.ok) {
        await fetchNews(); // Refresh list
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteNews = async (id: number) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_URL}/content/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNewsItems(prev => prev.filter(item => item.id !== id));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const addVideo = async (formData: FormData) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_URL}/content/videos`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        await fetchVideos(); // Refresh list
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteVideo = async (id: number) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_URL}/content/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setVideoItems(prev => prev.filter(item => item.id !== id));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
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