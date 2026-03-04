import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  url?: string;
}

export const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data);
      } catch (e) {
        console.error(e);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-purple-500/20 opacity-30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Latest AI <span className="text-brand-primary">News</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Stay updated with the most significant developments in Artificial Intelligence from around the globe.
          </p>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => (
                <Link 
                    key={index} 
                    to={`/news/${item.id}`} 
                    className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 hover:border-brand-primary/50 transition-all hover:shadow-xl hover:shadow-brand-primary/10 hover:-translate-y-1"
                >
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <span className="text-brand-primary">{item.source}</span>
                        <span>{item.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-primary transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow">
                        {item.summary}
                    </p>
                    <div className="flex items-center text-brand-primary font-bold text-sm mt-auto">
                        Read more <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                </div>
                </Link>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};
