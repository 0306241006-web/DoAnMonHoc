import React from 'react';

export default function NoteCards({ notes, onEdit, onDelete }) {
  return (
    <div className="notes-grid">
      {notes.length === 0 && <p>Chưa có ghi chú nào.</p>}
      {notes.map(note => (
        <article key={note.id} className="note-card">
          <h4>{note.title}</h4>
          <p className="note-content">{note.content}</p>
          <div className="actions">
            <button type="button" onClick={() => onEdit(note)}>Sửa</button>
            <button type="button" className="danger" onClick={() => onDelete(note.id)}>Xóa</button>
          </div>
        </article>
      ))}
    </div>
  );
}
