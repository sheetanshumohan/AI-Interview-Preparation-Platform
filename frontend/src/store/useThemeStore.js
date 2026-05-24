import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isDarkMode: localStorage.getItem('app-theme') ? localStorage.getItem('app-theme') === 'dark' : true,
  
  toggleTheme: () => set((state) => {
    const newMode = !state.isDarkMode;
    localStorage.setItem('app-theme', newMode ? 'dark' : 'light');
    const root = window.document.documentElement;
    if (newMode) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
    return { isDarkMode: newMode };
  }),

  initTheme: () => {
    const saved = localStorage.getItem('app-theme');
    const isDark = saved ? saved === 'dark' : true;
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
    set({ isDarkMode: isDark });
  }
}));
