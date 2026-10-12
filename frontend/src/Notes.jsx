import React, { useState, useEffect } from 'react';
import NoteCards from './components/NoteCards.jsx';

function Notes() {
  /* ==================== VÙNG 1: KHỞI TẠO STATE ==================== */
  const [topic, setTopic] = useState('hoc-tap');
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ id: null, title: '', content: '' });
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  /* ==================== VÙNG 2: XỬ LÝ LOGIC & GỌI API ==================== */
  const fetchNotes = async (currentTopic = topic) => {
    const res = await fetch(`http://localhost:5000/api/notes/${currentTopic}`);
    if (!res.ok) throw new Error('Không tải được danh sách ghi chú');
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotes([]);
    setNotice('');
    fetchNotes(topic)
      .then(data => { if (active) setNotes(data); })
      .catch(err => { if (active) setNotice(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [topic]);

  const handleSave = async e => {
    e.preventDefault();
    if (!formData.title.trim()) return setNotice('Vui lòng nhập tiêu đề');
    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id
      ? `http://localhost:5000/api/notes/${topic}/${formData.id}`
      : `http://localhost:5000/api/notes/${topic}`;
    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title.trim(), content: formData.content })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lưu ghi chú thất bại');
      setNotes(await fetchNotes());
      setFormData({ id: null, title: '', content: '' });
      setNotice('Lưu ghi chú thành công!');
    } catch (error) {
      setNotice(error.message);
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Bạn có chắc muốn xóa ghi chú này?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/notes/${topic}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Xóa ghi chú thất bại');
        setNotes(await fetchNotes());
        setFormData({ id: null, title: '', content: '' });
        setNotice('Đã xóa ghi chú!');
      } catch (error) { setNotice(error.message); }
    }
  };

  const handleEdit = note => setFormData({ id: note.id, title: note.title, content: note.content });

  /* ==================== VÙNG 3: RENDER GIAO DIỆN ==================== */
  return (
    <section className="panel">
      <h2>Ghi chú Công khai</h2>
      <div className="topic-bar">
        <strong>Chủ đề: </strong>
        <select value={topic} onChange={e => {
          setTopic(e.target.value);
          setFormData({ id: null, title: '', content: '' });
        }}>
          <option value="hoc-tap">Học tập</option>
          <option value="cong-viec">Công việc</option>
          <option value="ca-nhan">Cá nhân</option>
        </select>
      </div>

      <form className="note-form" onSubmit={handleSave}>
        <h3>{formData.id ? 'Sửa ghi chú' : 'Thêm ghi chú mới'}</h3>
        <input placeholder="Tiêu đề" value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })} />
        <textarea placeholder="Nội dung" value={formData.content}
          onChange={e => setFormData({ ...formData, content: e.target.value })} />
        <div className="actions">
          <button type="submit">{formData.id ? 'Cập nhật' : 'Thêm mới'}</button>
          {formData.id && <button type="button" className="secondary"
            onClick={() => setFormData({ id: null, title: '', content: '' })}>Hủy</button>}
        </div>
      </form>
      {notice && <p role="status" className="notice">{notice}</p>}
      {loading ? <p>Đang tải danh sách ghi chú...</p> :
        <NoteCards notes={notes} onEdit={handleEdit} onDelete={handleDelete} />}
    </section>
  );
}

export default Notes;
