/**
 * ============================================================================
 * COMPONENT: VUNG KIN & BAO MAT (PrivateNotes.jsx) - SPRINT 3
 * VUNG 1: State - VUNG 2: Logic/API - VUNG 3: Render UI
 * PDF chua viet PUT/DELETE Note Kin -> bo sung theo checklist Sprint 3.
 * ============================================================================
 */
import React, { useState } from 'react';
import NoteCards from './components/NoteCards.jsx';

function PrivateNotes() {
  /* ==================== VÙNG 1: STATE ==================== */
  const [isUnlocked, setIsUnlocked] = useState(false); // Khi F5 se tu ve false
  const [passwordInput, setPasswordInput] = useState('');
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ id: null, title: '', content: '' });
  const [notice, setNotice] = useState('');

  /* ==================== VÙNG 2: LOGIC ==================== */
  const fetchPrivateNotes = async () => {
    const res = await fetch('http://localhost:5000/api/private/notes');
    if (!res.ok) throw new Error('Không tải được ghi chú riêng tư');
    return res.json();
  };

  const handleLogin = async e => {
    e.preventDefault();
    setNotice('');
    try {
      const res = await fetch('http://localhost:5000/api/private/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      if (!data.success) {
        setPasswordInput('');
        setNotice('Sai mật khẩu, vui lòng thử lại!');
        return;
      }
      // Chỉ tải ghi chú sau khi xác thực đúng, giống luồng Sprint 3
      const allNotes = await fetchPrivateNotes();
      setNotes(allNotes);
      setIsUnlocked(true);
      setPasswordInput('');
    } catch (error) { setNotice(error.message); }
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!formData.title.trim()) return setNotice('Vui lòng nhập tiêu đề');
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id
      ? `http://localhost:5000/api/private/notes/${formData.id}`
      : 'http://localhost:5000/api/private/notes';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title.trim(), content: formData.content })
      });
      if (!res.ok) throw new Error('Không thể lưu ghi chú riêng tư ');
      setNotes(await fetchPrivateNotes());
      setFormData({ id: null, title: '', content: '' });
      setNotice('Lưu ghi chú riêng tư thành công!');
    } catch (error) { setNotice(error.message); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn có chắc muốn xóa ghi chú này?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/private/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Không thể xóa ghi chú riêng tư ');
      setNotes(await fetchPrivateNotes());
      setFormData({ id: null, title: '', content: '' });
      setNotice('Đã xóa ghi chú riêng tư!');
    } catch (error) { setNotice(error.message); }
  };

  const handleEdit = note => setFormData({ id: note.id, title: note.title, content: note.content });

  /* ==================== VÙNG 3: RENDER ==================== */
  if (!isUnlocked) {
    return (
      <section className="panel unlock-panel">
        <h2>Khu vực Bảo mật</h2>
        <p>Vui lòng nhập mật khẩu để truy cập</p>
        <form onSubmit={handleLogin} className="unlock-form">
          <input type="password" value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            placeholder="Nhập mật khẩu..." autoComplete="current-password" />
          <button type="submit">Mở khóa</button>
        </form>
        {notice && <p role="status" className="notice">{notice}</p>}
      </section>
    );
  }

  return (
    <section className="panel private-panel">
      <div className="private-head">
        <h2>Khu vực Ghi chú Riêng tư 🔒</h2>
        <button type="button" className="secondary" onClick={() => {
          setIsUnlocked(false);
          setNotes([]);
          setFormData({ id: null, title: '', content: '' });
          setNotice('');
        }}>Khóa lại</button>
      </div>
      <form className="note-form" onSubmit={handleSave}>
        <h3>{formData.id ? 'Sửa ghi chú bí mật' : 'Thêm ghi chú bí mật'}</h3>
        <input placeholder="Tiêu đề bí mật" value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })} />
        <textarea placeholder="Nội dung bí mật" value={formData.content}
          onChange={e => setFormData({ ...formData, content: e.target.value })} />
        <div className="actions">
          <button type="submit">{formData.id ? 'Cập nhật' : 'Lưu bí mật'}</button>
          {formData.id && <button type="button" className="secondary"
            onClick={() => setFormData({ id: null, title: '', content: '' })}>Hủy</button>}
        </div>
      </form>
      {notice && <p role="status" className="notice">{notice}</p>}
      <NoteCards notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
    </section>
  );
}

export default PrivateNotes;
