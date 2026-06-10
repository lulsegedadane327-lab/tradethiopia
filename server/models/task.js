// Simple file-based storage (no MongoDB needed)
const fs = require('fs');
const path = require('path');

const tasksFile = path.join(__dirname, '../tasks.json');
const usersFile = path.join(__dirname, '../users.json');

// Initialize files if they don't exist
if (!fs.existsSync(tasksFile)) fs.writeFileSync(tasksFile, '[]');
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');

const getTasks = () => JSON.parse(fs.readFileSync(tasksFile));
const saveTasks = (tasks) => fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
const getUsers = () => JSON.parse(fs.readFileSync(usersFile));
const saveUsers = (users) => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

module.exports = { getTasks, saveTasks, getUsers, saveUsers };