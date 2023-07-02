import React from 'react';

import SocialNetwork from '../soc/SocialNetwork'

const MainPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-700">
          Hello world!
        </h1>
      </header>

      <section><div className="bg-emerald-500 w-52 h-52 rounded-full shadow-2xl"></div></section>

      <section className="w-full max-w-2xl p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">About Me</h2>
        <p className="text-gray-600">Your bio...</p>
      </section>

      <section className="w-full max-w-2xl p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Contact</h2>
        <p className="text-gray-600">Email: your-email@example.com</p>
        <p className="text-gray-600">Phone: +1234567890</p>
      </section>

      <footer>
        <SocialNetwork />
      </footer>
    </div>
  );
}

export default MainPage;
