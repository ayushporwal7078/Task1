const mongoose = require('mongoose');

const deanSchema = new mongoose.Schema({
  universityId: { type: String, required: true },
  password: { type: String, required: true },
});

const Dean = mongoose.model('Dean', deanSchema);

module.exports = Dean;
