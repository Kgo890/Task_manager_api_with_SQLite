import React, { useState } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(false);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      status,
      due_date: dueDate,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();
      console.log('Task Created:', result);
      // Clear form
      setTitle('');
      setDescription('');
      setStatus(false);
      setDueDate('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div>
      <h1>Create a New Task</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Description:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Status:</label>
        <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} />

        <label>Due Date:</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default App;
