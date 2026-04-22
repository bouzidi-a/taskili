import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddTask.css';
import logo from '../assets/logo.svg';

const AddTask = () => {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: '', phone: '', wilaya: '', city: '', category: '', description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/payment', { state: { taskData } });
  };

  return (
    <div className="add-task-container">
      <div className="add-task-card">
        <div className="add-task-header">
          <img src={logo} alt="Askili Logo" className="add-task-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        </div>
        
        <div className="add-task-form-wrapper">
          <h1 className="add-task-title">Post a Task</h1>
          <p className="add-task-subtitle">Enter your information and your task details below</p>

          <form className="add-task-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Task Title</label>
              <input type="text" name="title" value={taskData.title} onChange={handleChange} placeholder="Enter the task title" required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={taskData.phone} onChange={handleChange} placeholder="Enter your phone number" required />
            </div>

            <div className="form-group">
              <label>Wilaya</label>
              <input type="text" name="wilaya" value={taskData.wilaya} onChange={handleChange} placeholder="Enter your wilaya" required />
            </div>

            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={taskData.city} onChange={handleChange} placeholder="Enter your city" required />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input type="text" name="category" value={taskData.category} onChange={handleChange} placeholder="Enter the task category" required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" value={taskData.description} onChange={handleChange} placeholder="Enter the task description" required />
            </div>

            <button type="submit" className="add-task-submit-btn">Next to payment</button>
          </form>
        </div>
      </div>
      <div className="add-task-background">
        <div className="pattern-layer"></div>
      </div>
    </div>
  );
};

export default AddTask;
