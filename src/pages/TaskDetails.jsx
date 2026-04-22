import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import NavbarTask from '../components/NavbarTask';
import Hero from '../components/hero';
import { tasks } from '../data/tasks';
import { useUser } from '../context/UserContext';
import '../styles/TaskDetails.css';

const TaskDetails = () => {
  const { id } = useParams();
  const { myTasks = [] } = useUser();

  const normalizedMyTasks = myTasks.map(t => ({
    id: t.id,
    title: t.title || '',
    desc: t.description || '',
    location: `${t.city} , ${t.wilaya} .`,
    category: t.category || '',
    price: `${t.price} / ${t.per}`,
    payment: t.paymentMethod || 'Paying in cash'
  }));

  const allTasks = [...normalizedMyTasks, ...tasks];
  const task = allTasks.find(t => t.id.toString() === id.toString());

  const [currentIndex, setCurrentIndex] = useState(0);

  // If someone goes to a non-existent task, go back to tasks page
  if (!task) return <Navigate to="/tasks" />;

  // Find related tasks
  const relatedTasks = allTasks.filter(t => t.category === task.category && t.id.toString() !== task.id.toString());
  
  // Make sure index is valid if relatedTasks changes
  const safeIndex = currentIndex >= relatedTasks.length ? 0 : currentIndex;
  const relatedTask = relatedTasks.length > 0 ? relatedTasks[safeIndex] : null;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + relatedTasks.length) % relatedTasks.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % relatedTasks.length);
  };

  return (
    <div className="task-details-page">
      <NavbarTask />
      
      <Hero />

      {/* Main Content */}
      <div className="task-details-content">
        
        {/* Left Section: Details */}
        <div className="task-details-left">
          <h2>{task.title}</h2>
          
          <div className="task-info-group">
            <span className="task-info-label">Description :</span>
            <p className="task-info-text">{task.desc}</p>
          </div>

          <div className="task-info-group">
            <span className="task-info-label">Price :</span>
            <div className="task-price-box">{task.price}</div>
          </div>

          <div className="task-info-group">
            <span className="task-info-label">Payment :</span>
            <p className="task-info-text">{task.payment}</p>
          </div>

          <div className="task-info-group">
            <span className="task-info-label">City , Town :</span>
            <p className="task-info-text">{task.location}</p>
          </div>

          <div className="task-info-group">
            <span className="task-info-label">Category :</span>
            <p className="task-info-text">{task.category}</p>
          </div>

          <div className="task-apply-container">
            <Link to={`/apply-task/${task.id}`} className="task-apply-btn" style={{textDecoration: 'none', display: 'inline-block'}}>Apply to this task</Link>
          </div>
        </div>

        {/* Right Section: Related Tasks */}
        {relatedTask && (
          <div className="task-details-right">
            <h3>Tasks in the same category</h3>
            
            <div className="related-task-slider">
              <button className="slider-arrow" onClick={handlePrev}>&lt;</button>
              
              <Link to={`/task/${relatedTask.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                <div className="related-task-card">
                  <span className="related-task-category">{relatedTask.category}</span>
                  <h4 className="related-task-title">{relatedTask.title}</h4>
                  
                  <p className="related-task-desc">
                    {relatedTask.desc.length > 80 ? relatedTask.desc.substring(0, 80) + '...' : relatedTask.desc}
                  </p>
                  
                  <div className="related-task-footer">
                    <span className="related-task-location">{relatedTask.location}</span>
                    <div className="related-task-price-section">
                      <span className="related-task-price-label">The Price</span>
                      <span className="related-task-price-value">{relatedTask.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
  
              <button className="slider-arrow" onClick={handleNext}>&gt;</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TaskDetails;
