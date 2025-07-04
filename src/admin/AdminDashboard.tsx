import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { NewsItem } from '../data/newsData';
import { Video } from '../data/videos';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { newsItems, airVideos, loading, error, addNewsItem, updateNewsItem, deleteNewsItem, addVideo, updateVideo, deleteVideo, refreshData, resetToDefaults } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'news' | 'videos'>('news');
  const [editingNews, setEditingNews] = useState<{ index: number; item: NewsItem } | null>(null);
  const [editingVideo, setEditingVideo] = useState<{ index: number; item: Video } | null>(null);
  const [newNews, setNewNews] = useState<NewsItem>({ title: '', date: '', content: '' });
  const [newVideo, setNewVideo] = useState<Video>({ title: '', description: '', videoUrl: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNews.title && newNews.date && newNews.content) {
      try {
        await addNewsItem(newNews);
        setNewNews({ title: '', date: '', content: '' });
      } catch (error) {
        console.error('Failed to add news item:', error);
      }
    }
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNews && editingNews.item.title && editingNews.item.date && editingNews.item.content) {
      try {
        const newsItem = newsItems[editingNews.index];
        if (newsItem.id) {
          await updateNewsItem(newsItem.id, editingNews.item);
          setEditingNews(null);
        }
      } catch (error) {
        console.error('Failed to update news item:', error);
      }
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newVideo.title && newVideo.videoUrl) {
      try {
        await addVideo(newVideo);
        setNewVideo({ title: '', description: '', videoUrl: '' });
      } catch (error) {
        console.error('Failed to add video:', error);
      }
    }
  };

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideo && editingVideo.item.title && editingVideo.item.videoUrl) {
      try {
        const video = airVideos[editingVideo.index];
        if (video.id) {
          await updateVideo(video.id, editingVideo.item);
          setEditingVideo(null);
        }
      } catch (error) {
        console.error('Failed to update video:', error);
      }
    }
  };

  const formatDateForInput = (dateStr: string) => {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
    return dateStr;
  };

  const formatDateForDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${(date.getMonth() + 1)}.${date.getDate()}`;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="font-sans overflow-x-hidden">
      <Header />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">CMS管理画面</h1>
            <div className="space-x-4">
              <button
                onClick={refreshData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? 'データ更新中...' : 'データ更新'}
              </button>
              <button
                onClick={() => {
                  if (confirm('すべてのデータを初期状態にリセットしますか？')) {
                    resetToDefaults();
                  }
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                データリセット
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                ログアウト
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="text-lg text-gray-600">データを読み込み中...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('news')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'news'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ニュース管理
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'videos'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  動画管理
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'news' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">新しいニュースを追加</h2>
                <form onSubmit={handleAddNews} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">タイトル</label>
                    <input
                      type="text"
                      value={newNews.title}
                      onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">日付</label>
                    <input
                      type="date"
                      value={formatDateForInput(newNews.date)}
                      onChange={(e) => setNewNews({ ...newNews, date: formatDateForDisplay(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">内容</label>
                    <textarea
                      value={newNews.content}
                      onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={3}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                  >
                    追加
                  </button>
                </form>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">ニュース一覧</h2>
                <div className="space-y-4">
                  {newsItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded p-4">
                      {editingNews?.index === index ? (
                        <form onSubmit={handleUpdateNews} className="space-y-4">
                          <input
                            type="text"
                            value={editingNews.item.title}
                            onChange={(e) => setEditingNews({ ...editingNews, item: { ...editingNews.item, title: e.target.value } })}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                          <input
                            type="date"
                            value={formatDateForInput(editingNews.item.date)}
                            onChange={(e) => setEditingNews({ ...editingNews, item: { ...editingNews.item, date: formatDateForDisplay(e.target.value) } })}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                          <textarea
                            value={editingNews.item.content}
                            onChange={(e) => setEditingNews({ ...editingNews, item: { ...editingNews.item, content: e.target.value } })}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2"
                            rows={3}
                          />
                          <div className="space-x-2">
                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                              保存
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNews(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                            >
                              キャンセル
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div>
                          <h3 className="font-bold text-orange-500">{item.title}</h3>
                          <p className="text-gray-700">{item.date}</p>
                          <p className="text-gray-600 mt-2">{item.content}</p>
                          <div className="mt-2 space-x-2">
                            <button
                              onClick={() => setEditingNews({ index, item })}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            >
                              編集
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('このニュースを削除しますか？')) {
                                  try {
                                    const newsItem = newsItems[index];
                                    if (newsItem.id) {
                                      await deleteNewsItem(newsItem.id);
                                    }
                                  } catch (error) {
                                    console.error('Failed to delete news item:', error);
                                  }
                                }
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">新しい動画を追加</h2>
                <form onSubmit={handleAddVideo} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">タイトル</label>
                    <input
                      type="text"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">説明</label>
                    <textarea
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
                    <input
                      type="url"
                      value={newVideo.videoUrl}
                      onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="https://youtu.be/..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                  >
                    追加
                  </button>
                </form>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">動画一覧</h2>
                <div className="space-y-4">
                  {airVideos.map((video, index) => (
                    <div key={index} className="border border-gray-200 rounded p-4">
                      {editingVideo?.index === index ? (
                        <form onSubmit={handleUpdateVideo} className="space-y-4">
                          <input
                            type="text"
                            value={editingVideo.item.title}
                            onChange={(e) => setEditingVideo({ ...editingVideo, item: { ...editingVideo.item, title: e.target.value } })}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                          <textarea
                            value={editingVideo.item.description}
                            onChange={(e) => setEditingVideo({ ...editingVideo, item: { ...editingVideo.item, description: e.target.value } })}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2"
                            rows={2}
                          />
                          <input
                            type="url"
                            value={editingVideo.item.videoUrl}
                            onChange={(e) => setEditingVideo({ ...editingVideo, item: { ...editingVideo.item, videoUrl: e.target.value } })}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                          <div className="space-x-2">
                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                              保存
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingVideo(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                            >
                              キャンセル
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div>
                          <h3 className="font-bold">{video.title}</h3>
                          <p className="text-gray-600 mt-1">{video.description}</p>
                          <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                            {video.videoUrl}
                          </a>
                          <div className="mt-2 space-x-2">
                            <button
                              onClick={() => setEditingVideo({ index, item: video })}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            >
                              編集
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('この動画を削除しますか？')) {
                                  try {
                                    const video = airVideos[index];
                                    if (video.id) {
                                      await deleteVideo(video.id);
                                    }
                                  } catch (error) {
                                    console.error('Failed to delete video:', error);
                                  }
                                }
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
