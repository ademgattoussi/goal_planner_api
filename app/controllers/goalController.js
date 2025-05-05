const db = require("../config/db");

const saveGoal = (req, res) => {
  const {
    goalName,
    description,
    startDate,
    endDate,
    userId,
    isAchieved,
    milestones,
  } = req.body;

  const goalSql = `
    INSERT INTO goals (goalName, description, startDate, endDate, userId, isAchieved)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    goalSql,
    [goalName, description, startDate, endDate, userId, isAchieved],
    (err, result) => {
      if (err) {
        console.error("Error inserting goal:", err);
        return res.status(500).json({ error: "Failed to insert goal" });
      }

      const insertedGoalId = result.insertId;

      // Insert milestones
      const milestoneSql = `
      INSERT INTO milestones (goalId, milestoneName, description, targetDate, isCompleted)
      VALUES ?
    `;

      const milestoneValues = milestones.map((m) => [
        insertedGoalId,
        m.milestoneName,
        m.description,
        m.targetDate,
        m.isCompleted,
      ]);

      if (milestoneValues.length > 0) {
        db.query(milestoneSql, [milestoneValues], (milestoneErr) => {
          if (milestoneErr) {
            console.error("Error inserting milestones:", milestoneErr);
            return res
              .status(500)
              .json({ error: "Failed to insert milestones" });
          }

          res
            .status(201)
            .json({ message: "Goal and milestones saved successfully" });
        });
      } else {
        res
          .status(201)
          .json({ message: "Goal saved successfully (no milestones)" });
      }
    }
  );
};
const getGoalsByUserId = (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  // First get all goals for the user
  const goalSql = `SELECT * FROM goals WHERE userId = ?`;

  db.query(goalSql, [userId], (err, goals) => {
    if (err) {
      console.error("Error fetching goals:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (goals.length === 0) {
      return res.json([]);
    }

    // For each goal, fetch its milestones
    const goalIds = goals.map((g) => g.goalId);
    const milestoneSql = `SELECT * FROM milestones WHERE goalId IN (?)`;

    db.query(milestoneSql, [goalIds], (err, milestones) => {
      if (err) {
        console.error("Error fetching milestones:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // Attach milestones to their corresponding goal
      const goalsWithMilestones = goals.map((goal) => {
        const goalMilestones = milestones.filter(
          (m) => m.goalId === goal.goalId
        );
        return {
          ...goal,
          milestones: goalMilestones,
        };
      });

      res.json(goalsWithMilestones);
    });
  });
};

///////
const updateMilestone = (req, res) => {
  const { milestoneId, milestoneName, description, targetDate, isCompleted } =
    req.body;

  if (!milestoneId) {
    return res.status(400).json({ error: "milestoneId is required" });
  }

  const sql = `
      UPDATE milestones
      SET milestoneName = ?, description = ?, targetDate = ?, isCompleted = ?
      WHERE milestoneId = ?
    `;

  db.query(
    sql,
    [milestoneName, description, targetDate, isCompleted, milestoneId],
    (err, result) => {
      if (err) {
        console.error("Error updating milestone:", err);
        return res.status(500).json({ error: "Failed to update milestone" });
      }

      res.json({ message: "Milestone updated successfully" });
    }
  );
};


// delete goal
const deleteGoal = (req, res) => {
  const goalId = req.params.goalId;

  if (!goalId) {
    return res.status(400).json({ error: "goalId is required" });
  }

  // Step 1: Delete milestones first
  const deleteMilestonesSql = 'DELETE FROM milestones WHERE goalId = ?';
  db.query(deleteMilestonesSql, [goalId], (milestoneErr) => {
    if (milestoneErr) {
      console.error("Error deleting milestones:", milestoneErr);
      return res.status(500).json({ error: "Failed to delete milestones: " + milestoneErr });
    }

    // Step 2: Delete the goal
    const deleteGoalSql = 'DELETE FROM goals WHERE goalId = ?';
    db.query(deleteGoalSql, [goalId], (goalErr, result) => {
      if (goalErr) {
        console.error("Error deleting goal:", goalErr);
        return res.status(500).json({ error: "Failed to delete goal: " + goalErr });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Goal not found" });
      }

      res.json({ message: "Goal and its milestones deleted successfully" });
    });
  });
};


module.exports = {
  saveGoal,
  getGoalsByUserId,
  updateMilestone,
  deleteGoal,
};
