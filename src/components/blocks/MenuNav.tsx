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

    return (
        <header className={`${menuClasses} transition-transform duration-300 ease-in-out sm:fixed lg:static lg:block w-full h-full sm:top-2/4 inset-0 sm:bg-opacity-80 sm:dark:bg-opacity-80 sm:dark:bg-base03 sm:bg-base0 sm:backdrop-blur-lg lg:backdrop-blur-0 sm:border-red-600 sm:border-t-8 lg:border-0 lg:bg-inherit`}>
            <nav className="h-full flex justify-evenly items-center sm:text-5xl lg:text-xl sm:flex sm:flex-col lg:flex-row sm:h-2/5">
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
