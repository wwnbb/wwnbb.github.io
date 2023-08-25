import React from 'react';

const Svg = ({ svg, tailwindClass }) => {
  // Initialize the state variable with a default font size
  return (
    <div className={tailwindClass}>
      {React.cloneElement(svg)}
    </div>
  );
};

export default Svg;
