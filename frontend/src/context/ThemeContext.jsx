import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  isDark: true
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('buildguard_theme');
      return saved ? saved : 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      document.body.className = 'h-full font-sans text-slate-100 bg-[#090d16] selection:bg-amber-500 selection:text-slate-950';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      document.body.className = 'h-full font-sans text-slate-900 bg-slate-50 selection:bg-amber-100 selection:text-amber-900';
    }

    try {
      localStorage.setItem('buildguard_theme', theme);
    } catch (e) {
      // Ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
