const express = require('express');
const router = express.Router();
const { saveGoal , getGoalsByUserId, updateMilestone, deleteGoal } = require('../controllers/goalController');

router.post('/', saveGoal);
router.get('/', getGoalsByUserId); // This should be a GET request with query parameters
router.put('/milestone/:id', updateMilestone);
router.delete('/:goalId', deleteGoal); // Uncomment if you have a delete function

module.exports = router;
