import HamburgerMenu from "../util/HamburgerMenu";

const Header = () => {
    return (
        <header className="bg-teal-700 text-white sticky top-0 z-10">
            <section className="max-w-4xl mx-auto flex justify-between p-4 items-center">
                <h1 className="text-3xl font-medium"><a href="#hero">🚀 Acme Rockets</a></h1>
                <div>
                    <div className="sm:hidden focus:outline-none">
                        <HamburgerMenu />
                    </div>
                    <nav className="hidden sm:block space-x-8 tex-xl" aria-label="main">
                        <a href="#rockets" className="opacity-90">Rockets</a>
                        <a href="#testimonials" className="opacity-90">Testimonials</a>
                        <a href="#contact" className="opacity-90">Contact</a>
                    </nav>
                </div>

            </section>
        </header >
    );
};

export default Header;
