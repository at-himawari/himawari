import React, { createContext, useContext, useState, useEffect } from 'react';
import { NewsItem, newsItems as defaultNewsItems } from '../data/newsData';
import { Video, airVideos as defaultAirVideos } from '../data/videos';

interface DataContextType {
  newsItems: NewsItem[];
  airVideos: Video[];
  loading: boolean;
  error: string | null;
  addNewsItem: (item: Omit<NewsItem, 'id'>) => Promise<void>;
  updateNewsItem: (id: number, item: Omit<NewsItem, 'id'>) => Promise<void>;
  deleteNewsItem: (id: number) => Promise<void>;
  addVideo: (video: Omit<Video, 'id'>) => Promise<void>;
  updateVideo: (id: number, video: Omit<Video, 'id'>) => Promise<void>;
  deleteVideo: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_BASE_URL = '/api';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [airVideos, setAirVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('himawari-admin-token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchNewsItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news.php`);
      if (response.ok) {
        const data = await response.json();
        setNewsItems(data.map((item: { id: number; title: string; date: string; content: string }) => ({
          id: item.id,
          title: item.title,
          date: item.date,
          content: item.content
        })));
      } else {
        setNewsItems(defaultNewsItems);
      }
    } catch (error) {
      console.error('Failed to fetch news items:', error);
      setNewsItems(defaultNewsItems);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos.php`);
      if (response.ok) {
        const data = await response.json();
        setAirVideos(data.map((item: { id: number; title: string; description: string; video_url: string }) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          videoUrl: item.video_url
        })));
      } else {
        setAirVideos(defaultAirVideos);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setAirVideos(defaultAirVideos);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchNewsItems(), fetchVideos()]);
    } catch {
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addNewsItem = async (item: Omit<NewsItem, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(item)
      });
      
      if (response.ok) {
        await fetchNewsItems();
      } else {
        throw new Error('Failed to add news item');
      }
    } catch (error) {
      console.error('Failed to add news item:', error);
      throw error;
    }
  };

  const updateNewsItem = async (id: number, item: Omit<NewsItem, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news.php?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(item)
      });
      
      if (response.ok) {
        await fetchNewsItems();
      } else {
        throw new Error('Failed to update news item');
      }
    } catch (error) {
      console.error('Failed to update news item:', error);
      throw error;
    }
  };

  const deleteNewsItem = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news.php?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        await fetchNewsItems();
      } else {
        throw new Error('Failed to delete news item');
      }
    } catch (error) {
      console.error('Failed to delete news item:', error);
      throw error;
    }
  };

  const addVideo = async (video: Omit<Video, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(video)
      });
      
      if (response.ok) {
        await fetchVideos();
      } else {
        throw new Error('Failed to add video');
      }
    } catch (error) {
      console.error('Failed to add video:', error);
      throw error;
    }
  };

  const updateVideo = async (id: number, video: Omit<Video, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos.php?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(video)
      });
      
      if (response.ok) {
        await fetchVideos();
      } else {
        throw new Error('Failed to update video');
      }
    } catch (error) {
      console.error('Failed to update video:', error);
      throw error;
    }
  };

  const deleteVideo = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos.php?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        await fetchVideos();
      } else {
        throw new Error('Failed to delete video');
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
      throw error;
    }
  };

  const resetToDefaults = () => {
    setNewsItems(defaultNewsItems);
    setAirVideos(defaultAirVideos);
  };

  return (
    <DataContext.Provider value={{
      newsItems, airVideos, loading, error, addNewsItem, updateNewsItem, deleteNewsItem,
      addVideo, updateVideo, deleteVideo, refreshData, resetToDefaults
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
