import React from 'react';
import { ShieldAlert, Settings, Activity } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'demo', label: 'RBAC/ABAC Demo', icon: Activity },
        { id: 'admin', label: 'Admin Panel', icon: Settings },
    ];

    return (
        <div className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-10 h-10 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900">Security Demo</h1>
                            <p className="text-xs text-gray-600">RBAC vs ABAC Comparison</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
