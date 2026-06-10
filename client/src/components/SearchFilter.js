import React from 'react';

function SearchFilter({ searchTerm, setSearchTerm, filterPriority, setFilterPriority, filterStatus, setFilterStatus }) {
  return (
    <div className="search-filter-container">
      <div className="search-box">
        <input type="text" placeholder="🔍 Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <div className="filters">
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
}

export default SearchFilter;