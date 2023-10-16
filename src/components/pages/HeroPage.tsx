import React from 'react';


const HeroPage: React.FC = () => {
  return (
    <div className="flex w-full sm:h-[90vh] lg:h-full lg:space-x-20">
      <div className="sm:hidden lg:flex flex-1 w-full h-full justify-center align-middle">
        <img src="/images/codesnippets.png" alt="" className="w-full h-full object-scale-down" />
      </div>

      <div className="sm:justify-around flex-1 flex flex-col justify-evenly sm:mx-0 sm:my-auto lg:m-0">
        <div className="sm:self-center lg:self-start lg:ml-10">
          <img src="/images/avatar.png" alt="" className="self-center w-44 h-44 text-center" />
        </div>
        <p className="text-9xl sm:text-center lg:text-left lg:text-8xl font-extrabold">EXPERIENCE <span className="text-shadow-default dark:text-shadow-dark">EXCEPTIONAL</span><br /> CODE</p>
      </div>
    </div>
  );
}

export default HeroPage;
