import { Link } from 'react-router-dom';
import { routes } from '../../routes';

const MenuNav = ({ isMenuOpen }) => {
    const hoverClass = 'hover:border-b-2 hover:border-solid hover:border-sdarkcyan'
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
            text: 'CONTACT',
        }
    ];

    return (
        <header className={`${isMenuOpen ? 'sm:block' : 'sm:hidden'} sm:fixed w-full h-full sm:top-2/4 inset-0 sm:bg-opacity-50 sm:bg-base0`}>
            <nav className="h-full flex justify-evenly items-center text-3xl sm:flex sm:flex-col sm:h-2/5">
                {navItems.map((item, index) => (
                    <Link key={index} to={item.to} className={hoverClass}>
                        {item.text}
                    </Link>
                ))}
            </nav>
        </header >
    );
};

export default MenuNav;
