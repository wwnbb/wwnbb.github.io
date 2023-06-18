import React from 'react';
import { GitHub, LinkedIn, Twitter } from '@mui/icons-material';


const SocialNetwork: React.FC = () => {
  return (
    <div className="flex justify-center space-x-4 mt-6">
      <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transform hover:scale-125 transition duration-300">
        <GitHub style={{ fontSize: 30, color: 'black' }} />
      </a>
      <a href="https://www.linkedin.com/in/yourusername/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transform hover:scale-125 transition duration-300">
        <LinkedIn style={{ fontSize: 30, color: 'black' }} />
      </a>
      <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transform hover:scale-125 transition duration-300">
        <Twitter style={{ fontSize: 30, color: 'black' }} />
      </a>
    </div>
  );
}

export default SocialNetwork;
