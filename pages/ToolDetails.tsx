import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AiTool } from '../types';
import { api } from '../utils/api';

export const ToolDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<AiTool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTool = async () => {
        if (!id) return;
        try {
            const data = await api.getTool(id);
            setTool(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadTool();
  }, [id]);

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!tool) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">Tool not found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">The AI tool you are looking for doesn't exist or has been removed.</p>
        <Link to="/" className="px-6 py-3 rounded-lg gradient-bg text-white font-bold hover:opacity-90 transition-opacity">
          Back to Directory
        </Link>
      </div>
    );
  }

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return 'visit website';
    }
  };

  return (
    <div className="animate-fade-in-up">
        {/* Header Hero */}
        <div className="relative h-[400px] w-full overflow-hidden">
            <div className="absolute inset-0 bg-slate-900">
                <img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-cover opacity-50 blur-sm scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent"></div>
            </div>
            
            <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <Link to="/" className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-md transition-colors border border-white/10">
                        <i className="fa-solid fa-arrow-left mr-2"></i> Back
                    </Link>
                    <span className="px-3 py-1.5 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-wide">
                        {tool.category}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-white text-xs font-bold border backdrop-blur-md ${tool.pricing === 'Free' ? 'bg-green-500/20 border-green-500/30' : 'bg-white/10 border-white/20'}`}>
                        {tool.pricing}
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">{tool.name}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-slate-300">
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fa-solid fa-star ${i < Math.floor(tool.rating) ? '' : 'text-slate-600'}`}></i>
                            ))}
                        </div>
                        <span className="font-semibold text-white">{tool.rating}</span>
                        <span className="text-slate-400">({tool.reviewCount} reviews)</span>
                    </div>
                    
                    <span className="hidden md:inline text-slate-600">•</span>
                    
                    <a href={tool.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                        <i className="fa-solid fa-globe"></i> 
                        {getHostname(tool.websiteUrl)}
                    </a>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                            <i className="fa-solid fa-circle-info text-brand-primary text-xl"></i>
                            Overview
                        </h3>
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                            <p>{tool.description}</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                            <i className="fa-solid fa-bolt text-yellow-400 text-xl"></i>
                            Key Features
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {(tool.keyFeatures || []).map((feature, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <div className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                                        <i className="fa-solid fa-check text-xs"></i>
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl glass-panel border border-brand-primary/20 shadow-xl shadow-brand-primary/5 sticky top-24">
                        <a 
                            href={tool.websiteUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full py-4 rounded-xl gradient-bg text-white font-bold shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 mb-6 text-lg"
                        >
                            Visit Website <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider opacity-70">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {tool.tags.map(tag => (
                                        <Link to={`/?search=${tag}`} key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-brand-primary hover:text-white transition-colors">
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};