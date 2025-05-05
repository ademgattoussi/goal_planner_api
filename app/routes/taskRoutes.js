const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getTasksByUserId, 
  getTasksByFrequency, 
  updateTaskStatus, 
  deleteTask 
} = require('../controllers/taskController');

// Create a new task
router.post('/', createTask);

// Get all tasks for a user
router.get('/', getTasksByUserId);

// Get tasks by frequency for a user
router.get('/by-frequency', getTasksByFrequency);

// Update task status
router.put('/:taskId/status', updateTaskStatus);

// Delete a task
router.delete('/:taskId', deleteTask);

module.exports = router;