const express = require('express');
const router = express.Router();

// Temporary in-memory data storage
let tasks = [];

// GET all tasks
router.get('/', (req, res) => {
  res.json(tasks);
});

// POST a new task
router.post('/', (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title || !description || !dueDate) {
    return res.status(400).json({ error: 'Please provide title, description, and due date' });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    dueDate,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// GET a single task by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const task = tasks.find(task => task.id === parseInt(id));

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

// PUT to update an existing task
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate } = req.body;

  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (!title || !description || !dueDate) {
    return res.status(400).json({ error: 'Please provide title, description, and due date' });
  }

  const updatedTask = {
    id: parseInt(id),
    title,
    description,
    dueDate,
  };

  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// DELETE a task by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(taskIndex, 1);
  res.json(deletedTask[0]);
});

module.exports = router;
