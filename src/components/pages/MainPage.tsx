import React from 'react';
import Svg from '../Svg';


const MainPage: React.FC = () => {
  return (
    <div className="flex sm:h-noscroll w-full lg:space-x-20">
      <div className="sm:hidden lg:flex flex-1 w-full h-full justify-center align-middle">
        <img src="/images/codesnippets.png" alt="" className="w-full h-full object-scale-down" />
      </div>

      <div className="sm:justify-around flex-1 flex flex-col justify-evenly">
        <div className="sm:self-center lg:self-start lg:ml-10">
          <img src="/images/avatar.png" alt="" className="self-center w-96 h-96 text-center" />
        </div>
        <p className="text-9xl text-center lg:text-8xl font-extrabold">EXPERIENCE <span className="text-shadow-default dark:text-shadow-dark">EXCEPTIONAL</span><br /> CODE</p>
      </div>
    </div>
  );
}

export default MainPage;
