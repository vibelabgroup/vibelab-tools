import React from 'react';
import { AiTool } from '../types';
import { Link } from 'react-router-dom';

interface AppCardProps {
  tool: AiTool;
}

export const AppCard: React.FC<AppCardProps> = ({ tool }) => {
  return (
    <Link 
      to={`/tool/${tool.id}`}
      className="group relative flex flex-col glass-panel rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.2)] dark:hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] border-transparent hover:border-brand-primary/30"
    >
      {/* Featured Badge */}
      {tool.featured && (
        <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-md bg-gradient-to-r from-brand-secondary to-purple-600 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
          Featured
        </div>
      )}

      {/* Image Area */}
      <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-brand-surface">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 z-10"></div>
        <img 
          src={tool.imageUrl} 
          alt={tool.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-3 left-3 z-20 flex gap-2">
            <div className="px-2 py-1 rounded bg-black/40 backdrop-blur-md border border-white/10 text-xs text-white">
                <i className="fa-solid fa-layer-group mr-1.5 text-brand-cyan"></i>
                {tool.category}
            </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
            {tool.name}
          </h3>
          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
            <i className="fa-solid fa-star text-yellow-400"></i>
            {tool.rating}
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {tool.shortDescription}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
          <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${
            tool.pricing === 'Free' ? 'text-green-500 bg-green-500/10' : 
            tool.pricing === 'Paid' ? 'text-brand-secondary bg-brand-secondary/10' : 
            'text-brand-primary bg-brand-primary/10'
          }`}>
            {tool.pricing}
          </span>
          <div className="flex gap-2">
             {tool.tags.slice(0,2).map(tag => (
                 <span key={tag} className="text-[10px] text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">
                     #{tag}
                 </span>
             ))}
          </div>
        </div>
      </div>
    </Link>
  );
};