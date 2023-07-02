import React from 'react';
import Header from './components/blocks/Header';
import MainPage from './components/pages/MainPage';
import Footer from './components/blocks/Footer';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <MainPage />
      <Footer />
    </>
  );
}


export default App;
