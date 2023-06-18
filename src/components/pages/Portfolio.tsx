import React from "react";

// Define your work experience data
const experienceData = [
  {
    title: "Software Engineer",
    company: "Secure-t",
    location: "Podgorica",
    date: "May 2022 to Present",
    description: "Developer at Secure-T: Responsible for developing and maintaining a security training application for employees..."
  },
  // Add the rest of your experience here...
];

const Portfolio: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Work Experience</h1>
      {experienceData.map((job, index) => (
        <div key={index} className="mb-6 bg-white rounded shadow p-4">
          <h2 className="text-xl font-bold">{job.title}</h2>
          <h3 className="text-blue-500">{job.company}</h3>
          <h4 className="text-gray-500">{job.location}</h4>
          <p className="text-gray-500">{job.date}</p>
          <p className="mt-2">{job.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Portfolio;
