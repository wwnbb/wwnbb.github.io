import React from "react";

// Define your work experience data
const experienceData = [
  {
    title: "Senior Golang Engineer",
    company: "Secure-T",
    location: "Remote, Georgia",
    date: "04/22 - Present",
    description: `Specialize in leading a proficient team of software developers in designing, developing, and deploying high-impact software solutions with an emphasis on Kubernetes orchestration and Golang. Our platform, focused on security awareness and cybersecurity training, is utilized by over 100 companies each with an average employee count of 1,000, highlighting its scalability and reach.`,
    achievements: [
      "Dramatically enhanced the application's performance for collecting and processing statistics, achieving a speed boost of over 4 times, thanks to optimizations using PostgreSQL and GORM. This improvement played a pivotal role in our ability to successfully attract and serve large B2B clients, including those with more than 10,000 employees.",
      "Managed product integration for a major Hungarian bank using Golang, successfully closing five critical development milestones from the planned roadmap by seamlessly integrating third-party systems."
    ]
  },
  {
    title: "Golang Developer",
    company: "Tochka",
    location: "Remote, Moscow",
    date: "04/20 - 01/22",
    description: `Contributed to the development of the CompanyName mobile banking app, a product serving over 2 million customers and backed by a team of over 1,000 employees. Implemented pivotal features such as automatic card withdrawals, batch payments, and seamless integration of the 'CompanyName XS' payment feed using Golang and RabbitMQ. Further enhanced both user experience and operational efficiency by developing a legal document section, establishing effective counterparties management, and introducing rigorous bank card number validation mechanisms.`,
    achievements: [
      "Implemented performance enhancements that resulted in a 40% reduction in API response times, leading to improved user experience and increased customer satisfaction.",
      "Engineered a robust card validation service using Fiber, resulting in a 15% reduction in transaction errors. This achievement significantly bolstered the overall reliability of the mobile banking application, ensuring a smoother and more secure experience for users."
    ]
  },
  {
    title: "Python Software Engineer",
    company: "MONS",
    location: "Remote, Moscow",
    date: "06/19 - 03/20",
    description: `Architected and implemented robust backend solutions for medical services aggregator applications, catering to both mobile and web platforms. These solutions played a pivotal role in ensuring seamless user experiences and optimizing the delivery of critical healthcare information.`,
    achievements: [
      "Increased the medical startup's network of healthcare providers by 200% by developing custom parsers with Python and Scrapy, which efficiently aggregated and integrated data from various sources to expand the range of available doctors and clinics.",
      "Introduced a potent search service powered by Django, enabling efficient and user-friendly search functionality. This solution facilitated rapid and precise retrieval of relevant information, resulting in an enhanced overall user experience and simplified data access."
    ]
  },
  {
    title: "Python Software Engineer",
    company: "ArumCapital",
    location: "Full-time, Moscow",
    date: "10/17 - 03/19",
    description: `Managed the broker's website using Python and Django, integrating secure payment systems and maintaining the Content Management System (CMS). Achieved seamless integration with trading client software through well-documented APIs for real-time data exchange and enhanced trading features.`,
    achievements: [
      "Streamlined the website's user interface, resulting in a 20% increase in user engagement and a 15% reduction in bounce rates.",
      "Developed and maintained documentation for website and software configurations, ensuring smooth operations and easy troubleshooting.",
      "Managed and maintained the broker's website, ensuring its functionality and responsiveness to user needs."
    ]
  },
  {
    title: "Python Software Engineer",
    company: "SmartTeleMax",
    location: "Full-time, Moscow",
    date: "02/15 - 01/17",
    description: `I was responsible for developing news websites and undertaking a ground-up rewrite of the Federation Council's website. I created a sophisticated backend admin panel tailored for editors, effectively crafting a Content Management System (CMS) using Python and MySQL to empower the editorial team. Notably, this CMS proved to be more intricate than the frontend, highlighting my ability to deliver comprehensive solutions.`,
    achievements: [
      "Actively participated in code reviews, quality assurance testing, and debugging, ensuring the delivery of high-quality software with minimal errors.",
      "Collaborated on the development of user-friendly admin interfaces and dashboards, simplifying content management tasks for editors and administrators.",
      "Leveraged Python's capabilities to develop and optimize various components of the CMS, facilitating seamless content creation, editing, and distribution workflows."
    ]
  }
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
          <ul className="list-disc list-inside mt-2">
            {job.achievements.map((achievement, achievementIndex) => (
              <li key={achievementIndex}>{achievement}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Portfolio;
