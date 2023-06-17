import React from 'react';

const Portfolio: React.FC = () => {
  return (
    <div className="portfolio-page">
      <header className="header">
        <h1>My Portfolio</h1>
      </header>

      <section className="project">
        <h2>Project 1</h2>
        <p>Description of Project 1...</p>
        <a href="http://example.com">Link to Project 1</a>
      </section>

      <section className="project">
        <h2>Project 2</h2>
        <p>Description of Project 2...</p>
        <a href="http://example.com">Link to Project 2</a>
      </section>

      {/* Add as many projects as you want */}

    </div>
  );
}

export default Portfolio;
