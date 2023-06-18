import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/blocks/Header';
import About from './components/pages/About';
import Resume from './components/pages/Resume';
import MainPage from './components/pages/MainPage';
import Portfolio from './components/pages/Portfolio';
import Contact from './components/pages/Contact';
import { routes } from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path={routes.HOME} element={<MainPage />} />
        <Route path={routes.ABOUT} element={<About />} />
        <Route path={routes.PORTFOLIO} element={<Portfolio />} />
        <Route path={routes.RESUME} element={<Resume />} />
        <Route path={routes.CONTACT} element={<Contact />} />
      </Routes>
    </Router>
  );
}


export default App;
