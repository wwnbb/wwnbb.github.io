import React from 'react';
import { Link } from 'react-router-dom';

const MainPage: React.FC = () => {
  return (
    <div className="main-page">
      <header className="header">
        <h1>Your Name</h1>
      </header>

      <section className="about-me">
        <h2>About Me</h2>
        <p>Your bio...</p>
      </section>

      <section className="contact">
        <h2>Contact Me</h2>
        <p>Email: your-email@example.com</p>
        <p>Phone: +1234567890</p>
      </section>

      <nav className="navigation">
        <Link to="/portfolio">My Portfolio</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </div>
  );
}

export default MainPage;
