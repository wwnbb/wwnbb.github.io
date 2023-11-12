import { GitHub, LinkedIn, Telegram } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import React from "react";

// Define the types for your props
interface FooterProps {
    toggleMenu: () => void; // Adjust the type according to the actual function signature
}

// Use the defined types for the props parameter
const Footer = React.forwardRef<HTMLElement, FooterProps>((props, ref) => {
    const { toggleMenu } = props;

    return (
        <>
            <section ref={ref} className="flex w-full h-full z-10 relative sm:flex sm:flex-col justify-end lg:dark:text-base3 lg:text-base03 sm:dark:text-base3 sm:text-base3">
                <div className="bg-gradient-to-r from-base03 to-base02  sm:h-2/3 sm:w-full flex sm:flex-row sm:justify-between lg:flex-col justify-end items-center lg:w-full lg:h-full lg:bg-none">
                    <a className="mt-4 mb-auto">
                        <div className="sm:text-9xl lg:text-4xl">
                        </div>
                    </a>
                    <div className="mb-12">
                        <div className="sm:hidden lg:block text-base01  dark:text-sgray -rotate-90 focus:outline-none select-none">#HARDCODE</div>
                    </div>
                    <div className="h-20 w-0.5 bg-base02 dark:bg-base2"></div>
                    <div className="my-5 lg:menu-shadow-unset sm:menu-shadow-unset dark:sm:menu-shadow-white sm:flex sm:flex-row sm:w-full sm:h-full sm:justify-around sm:items-center lg:block lg:h-auto lg:w-auto sm:text-7xl lg:text-3xl">
                        <div className="mb-1 transform hover:scale-125 transition duration-300 disable-outline">
                            <a className="focus:outline-none focus:select-none" href="https://github.com/wwnbb"><GitHub fontSize="inherit" /></a>
                        </div>

                        <div className="mb-1 transform hover:scale-125 transition duration-300 disable-outline">
                            <a className="focus:outline-none select-none" href="https://www.linkedin.com/in/wwnbb/"><LinkedIn fontSize="inherit" /></a>
                        </div>

                        <div className="my-1 transform hover:scale-125 transition duration-300 disable-outline">
                            <a className="focus:outline-none focus:select-none" href="https://t.me/P_Iliya_oe8eeShi"><Telegram fontSize="inherit" onClick={(event) => event.currentTarget.blur()} /></a>
                        </div>

                        <div className="my-1 transform hover:scale-125 transition duration-300 sm:text-9xl lg:hidden">
                            <MenuIcon fontSize="inherit" onClick={() => toggleMenu()} />
                        </div>
                    </div>
                    <div className="h-2/5 w-0.5 bg-base02 dark:bg-base2"></div>
                </div>
            </section >
        </>
    );
});

export default Footer;
