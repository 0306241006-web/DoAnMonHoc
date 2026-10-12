import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext.jsx';

function Settings() {
  const [profile, setProfile] = useState({ displayName: '', theme: 'light', password: '' });
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const { setDisplayName, setTheme } = useApp();

  // VÙNG 1: Lấy dữ liệu cấu hình khi load trang
  useEffect(() => {
    fetch('http://localhost:5000/api/profile')
      .then(res => { if (!res.ok) throw new Error('Không tải được Profile'); return res.json(); })
      .then(data => {
        setProfile(data);
        setDisplayName(data.displayName || 'Sinh viên');
        setTheme(data.theme === 'dark' ? 'dark' : 'light');
      })
      .catch(() => setNotice('Không kết nối được Backend. Hãy chạy node server.js ở cổng 5000.'));
  }, [setDisplayName, setTheme]);

  // VÙNG 2: Xử lý thay đổi Input
  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // VÙNG 2: Lưu thông tin qua API PUT
  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi cập nhật');
      setDisplayName(profile.displayName || 'Sinh viên');
      setTheme(profile.theme);
      setNotice('Lưu thành công!');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  // VÙNG 3: Render giao diện
  return (
    <section className="panel">
      <h2>Cài đặt hệ thống</h2>
      <p>Thay đổi tên hiển thị, giao diện Sáng/Tối và mật khẩu vùng riêng tư .</p>
      <form className="settings-form" onSubmit={handleSave}>
        <label>
          Tên hiển thị:
          <input name="displayName" value={profile.displayName} onChange={handleChange} />
        </label>
        <label>
          Giao diện:
          <select name="theme" value={profile.theme} onChange={handleChange}>
            <option value="light">Sáng</option>
            <option value="dark">Tối</option>
          </select>
        </label>
        <label>
          Mật khẩu vùng riêng tư :
          <input type="password" name="password" value={profile.password}
            onChange={handleChange} autoComplete="new-password" />
        </label>
        <button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
      </form>
      {notice && <p role="status" className="notice">{notice}</p>}
    </section>
  );
}

export default Settings;
