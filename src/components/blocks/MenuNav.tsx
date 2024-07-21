import { Link } from 'react-router-dom';
import { routes } from '../../routes';

const MenuNav = ({ isMenuOpen }) => {
    const hoverClass = 'hover:border-b-2 hover:border-solid hover:border-sdarkcyan'
    const textClass = 'sm:border-base03 sm:dark:border-base3 sm:border-b-4 sm:dark:border-base3 dark:text-base3 text-base03 lg:border-0'

    const navItems = [
        {
            to: routes.HOME,
            text: 'HOME',
        },
        {
            to: routes.BLOG,
            text: 'BLOG',
        },
        {
            to: routes.CONTACT,
            text: 'RESUME',
        }
    ];
    const menuClasses = isMenuOpen
        ? 'sm:translate-y-200 lg:translate-y-0'
        : 'sm:translate-y-full lg:translate-y-0';

    const menuTransform = 'transition-transform duration-300 ease-in-out'

    const smClasses = `
        sm:fixed w-full h-full sm:top-2/4 inset-0 sm:bg-opacity-80 sm:dark:bg-opacity-80
        sm:dark:bg-base03 sm:bg-base0 sm:backdrop-blur-lg  sm:border-t-8 z-10
    `

    const lgClasses = `
        lg:static lg:block lg:backdrop-blur-0 sm:border-red-600
        lg:border-0 lg:bg-inherit lg:h-[17vh] lg:flex lg:items-end lg:justify-end
    `

    return (
        <header className={`${menuClasses} ${menuTransform} ${lgClasses} ${smClasses}`}>
            <nav className="h-full flex justify-evenly items-center sm:text-5xl lg:text-xl sm:flex sm:flex-col lg:flex-row sm:h-2/5 lg:w-[33.3%] mr-[17%]">
                {navItems.map((item, index) => (
                    <Link key={index} to={item.to} className={`${hoverClass} ${textClass}`}>
                        {item.text}
                    </Link>
                ))}
            </nav>
        </header >
    );
};

export default MenuNav;
