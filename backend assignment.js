const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const tasks = [];
const subTasks = [];

// Sample user for demonstration
const sampleUser = {
  id: 1,
  phone_number: '1234567890',
  priority: 0
};

const JWT_SECRET_KEY = 'your_secret_key'; // Should be stored securely, not hardcoded

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware for input validation
const validateInput = (req, res, next) => {
  const { title, description, due_date } = req.body;
  if (!title || !description || !due_date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  next();
};

// API to create a task
app.post('/api/tasks', verifyToken, validateInput, (req, res) => {
  const { title, description, due_date } = req.body;
  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    due_date,
    status: 'TODO',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// API to create a sub task
app.post('/api/subtasks', verifyToken, (req, res) => {
  const { task_id } = req.body;
  const newSubTask = {
    id: subTasks.length + 1,
    task_id,
    status: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null
  };
  subTasks.push(newSubTask);
  res.status(201).json(newSubTask);
});

// API to get all user tasks with filters and pagination
app.get('/api/tasks', verifyToken, (req, res) => {
  let { priority, due_date, page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let filteredTasks = tasks.filter(task => !task.deleted_at);

  if (priority !== undefined) {
    filteredTasks = filteredTasks.filter(task => task.priority === parseInt(priority));
  }

  if (due_date !== undefined) {
    // Assuming due_date format is YYYY-MM-DD
    filteredTasks = filteredTasks.filter(task => task.due_date === due_date);
  }

  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
  res.status(200).json({
    total_count: filteredTasks.length,
    tasks: paginatedTasks
  });
});

// API to get all user sub tasks with filters
app.get('/api/subtasks', verifyToken, (req, res) => {
  const { task_id } = req.query;
  const filteredSubTasks = task_id ? subTasks.filter(subTask => subTask.task_id === parseInt(task_id)) : subTasks;
  res.status(200).json(filteredSubTasks);
});

// API to update a task
app.put('/api/tasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { due_date, status } = req.body;
  const task = tasks.find(task => task.id === parseInt(id));
  if (!task || task.deleted_at) return res.status(404).json({ message: 'Task not found' });

  task.due_date = due_date || task.due_date;
  task.status = status || task.status;
  task.updated_at = new Date().toISOString();

  res.status(200).json(task);
});

// API to update a sub task
app.put('/api/subtasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const subTask = subTasks.find(subTask => subTask.id === parseInt(id));
  if (!subTask || subTask.deleted_at) return res.status(404).json({ message: 'Subtask not found' });

  subTask.status = status;
  subTask.updated_at = new Date().toISOString();

  res.status(200).json(subTask);
});

// API to delete a task (soft deletion)
app.delete('/api/tasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const task = tasks.find(task => task.id === parseInt(id));
  if (!task || task.deleted_at) return res.status(404).json({ message: 'Task not found' });

  task.deleted_at = new Date().toISOString();
  res.status(204).end();
});

// API to delete a sub task (soft deletion)
app.delete('/api/subtasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const subTask = subTasks.find(subTask => subTask.id === parseInt(id));
  if (!subTask || subTask.deleted_at) return res.status(404).json({ message: 'Subtask not found' });

  subTask.deleted_at = new Date().toISOString();
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const tasks = [];
const subTasks = [];

// Sample user for demonstration
const sampleUser = {
  id: 1,
  phone_number: '1234567890',
  priority: 0
};

const JWT_SECRET_KEY = 'your_secret_key'; // Should be stored securely, not hardcoded

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware for input validation
const validateInput = (req, res, next) => {
  const { title, description, due_date } = req.body;
  if (!title || !description || !due_date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  next();
};

// API to create a task
app.post('/api/tasks', verifyToken, validateInput, (req, res) => {
  const { title, description, due_date } = req.body;
  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    due_date,
    status: 'TODO',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// API to create a sub task
app.post('/api/subtasks', verifyToken, (req, res) => {
  const { task_id } = req.body;
  const newSubTask = {
    id: subTasks.length + 1,
    task_id,
    status: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null
  };
  subTasks.push(newSubTask);
  res.status(201).json(newSubTask);
});

// API to get all user tasks with filters and pagination
app.get('/api/tasks', verifyToken, (req, res) => {
  let { priority, due_date, page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let filteredTasks = tasks.filter(task => !task.deleted_at);

  if (priority !== undefined) {
    filteredTasks = filteredTasks.filter(task => task.priority === parseInt(priority));
  }

  if (due_date !== undefined) {
    // Assuming due_date format is YYYY-MM-DD
    filteredTasks = filteredTasks.filter(task => task.due_date === due_date);
  }

  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
  res.status(200).json({
    total_count: filteredTasks.length,
    tasks: paginatedTasks
  });
});

// API to get all user sub tasks with filters
app.get('/api/subtasks', verifyToken, (req, res) => {
  const { task_id } = req.query;
  const filteredSubTasks = task_id ? subTasks.filter(subTask => subTask.task_id === parseInt(task_id)) : subTasks;
  res.status(200).json(filteredSubTasks);
});

// API to update a task
app.put('/api/tasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { due_date, status } = req.body;
  const task = tasks.find(task => task.id === parseInt(id));
  if (!task || task.deleted_at) return res.status(404).json({ message: 'Task not found' });

  task.due_date = due_date || task.due_date;
  task.status = status || task.status;
  task.updated_at = new Date().toISOString();

  res.status(200).json(task);
});

// API to update a sub task
app.put('/api/subtasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const subTask = subTasks.find(subTask => subTask.id === parseInt(id));
  if (!subTask || subTask.deleted_at) return res.status(404).json({ message: 'Subtask not found' });

  subTask.status = status;
  subTask.updated_at = new Date().toISOString();

  res.status(200).json(subTask);
});

// API to delete a task (soft deletion)
app.delete('/api/tasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const task = tasks.find(task => task.id === parseInt(id));
  if (!task || task.deleted_at) return res.status(404).json({ message: 'Task not found' });

  task.deleted_at = new Date().toISOString();
  res.status(204).end();
});

// API to delete a sub task (soft deletion)
app.delete('/api/subtasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const subTask = subTasks.find(subTask => subTask.id === parseInt(id));
  if (!subTask || subTask.deleted_at) return res.status(404).json({ message: 'Subtask not found' });

  subTask.deleted_at = new Date().toISOString();
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
