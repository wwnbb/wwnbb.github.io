import React, { useState } from 'react';

const JumpingRabbit: React.FC = () => {
    const [animate, setAnimate] = useState(false);

    const toggleAnimation = () => {
        setAnimate(!animate);
    };

    return (
        <div className="flex fixed bottom-5 left-10" onClick={toggleAnimation}>
            <img src={`/svg/monster-rabbit.svg`} alt="dumb rabbit"
                className={`h-12 w-12 transition-all duration-1000 ease-in-out ${animate ? 'transform translate-x-96 translate-y-32' : ''}`}
            />
        </div>
    );
};

export default JumpingRabbit;
