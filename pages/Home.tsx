import React, { useState, useMemo, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { CategoryFilter } from '../components/CategoryFilter';
import { AppCard } from '../components/AppCard';
import { AppListItem } from '../components/AppListItem';
import { Category, AiTool } from '../types';
import { api } from '../utils/api';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [tools, setTools] = useState<AiTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTools = async () => {
        try {
            const data = await api.getTools();
            setTools(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    loadTools();
  }, []);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = selectedCategory === Category.ALL || tool.category === selectedCategory;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, tools]);

  return (
    <div>
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />

      <div id="directory" className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Controls Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center">
            {selectedCategory === Category.ALL ? 'All Tools' : selectedCategory}
            <span className="ml-3 text-sm font-sans font-normal text-slate-500 bg-slate-200 dark:bg-white/10 px-2 py-1 rounded-full">
              {filteredTools.length}
            </span>
          </h2>
          
          <div className="flex items-center gap-6">
              {/* View Toggle */}
              <div className="flex items-center p-1 bg-slate-200 dark:bg-white/5 rounded-lg border border-slate-300 dark:border-white/10">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`w-9 h-9 flex items-center justify-center rounded-md transition-all ${
                        viewMode === 'grid' 
                        ? 'bg-white dark:bg-brand-surface text-brand-primary shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="Grid View"
                  >
                      <i className="fa-solid fa-grip"></i>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`w-9 h-9 flex items-center justify-center rounded-md transition-all ${
                        viewMode === 'list' 
                        ? 'bg-white dark:bg-brand-surface text-brand-primary shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="List View"
                  >
                      <i className="fa-solid fa-list"></i>
                  </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="hidden sm:inline">Sort by:</span>
                  <select className="bg-transparent border-none outline-none font-bold text-brand-primary cursor-pointer p-0">
                      <option>Popularity</option>
                      <option>Newest</option>
                      <option>Rating</option>
                  </select>
              </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1,2,3,4].map(i => (
                    <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse"></div>
                ))}
             </div>
        ) : filteredTools.length > 0 ? (
          <div className={
              viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "flex flex-col gap-4 max-w-4xl mx-auto"
          }>
            {filteredTools.map((tool) => (
               viewMode === 'grid' ? (
                <AppCard key={tool.id} tool={tool} />
               ) : (
                <AppListItem key={tool.id} tool={tool} />
               )
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
              <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-slate-200 dark:bg-white/5 mb-6 text-4xl text-slate-400">
                  <i className="fa-regular fa-folder-open"></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">No tools found</h3>
              <p className="text-slate-500">Try adjusting your search or category filter.</p>
              <button 
                  onClick={() => {setSearchTerm(''); setSelectedCategory(Category.ALL)}}
                  className="mt-6 text-brand-primary hover:underline font-medium"
              >
                  Clear all filters
              </button>
          </div>
        )}
      </div>
    </div>
  );
};