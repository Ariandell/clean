import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, List, Users, LogOut } from 'lucide-react';

export const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Головна' },
        { path: '/admin/leads', icon: Users, label: 'Заявки' },
        { path: '/admin/services', icon: List, label: 'Послуги' },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex font-sans">

            <aside className="w-64 bg-[#1a1a1a] border-r border-white/10 flex flex-col fixed h-full z-50">
                <div className="p-8 border-b border-white/10">
                    <h1 className="text-xl font-black uppercase tracking-widest">Uberem<span className="text-blue-500">.</span></h1>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm uppercase tracking-wider ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-colors font-bold text-sm uppercase tracking-wider"
                    >
                        <LogOut size={18} />
                        Вийти
                    </button>
                </div>
            </aside>


            <main className="flex-1 ml-64 p-8 bg-black min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};
