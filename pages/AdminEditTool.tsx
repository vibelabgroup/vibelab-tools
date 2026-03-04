import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiTool, Category } from '../types';
import { api } from '../utils/api';

const DEFAULT_TOOL: Partial<AiTool> = {
  name: '',
  category: Category.TEXT,
  description: '',
  shortDescription: '',
  pricing: 'Freemium',
  imageUrl: 'https://picsum.photos/400/300',
  websiteUrl: '',
  tags: [],
  rating: 0,
  reviewCount: 0,
  featured: false,
  status: 'approved'
};

export const AdminEditTool: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tool, setTool] = useState<Partial<AiTool>>(DEFAULT_TOOL);
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
            loadTool(id, savedKey);
        }
    }, [id, navigate]);

    const loadTool = async (toolId: string, apiKey: string) => {
        setLoading(true);
        try {
            const tools = await api.getAdminTools(apiKey);
            const foundTool = tools.find(t => t.id === toolId);
            if (foundTool) {
                setTool(foundTool);
            } else {
                alert('Tool not found');
                navigate('/admin');
            }
        } catch (e) {
            console.error(e);
            alert('Failed to load tool');
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id && id !== 'new') {
                await api.updateTool(id, tool, key);
            } else {
                // @ts-ignore
                await api.createTool(tool, key);
            }
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert('Failed to save tool');
        }
        setLoading(false);
    };

    if (loading && id && id !== 'new' && !tool.name) {
        return <div className="pt-32 text-center">Loading...</div>;
    }

    return (
        <div className="pt-24 pb-20 px-6 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold dark:text-white">{id === 'new' ? 'Add New Tool' : 'Edit Tool'}</h1>
                    <button onClick={() => navigate('/admin')} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                        Cancel
                    </button>
                </div>

                <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-white/10">
                    <form onSubmit={handleSave}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Name</label>
                                <input 
                                    required 
                                    value={tool.name} 
                                    onChange={e => setTool({...tool, name: e.target.value})} 
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Website URL</label>
                                <input 
                                    required 
                                    value={tool.websiteUrl} 
                                    onChange={e => setTool({...tool, websiteUrl: e.target.value})} 
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                             <div>
                                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Category</label>
                                <select 
                                    value={tool.category} 
                                    onChange={e => setTool({...tool, category: e.target.value as Category})} 
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                >
                                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Status</label>
                                <select 
                                    value={tool.status || 'approved'} 
                                    onChange={e => setTool({...tool, status: e.target.value as any})} 
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                                >
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-6">
                             <label className="block text-sm font-bold mb-2 dark:text-slate-300">Image URL</label>
                             <input 
                                value={tool.imageUrl} 
                                onChange={e => setTool({...tool, imageUrl: e.target.value})} 
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2 dark:text-slate-300">Short Description</label>
                            <input 
                                value={tool.shortDescription} 
                                onChange={e => setTool({...tool, shortDescription: e.target.value})} 
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2 dark:text-slate-300">Full Description</label>
                            <textarea 
                                rows={6} 
                                value={tool.description} 
                                onChange={e => setTool({...tool, description: e.target.value})} 
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2 dark:text-slate-300">Tags (comma separated)</label>
                            <input 
                                value={tool.tags?.join(', ')} 
                                onChange={e => setTool({...tool, tags: e.target.value.split(',').map(t => t.trim())})} 
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50" 
                            />
                        </div>
                        
                        <div className="flex items-center gap-8 mb-8 p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5">
                            <label className="flex items-center gap-3 dark:text-white font-bold cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={tool.featured} 
                                    onChange={e => setTool({...tool, featured: e.target.checked})} 
                                    className="w-5 h-5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                                />
                                Featured Tool
                            </label>
                            <div className="flex items-center gap-3">
                                <label className="font-bold dark:text-white">Rating</label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    max="5"
                                    min="0"
                                    value={tool.rating} 
                                    onChange={e => setTool({...tool, rating: parseFloat(e.target.value)})} 
                                    className="w-24 px-3 py-1 rounded bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white" 
                                />
                            </div>
                             <div className="flex items-center gap-3">
                                <label className="font-bold dark:text-white">Pricing</label>
                                <select 
                                    value={tool.pricing} 
                                    onChange={e => setTool({...tool, pricing: e.target.value})} 
                                    className="px-3 py-1 rounded bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 dark:text-white"
                                >
                                    <option value="Free">Free</option>
                                    <option value="Freemium">Freemium</option>
                                    <option value="Paid">Paid</option>
                                </select>
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
                                {loading ? 'Saving...' : 'Save Tool'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
