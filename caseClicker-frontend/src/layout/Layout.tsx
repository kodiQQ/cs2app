import React from 'react';
import { Navbar } from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
    return (
        <div className="App">
            <div className="navbar sticky top-0 z-50">
                <Navbar />
            </div>
            <div className="content-wrapper relative flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};
