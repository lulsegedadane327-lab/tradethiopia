import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import SearchFilter from './SearchFilter';

function Dashboard({ setIsAuthenticated }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  useEffect(() => {
  fetchTasks();
  fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('https://tradethiopia-theta.vercel.app/api/tasks', {
      headers: { 'x-auth-token': token }
    });
    setTasks(res.data);
  };

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('https://tradethiopia-theta.vercel.app/api/tasks/stats', {
      headers: { 'x-auth-token': token }
    });
    setStats(res.data);
  };

  const filterTasks = () => {
    let filtered = [...tasks];
    
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterPriority !== 'All') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }
    
    if (filterStatus !== 'All') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }
    
    setFilteredTasks(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <div className="dashboard-container">
        {stats && (
          <div className="stats-grid">
            <div className="stat-card"><h3>Total Tasks</h3><p className="stat-number">{stats.totalTasks}</p></div>
            <div className="stat-card completed"><h3>Completed</h3><p className="stat-number">{stats.completedTasks}</p></div>
            <div className="stat-card pending"><h3>Pending</h3><p className="stat-number">{stats.pendingTasks}</p></div>
            <div className="stat-card progress"><h3>In Progress</h3><p className="stat-number">{stats.inProgressTasks}</p></div>
            <div className="stat-card rate"><h3>Completion Rate</h3><p className="stat-number">{stats.completionRate}%</p></div>
          </div>
        )}

        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        <button className="add-task-btn" onClick={() => setShowForm(true)}>+ Add New Task</button>

        {(showForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onClose={() => { setShowForm(false); setEditingTask(null); }}
            onSave={() => { fetchTasks(); fetchStats(); setShowForm(false); setEditingTask(null); }}
          />
        )}

        <div className="tasks-grid">
          {filteredTasks.length === 0 ? (
            <div className="no-tasks">No tasks found. Create your first task!</div>
          ) : (
            filteredTasks.map(task => (
              <TaskCard key={task._id} task={task} onEdit={() => setEditingTask(task)} onDelete={() => { fetchTasks(); fetchStats(); }} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;