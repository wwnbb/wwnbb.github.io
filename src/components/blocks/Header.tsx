import { Link } from 'react-router-dom';
import { routes, files } from '../../routes';
import DownloadIcon from '@mui/icons-material/Download';

const Header = () => {
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
            to: routes.BLOG,
            text: 'ABOUT',
        },
        {
            to: routes.CONTACT,
            text: 'CONTACT',
        }
    ];

    return (
        <header className="w-full h-full">
            <nav className="h-full flex justify-between items-center text-3xl">
                {navItems.map((item, index) => (
                    <Link key={index} to={item.to} className={hoverClass}>
                        {item.text}
                    </Link>
                ))}
            </nav>
        </header >
    );
};

export default Header;
