import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import { useApp } from './AppContext.jsx';
import Notes from './Notes.jsx';
import Settings from './Settings.jsx';
import PrivateNotes from './PrivateNotes.jsx';

export default function App() {
  const { displayName } = useApp();
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>QUẢN LÝ GHI CHÚ</h2>
        <p>Xin chào, {displayName}</p>
        <nav>
          <NavLink to="/" end>Trang chủ / Ghi chú thường</NavLink>
          <NavLink to="/settings">Cài đặt</NavLink>
          <NavLink to="/private">Vùng riêng tư </NavLink>
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/private" element={<PrivateNotes />} />
          <Route path="*" element={<h2>Không tìm thấy trang</h2>} />
        </Routes>
      </main>
    </div>
  );
}
