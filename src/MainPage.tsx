import React from 'react';
import { Link } from 'react-router-dom';

const MainPage: React.FC = () => {
  return (
    <div className="ml-1 p-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Your Name</h1>
      </header>

      <section>
        <h2 className="text-xl font-semibold">About Me</h2>
        <p>Your bio...</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>Email: your-email@example.com</p>
        <p>Phone: +1234567890</p>
      </section>

      <nav className="mt-6 flex justify-between">
        <Link to="/portfolio" className="text-blue-500">Portfolio</Link>
        <Link to="/contact" className="text-blue-500">Contact</Link>
      </nav>
    </div>
  );
}

export default MainPage;
