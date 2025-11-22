import { Outlet } from 'react-router-dom';
import Header from './Header';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;