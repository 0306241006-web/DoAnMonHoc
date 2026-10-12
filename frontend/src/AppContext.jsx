import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [displayName, setDisplayName] = useState('Sinh viên');
  const [theme, setTheme] = useState('light');

  // theme va ten van dung sau F5 tren moi trang.
  useEffect(() => {
    let active = true;
    fetch('http://localhost:5000/api/profile')
      .then(res => { if (!res.ok) throw new Error('Khong tai duoc Profile'); return res.json(); })
      .then(data => {
        if (!active) return;
        setDisplayName(data.displayName || 'Sinh viên');
        setTheme(data.theme === 'dark' ? 'dark' : 'light');
      })
      .catch(() => { /* Settings.jsx se hien thong bao khi Backend chua mo */ });
    return () => { active = false; };
  }, []);

  return (
    <AppContext.Provider value={{ displayName, setDisplayName, theme, setTheme }}>
      <div className={`app theme-${theme}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
