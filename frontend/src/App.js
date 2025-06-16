import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function Home() {
  return <h2>Welcome to the Task Manager</h2>;
}

function CreateTask({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(false);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const task = { title, description, status, due_date: dueDate };
    await fetch('http://127.0.0.1:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    onTaskCreated();
  };

  return (
    <div>
      <h2>Create a New Task</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /><br />

        <label>Description:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} /><br />

        <label>Status:</label>
        <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} /><br />

        <label>Due Date:</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /><br />

        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

function EditTask({ task, onCancel, onUpdate }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(task.due_date?.split('T')[0] || '');

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`http://127.0.0.1:5000/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status, due_date: dueDate }),
    });
    onUpdate();
  };

  return (
    <form onSubmit={handleUpdate}>
      <label>Title:</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /><br />

      <label>Description:</label>
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} /><br />

      <label>Status:</label>
      <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} /><br />

      <label>Due Date:</label>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /><br />

      <button type="submit">Update Task</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

function AllTasks() {
  const [tasks, setTasks] = React.useState([]);
  const [filters, setFilters] = React.useState({
    status: '',
    title: '',
    due_date: '',
    creation_time: ''
  });

  const fetchTasks = () => {
    fetch('http://127.0.0.1:5000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  };

  const fetchFilteredTasks = () => {
    const queryParams = new URLSearchParams();
    if (filters.status !== '') queryParams.append('status', filters.status);
    if (filters.title) queryParams.append('title', filters.title);
    if (filters.due_date) queryParams.append('due_date', filters.due_date);
    if (filters.creation_time) queryParams.append('creation_time', filters.creation_time);

    fetch(`http://127.0.0.1:5000/tasks/filter?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          alert(data.error || 'No tasks found with given filters.');
        }
      })
      .catch(err => console.error(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  React.useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>All Tasks</h2>

      <div style={{ marginBottom: '1em' }}>
        <h4>Filter Tasks</h4>
        <label>Status:</label>
        <select name="status" onChange={handleInputChange} value={filters.status}>
          <option value="">--</option>
          <option value="true">Completed</option>
          <option value="false">Incomplete</option>
        </select>

        <label> Title:</label>
        <input type="text" name="title" value={filters.title} onChange={handleInputChange} />

        <label> Due Date:</label>
        <input type="date" name="due_date" value={filters.due_date} onChange={handleInputChange} />

        <label> Creation Time:</label>
        <input type="datetime-local" name="creation_time" value={filters.creation_time} onChange={handleInputChange} />

        <button onClick={fetchFilteredTasks}>Apply Filters</button>
        <button onClick={fetchTasks}>Clear Filters</button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.description} - {task.due_date}
          </li>
        ))}
      </ul>
    </div>
  );
}


function App() {
  const [refreshFlag, setRefreshFlag] = useState(false);

  return (
    <Router>
      <div className="App">
        <h1>Task Manager</h1>
        <nav>
          <Link to="/"><button>Home</button></Link>
          <Link to="/create"><button>Create Task</button></Link>
          <Link to="/tasks"><button>All Tasks</button></Link>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateTask onTaskCreated={() => setRefreshFlag(!refreshFlag)} />} />
          <Route path="/tasks" element={<AllTasks key={refreshFlag} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
