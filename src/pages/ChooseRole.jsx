import "../styles/ChooseRole.css"
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"

function ChooseRole() {
  const navigate = useNavigate()

  return (
    <div className="role-wrapper">
      <nav className="role-nav">
        <div className="role-nav-logo">
          <img src={logo} alt="Askili" />
        </div>
        <ul className="role-nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="#">Find work</a></li>
          <li><a href="#">Find Freelancers</a></li>
          <li><a href="/signin">Log In</a></li>
          <li><a href="/signup">Sign Up</a></li>
        </ul>
        <button className="role-nav-btn">Post a project</button>
      </nav>

      <div className="role-hero">
        <h1>Join us As</h1>
        <div className="role-cards">
          <div className="role-card freelancer" onClick={() => navigate("/tasks")}>
            <span>Freelancer</span>
          </div>
          <div className="role-card employer" onClick={() => navigate("/")}>
            <span>Employer</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChooseRole