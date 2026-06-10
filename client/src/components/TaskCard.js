import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function TaskCard({ task, onEdit, onDelete }) {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#e53e3e';
      case 'Medium': return '#ed8936';
      case 'Low': return '#48bb78';
      case 'Urgent': return '#d53f8c';
      default: return '#718096';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return '#48bb78';
      case 'In Progress': return '#ed8936';
      case 'Pending': return '#e53e3e';
      default: return '#718096';
    }
  };

  const handleDelete = async () => {
    // Modern confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${task.title}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#fff',
      backdrop: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/tasks/${task._id}`, {
          headers: { 'x-auth-token': token }
        });
        
        // Success message
        Swal.fire({
          title: 'Deleted!',
          text: 'Your task has been deleted.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          timer: 2000,
          showConfirmButton: true
        });
        
        onDelete();
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete task.',
          icon: 'error',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-badges">
          <span className="priority-badge" style={{ background: getPriorityColor(task.priority) }}>
            {task.priority}
          </span>
          <span className="status-badge" style={{ background: getStatusColor(task.status) }}>
            {task.status}
          </span>
        </div>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-footer">
        <span className="due-date">📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        <div className="task-actions">
          <button className="edit-btn" onClick={onEdit}>✏️ Edit</button>
          <button className="delete-btn" onClick={handleDelete}>🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;