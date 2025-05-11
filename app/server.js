const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const goalRoutes = require('./routes/goalRoutes');
const taskRoutes = require('./routes/taskRoutes');



const app = express();
const port = 3030;

app.use(cors({
    origin: 'http://localhost:4200',
}));

app.use(bodyParser.json());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/goal', goalRoutes);
app.use('/api/v1/task', taskRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
