import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col w-full">
            <Navbar />
            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 flex flex-col">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
