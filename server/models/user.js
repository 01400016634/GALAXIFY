const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscription: {
    status: { type: String, enum: ['active', 'inactive', 'trial'], default: 'trial' },
    plan: { type: String, enum: ['free', 'pro', 'premium'], default: 'free' },
    expiresAt: { type: Date }
  }
}, { timestamps: true }); // timestamps automatically track when a user joined (for growth metrics)

module.exports = mongoose.model('User', userSchema);