const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure storage for Themes (Code files)
const themeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../src/themes');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => { cb(null, file.originalname); }
});
const uploadTheme = multer({ storage: themeStorage });

const app = express();

// 🚀 CRITICAL: Increased Payload limit to fix "Payload Too Large" (413) error
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));

app.use('/themes', express.static(path.join(__dirname, '../src/themes')));

// 🗄️ MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 3D UNIVERSE: MongoDB Connected'))
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
  siteName: { type: String, default: '3D UNIVERSE' },
  heroTagline: { type: String, default: 'Build immersive web experiences' },
  siteLogo: { type: String, default: '' }, // Logo URL/Base64
  maintenanceMode: { type: Boolean, default: false },
  homepageSections: { type: Array, default: ['Features', 'Pricing', 'Themes', 'FAQ'] },
  userDashboardTabs: { type: Array, default: ['Analytics', 'Pages', 'Editor', 'Inventory', 'Settings'] },
  sectionContent: { type: Object, default: {} } // Stores FAQ data, features data, etc
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

const workflowSchema = new mongoose.Schema({
  type: { type: String, default: 'master_workflow' },
  phases: { type: Array, default: [] }
});
const Workflow = mongoose.model('Workflow', workflowSchema);

// ==========================================
// 🤝 SYNC ROUTES
// ==========================================
app.post('/api/owner/sync-user', async (req, res) => {
  const { name, email, uid } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      if (user.uid !== uid) { user.uid = uid; await user.save(); }
    } else {
      user = await User.create({ uid, name, email, plan: 'free', status: 'active' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 🌍 PUBLIC ROUTES
// ==========================================
app.get('/api/public/home', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) settings = await Setting.create({});
    res.status(200).json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public data' });
  }
});

// ==========================================
// 👤 USER PORTFOLIO ROUTES
// ==========================================
app.get('/api/user/portfolio/:uid', async (req, res) => {
  try {
    let user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    let portfolio = await Portfolio.findOne({ userId: user._id });
    if (!portfolio) portfolio = await Portfolio.create({ userId: user._id });
    res.status(200).json({ user, portfolio });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load portfolio' });
  }
});

app.put('/api/user/portfolio/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { userId: user._id },
      { ...req.body },
      { new: true, upsert: true }
    );
    res.status(200).json({ portfolio: updatedPortfolio });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save portfolio' });
  }
});

// ==========================================
// ⚙️ OWNER CMS ROUTES
// ==========================================
app.post('/api/owner/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'owner' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

app.get('/api/owner/dashboard', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const projects = await Portfolio.find().sort({ createdAt: -1 });
    let settings = await Setting.findOne();
    if (!settings) settings = await Setting.create({});

    res.status(200).json({
      metrics: {
        totalUsers: users.length,
        premiumUsers: users.filter(u => u.plan !== 'free').length,
        activeThemesCount: 15
      },
      users, settings, projects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🚀 SAVES SETTINGS, LOGO, AND HOMEPAGE SECTIONS
// server/index.js -> Locate this route and update the body
app.put('/api/owner/settings', async (req, res) => {
  const { settings } = req.body;
  try {
    // We use $set to update only the fields sent in the object
    const updatedSettings = await Setting.findOneAndUpdate(
      {},
      { $set: settings },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: 'Settings saved', settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

app.put('/api/owner/users/:id/plan', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { plan: req.body.plan });
  res.status(200).json({ message: 'Plan updated' });
});

app.delete('/api/owner/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'User deleted' });
});

app.delete('/api/owner/projects/:id', async (req, res) => {
  await Portfolio.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Project deleted' });
});

app.post('/api/owner/upload-theme', uploadTheme.single('themeFile'), (req, res) => {
  res.status(200).json({ message: "Theme uploaded!" });
});

// Workflow routes
app.put('/api/owner/workflow', async (req, res) => {
  try {
    const { workflowConfig } = req.body;
    await Workflow.findOneAndUpdate({ type: 'master_workflow' }, { phases: workflowConfig }, { upsert: true });
    res.status(200).json({ message: 'Workflow updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));