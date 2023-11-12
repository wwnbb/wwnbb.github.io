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
    console.log('toggleMenu');
    setMenuOpen((prev) => !prev);
    console.log(isMenuOpen);
  };

  return (
    <Router>
      <div className="grid sm:grid-cols-6 sm:grid-rows-1">
        <div className="lg:col-start-7 lg:col-end-11 lg:row-start-2 lg:row-end-3">
          <MenuNav isMenuOpen={isMenuOpen} />
        </div>
        <div className="sm:fixed sm:bottom-0 sm:w-[101%] left-[-2px] lg:static lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-13 lg:row-span-full">
          <Footer ref={divRef} toggleMenu={toggleMenu} />
        </div>
        <div className="w-full h-full sm:col-start-1 sm:col-end-7 lg:col-start-2 lg:col-end-12">

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
