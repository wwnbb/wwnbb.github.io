import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/blocks/Header';
import MainPage from './components/pages/MainPage';
import Portfolio from './components/pages/Portfolio';
import { routes } from './routes';
import Footer from './components/blocks/Footer';
import Blog from './components/pages/Blog';

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";
import About from './components/pages/About';



const App: React.FC = () => {
  return (
    <Router>
      <div className="grid grid-cols-12 grid-rows-12 h-screen">
        <div className="col-start-7 col-end-11 row-start-2 row-end-3">
          <Header />
        </div>
        <div className="col-start-1 col-end-2 row-start-2 row-end-13 row-span-full">
          <Footer />
        </div>
        <div className="col-start-2 col-end-12 row-start-3 row-end-12">

          <Routes>
            <Route path={routes.HOME} element={<MainPage />} />
            <Route path={routes.BLOG} element={<Blog />} />
            <Route path={routes.CONTACT} element={<Portfolio />} />
          </Routes>

        </div>
      </div>
    </Router>
  );
}


export default App;
//
//
<Header />
