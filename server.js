const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const tasksRouter = require('./routes/tasks');

// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.static('public'));

// Use the tasks router for the /tasks endpoint
app.use('/tasks', tasksRouter);

// Basic route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
