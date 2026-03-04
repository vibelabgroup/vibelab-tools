import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const DEFAULT_NEWS = {
  title: '',
  summary: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  author: '',
  imageUrl: 'https://picsum.photos/800/400',
  source: '',
  originalUrl: ''
};

export const AdminEditNews: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState<any>(DEFAULT_NEWS);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState('');

    useEffect(() => {
        const savedKey = localStorage.getItem('vibelab_admin_key');
        if (!savedKey) {
            navigate('/admin');
            return;
        }
        setKey(savedKey);

        if (id && id !== 'new') {
            loadNews(id, savedKey);
        }
    }, [id, navigate]);

    const loadNews = async (newsId: string, apiKey: string) => {
        setLoading(true);
        try {
            const newsList = await api.getAdminNews(apiKey);
            const foundNews = newsList.find(n => n.id === newsId);
            if (foundNews) {
                setNews(foundNews);
            } else {
                alert('News not found');
                navigate('/admin');
            }
        } catch (e) {
            console.error(e);
            alert('Failed to load news');
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id && id !== 'new') {
                await api.updateNews(id, news, key);
            } else {
                // @ts-ignore
                await api.createNews(news, key);
            }
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert('Failed to save news');
        }
        setLoading(false);
    };

    if (loading && id && id !== 'new' && !news.title) {
        return <div className="pt-32 text-center">Loading...</div>;
    }

    return (
        <div className="pt-24 pb-20 px-6 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold dark:text-white">{id === 'new' ? 'Add New News' : 'Edit News'}</h1>
                    <button onClick={() => navigate('/admin')} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                        Cancel
                    </button>
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-white/10">
                    <form onSubmit={handleSave}>
                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2 dark:text-slate-300">Title</label>
                            <input 
                                required 
                                value={news.title} 
                                onChange={e => setNews({...news, title: e.target.value})} 
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2 dark:text-slate-300">Summary</label>
                            <textarea 
                                rows={3} 
                                value={news.summary} 
                                onChange={e => setNews({...news, summary: e.target.value})} 
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2 dark:text-slate-300">Content (Markdown)</label>
                            <textarea 
                                rows={10} 
                                value={news.content} 
                                onChange={e => setNews({...news, content: e.target.value})} 
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Author</label>
                                <input 
                                    value={news.author} 
                                    onChange={e => setNews({...news, author: e.target.value})} 
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Date</label>
                                <input 
                                    type="date" 
                                    value={news.date} 
                                    onChange={e => setNews({...news, date: e.target.value})} 
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                             <label className="block text-sm font-bold mb-2 dark:text-slate-300">Image URL</label>
                             <input 
                                value={news.imageUrl} 
                                onChange={e => setNews({...news, imageUrl: e.target.value})} 
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Source Name</label>
                                <input 
                                    value={news.source} 
                                    onChange={e => setNews({...news, source: e.target.value})} 
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Original URL</label>
                                <input 
                                    value={news.originalUrl} 
                                    onChange={e => setNews({...news, originalUrl: e.target.value})} 
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end">
                            <button 
                                type="button" 
                                onClick={() => navigate('/admin')} 
                                className="px-6 py-2.5 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-8 py-2.5 rounded-lg gradient-bg text-white font-bold shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : 'Save News'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
