import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddTask.css';
import logo from '../assets/logo.svg';

const AddTask = () => {
  const navigate = useNavigate();

  return (
    <div className="add-task-container">
      <div className="add-task-card">
        <div className="add-task-header">
          <img src={logo} alt="Askili Logo" className="add-task-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        </div>
        
        <div className="add-task-form-wrapper">
          <h1 className="add-task-title">Post a Task</h1>
          <p className="add-task-subtitle">Enter your information and your task details below</p>

          <form className="add-task-form" onSubmit={(e) => { e.preventDefault(); navigate('/payment'); }}>
            <div className="form-group">
              <label>Task Title</label>
              <input type="text" placeholder="Enter the task title" required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="Enter your phone number" required />
            </div>

            <div className="form-group">
              <label>Wilaya</label>
              <input type="text" placeholder="Enter your wilaya" required />
            </div>

            <div className="form-group">
              <label>City</label>
              <input type="text" placeholder="Enter your city" required />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input type="text" placeholder="Enter the task category" required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input type="text" placeholder="Enter the task description" required />
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
