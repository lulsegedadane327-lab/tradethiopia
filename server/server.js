const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('Starting server... - server.js:12');

// MongoDB Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, default: 'Medium' },
  status: { type: String, default: 'Pending' },
  dueDate: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Task = mongoose.model('Task', TaskSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas! - server.js:37'))
  .catch(err => {
    console.error('❌ MongoDB connection error: - server.js:39', err.message);
    process.exit(1);
  });

// Register Route
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request: - server.js:46', req.body);
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    console.error('Register error: - server.js:70', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request: - server.js:78', req.body.email);
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    console.error('Login error: - server.js:101', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Auth Middleware
const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get Tasks
app.get('/api/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Get tasks error: - server.js:127', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Task
app.post('/api/tasks', auth, async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    const task = new Task({ 
      userId: req.userId, 
      title, 
      description: description || '',
      priority: priority || 'Medium', 
      status: status || 'Pending', 
      dueDate 
    });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error('Create task error: - server.js:147', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Task
app.put('/api/tasks/:id', auth, async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description, priority, status, dueDate },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error('Update task error: - server.js:166', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Task
app.delete('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete task error: - server.js:180', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Stats
app.get('/api/tasks/stats', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    
    res.json({
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      inProgressTasks: inProgress,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
    });
  } catch (err) {
    console.error('Stats error: - server.js:202', err);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT} - server.js:209`);
});