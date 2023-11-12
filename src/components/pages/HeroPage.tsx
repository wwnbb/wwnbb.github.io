import React from 'react';


const HeroPage: React.FC = () => {
  return (
    <div className="flex w-full sm:h-[90vh] lg:space-x-20 lg:h-[80vh]">
      <div className="sm:hidden lg:flex flex-1 w-full justify-center align-middle">
        <img src="/images/codesnippets.png" alt="" className="w-full h-full object-scale-down" />
      </div>

      <div className="sm:justify-around flex-1 flex flex-col justify-evenly sm:mx-0 sm:my-auto lg:m-0">
        <div className="sm:self-center lg:self-start lg:ml-10">
          <img src="/images/avatar.png" alt="" className="self-center sm:w-96 sm:h-96 lg:w-56 lg:h-56 text-center" />
        </div>
        <p className="text-9xl sm:text-center lg:text-left lg:text-8xl font-extrabold focus:outline-none select-none">EXPERIENCE <span className="text-shadow-default dark:text-shadow-dark">EXCEPTIONAL</span><br /> CODE</p>
      </div>
    </div>
  );
}

export default HeroPage;
