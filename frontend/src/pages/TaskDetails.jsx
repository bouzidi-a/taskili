import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import NavbarTask from '../components/NavbarTask';
import Hero from '../components/hero';
import '../styles/TaskDetails.css';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [work, setWork]           = useState(null);
  const [totalBids, setTotalBids] = useState(0);
  const [related, setRelated]     = useState([]);
  const [relatedIdx, setRelatedIdx] = useState(0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  // ── Fetch this work ──────────────────────────────────────
  useEffect(() => {
    const fetchWork = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/works/${id}`);

        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/signin");
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load task.");
          return;
        }

        setWork(data.work || data);
        setTotalBids(data.totalBids ?? 0);
      } catch {
        setError("Network error. Could not load task.");
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [id, navigate]);

  // ── Fetch related works in same category ─────────────────
  useEffect(() => {
    if (!work?.category) return;
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/works?category=${work.category}&limit=10`);
        const data = await res.json();
        const list = (data.works || data.data || []).filter(w => w._id !== id);
        setRelated(list);
      } catch {
        // silently ignore related fetch errors
      }
    };
    fetchRelated();
  }, [work, id]);

  const formatBudget = (budget) => {
    if (!budget) return "—";
    if (budget.type === "fixed")  return `$${budget.min} – $${budget.max} (fixed)`;
    if (budget.type === "hourly") return `$${budget.min} – $${budget.max} / hr`;
    return `$${budget.min} – $${budget.max}`;
  };

  const handlePrev = () => setRelatedIdx(prev => (prev - 1 + related.length) % related.length);
  const handleNext = () => setRelatedIdx(prev => (prev + 1) % related.length);
  const relatedWork = related.length > 0 ? related[relatedIdx] : null;

  // ── Render states ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="task-details-page">
        <NavbarTask />
        <Hero />
        <div className="task-details-content">
          <p style={{ padding: '40px', color: '#64748b', fontSize: '1.1rem' }}>Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="task-details-page">
        <NavbarTask />
        <Hero />
        <div className="task-details-content">
          <p style={{ padding: '40px', color: '#e53e3e', fontSize: '1.1rem' }}>{error || "Task not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-details-page">
      <NavbarTask />
      <Hero />

      {/* Main Content */}
      <div className="task-details-content">

        {/* Left Section: Details */}
        <div className="task-details-left">
          <h2>{work.title}</h2>

          <div className="task-info-group">
            <span className="task-info-label">Description :</span>
            <p className="task-info-text">{work.description}</p>
          </div>

          <div className="task-info-group">
            <span className="task-info-label">Budget :</span>
            <div className="task-price-box">{formatBudget(work.budget)}</div>
          </div>

          <div className="task-info-group">
            <span className="task-info-label">Category :</span>
            <p className="task-info-text">{work.category?.replace(/_/g, ' ')}</p>
          </div>

          <div className="task-info-group">
            <span className="task-info-label">Location :</span>
            <p className="task-info-text">{work.location}</p>
          </div>

          <div className="task-info-group">
            <span className="task-info-label">Experience Level :</span>
            <p className="task-info-text">{work.experienceLevel}</p>
          </div>

          {work.deadline && (
            <div className="task-info-group">
              <span className="task-info-label">Deadline :</span>
              <p className="task-info-text">{new Date(work.deadline).toLocaleDateString()}</p>
            </div>
          )}

          <div className="task-info-group">
            <span className="task-info-label">Total Bids :</span>
            <p className="task-info-text">{totalBids}</p>
          </div>

          <div className="task-apply-container">
            <Link
              to={`/apply-task/${work._id}`}
              className="task-apply-btn"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              Apply to this task
            </Link>
          </div>
        </div>

        {/* Right Section: Related Tasks */}
        {relatedWork && (
          <div className="task-details-right">
            <h3>Tasks in the same category</h3>

            <div className="related-task-slider">
              <button className="slider-arrow" onClick={handlePrev}>&lt;</button>

              <Link to={`/task/${relatedWork._id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                <div className="related-task-card">
                  <span className="related-task-category">{relatedWork.category?.replace(/_/g, ' ')}</span>
                  <h4 className="related-task-title">{relatedWork.title}</h4>
                  <p className="related-task-desc">
                    {relatedWork.description?.length > 80
                      ? relatedWork.description.substring(0, 80) + '...'
                      : relatedWork.description}
                  </p>
                  <div className="related-task-footer">
                    <span className="related-task-location">{relatedWork.location}</span>
                    <div className="related-task-price-section">
                      <span className="related-task-price-label">Budget</span>
                      <span className="related-task-price-value">{formatBudget(relatedWork.budget)}</span>
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
