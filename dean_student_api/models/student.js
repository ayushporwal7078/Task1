const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  universityId: { type: String, required: true },
  password: { type: String, required: true },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
