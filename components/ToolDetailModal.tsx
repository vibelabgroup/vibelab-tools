import React from 'react';
import { AiTool } from '../types';

interface ToolDetailModalProps {
  tool: AiTool | null;
  onClose: () => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({ tool, onClose }) => {
  if (!tool) return null;

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return 'visit website';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh] animate-float">
        
        {/* Header Image */}
        <div className="relative h-64 shrink-0">
            <img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent opacity-90"></div>
            
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/10"
            >
                <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-wide">
                        {tool.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20 backdrop-blur-md">
                        {tool.pricing}
                    </span>
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-2">{tool.name}</h2>
                <div className="flex items-center gap-4 text-slate-300 text-sm">
                    <span className="flex items-center gap-1"><i className="fa-solid fa-star text-yellow-400"></i> {tool.rating} ({tool.reviewCount} reviews)</span>
                    <span className="flex items-center gap-1"><i className="fa-solid fa-globe"></i> {getHostname(tool.websiteUrl)}</span>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">About</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {tool.description}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Key Features</h3>
                        <ul className="space-y-2">
                            {[1, 2, 3].map((_, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mt-0.5 shrink-0">
                                        <i className="fa-solid fa-check text-xs"></i>
                                    </div>
                                    <span>High fidelity output with minimal latency processing.</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-6">
                    <a 
                        href={tool.websiteUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full py-4 rounded-xl gradient-bg text-white font-bold shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 flex items-center justify-center gap-2 transition-transform hover:-translate-y-1"
                    >
                        Visit Website <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>

                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {tool.tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-black/20 text-slate-600 dark:text-slate-400">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                         <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Similar Tools</h4>
                         <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-300 dark:bg-slate-700"></div>
                                <div className="text-sm dark:text-slate-300">Alternative A</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-300 dark:bg-slate-700"></div>
                                <div className="text-sm dark:text-slate-300">Alternative B</div>
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