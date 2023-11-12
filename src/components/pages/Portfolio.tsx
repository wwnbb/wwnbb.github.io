import React from "react";

// Define your work experience data
const experienceData = [
  {
    title: "Senior Golang Engineer",
    company: "Scere-T",
    location: "Remote, Georgia",
    date: "April 2022 to Present",
    description: `Specialize in leading a proficient team of software developers in designing, developing, and deploying high-impact
software solutions with an emphasis on Kubernetes orchestration and Golang. Our platform,
focused on security awareness and cybersecurity training, is utilized by over 100 companies each with an
average employee count of 1,000, highlighting its scalability and reach.`
  },
  {
    title: "Golang Developer",
    company: "Tochka Bank",
    location: "Remote, Moscow",
    date: "April 2020 to January 2022",
    description: `Contributed to the development of the CompanyName mobile banking app, a product serving over 2
million customers. Implemented pivotal features using Golang and RabbitMQ, and enhanced both user experience and operational efficiency.`
  },
  {
    title: "Python Software Engineer",
    company: "MedicalNote",
    location: "Remote, Moscow",
    date: "June 2019 to March 2020",
    description: `Architected and implemented backend solutions for medical services aggregator applications,
catering to both mobile and web platforms. Developed custom parsers with Python and Scrapy, expanding the range of available doctors and clinics.`
  },
  {
    title: "Python Software Engineer",
    company: "ArumCapital",
    location: "Full-time, Moscow",
    date: "October 2017 to March 2019",
    description: `Managed the broker's website using Python and Django, integrating secure payment systems and
maintaining the Content Management System (CMS). Streamlined the website's user interface, resulting in increased user engagement.`
  },
  {
    title: "Python Software Engineer",
    company: "SmartTeleMax",
    location: "Full-time, Moscow",
    date: "February 2015 to January 2017",
    description: `Responsible for developing news websites and a ground-up rewrite of the Federation Council's website.
Created a sophisticated backend admin panel using Python and MySQL, crafting a comprehensive Content Management System (CMS).`
  },
  // ... Add additional experiences here
];

const Portfolio: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">About Me</h1>
      <h2 className="text-xl font-bold mb-2">Hi, I'm Iliya Pichugin</h2>
      <h3 className="text-blue-500 mb-2">Software Engineer</h3>
      <h4 className="text-gray-500 mb-2">USA, remote 100%</h4>


      <h1 className="text-3xl font-semibold mb-4">Summary</h1>
      <p className="mb-6">
        I am a software engineer with over 6 years of experience in backend development. I specialize in Golang, Python, and
        Kubernetes, and I am passionate about building scalable, high-impact software solutions.
      </p>
      <h1 className="text-3xl font-semibold mb-4">Work Experience</h1>
      {experienceData.map((job, index) => (
        <div key={index} className="mb-6 bg-codelightbg dark:bg-codedarkbg rounded shadow p-4">
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
