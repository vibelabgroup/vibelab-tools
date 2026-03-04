import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  source: string;
  originalUrl?: string;
  imageUrl?: string;
  author?: string;
}

export const NewsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch(`/api/news/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch news details');
        }
        const data = await response.json();
        setNews(data);
      } catch (e) {
        console.error(e);
        setError('Failed to load news article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [id]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (error || !news) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Article Not Found</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">{error || "The article you are looking for does not exist."}</p>
            <Link to="/news" className="px-6 py-3 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-secondary transition-colors">
                Back to News
            </Link>
        </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-purple-500/20 opacity-30"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
            {/* Spacer to maintain vertical rhythm after removing Back to News link */}
            <div className="h-6 mb-8"></div>
            
            <div className="flex justify-center mb-6">
                <span className="inline-block px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/30">
                    {news.source}
                </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                {news.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-slate-400 text-sm md:text-base">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                        {news.author ? news.author.charAt(0) : 'A'}
                    </div>
                    <span className="text-slate-200 font-medium">{news.author || 'Unknown Author'}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                <div>
                    Published on {news.date}
                </div>
            </div>
        </div>
      </div>

      {/* Featured Image & Content */}
      <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-10 pb-20">
        {news.imageUrl && (
            <div className="rounded-2xl overflow-hidden shadow-2xl mb-12 border-4 border-white dark:border-slate-800">
                <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-auto object-cover max-h-[500px]"
                    referrerPolicy="no-referrer"
                />
            </div>
        )}

        <article className="prose prose-lg prose-slate dark:prose-invert mx-auto">
            <div className="markdown-body">
                <ReactMarkdown>{news.content}</ReactMarkdown>
            </div>
        </article>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 text-sm">
                Share this article
            </div>
            {news.originalUrl && (
                <a 
                    href={news.originalUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm text-brand-primary hover:text-brand-secondary transition-colors font-medium"
                >
                    Read original source <i className="fa-solid fa-external-link-alt ml-1"></i>
                </a>
            )}
        </div>
      </div>
    </div>
  );
};
