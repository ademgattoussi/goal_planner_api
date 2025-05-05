const express = require('express');
const router = express.Router();
const { saveGoal , getGoalsByUserId } = require('../controllers/goalController');

router.post('/', saveGoal);
router.get('/', getGoalsByUserId); // This should be a GET request with query parameters


module.exports = router;
