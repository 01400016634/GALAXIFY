const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // You need this for the Owner Login!
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use(express.json());

// 🗄️ MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 GALAXIFY: MongoDB Connected'))
  .catch(err => console.log('🔴 DB Connection Error:', err));

// ==========================================
// 📝 DATABASE SCHEMAS
// ==========================================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  plan: { type: String, default: 'free' },
  status: { type: String, default: 'active' },
  uid: String,
  username: { type: String, unique: true, sparse: true }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  fullName: { type: String, default: '' },
  designation: { type: String, default: '' },
  aboutMe: { type: String, default: '' },
  skills: [{ name: String, level: Number }],
  experience: [{ jobTitle: String, company: String, dateRange: String, responsibilities: String }],
  education: [{ degree: String, institution: String, yearRange: String }],
  themeSelection: { type: String, default: 'GALAXY' },
  customDomain: { type: String, default: '' }
}, { timestamps: true });
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

const settingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'GALAXIFY' },
  heroTagline: { type: String, default: 'Build immersive web experiences' },
  maintenanceMode: { type: Boolean, default: false },
  homeSections: {
    aboutSection: { type: String, default: 'The premier 3D portfolio builder.' },
    featuresSection: { type: String, default: 'Next-gen WebGL, AI integration.' }
  }
});
const Setting = mongoose.model('Setting', settingSchema);

const announcementSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: { type: String, default: 'offer' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
const Announcement = mongoose.model('Announcement', announcementSchema);

const themeSchema = new mongoose.Schema({
  name: String,
  category: String,
  isPremium: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
const Theme = mongoose.model('Theme', themeSchema);

// ==========================================
// 🤝 FIREBASE TO MONGODB SYNC ROUTE
// ==========================================
app.post('/api/owner/sync-user', async (req, res) => {
  const { name, email, uid } = req.body;

  if (!uid) return res.status(400).json({ error: 'UID is required' });

  try {
    // Use findOneAndUpdate with upsert to prevent race conditions and crashes
    const user = await User.findOneAndUpdate(
      { uid: uid },
      {
        $setOnInsert: { // Only set these fields if the user is brand new
          name: name || "Galaxify User",
          email: email || `${uid}@no-email.com`, // Fallback so MongoDB doesn't crash on null emails
          plan: 'free',
          status: 'active'
        }
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'User synced successfully', user });
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});
// ==========================================
// 🌍 PUBLIC ROUTES (For Home.jsx)
// ==========================================
app.get('/api/public/home', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) settings = await Setting.create({});
    const announcements = await Announcement.find({ isActive: true });
    res.status(200).json({ settings, announcements });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public data' });
  }
});

// ==========================================
// 👤 USER DASHBOARD ROUTES (For Dashboard.jsx)
// ==========================================
app.get('/api/user/portfolio/:uid', async (req, res) => {
  try {
    let user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    let portfolio = await Portfolio.findOne({ userId: user._id });
    if (!portfolio) portfolio = await Portfolio.create({ userId: user._id });

    res.status(200).json({ user, portfolio });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load portfolio dashboard' });
  }
});

app.put('/api/user/portfolio/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    const payload = req.body;

    if (payload.username && payload.username !== user.username) {
      await User.findByIdAndUpdate(user._id, { username: payload.username });
    }

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { userId: user._id },
      {
        fullName: payload.fullName,
        designation: payload.designation,
        aboutMe: payload.aboutMe,
        skills: payload.skills,
        experience: payload.experience,
        education: payload.education,
        themeSelection: payload.themeSelection,
        customDomain: (user.plan === 'pro' || user.plan === 'premium') ? payload.customDomain : ''
      },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: 'Portfolio Saved', portfolio: updatedPortfolio });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save portfolio data' });
  }
});

// ==========================================
// ⚙️ OWNER CMS ROUTES (For OwnerCMS.jsx)
// ==========================================

// 1. Admin Login (WAS MISSING)
app.post('/api/owner/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'owner' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.status(200).json({ token, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

// 2. Fetch Dashboard Data (WAS MISSING - THIS FIXES THE USER HUB)
app.get('/api/owner/dashboard', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const themes = await Theme.find();
    const announcements = await Announcement.find();
    let settings = await Setting.findOne();
    if (!settings) settings = await Setting.create({});

    res.status(200).json({
      metrics: {
        totalUsers: users.length,
        premiumUsers: users.filter(u => u.plan !== 'free').length,
        activeThemes: themes.filter(t => t.isActive).length
      },
      users, themes, announcements, settings
    });
  } catch (error) {
    res.status(500).json({ error: 'Dashboard failed to load' });
  }
});

// 3. User Actions (Upgrade Plan & Delete)
app.put('/api/owner/users/:id/plan', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { plan: req.body.plan });
  res.status(200).json({ message: 'Plan updated' });
});

app.delete('/api/owner/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'User deleted' });
});

// 4. Update Settings
app.put('/api/owner/settings', async (req, res) => {
  const { siteName, heroTagline, maintenanceMode, homeSections } = req.body;
  try {
    const settings = await Setting.findOneAndUpdate(
      {}, { siteName, heroTagline, maintenanceMode, homeSections }, { new: true, upsert: true }
    );
    res.status(200).json({ message: 'Settings saved', settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// 5. Broadcasts
app.post('/api/owner/announcements', async (req, res) => {
  await Announcement.create(req.body);
  res.status(201).json({ message: 'Broadcast created' });
});

app.delete('/api/owner/announcements/:id', async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Broadcast deleted' });
});
// ==========================================
// 💳 INSTANT MOCK UPGRADE ROUTE
// ==========================================
app.post('/api/payment/create-checkout-session', async (req, res) => {
  const { uid } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid: uid },
      { plan: 'pro' },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Upgraded to Pro successfully' });
  } catch (error) {
    console.error("❌ Mock Payment Error:", error);
    res.status(500).json({ error: 'Failed to upgrade user' });
  }
});

// ==========================================
// 🚀 SERVER START
// ==========================================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 MASTER API running on port ${PORT}`));