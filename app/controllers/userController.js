const db = require('../config/db');
const bcrypt = require('bcrypt');

const registerUser = (req, res) => {
  const { email, password, fullName, mobile } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });

    const sql = 'INSERT INTO users (email, password, fullName, mobile) VALUES (?, ?, ?, ?)';
    db.query(sql, [email, hashedPassword, fullName, mobile], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Prepare response just like login
      res.status(201).json({
        message: 'Registration successful',
        user: {
          userId: result.insertId,
          email,
          fullName,
          mobile
        }
      });
    });
  });
};


const loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      res.json({
        message: 'Login successful',
        user: {
          userId: user.userId,
          email: user.email,
          fullName: user.fullName,
          mobile: user.mobile
        }
      });
    });
  });
};

module.exports = { registerUser, loginUser };
