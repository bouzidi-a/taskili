import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../styles/menu.css";

function Menu({ searchQuery = '', filters = {} }) {
  const [works, setWorks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchWorks = async () => {
      setLoading(true);
      setError("");
      try {
        // Build query string from searchQuery + filters
        const params = new URLSearchParams();
        if (searchQuery)       params.set("search",      searchQuery);
        if (filters.category)  params.set("category",    filters.category);
        if (filters.budgetMin) params.set("budgetMin",   filters.budgetMin);
        if (filters.budgetMax) params.set("budgetMax",   filters.budgetMax);
        if (filters.sort)      params.set("sort",        filters.sort);
        params.set("page",  "1");
        params.set("limit", "10");

        const res = await fetch(`/api/works?${params.toString()}`);

        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/signin";
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load works.");
          return;
        }

        // Backend returns { works: [...] } or { data: [...] } — handle both
        setWorks(data.works || data.data || []);
      } catch {
        setError("Network error. Could not load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, [searchQuery, filters.category, filters.budgetMin, filters.budgetMax, filters.sort]);

  const formatBudget = (budget) => {
    if (!budget) return "—";
    if (budget.type === "fixed") return `$${budget.min} – $${budget.max} (fixed)`;
    if (budget.type === "hourly") return `$${budget.min} – $${budget.max} / hr`;
    return `$${budget.min} – $${budget.max}`;
  };

  if (loading) {
    return (
      <div className="menu">
        <p style={{ textAlign: 'center', width: '100%', padding: '20px', fontSize: '1.1rem', color: '#666' }}>
          Loading tasks...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu">
        <p style={{ textAlign: 'center', width: '100%', padding: '20px', fontSize: '1.1rem', color: '#e53e3e' }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="menu">
      {works.length === 0 ? (
        <p style={{ textAlign: 'center', width: '100%', padding: '20px', fontSize: '1.2rem', color: '#666' }}>
          No tasks found{searchQuery ? ` matching "${searchQuery}"` : ""}.
        </p>
      ) : (
        works.map(work => (
          <Link to={`/task/${work._id}`} className="task" key={work._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>{work.title}</h3>
            <span className="task-category">{work.category?.replace(/_/g, ' ')}</span>
            <p>{work.description?.length > 120 ? work.description.substring(0, 120) + '...' : work.description}</p>
            <span className="task-price-label">Budget</span>
            <span className="task-location">{work.location}</span>
            <span className="task-price">{formatBudget(work.budget)}</span>
            {work.totalBids !== undefined && (
              <span style={{ fontSize: 12, color: '#64748b', marginTop: 4, display: 'block' }}>
                {work.totalBids} bid{work.totalBids !== 1 ? 's' : ''}
              </span>
            )}
          </Link>
        ))
      )}
    </div>
  );
}

export default Menu;
