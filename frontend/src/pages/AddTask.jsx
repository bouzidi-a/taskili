import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddTask.css';
import logo from '../assets/logo.svg';

const AddTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);

    const skillsRaw = formData.get("skills");
    const skillsArray = skillsRaw.split(",").map((s) => s.trim()).filter(Boolean);

    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      skills: skillsArray,
      budget: {
        type: formData.get("budgetType"),
        min: Number(formData.get("budgetMin")),
        max: Number(formData.get("budgetMax")),
      },
      deadline: formData.get("deadline"),
      experienceLevel: formData.get("experienceLevel"),
      location: formData.get("location"),
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/works", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to post task.");
        return;
      }

      navigate("/payment");

    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
              <input type="text" name="title" placeholder="Enter the task title" required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="Enter your phone number" required />
            </div>

            <div className="form-group">
              <label>Wilaya</label>
              <input type="text" name="wilaya" placeholder="Enter your wilaya" required />
            </div>

            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" placeholder="Enter your city" required />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input type="text" name="category" placeholder="Enter the task category" required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" placeholder="Enter the task description" required />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="add-task-submit-btn" disabled={loading}>
              {loading ? "Posting..." : "Next to payment"}
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

export default AddTask;