import React from 'react';


const MainPage: React.FC = () => {
  return (
    <div className="flex h-full w-full">
      <div className="flex-1 w-full h-full flex justify-center align-middle">
        <img src="/images/codesnippets.png" alt="" className="h-full object-cover" />
      </div>

      <div className="flex-1">

        <img src="/images/avatar.png" alt="" />
        <p className="text-7xl font-bold">EXPERIENCE <span className="text-red-600 text-shadow-default">EXCEPTIONAL</span> CODE</p>
      </div>
    </div>
  );
}

export default MainPage;
