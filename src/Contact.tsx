import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="contact-page">
      <header className="header">
        <h1>Contact Me</h1>
      </header>

      <section className="contact-info">
        <h2>Email</h2>
        <p>your-email@example.com</p>

        <h2>Phone</h2>
        <p>+1234567890</p>
      </section>
    </div>
  );
}

export default Contact;
