import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            // 768px is Tailwind's md breakpoint
            return window.innerWidth >= 768;
        }
        return true;
    });

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    return (
        <div className="min-h-screen flex flex-col w-full relative">
            <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 w-full flex flex-row">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <main className="flex-1 min-w-0 flex">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}


