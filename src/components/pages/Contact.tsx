import React from 'react';
import SocialNetwork from '../soc/SocialNetwork'

const Contact: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-700">Contact Me</h1>
      </header>

      <section className="mb-8 p-6 bg-white shadow-md rounded-lg max-w-md w-full text-center">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-600">Email</h2>
          <p className="text-gray-500">your-email@example.com</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-600">Phone</h2>
          <p className="text-gray-500">+1234567890</p>
        </div>
      </section>

      <footer>
        <SocialNetwork />
      </footer>
    </div>
  );
}

export default Contact;
