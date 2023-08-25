import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/blocks/Header';
import MainPage from './components/pages/MainPage';
import Portfolio from './components/pages/Portfolio';
import { routes } from './routes';
import Footer from './components/blocks/Footer';
import Blog from './components/pages/Blog';



const App: React.FC = () => {
  return (
    <Router>
      <div className="grid sm:grid-cols-6 sm:grid-rows-5 lg:grid-cols-12 lg:grid-rows-12">
        <div className="sm:hidden lg:col-start-7 lg:col-end-11 lg:row-start-2 lg:row-end-3">
          <Header />
        </div>
        <div className="sm:fixed sm:bottom-0 sm:w-full lg:relative lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-13 lg:row-span-full">
          <Footer />
        </div>
        <div className="w-full h-full sm:col-start-1 sm:col-end-7 sm:row-start-1 sm:row-end-5 lg:col-start-2 lg:col-end-12 lg:row-start-3 lg:row-end-12">

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
