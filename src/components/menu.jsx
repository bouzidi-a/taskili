import { Link } from 'react-router-dom';
import "../styles/menu.css";

import { tasks } from '../data/tasks';

function Menu({ searchQuery = '', filters = {} }) {
  const filteredTasks = tasks.filter((task) => {
    // Search query
    const query = searchQuery.toLowerCase();
    const matchSearch = 
      task.title.toLowerCase().includes(query) || 
      task.desc.toLowerCase().includes(query) || 
      task.category.toLowerCase().includes(query);

    // Filters
    const matchCategory = filters.category ? task.category === filters.category : true;
    const matchPrice = filters.price ? task.price.includes(filters.price) : true;
    
    // Location matching (city and commune)
    const taskLoc = task.location.toLowerCase();
    const matchCity = filters.city ? taskLoc.includes(filters.city.toLowerCase()) : true;
    const matchCommune = filters.commune ? taskLoc.includes(filters.commune.toLowerCase()) : true;

    return matchSearch && matchCategory && matchPrice && matchCity && matchCommune;
  });

  return (
    <div className="menu">
      {filteredTasks.length === 0 ? (
        <p style={{ textAlign: 'center', width: '100%', padding: '20px', fontSize: '1.2rem', color: '#666' }}>
          No tasks found matching "{searchQuery}"
        </p>
      ) : (
        filteredTasks.map(task => (
          <Link to={`/task/${task.id}`} className="task" key={task.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>{task.title}</h3>
            <span className="task-category">{task.category}</span>
            <p>{task.desc}</p>
            <span className="task-price-label">The Price</span>
            <span className="task-location">{task.location}</span>
            <span className="task-price">{task.price}</span>
          </Link>
        ))
      )}
    </div>
  );
}

export default Menu;
