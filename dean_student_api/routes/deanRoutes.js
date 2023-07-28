const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const Dean = require('../models/dean');
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
  


// Dean login API
router.post('/login', async (req, res) => {
  try {
    const { universityId, password } = req.body;
    const dean = await Dean.findOne({ universityId });

    if (!dean) {
      return res.status(401).json({ message: 'Invalid dean name' });
    }

    const isPasswordValid = await bcrypt.compare(password, dean.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(dean._id);
    dean.token = token;
    await dean.save();

    return res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all pending sessions for Dean
router.get('/pending-sessions', authenticateToken, async (req, res) => {
  try {
    const deanId = req.user.userId;
    const pendingSessions = await Session.find({ bookedBy: deanId }).populate('bookedBy', 'universityId');
    return res.json({ pendingSessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
