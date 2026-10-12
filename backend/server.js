const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());                // Cho phep Frontend goi API
app.use(express.json());       // Doc du lieu JSON tu Frontend

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// =================== SPRINT 1: PROFILE ===================
const profilePath = path.join(dataDir, 'profile.json');
if (!fs.existsSync(profilePath)) {
  fs.writeFileSync(profilePath, JSON.stringify({
    displayName: 'Sinh viên', theme: 'light', password: ''
  }, null, 2), 'utf8');
}

// API 1: Doc thong tin Profile (GET)
app.get('/api/profile', (req, res) => {
  try {
    const rawData = fs.readFileSync(profilePath, 'utf8');
    const profile = JSON.parse(rawData);
    res.json(profile); // Giong code mau trong PDF Sprint 1
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đọc file' });
  }
});

// API 2: Cap nhat Profile (PUT)
app.put('/api/profile', (req, res) => {
  try {
    const newProfile = req.body;
    if (!newProfile || typeof newProfile.displayName !== 'string' ||
        !['light', 'dark'].includes(newProfile.theme) ||
        typeof newProfile.password !== 'string') {
      return res.status(400).json({ message: 'Thông tin cấu hình không hợp lệ' });
    }
    fs.writeFileSync(profilePath, JSON.stringify(newProfile, null, 2), 'utf8');
    res.json({ success: true, message: 'Đã cập nhật Profile' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi ghi file' });
  }
});

// =================== SPRINT 2: PUBLIC NOTES ===================
const notesDir = path.join(__dirname, 'data', 'notes');
if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir, { recursive: true });
}

// PDF su dung /api/notes/:topic. Gioi han 3 topic cua giao dien de an toan ten file.
const allowedTopics = new Set(['hoc-tap', 'cong-viec', 'ca-nhan']);
const getFilePath = topic => path.join(notesDir, `${topic}.json`);
const validTopic = (req, res, next) => {
  if (!allowedTopics.has(req.params.topic)) {
    return res.status(400).json({ message: 'Chủ đề không hợp lệ' });
  }
  next();
};
app.use('/api/notes/:topic', validTopic);

// 1. Lay danh sach ghi chu (GET)
app.get('/api/notes/:topic', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.json([]);
    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đọc danh sách ghi chú' });
  }
});

// 2. Them moi ghi chu (POST)
app.post('/api/notes/:topic', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    let notes = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    const newNote = {
      id: Date.now().toString(),
      title: req.body.title || 'Không tiêu đề',
      content: req.body.content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.push(newNote);
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
    res.json({ success: true, note: newNote });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi thêm ghi chú' });
  }
});

// 3. Sua ghi chu (PUT)
app.put('/api/notes/:topic/:id', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const index = notes.findIndex(n => n.id === req.params.id);
    if (index !== -1) {
      notes[index].title = req.body.title;
      notes[index].content = req.body.content;
      notes[index].updatedAt = new Date().toISOString();
      fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
      return res.json({ success: true, message: 'Đã sửa thành công' });
    }
    res.status(404).json({ message: 'Không tìm thấy ghi chú' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật ghi chú' });
  }
});

// 4. Xoa ghi chu (DELETE)
app.delete('/api/notes/:topic/:id', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const newNotes = notes.filter(n => n.id !== req.params.id);
    fs.writeFileSync(filePath, JSON.stringify(newNotes, null, 2), 'utf8');
    res.json({ success: true, message: 'Đã xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa ghi chú' });
  }
});

// =================== SPRINT 3: PRIVATE NOTES ===================
const privateNotesFile = path.join(__dirname, 'data', 'private.json');
if (!fs.existsSync(privateNotesFile)) {
  fs.writeFileSync(privateNotesFile, '[]', 'utf8');
}

// 1. API xac thuc mat khau (POST)
app.post('/api/private/auth', (req, res) => {
  try {
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    if (profile.password === req.body.password) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Sai mật khẩu!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống xác thực' });
  }
});

// 2. Lay danh sach ghi chu rieng tu (GET)
app.get('/api/private/notes', (req, res) => {
  try {
    const data = fs.readFileSync(privateNotesFile, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đọc ghi chú riêng tư' });
  }
});

// 3. Them ghi chu rieng tu (POST)
app.post('/api/private/notes', (req, res) => {
  try {
    let notes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));
    const newNote = {
      id: Date.now().toString(),
      title: req.body.title || 'Lưu bút mật',
      content: req.body.content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.push(newNote);
    fs.writeFileSync(privateNotesFile, JSON.stringify(notes, null, 2), 'utf8');
    res.json({ success: true, note: newNote });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi thêm ghi chú riêng tư ' });
  }
});

// 4 + 5: PUT/DELETE PRIVATE - PDF Sprint 3 de BE tu viet them (bo sung de du CRUD).
app.put('/api/private/notes/:id', (req, res) => {
  try {
    let notes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));
    const index = notes.findIndex(n => n.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Không tìm thấy ghi chú riêng tư ' });
    notes[index].title = req.body.title;
    notes[index].content = req.body.content;
    notes[index].updatedAt = new Date().toISOString();
    fs.writeFileSync(privateNotesFile, JSON.stringify(notes, null, 2), 'utf8');
    res.json({ success: true, message: 'Đã sửa ghi chú riêng tư ' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật ghi chú riêng tư ' });
  }
});

app.delete('/api/private/notes/:id', (req, res) => {
  try {
    let notes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));
    let newNotes = notes.filter(n => n.id !== req.params.id);
    fs.writeFileSync(privateNotesFile, JSON.stringify(newNotes, null, 2), 'utf8');
    res.json({ success: true, message: 'Đã xóa ghi chú riêng tư ' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa ghi chú riêng tư ' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend chạy tại http://localhost:${PORT}`));
