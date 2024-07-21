const Resume = () => {
    return (
        <section className="resume p-6 bg-gray-100">
            <div className="resume__container mx-auto max-w-xl">
                <h1 className="text-2xl font-bold mb-2">Pichugin Iliya</h1>
                <p className="mb-4">100% Remote - United States</p>
                <p className="mb-2">iliya.pichugin@hotmail.com</p>
                <p className="mb-4"><a href="https://www.linkedin.com/in/iliya-pichugin/" className="text-blue-600 hover:underline">LinkedIn Profile</a></p>

                <h2 className="text-xl font-semibold mt-6 mb-2">SKILLS</h2>
                <ul className="list-disc list-inside mb-4">
                    <li>Golang</li>
                    <li>Microservice Architecture</li>
                    <li>Kubernetes</li>
                    <li>RabbitMQ</li>
                    <li>GORM</li>
                    <li>GRPC</li>
                    <li>PostgreSQL</li>
                    <li>Python</li>
                    <li>Redis</li>
                    <li>Linux</li>
                    <li>CI/CD</li>
                    <li>Github</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">EXPERIENCE</h2>

                <h3 className="text-lg font-semibold mt-4">Senior Golang Engineer at Secure-T (Remote, Georgia) – 04/22 - Present</h3>
                <p className="mb-2">Specialize in leading a proficient team of software developers in designing, developing, and deploying high-impact software solutions with an emphasis on Kubernetes orchestration and Golang. Our platform, focused on security awareness and cybersecurity training, is utilized by over 100 companies each with an average employee count of 1,000, highlighting its scalability and reach.</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Dramatically enhanced the application's performance for collecting and processing statistics, achieving a speed boost of over 4 times, thanks to optimizations using PostgreSQL and GORM. This improvement played a pivotal role in our ability to successfully attract and serve large B2B clients, including those with more than 10,000 employees.</li>
                    <li>Managed product integration for a major Hungarian bank using Golang, successfully closing five critical development milestones from the planned roadmap by seamlessly integrating third-party systems.</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">Golang Developer at Tochka (Remote, Moscow) – 04/20 - 01/22</h3>
                <p className="mb-2">Contributed to the development of the CompanyName mobile banking app, a product serving over 2 million customers and backed by a team of over 1,000 employees. Implemented pivotal features such as automatic card withdrawals, batch payments, and seamless integration of the 'CompanyName XS' payment feed using Golang and RabbitMQ. Further enhanced both user experience and operational efficiency by developing a legal document section, establishing effective counterparties management, and introducing rigorous bank card number validation mechanisms.</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Implemented performance enhancements that resulted in a 40% reduction in API response times, leading to improved user experience and increased customer satisfaction.</li>
                    <li>Engineered a robust card validation service using Fiber, resulting in a 15% reduction in transaction errors. This achievement significantly bolstered the overall reliability of the mobile banking application, ensuring a smoother and more secure experience for users.</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">Python Software Engineer MONS (Remote, Moscow) – 06/19 - 03/20</h3>
                <p className="mb-2">Architected and implemented robust backend solutions for medical services aggregator applications, catering to both mobile and web platforms. These solutions played a pivotal role in ensuring seamless user experiences and optimizing the delivery of critical healthcare information.</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Increased the medical startup's network of healthcare providers by 200% by developing custom parsers with Python and Scrapy, which efficiently aggregated and integrated data from various sources to expand the range of available doctors and clinics.</li>
                    <li>Introduced a potent search service powered by Django, enabling efficient and user-friendly search functionality. This solution facilitated rapid and precise retrieval of relevant information, resulting in an enhanced overall user experience and simplified data access.</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">Python Software Engineer ArumCapital (Full-time, Moscow) – 10/17 - 03/19</h3>
                <p className="mb-2">Managed the broker's website using Python and Django, integrating secure payment systems and maintaining the Content Management System (CMS). Achieved seamless integration with trading client software through well-documented APIs for real-time data exchange and enhanced trading features.</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Streamlined the website's user interface, resulting in a 20% increase in user engagement and a 15% reduction in bounce rates.</li>
                    <li>Developed and maintained documentation for website and software configurations, ensuring smooth operations and easy troubleshooting.</li>
                    <li>Managed and maintained the broker's website, ensuring its functionality and responsiveness to user needs.</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">Python Software Engineer SmartTeleMax (Full-time, Moscow) – 02/15 - 01/17</h3>
                <p className="mb-2">I was responsible for developing news websites and undertaking a ground-up rewrite of the Federation Council's website. I created a sophisticated backend admin panel tailored for editors, effectively crafting a Content Management System (CMS) using Python and MySQL to empower the editorial team. Notably, this CMS proved to be more intricate than the frontend, highlighting my ability to deliver comprehensive solutions.</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Actively participated in code reviews, quality assurance testing, and debugging, ensuring the delivery of high-quality software with minimal errors.</li>
                    <li>Collaborated on the development of user-friendly admin interfaces and dashboards, simplifying content management tasks for editors and administrators.</li>
                    <li>Leveraged Python's capabilities to develop and optimize various components of the CMS, facilitating seamless content creation, editing, and distribution workflows.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">EDUCATION</h2>
                <p className="font-semibold">Bauman Moscow State Technical University</p>
                <p>Moscow, Russia</p>
                <p>Bachelor Degree</p>
                <p>Attended: 2011 - 2015</p>
            </div>
        </section>
    );
};

export default Resume;
