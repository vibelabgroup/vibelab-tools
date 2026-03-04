import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiTool, Category } from '../types';
import { api } from '../utils/api';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [key, setKey] = useState('');
  const [activeTab, setActiveTab] = useState<'tools' | 'news'>('tools');
  const navigate = useNavigate();
  
  // Tools State
  const [tools, setTools] = useState<AiTool[]>([]);
  const [toolFilter, setToolFilter] = useState<'all' | 'pending' | 'approved'>('all');
  
  // News State
  const [news, setNews] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('vibelab_admin_key');
    if (savedKey) {
        verify(savedKey);
    }
  }, []);

  const verify = async (k: string) => {
      const valid = await api.verifyKey(k);
      if (valid) {
          setIsAuthenticated(true);
          setKey(k);
          localStorage.setItem('vibelab_admin_key', k);
          loadData(k);
      } else {
          alert('Invalid Key');
      }
  };

  const loadData = async (apiKey: string) => {
      setLoading(true);
      try {
          const [toolsData, newsData] = await Promise.all([
              api.getAdminTools(apiKey),
              api.getAdminNews(apiKey)
          ]);
          setTools(toolsData);
          setNews(newsData);
      } catch (e) {
          console.error(e);
      }
      setLoading(false);
  };

  const handleDeleteTool = async (id: string) => {
      if(!confirm('Are you sure?')) return;
      try {
          await api.deleteTool(id, key);
          loadData(key);
      } catch (e) {
          alert('Failed to delete tool');
      }
  };

  const handleApproveTool = async (tool: AiTool) => {
      try {
          await api.updateTool(tool.id, { ...tool, status: 'approved' }, key);
          loadData(key);
      } catch (e) {
          alert('Failed to approve tool');
      }
  };

  const handleDeleteNews = async (id: string) => {
      if(!confirm('Are you sure?')) return;
      try {
          await api.deleteNews(id, key);
          loadData(key);
      } catch (e) {
          alert('Failed to delete news');
      }
  };

  const filteredTools = tools.filter(t => {
      if (toolFilter === 'all') return true;
      return t.status === toolFilter;
  });

  if (!isAuthenticated) {
      return (
          <div className="min-h-screen pt-32 flex justify-center">
              <div className="glass-panel p-8 rounded-2xl w-full max-w-md h-fit">
                  <h2 className="text-2xl font-bold mb-4 dark:text-white">Admin Access</h2>
                  <input 
                    type="password" 
                    placeholder="Enter Admin Key" 
                    className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10"
                    onKeyDown={(e) => { if (e.key === 'Enter') verify(e.currentTarget.value) }}
                  />
                  <button onClick={(e) => verify((e.target as any).previousSibling.value)} className="w-full gradient-bg text-white py-2 rounded-lg font-bold">Login</button>
              </div>
          </div>
      );
  }

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab('tools')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm ${activeTab === 'tools' ? 'bg-brand-primary text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}
                    >
                        Tools
                    </button>
                    <button 
                        onClick={() => setActiveTab('news')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm ${activeTab === 'news' ? 'bg-brand-primary text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}
                    >
                        News
                    </button>
                </div>
            </div>

            {activeTab === 'tools' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-2">
                            <button onClick={() => setToolFilter('all')} className={`px-3 py-1 rounded-full text-xs font-bold ${toolFilter === 'all' ? 'bg-slate-800 text-white dark:bg-white dark:text-black' : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400'}`}>All</button>
                            <button onClick={() => setToolFilter('pending')} className={`px-3 py-1 rounded-full text-xs font-bold ${toolFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400'}`}>Pending</button>
                            <button onClick={() => setToolFilter('approved')} className={`px-3 py-1 rounded-full text-xs font-bold ${toolFilter === 'approved' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400'}`}>Approved</button>
                        </div>
                        <Link 
                            to="/admin/tools/new"
                            className="gradient-bg px-4 py-2 rounded-lg text-white font-bold text-sm flex items-center gap-2"
                        >
                            <i className="fa-solid fa-plus"></i> Add New Tool
                        </Link>
                    </div>

                    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-white/5 uppercase font-bold text-xs text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Tool</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Rating</th>
                                    <th className="px-6 py-4">Featured</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                                {loading ? (
                                    <tr><td colSpan={6} className="px-6 py-8 text-center">Loading...</td></tr>
                                ) : filteredTools.map(tool => (
                                    <tr key={tool.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={tool.imageUrl} className="w-8 h-8 rounded object-cover" />
                                                <span className="font-bold dark:text-white">{tool.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-xs uppercase font-bold ${
                                                tool.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                                tool.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {tool.status || 'approved'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{tool.category}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-1">
                                                <i className="fa-solid fa-star text-yellow-400 text-xs"></i>
                                                {tool.rating}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {tool.featured && <span className="text-brand-secondary">★</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            {tool.status === 'pending' && (
                                                <button onClick={() => handleApproveTool(tool)} className="text-green-500 hover:text-green-600 font-bold" title="Approve">
                                                    <i className="fa-solid fa-check"></i>
                                                </button>
                                            )}
                                            <Link to={`/admin/tools/${tool.id}`} className="text-slate-400 hover:text-brand-primary transition-colors" title="Edit">
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => handleDeleteTool(tool.id)} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === 'news' && (
                <>
                    <div className="flex justify-end mb-6">
                        <Link 
                            to="/admin/news/new"
                            className="gradient-bg px-4 py-2 rounded-lg text-white font-bold text-sm flex items-center gap-2"
                        >
                            <i className="fa-solid fa-plus"></i> Add New News
                        </Link>
                    </div>
                    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-white/5 uppercase font-bold text-xs text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Author</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                                {news.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                                        <td className="px-6 py-4 font-bold dark:text-white">{item.title}</td>
                                        <td className="px-6 py-4">{item.date}</td>
                                        <td className="px-6 py-4">{item.author}</td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <Link to={`/admin/news/${item.id}`} className="text-slate-400 hover:text-brand-primary transition-colors" title="Edit">
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </Link>
                                            <button onClick={() => handleDeleteNews(item.id)} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    </div>
  );
};
