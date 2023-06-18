import { Link } from 'react-router-dom';
import { routes, files } from '../../routes';
import DownloadIcon from '@mui/icons-material/Download';

const Header = () => {
    return (
        <header className="flex items-center justify-between p-5 bg-blue-500">
            <Link to={routes.HOME} className="flex items-center">
                <img className="h-10 w-10" src={`/images/avatar.png`} alt="Logo" />
            </Link>
            <nav className="space-x-4">
                <Link to={routes.ABOUT} className="text-white hover:text-blue-200">
                    About
                </Link>
                <Link to={routes.PORTFOLIO} className="text-white hover:text-blue-200">
                    Portfolio
                </Link>
                <a href={files.RESUME} download="John_Doe_Resume.pdf" className="text-white hover:text-blue-200">
                    <span>Resume</span>
                    <DownloadIcon />
                </a>
                <Link to={routes.CONTACT} className="text-white hover:text-blue-200">
                    Contact
                </Link>
            </nav>
        </header >
    );
};

export default Header;
