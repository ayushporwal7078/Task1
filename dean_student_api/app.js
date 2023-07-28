const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db');
const jwt = require('jsonwebtoken');
const Student = require('./models/student');
const Dean = require('./models/dean');

const app = express();
app.use(bodyParser.json());

const JWT_Token = 
"eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5MDU1OTQ0MywiaWF0IjoxNjkwNTU5NDQzfQ.OX5eZQ14T_QkRJDkHPahMxY9kUtBegIOFTQPRJjyi2I"

// Helper function to generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_Token, { expiresIn: '1h' });
}


// Middleware to validate bearer token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
    if (err) return res.sendStatus(403);

    const userId = decoded.userId;
    const student = await Student.findById(userId);
    const dean = await Dean.findById(userId);

    if (!student && !dean) return res.sendStatus(403);

    req.user = { userId, userType: student ? 'student' : 'dean' };
    next();
  });
}

// Import route files
const deanRoutes = require('./routes/deanRoutes');
const studentRoutes = require('./routes/studentRoutes');



// Set up the routes
app.use('/api/deans', deanRoutes);
app.use('/api/student', studentRoutes);

// Other middleware and error handling...

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


module.exports = { authenticateToken };