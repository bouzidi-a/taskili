import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import NavbarTask from '../components/NavbarTask';
import Hero from '../components/hero';
import '../styles/TaskDetails.css';

const ApplyTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [work, setWork]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [submitted, setSubmitted]   = useState(false);

  // Bid form fields
  const [coverLetter,   setCoverLetter]   = useState("");
  const [bidAmount,     setBidAmount]     = useState("");
  const [deliveryTime,  setDeliveryTime]  = useState("");
  const [bidLoading,    setBidLoading]    = useState(false);
  const [bidError,      setBidError]      = useState("");

  // Related works
  const [related,    setRelated]    = useState([]);
  const [relatedIdx, setRelatedIdx] = useState(0);

  // ── Fetch work details ────────────────────────────────────
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
      } catch {
        setError("Network error. Could not load task.");
      } finally {
        setLoading(false);
      }
    };
    fetchWork();
  }, [id, navigate]);

  // ── Fetch related works ───────────────────────────────────
  useEffect(() => {
    if (!work?.category) return;
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/works?category=${work.category}&limit=10`);
        const data = await res.json();
        const list = (data.works || data.data || []).filter(w => w._id !== id);
        setRelated(list);
      } catch {
        // silently ignore
      }
    };
    fetchRelated();
  }, [work, id]);

  // ── Submit bid ────────────────────────────────────────────
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError("");

    if (!coverLetter.trim()) {
      setBidError("Please write a cover letter.");
      return;
    }
    if (!bidAmount || Number(bidAmount) <= 0) {
      setBidError("Please enter a valid bid amount.");
      return;
    }
    if (!deliveryTime || Number(deliveryTime) <= 0) {
      setBidError("Please enter a valid delivery time.");
      return;
    }

    setBidLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/works/${id}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          coverLetter:  coverLetter.trim(),
          bidAmount:    Number(bidAmount),
          deliveryTime: Number(deliveryTime),
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setBidError(data.message || "Failed to submit bid.");
        return;
      }

      setSubmitted(true);
    } catch {
      setBidError("Network error. Please try again.");
    } finally {
      setBidLoading(false);
    }
  };

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

        {/* Left Section: Details + Bid Form */}
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
            <span className="task-info-label">Location :</span>
            <p className="task-info-text">{work.location}</p>
          </div>

          <div className="task-info-group">
            <span className="task-info-label">Category :</span>
            <p className="task-info-text">{work.category?.replace(/_/g, ' ')}</p>
          </div>

          {/* ── Bid Form (shown before submission) ── */}
          {!submitted ? (
            <form onSubmit={handleBidSubmit} style={{ marginTop: 24 }}>
              <div className="task-info-group">
                <span className="task-info-label">Cover Letter</span>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Explain why you're the best fit for this task..."
                  rows={5}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0',
                    borderRadius: 8, fontSize: 14, fontFamily: 'inherit',
                    resize: 'vertical', boxSizing: 'border-box', marginTop: 6,
                  }}
                />
              </div>

              <div className="task-info-group">
                <span className="task-info-label">Your Bid Amount ($)</span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  placeholder="e.g. 250"
                  min="1"
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0',
                    borderRadius: 8, fontSize: 14, fontFamily: 'inherit',
                    boxSizing: 'border-box', marginTop: 6,
                  }}
                />
              </div>

              <div className="task-info-group">
                <span className="task-info-label">Delivery Time (days)</span>
                <input
                  type="number"
                  value={deliveryTime}
                  onChange={e => setDeliveryTime(e.target.value)}
                  placeholder="e.g. 7"
                  min="1"
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0',
                    borderRadius: 8, fontSize: 14, fontFamily: 'inherit',
                    boxSizing: 'border-box', marginTop: 6,
                  }}
                />
              </div>

              {bidError && <p className="error-msg">{bidError}</p>}

              <div className="task-apply-container">
                <button type="submit" className="task-apply-btn" disabled={bidLoading}
                  style={{ border: 'none', cursor: bidLoading ? 'not-allowed' : 'pointer' }}>
                  {bidLoading ? "Submitting..." : "Submit Bid ✓"}
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* ── Success state ── */}
              <div className="task-apply-container">
                <button className="task-apply-btn applied-btn">Applied ✓</button>
              </div>

              <div className="application-success-box">
                <h4 className="success-box-title">Application Submitted Successfully!</h4>
                <p className="success-box-text">Check your inbox for a confirmation email with further details regarding our hiring process.</p>
              </div>
            </>
          )}
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

export default ApplyTask;
