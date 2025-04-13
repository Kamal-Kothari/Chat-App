import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    theme:  localStorage.getItem('chat-theme') || 'dark', // default theme
    setTheme: (theme) => {
        localStorage.setItem('chat-theme', theme); // save theme to local storage
        set({ theme }); // function to set the theme
    } 
}));