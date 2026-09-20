import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  isDark: true
});

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
    document.body.className = 'h-full font-sans text-slate-100 bg-[#090d16] selection:bg-amber-500 selection:text-slate-950';

    try {
      localStorage.setItem('buildguard_theme', 'dark');
    } catch (e) {
      // Ignore
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', isDark: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

