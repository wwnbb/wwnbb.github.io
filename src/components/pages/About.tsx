const About = () => {
    return (
        <section className="about bg-gray-100 py-8">
            <div className="about__container mx-auto max-w-lg">
                <h2 className="about__title text-2xl font-bold text-center mb-4">About</h2>
                <div className="about__content bg-white shadow-md rounded p-4">
                    <div className="about__content-left">
                        <h3 className="about__content-title font-medium text-lg mb-2">Education</h3>
                        <div className="about__content-item">
                            <h4 className="about__content-item-title font-semibold mb-1">University of California, Berkeley</h4>
                            <p className="about__content-item-subtitle text-gray-500">Full Stack Web Development</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
