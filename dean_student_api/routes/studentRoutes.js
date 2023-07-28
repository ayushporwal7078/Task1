const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const Student = require('../models/student');
const Session = require('../models/session');

const router = express.Router();

const JWT_Token = 
"eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5MDU1OTQ0MywiaWF0IjoxNjkwNTU5NDQzfQ.OX5eZQ14T_QkRJDkHPahMxY9kUtBegIOFTQPRJjyi2I"

// Middleware to validate bearer token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, JWT_Token, async (err, decoded) => {
      if (err) return res.sendStatus(403);
  
      const userId = decoded.userId;
      const student = await Student.findById(userId);
      const dean = await Dean.findById(userId);
  
      if (!student && !dean) return res.sendStatus(403);
  
      req.user = { userId, userType: student ? 'student' : 'dean' };
      next();
    });
  }



// Student login API
router.post('/login', async (req, res) => {
  try {
    const { universityId, password } = req.body;
    const student = await Student.findOne({ universityId });

    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(student._id);
    student.token = token;
    await student.save();

    return res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all free sessions with the Dean
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const freeSessions = await Session.find({ bookedBy: null });
    return res.json({ sessions: freeSessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Book a session with the Dean
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const studentId = req.user.userId;

    const session = await Session.findById(sessionId);
    if (!session || session.bookedBy !== null) {
      return res.status(400).json({ message: 'Invalid session ID or session already booked' });
    }

    session.bookedBy = studentId;
    await session.save();

    return res.json({ message: 'Session booked successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
