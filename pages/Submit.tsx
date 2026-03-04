import React, { useState } from 'react';

export const Submit: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    shortDescription: '',
    category: 'Text & Writing',
    description: '',
    email: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/tools/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit tool');
      }

      setStatus('success');
      setFormData({
        name: '',
        websiteUrl: '',
        shortDescription: '',
        category: 'Text & Writing',
        description: '',
        email: ''
      });
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">Submit a Tool</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Help us build the most comprehensive AI directory. Submissions are reviewed daily.</p>
        </div>

        {status === 'success' ? (
            <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-check text-white text-3xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Submission Received!</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8">Thank you for submitting your tool. Our team will review it shortly and add it to the directory if it meets our guidelines.</p>
                <button onClick={() => setStatus('idle')} className="px-8 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-secondary transition-colors">
                    Submit Another Tool
                </button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                {status === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                        {errorMessage}
                    </div>
                )}
                
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tool Name *</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. ChatGPT" 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-brand-primary outline-none text-slate-900 dark:text-white transition-colors" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Website URL *</label>
                            <input 
                                type="url" 
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                required
                                placeholder="https://..." 
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-brand-primary outline-none text-slate-900 dark:text-white transition-colors" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Short Description *</label>
                        <input 
                            type="text" 
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            required
                            placeholder="One liner about the tool..." 
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-brand-primary outline-none text-slate-900 dark:text-white transition-colors" 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category</label>
                        <select 
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-brand-primary outline-none text-slate-900 dark:text-white transition-colors"
                        >
                            <option>Text & Writing</option>
                            <option>Image Generation</option>
                            <option>Video</option>
                            <option>Audio & Speech</option>
                            <option>Coding Assistant</option>
                            <option>Business</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Detailed Description</label>
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4} 
                            placeholder="Tell us more about the features..." 
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-brand-primary outline-none text-slate-900 dark:text-white transition-colors"
                        ></textarea>
                    </div>

                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Your Email</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="For notification..." 
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-brand-primary outline-none text-slate-900 dark:text-white transition-colors" 
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    className="w-full py-4 rounded-xl gradient-bg text-white font-bold text-lg shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'submitting' ? 'Submitting...' : 'Submit Tool'}
                </button>
                <p className="text-center text-xs text-slate-500">By submitting, you agree to our Terms of Service.</p>
            </form>
        )}
      </div>
    </div>
  );
};
