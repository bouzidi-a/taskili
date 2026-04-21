import landingImg from "../assets/landing.png"
import "../styles/LandingPage.css"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.svg"

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div>
      <nav>
        <img src={logo} alt="TASKILI" className="logo-img" />
        <ul className="nav-links">
          <li><a onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</a></li>
          <li><a onClick={() => navigate("/tasks")} style={{ cursor: "pointer" }}>Find work</a></li>
          <li><a href="#" style={{ cursor: "pointer" }}>Find Freelancers</a></li>
          <li><a onClick={() => navigate("/signin")} style={{ cursor: "pointer" }}>Log In</a></li>
          <li><a onClick={() => navigate("/signup")} style={{ cursor: "pointer" }}>Sign Up</a></li>
        </ul>
        <button className="btn-post">Post a project</button>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h1>Are you looking for Freelancers?</h1>
          <p>Hire Great Freelancers, Fast. Spacelance helps you hire elite freelancers at a moment's notice.</p>
          <div className="search-box">
            <button className="btn-hire" onClick={() => navigate("/tasks")}>Hire a freelancer</button>
            <input type="text" placeholder="search freelance work" />
          </div>
        </div>
        <div className="hero-img">
          <img src={landingImg} alt="Freelance UI Illustration" />
        </div>
      </section>

      <div className="steps">
        <div className="step-card">
          <div className="icon-wrap">🔓</div>
          <h3>Create Account</h3>
          <p>First you have to create a account here</p>
        </div>
        <div className="step-card">
          <div className="icon-wrap">🔍</div>
          <h3>Search work</h3>
          <p>Search the best freelance work here</p>
        </div>
        <div className="step-card">
          <div className="icon-wrap">🛡️</div>
          <h3>Save and apply</h3>
          <p>Apply or save and start your work</p>
        </div>
      </div>

      <div className="section-header">
        <p className="section-subtitle">The latest freelance work!</p>
        <h2>Recently Posted <span>Works</span></h2>
      </div>

      <div className="job-grid">
        <div className="job-card">
          <div className="icon-wrap icon-bg-1">🩺</div>
          <h3>Need a Nurse</h3>
          <p>Need a professional logo with writing underneath for our jewellery company</p>
          <div className="price">Highest bid 5000 DA</div>
          <a onClick={() => navigate("/task/1")} style={{ cursor: "pointer" }}>Apply now</a>
        </div>
        <div className="job-card">
          <div className="icon-wrap icon-bg-2">✏️</div>
          <h3>Baby Sitting</h3>
          <p>We need a graphic designer with UI/UX skills for our Furniture company</p>
          <div className="price">Highest bid 2500 DA</div>
          <a onClick={() => navigate("/task/2")} style={{ cursor: "pointer" }}>Apply now</a>
        </div>
        <div className="job-card">
          <div className="icon-wrap icon-bg-3">🏗️</div>
          <h3>Need a Builder</h3>
          <p>Need a SEO for our company who will let our company to a higher level</p>
          <div className="price">Highest bid 20000 DA</div>
          <a onClick={() => navigate("/task/3")} style={{ cursor: "pointer" }}>Apply now</a>
        </div>
      </div>

      <section className="cat-section">
        <h2>Choose Different <span className="primary-text">Category</span></h2>
        <div className="cat-grid">
          {[
            { label: "Graphic & Design", img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400" },
            { label: "Medical Assistance", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400" },
            { label: "Illustration", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400" },
            { label: "Flyers & Vouchers", img: "https://images.unsplash.com/photo-1623697899811-f2403f506899?auto=format&fit=crop&w=400" },
            { label: "Logo Design", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400" },
            { label: "Education", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400" },
            { label: "Article writing", img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400" },
            { label: "Video Editing", img: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=400" },
          ].map((cat, i) => (
            <div key={i} className="cat-card" style={{ backgroundImage: `url('${cat.img}')` }}>
              <span>{cat.label}</span>
            </div>
          ))}
        </div>
        <div className="cat-btn-container">
          <button className="btn-post btn-more-categories">More Categories</button>
        </div>
      </section>

      <section className="freelancer-section">
        <p className="freelancer-subtitle">The best freelancers!</p>
        <h2 className="freelancer-title">Find the Best <span className="primary-text">Freelancer</span></h2>
        <div className="freelancer-grid">
          {[
            { name: "Jane Cooper", role: "Graphic Designer", tags: ["Design", "Logo"], id: 11 },
            { name: "Wade Warren", role: "Web Developer", tags: ["Web", "React"], id: 12 },
            { name: "Esther Howard", role: "Article Writer", tags: ["SEO", "Content"], id: 13 },
          ].map((f, i) => (
            <div key={i} className="freelancer-card">
              <img src={`https://i.pravatar.cc/150?u=${f.id}`} className="profile-img" alt={f.name} />
              <div className="stars">★★★★★</div>
              <h3>{f.name}</h3>
              <p>{f.role}</p>
              <div className="tags">
                {f.tags.map((t, j) => <span key={j} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <div className="newsletter">
          <h2>Newsletter Subscription</h2>
          <p>Subscribe to our newsletter to get new freelance work and projects</p>
          <div className="sub-bar">
            <input type="email" placeholder="Enter your email address" />
            <button className="btn-hire">Subscribe</button>
          </div>
        </div>
        <div className="footer-cols">
          <div className="f-col about">
            <img src={logo} alt="TASKILI" className="logo-img footer-logo" />
            <p>Powerful Freelance Marketplace System with ability to change the Users (Freelancers & Clients)
            </p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <div className="f-col">
            <h4>For Clients</h4>
            <ul>
              <li>Find Freelancers</li>
              <li>Post Project</li>
              <li>Refund Policy</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div className="f-col">
            <h4>For Freelancers</h4>
            <ul>
              <li onClick={() => navigate("/tasks")} style={{ cursor: "pointer" }}>Find Work</li>
              <li onClick={() => navigate("/signup")} style={{ cursor: "pointer" }}>Create Account</li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Call Us</h4>
            <ul>
              <li>📍 Algeria</li>
              <li>📞 +2130000000</li>
              <li>✉️ taskili@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="copyright">2022 Taskili. All right reserved</div>
      </footer>
    </div>
  )
}

export default LandingPage