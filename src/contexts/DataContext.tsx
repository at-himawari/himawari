import React, { createContext, useContext, useState, useEffect } from 'react';
import { NewsItem, newsItems as defaultNewsItems } from '../data/newsData';
import { Video, airVideos as defaultAirVideos } from '../data/videos';

interface DataContextType {
  newsItems: NewsItem[];
  airVideos: Video[];
  addNewsItem: (item: NewsItem) => void;
  updateNewsItem: (index: number, item: NewsItem) => void;
  deleteNewsItem: (index: number) => void;
  addVideo: (video: Video) => void;
  updateVideo: (index: number, video: Video) => void;
  deleteVideo: (index: number) => void;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(defaultNewsItems);
  const [airVideos, setAirVideos] = useState<Video[]>(defaultAirVideos);

  useEffect(() => {
    const savedNews = localStorage.getItem('himawari-news-data');
    const savedVideos = localStorage.getItem('himawari-videos-data');
    
    if (savedNews) {
      setNewsItems(JSON.parse(savedNews));
    }
    if (savedVideos) {
      setAirVideos(JSON.parse(savedVideos));
    }
  }, []);

  const saveNewsToStorage = (items: NewsItem[]) => {
    localStorage.setItem('himawari-news-data', JSON.stringify(items));
    setNewsItems(items);
  };

  const saveVideosToStorage = (videos: Video[]) => {
    localStorage.setItem('himawari-videos-data', JSON.stringify(videos));
    setAirVideos(videos);
  };

  const addNewsItem = (item: NewsItem) => {
    const newItems = [item, ...newsItems];
    saveNewsToStorage(newItems);
  };

  const updateNewsItem = (index: number, item: NewsItem) => {
    const newItems = [...newsItems];
    newItems[index] = item;
    saveNewsToStorage(newItems);
  };

  const deleteNewsItem = (index: number) => {
    const newItems = newsItems.filter((_, i) => i !== index);
    saveNewsToStorage(newItems);
  };

  const addVideo = (video: Video) => {
    const newVideos = [video, ...airVideos];
    saveVideosToStorage(newVideos);
  };

  const updateVideo = (index: number, video: Video) => {
    const newVideos = [...airVideos];
    newVideos[index] = video;
    saveVideosToStorage(newVideos);
  };

  const deleteVideo = (index: number) => {
    const newVideos = airVideos.filter((_, i) => i !== index);
    saveVideosToStorage(newVideos);
  };

  const resetToDefaults = () => {
    localStorage.removeItem('himawari-news-data');
    localStorage.removeItem('himawari-videos-data');
    setNewsItems(defaultNewsItems);
    setAirVideos(defaultAirVideos);
  };

  return (
    <DataContext.Provider value={{
      newsItems, airVideos, addNewsItem, updateNewsItem, deleteNewsItem,
      addVideo, updateVideo, deleteVideo, resetToDefaults
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
