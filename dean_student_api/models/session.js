const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
