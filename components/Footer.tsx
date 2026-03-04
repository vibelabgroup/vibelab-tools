import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/5 py-12 bg-slate-100 dark:bg-[#0f172a] mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden relative flex items-center justify-center gradient-bg">
              <span className="text-white font-bold font-display text-xs">V</span>
            </div>
            <span className="text-slate-500 text-sm font-medium">VibeLab Tools</span>
          </div>
          
          <div className="flex gap-6 text-slate-500 text-sm">
            <Link to="/privacy" className="hover:text-brand-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-brand-primary transition-colors">Terms</Link>
            <Link to="/submit" className="hover:text-brand-primary transition-colors">Submit Tool</Link>
            <Link to="/admin" className="hover:text-brand-primary transition-colors">Admin</Link>
          </div>

          <p className="text-slate-500 dark:text-slate-600 text-sm">&copy; {new Date().getFullYear()} VibeLab Tools. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
