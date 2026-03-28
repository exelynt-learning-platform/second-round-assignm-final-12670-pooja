import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './app/store';
import ChatPage from './pages/ChatPage';

/**
 * App — root component.
 * Manages dark mode (persisted in localStorage) and wraps the app in the Redux Provider.
 */
function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark mode class on <html> element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const handleToggleDark = () => setDarkMode((prev) => !prev);

  return (
    <div className="h-screen flex flex-col app-container overflow-hidden transition-colors duration-300">
      <ChatPage darkMode={darkMode} onToggleDark={handleToggleDark} />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
