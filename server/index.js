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
  type: { type: String, default: 'global_settings' },
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

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: String
});
const Transaction = mongoose.model('Transaction', transactionSchema);
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
// 🌍 PUBLIC ROUTES UPDATE THE GET ROUTE
app.get('/api/public/home', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    // Lock to the specific type 'global_settings'
    let settings = await Setting.findOne({ type: 'global_settings' });
    if (!settings) settings = await Setting.create({ type: 'global_settings' });
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
    const projects = await Portfolio.find();

    // Calculate total revenue using aggregation
    const revenueResult = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      metrics: {
        totalUsers: users.length,
        premiumUsers: users.filter(u => u.plan !== 'free').length,
        totalRevenue: totalRevenue, // Send this real value to frontend
        activeThemesCount: 15
      },
      users, projects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE THE PUT ROUTE
app.put('/api/owner/settings', async (req, res) => {
  const { settings } = req.body;

  if (!settings) {
    return res.status(400).json({ error: "No settings data received" });
  }

  try {
    console.log("Attempting to update settings:", settings); // 🚀 DEBUG LOG

    const updatedSettings = await Setting.findOneAndUpdate(
      { type: 'global_settings' },
      { $set: settings },
      { new: true, upsert: true, runValidators: true } // runValidators helps catch issues early
    );

    res.status(200).json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error("SERVER SAVE ERROR:", error); // 🚀 THIS WILL SHOW YOU THE TRUTH
    res.status(500).json({ error: error.message });
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

// DELETE A USER PROJECT
app.delete('/api/user/project/:id', async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Attempting to delete ID:", id);

    let result = null;

    // 1. Only attempt findByIdAndDelete if the ID is a valid 24-character hex string
    if (mongoose.Types.ObjectId.isValid(id)) {
      result = await Portfolio.findByIdAndDelete(id);
    }

    // 2. If result is still null, try finding by other fields (e.g., if you had an 'id' string)
    // Note: Your schema doesn't have an 'id' field, so this will only work 
    // if you added that field to your schema definition.
    if (!result) {
      result = await Portfolio.findOneAndDelete({ id: id });
    }

    if (!result) {
      console.log("No project found for ID:", id);
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
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
app.post('/api/owner/log-transaction', async (req, res) => {
  const { uid, amount, description } = req.body;
  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    await Transaction.create({ userId: user._id, amount, description });
    res.status(200).json({ message: 'Transaction logged' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));