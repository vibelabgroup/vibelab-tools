import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ToolDetails } from './pages/ToolDetails';
import { Submit } from './pages/Submit';
import { About } from './pages/About';
import { Admin } from './pages/Admin';
import { AdminEditTool } from './pages/AdminEditTool';
import { AdminEditNews } from './pages/AdminEditNews';
import { News } from './pages/News';
import { NewsDetails } from './pages/NewsDetails';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';

// Layout wrapper to persist Header/Footer
const Layout: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-[#0f172a] dark:text-[#f8fafc] transition-colors duration-300">
      <Header toggleTheme={toggleTheme} isDark={isDark} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewsDetails />} />
          <Route path="tool/:id" element={<ToolDetails />} />
          <Route path="submit" element={<Submit />} />
          <Route path="about" element={<About />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/tools/:id" element={<AdminEditTool />} />
          <Route path="admin/news/:id" element={<AdminEditNews />} />
          {/* Fallback for undefined routes */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;