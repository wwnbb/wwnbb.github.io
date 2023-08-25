import React, { createContext, useContext, useState } from 'react';

const MenuContext = createContext<[boolean, (value: boolean) => void] | undefined>(undefined);

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
};

export const MenuProvider: React.FC = ({ children }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    return <MenuContext.Provider value={[isMenuOpen, setMenuOpen]}>{children}</MenuContext.Provider>;
};

