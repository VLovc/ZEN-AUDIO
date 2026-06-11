import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import PlayerBarStudio from './PlayerBarStudio';

const MainLayout = () => {
    return (
        <div className="bg-background text-on-surface font-body-md min-h-screen flex selection:bg-primary-container">
            <Sidebar />
            <div className="flex-1 w-full flex flex-col md:pl-64 min-w-0 min-h-screen relative overflow-hidden">
                <Outlet />
            </div>
            {/* PlayerBarStudio handles its own positioning internally */}
            <PlayerBarStudio />
        </div>
    );
};

export default MainLayout;
