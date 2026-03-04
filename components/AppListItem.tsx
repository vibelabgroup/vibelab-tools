import React from 'react';
import { AiTool } from '../types';
import { Link } from 'react-router-dom';

interface AppListItemProps {
  tool: AiTool;
}

export const AppListItem: React.FC<AppListItemProps> = ({ tool }) => {
  return (
    <Link 
      to={`/tool/${tool.id}`}
      className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 glass-panel p-4 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg border-transparent hover:border-brand-primary/30"
    >
      {/* Featured Indicator Line for List View */}
      {tool.featured && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-secondary to-purple-600"></div>
      )}

      {/* Image */}
      <div className="relative w-full sm:w-32 h-32 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-brand-surface">
        <img 
          src={tool.imageUrl} 
          alt={tool.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors truncate">
                {tool.name}
            </h3>
            {tool.featured && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 uppercase tracking-wider">
                    Featured
                </span>
            )}
            <span className={`sm:hidden ml-auto text-xs font-mono font-medium px-2 py-0.5 rounded ${
                tool.pricing === 'Free' ? 'text-green-500 bg-green-500/10' : 
                tool.pricing === 'Paid' ? 'text-brand-secondary bg-brand-secondary/10' : 
                'text-brand-primary bg-brand-primary/10'
            }`}>
                {tool.pricing}
            </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 sm:mb-2">
            {tool.shortDescription}
        </p>
        
        {/* Tags Row */}
        <div className="flex flex-wrap gap-2">
             {tool.tags.map(tag => (
                 <span key={tag} className="text-[10px] text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">
                     #{tag}
                 </span>
             ))}
        </div>
      </div>

      {/* Desktop Meta (Right Side) */}
      <div className="hidden sm:flex flex-col items-end gap-3 shrink-0 ml-4 min-w-[140px]">
         <div className="flex flex-col items-end gap-1">
            <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${
                tool.pricing === 'Free' ? 'text-green-500 bg-green-500/10' : 
                tool.pricing === 'Paid' ? 'text-brand-secondary bg-brand-secondary/10' : 
                'text-brand-primary bg-brand-primary/10'
            }`}>
                {tool.pricing}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <i className="fa-solid fa-star text-yellow-400"></i>
                {tool.rating} <span className="opacity-60">({tool.reviewCount})</span>
            </div>
         </div>
         
         <div className="px-2 py-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] text-slate-500 dark:text-slate-400">
            {tool.category}
        </div>
      </div>
    </Link>
  );
};