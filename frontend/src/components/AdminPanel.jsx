import React from 'react';
import { Settings, Clock, Globe, Users } from 'lucide-react';

const SECURE_SERVER_URL = "http://localhost:5001";

const AdminPanel = ({ policy, setPolicy, users, updatePolicy, updateUserClearance }) => {
    return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-lg border-2 border-purple-300">
            <h2 className="text-2xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6" /> Dynamic Policy Management
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Time Policy */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" /> Work Hours Policy
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Hour: {policy.workHours.start}:00</label>
                            <input
                                type="range"
                                min="0"
                                max="23"
                                value={policy.workHours.start}
                                onChange={(e) => setPolicy({ ...policy, workHours: { ...policy.workHours, start: parseInt(e.target.value) } })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Hour: {policy.workHours.end}:00</label>
                            <input
                                type="range"
                                min="0"
                                max="23"
                                value={policy.workHours.end}
                                onChange={(e) => setPolicy({ ...policy, workHours: { ...policy.workHours, end: parseInt(e.target.value) } })}
                                className="w-full"
                            />
                        </div>
                        <button onClick={updatePolicy} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Apply Time Policy
                        </button>
                    </div>
                </div>

                {/* IP Whitelist */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-600" /> IP Whitelist
                    </h3>
                    <div className="space-y-2 mb-3">
                        {policy.allowedIPs.map((ip, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <input
                                    value={ip}
                                    readOnly
                                    className="flex-1 p-2 border rounded bg-gray-50 text-sm font-mono"
                                />
                                <button
                                    onClick={() => setPolicy({ ...policy, allowedIPs: policy.allowedIPs.filter((_, i) => i !== idx) })}
                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            const newIP = prompt("Enter IP address:");
                            if (newIP) setPolicy({ ...policy, allowedIPs: [...policy.allowedIPs, newIP] });
                        }}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-2"
                    >
                        + Add IP
                    </button>
                    <button onClick={updatePolicy} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Apply IP Policy
                    </button>
                </div>

                {/* User Clearance Management */}
                <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-600" /> User Clearance Management
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {users.map(user => (
                            <div key={user._id} className="border rounded p-3 bg-gray-50">
                                <p className="font-bold text-sm">{user.username}</p>
                                <p className="text-xs text-gray-600">{user.role} | {user.department}</p>
                                <select
                                    value={user.clearance}
                                    onChange={(e) => updateUserClearance(user._id, e.target.value)}
                                    className="w-full mt-2 p-1 border rounded text-xs"
                                >
                                    <option value="public">Public</option>
                                    <option value="confidential">Confidential</option>
                                    <option value="secret">Secret</option>
                                    <option value="top_secret">Top Secret</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
