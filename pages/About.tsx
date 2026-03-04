import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 dark:text-white mb-6">Empowering Creators <br/> <span className="gradient-text">in the AI Era.</span></h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">VibeLab Tools is your curated gateway to the most powerful Artificial Intelligence tools shaping the future.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="glass-panel p-8 rounded-3xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center text-2xl mb-6">
                    <i className="fa-solid fa-bullseye"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    To democratize access to AI technology by providing a trusted, high-fidelity directory that helps individuals and businesses find the right tools for their needs. We believe in a future where AI enhances human creativity, not replaces it.
                </p>
            </div>
             <div className="glass-panel p-8 rounded-3xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-brand-secondary/20 text-brand-secondary flex items-center justify-center text-2xl mb-6">
                    <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Curated Quality</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Every tool listed on VibeLab Tools is manually reviewed by our team of experts. We verify functionality, pricing transparency, and user experience to ensure you only encounter the best of the best.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};