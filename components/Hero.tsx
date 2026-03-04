import React from 'react';

interface HeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="relative overflow-hidden pt-32 pb-20 px-6 border-b border-slate-200 dark:border-white/5">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[500px] bg-brand-primary/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-20 right-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-brand-secondary/10 blur-[80px] md:blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
          Discover the Future
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight font-display text-slate-900 dark:text-white">
          Curated Directory of <br />
          <span className="gradient-text">AI Superpowers.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Explore the best AI tools tailored for creators, developers, and businesses. Level up your workflow today.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-white dark:bg-brand-surface border border-slate-200 dark:border-white/10 rounded-xl flex items-center p-2 shadow-xl">
            <div className="pl-4 pr-3 text-slate-400">
              <i className="fa-solid fa-search text-lg"></i>
            </div>
            <input 
              type="text" 
              placeholder="Search specifically for tools, categories, or tags..."
              className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="hidden md:flex items-center pr-2">
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 font-mono">
                    ⌘ K
                </span>
            </div>
          </div>
        </div>
        
        {/* Quick Tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            <span className="text-slate-500">Trending:</span>
            {['Video Generation', 'Coding Assistants', 'Copywriting'].map(tag => (
                <button 
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors text-slate-600 dark:text-slate-300 border border-transparent hover:border-brand-primary/20"
                >
                    {tag}
                </button>
            ))}
        </div>
      </div>
    </header>
  );
};
