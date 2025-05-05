const db = require('../config/db');

// Create a new task
const createTask = (req, res) => {
  const {
    taskName,
    description,
    frequency,
    dueDate,
    isCompleted,
    userId
  } = req.body;

  const sql = `
    INSERT INTO tasks (taskName, description, frequency, dueDate, isCompleted, userId)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [taskName, description, frequency, dueDate, isCompleted, userId], (err, result) => {
    if (err) {
      console.error('Error creating task:', err);
      return res.status(500).json({ error: 'Failed to create task' });
    }

    res.status(201).json({ 
      message: 'Task created successfully',
      taskId: result.insertId
    });
  });
};

// Get all tasks for a user
const getTasksByUserId = (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const sql = `SELECT * FROM tasks WHERE userId = ? ORDER BY createdDate DESC`;

  db.query(sql, [userId], (err, tasks) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(tasks);
  });
};

// Get tasks by frequency for a user
const getTasksByFrequency = (req, res) => {
  const { userId, frequency } = req.query;

  if (!userId || !frequency) {
    return res.status(400).json({ error: 'userId and frequency are required' });
  }

  const sql = `SELECT * FROM tasks WHERE userId = ? AND frequency = ? ORDER BY createdDate DESC`;

  db.query(sql, [userId, frequency], (err, tasks) => {
    if (err) {
      console.error('Error fetching tasks by frequency:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(tasks);
  });
};

// Update task status (complete/incomplete)
const updateTaskStatus = (req, res) => {
  const taskId = req.params.taskId;
  const { isCompleted } = req.body;

  if (isCompleted === undefined) {
    return res.status(400).json({ error: 'isCompleted status is required' });
  }

  const sql = `UPDATE tasks SET isCompleted = ? WHERE taskId = ?`;

  db.query(sql, [isCompleted, taskId], (err, result) => {
    if (err) {
      console.error('Error updating task status:', err);
      return res.status(500).json({ error: 'Failed to update task status' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task status updated successfully' });
  });
};

// Delete a task
const deleteTask = (req, res) => {
  const taskId = req.params.taskId;

  const sql = `DELETE FROM tasks WHERE taskId = ?`;

  db.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ error: 'Failed to delete task' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  });
};

module.exports = {
  createTask,
  getTasksByUserId,
  getTasksByFrequency,
  updateTaskStatus,
  deleteTask
};