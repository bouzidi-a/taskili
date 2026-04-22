import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddTask.css';
import logo from '../assets/logo.svg';

const Payment = () => {
  const navigate = useNavigate();

  return (
    <div className="add-task-container">
      <div className="add-task-card" style={{ paddingBottom: '100px' }}>
        <div className="add-task-header">
          <img 
            src={logo} 
            alt="Askili Logo" 
            className="add-task-logo" 
            onClick={() => navigate('/')} 
            style={{ cursor: 'pointer' }} 
          />
        </div>
        
        <div className="add-task-form-wrapper">
          <h1 className="add-task-title">Post a Task</h1>
          <p className="add-task-subtitle">Enter your information and your task details bellow</p>

          <form className="add-task-form" onSubmit={(e) => { e.preventDefault(); navigate('/tasks'); }}>
            <div className="form-group">
              <label>Price</label>
              <input type="text" placeholder="Enter your task payment" required />
            </div>

            <div className="form-group">
              <label>Per</label>
              <input type="text" placeholder="ex : /session" required />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <input type="text" placeholder="Enter your payment method" required />
            </div>

            <button type="submit" className="add-task-submit-btn" style={{ marginTop: '30px' }}>
              Post the task
            </button>
          </form>
        </div>
      </div>
      <div className="add-task-background">
        <div className="pattern-layer"></div>
      </div>
    </div>
  );
};

export default Payment;
