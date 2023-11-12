import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import MenuNav from './components/blocks/MenuNav';
import HeroPage from './components/pages/HeroPage';
import Portfolio from './components/pages/Portfolio';
import { routes } from './routes';
import Footer from './components/blocks/Footer';
import Blog from './components/pages/Blog';
import Post from './components/pages/Post';



const App: React.FC = () => {
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const divRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [divRef]);
  React.useEffect(() => {
    // Close the menu on route change
    setMenuOpen(false);
  }, [location]);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  };

  return (
    <Router>
      <div className="sm:grid sm:grid-cols-6 sm:grid-rows-1 lg:flex lg:flex-col lg:pl-[9%]">

        <div className="">
          <MenuNav isMenuOpen={isMenuOpen} />
        </div>

        <div className="sm:fixed sm:bottom-0 sm:w-[101%] left-[-2px] lg:bottom-0 lg:h-[100vh] lg:w-[10%]">
          <Footer ref={divRef} toggleMenu={toggleMenu} />
        </div>

        <div className="w-full sm:col-start-1 sm:col-end-7">

          <Routes>
            <Route path={routes.HOME} element={<HeroPage />} />
            <Route path={routes.BLOG} element={<Blog />} />
            <Route path={routes.POST} element={<Post />} />
            <Route path={routes.CONTACT} element={<Portfolio />} />
          </Routes>

        </div>
      </div>
    </Router>
  );
}


export default App;
