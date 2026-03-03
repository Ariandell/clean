import React from 'react';

export const AdminDashboard = () => {
    return (
        <div>
            <h2 className="text-3xl font-black text-white mb-2">Огляд</h2>
            <p className="text-white/40 mb-8">Ласкаво просимо в панель керування.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
                    <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Нових заявок</div>
                    <div className="text-4xl font-black text-white">--</div>
                </div>
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6">
                    <div className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Активних послуг</div>
                    <div className="text-4xl font-black text-white">--</div>
                </div>
            </div>
        </div>
    );
};
