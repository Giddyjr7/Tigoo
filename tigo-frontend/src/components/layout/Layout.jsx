import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    return (
        <div className="min-h-screen flex flex-col w-full relative">
            <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 w-full flex flex-row">
                <Sidebar isOpen={sidebarOpen} />
                <main className="flex-1 min-w-0 flex">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}


