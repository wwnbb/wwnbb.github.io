const Resume = () => {
    return (
        <section className="resume p-6 bg-gray-100">
            <div className="resume__container mx-auto max-w-xl">
                <h2 className="resume__title text-3xl font-bold mb-4">Resume</h2>
                <div className="resume__content grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="resume__content-left">
                        <h3 className="resume__content-title text-2xl font-semibold mb-2">Education</h3>
                        <div className="resume__content-item mb-2">
                            <h4 className="resume__content-item-title font-medium text-lg">University of California, Berkeley</h4>
                            <p className="resume__content-item-subtitle text-blue-500">Full Stack Web Development</p>
                            <p className="resume__content-item-subtitle text-gray-500">2021</p>
                        </div>
                        <div className="resume__content-item">
                            <h4 className="resume__content-item-title font-medium text-lg">University of California, Berkeley</h4>
                            <p className="resume__content-item-subtitle text-blue-500">Full Stack Web Development</p>
                            <p className="resume__content-item-subtitle text-gray-500">2021</p>
                        </div>
                    </div>
                    <div className="resume__content-right">
                        <h3 className="resume__content-title text-2xl font-semibold mb-2">Experience</h3>
                        <div className="resume__content-item">
                            <h4 className="resume__content-item-title font-medium text-lg">Sr. Fullstack Developer</h4>
                            <p className="resume__content-item-subtitle text-blue-500">Full Stack Web Development</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Resume;
