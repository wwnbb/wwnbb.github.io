import React from 'react';


const MainPage: React.FC = () => {
  return (
    <div className="flex h-full w-full space-x-20">
      <div className="flex-1 w-full h-full flex justify-center align-middle">
        <img src="/images/codesnippets.png" alt="" className="w-full h-full object-scale-down" />
      </div>

      <div className="flex-1 flex flex-col justify-evenly">
        <div className="ml-10">
          <img src="/images/avatar.png" alt="" className="w-40 h-40" />
        </div>
        <p className="text-8xl font-extrabold">EXPERIENCE <span className="text-shadow-default dark:text-shadow-dark">EXCEPTIONAL</span><br /> CODE</p>
      </div>
    </div>
  );
}

export default MainPage;
