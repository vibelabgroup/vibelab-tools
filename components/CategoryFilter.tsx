import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="sticky top-20 z-40 bg-slate-50/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 py-4 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-2 min-w-max">
          {Object.values(Category).map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border
                  ${isSelected 
                    ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/25' 
                    : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-brand-primary/50 hover:text-brand-primary dark:hover:text-white'
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
