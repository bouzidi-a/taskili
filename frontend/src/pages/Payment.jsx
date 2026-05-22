import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/useUser';
import '../styles/AddTask.css';
import logo from '../assets/logo.svg';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setMyTasks } = useUser();
  const taskData = location.state?.taskData || {};

  const [paymentData, setPaymentData] = useState({ price: '', per: '', paymentMethod: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      ...taskData,
      ...paymentData,
      id: Date.now().toString()
    };
    setMyTasks(prev => [newTask, ...prev]);
    navigate('/my-tasks');
  };

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

          <form className="add-task-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Price</label>
              <input type="text" name="price" value={paymentData.price} onChange={handleChange} placeholder="Enter your task payment" required />
            </div>

            <div className="form-group">
              <label>Per</label>
              <input type="text" name="per" value={paymentData.per} onChange={handleChange} placeholder="ex : /session" required />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <input type="text" name="paymentMethod" value={paymentData.paymentMethod} onChange={handleChange} placeholder="Enter your payment method" required />
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
