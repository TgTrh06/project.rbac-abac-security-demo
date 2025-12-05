import React from 'react';
import { LogIn, User, FileWarning, Zap, Activity, Server, RefreshCw } from 'lucide-react';

const USERS = [
    { label: "IT Admin (Top Secret)", username: "admin", password: "123456" },
    { label: "IT User (Secret)", username: "user_it", password: "123456" },
    { label: "HR User (Confidential)", username: "user_hr", password: "123456" },
    { label: "User (Public)", username: "user", password: "123456" },
];

const API_ROUTES = [
    { id: "admin", name: "Admin Resource (RBAC)", secure: "/api/resource/admin", vulnerable: "/api/resource/admin", method: "GET" },
    { id: "dept_it", name: "IT Dept (ABAC-Dept)", secure: "/api/resource/department", vulnerable: "/api/resource/department", method: "GET" },
    { id: "top_secret", name: "Top Secret (ABAC-Clearance)", secure: "/api/resource/top-secret", vulnerable: "/api/resource/top-secret", method: "GET" },
    { id: "secret", name: "Secret (ABAC-Clearance)", secure: "/api/resource/secret", vulnerable: "/api/resource/secret", method: "GET" },
    { id: "work_hours", name: "Work Hours (ABAC-Time)", secure: "/api/resource/work-hours", vulnerable: "/api/resource/work-hours", method: "GET" },
    { id: "office_ip", name: "Office IP (ABAC-IP)", secure: "/api/resource/office-ip", vulnerable: "/api/resource/office-ip", method: "GET" },
];

const RBACDemo = ({
    username,
    setUsername,
    password,
    setPassword,
    token,
    currentUser,
    selectedRouteId,
    setSelectedRouteId,
    result,
    loading,
    breachLoading,
    breachResults,
    logs,
    setLogs,
    handleLogin,
    handleTestEndpoint,
    handleSimulateBreach,
}) => {
    const selectedRoute = API_ROUTES.find(r => r.id === selectedRouteId);

    const statusColor = result?.status ?
        (result.status === 200 || result.status === 201 ? 'bg-green-100 text-green-800 border-green-400' :
            (result.status === 403 || result.status === 401 ? 'bg-red-100 text-red-800 border-red-400' :
                'bg-yellow-100 text-yellow-800 border-yellow-400')) : 'bg-gray-100';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Controls */}
            <div className="lg:col-span-4 space-y-6">
                {/* Authentication */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" /> User Identity
                    </h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Persona:</label>
                        <select
                            className="w-full p-2 border rounded"
                            onChange={(e) => {
                                const user = USERS.find(u => u.username === e.target.value);
                                setUsername(user.username);
                                setPassword(user.password);
                            }}
                        >
                            {USERS.map(u => <option key={u.username} value={u.username}>{u.label}</option>)}
                        </select>
                    </div>

                    <div className="flex gap-2 mb-4">
                        <input type="text" value={username} readOnly className="flex-1 p-2 border rounded bg-gray-50 text-sm" />
                        <input type="password" value={password} readOnly className="w-24 p-2 border rounded bg-gray-50 text-sm" />
                    </div>

                    <button onClick={handleLogin} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center gap-2">
                        <LogIn className="w-4 h-4" /> {loading ? 'Logging in...' : 'Authenticate'}
                    </button>

                    {currentUser && (
                        <div className="mt-4 p-3 bg-blue-50 rounded text-sm border border-blue-100">
                            <p><strong>Role:</strong> {currentUser.role}</p>
                            <p><strong>Dept:</strong> {currentUser.department}</p>
                            <p><strong>Clearance:</strong> <span className="uppercase font-bold text-purple-600">{currentUser.clearance}</span></p>
                        </div>
                    )}
                </div>

                {/* Attack Simulation */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-500">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FileWarning className="w-5 h-5" /> Attack Simulation
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">Try to access ALL resources with current token.</p>
                    <button onClick={handleSimulateBreach} disabled={!token || breachLoading} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex justify-center items-center gap-2">
                        <Zap className="w-4 h-4" /> {breachLoading ? 'Attacking...' : 'Simulate Breach'}
                    </button>

                    {breachResults && (
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between items-center p-2 bg-green-100 rounded text-green-800">
                                <span>Secure Server blocked:</span>
                                <span className="font-bold">{breachResults.secureBlocked} / {API_ROUTES.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-red-100 rounded text-red-800">
                                <span>Vulnerable Server leaked:</span>
                                <span className="font-bold">{breachResults.vulnerableLeaked} / {API_ROUTES.length}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Middle Column: Testing */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500 h-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5" /> Access Test
                    </h2>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Resource:</label>
                        <div className="space-y-2">
                            {API_ROUTES.map(r => (
                                <button
                                    key={r.id}
                                    onClick={() => setSelectedRouteId(r.id)}
                                    className={`w-full text-left p-3 rounded border transition-all ${selectedRouteId === r.id ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <div className="font-medium text-gray-800">{r.name}</div>
                                    <div className="text-xs text-gray-500 font-mono">{r.secure}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button onClick={() => handleTestEndpoint(true)} disabled={!token} className="bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold">
                            Test Secure
                        </button>
                        <button onClick={() => handleTestEndpoint(false)} disabled={!token} className="bg-red-600 text-white py-2 rounded hover:bg-red-700 font-bold">
                            Test Vulnerable
                        </button>
                    </div>

                    {result && (
                        <div className={`p-4 rounded-lg border ${statusColor}`}>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold">{result.type} Server</span>
                                <span className="font-mono font-bold">{result.status}</span>
                            </div>

                            {result.body.policy ? (
                                <div className="bg-white/50 p-2 rounded text-sm space-y-1">
                                    <p className="font-bold text-red-700">{result.body.message}</p>
                                    <hr className="border-red-200 my-1" />
                                    <p><strong>Policy:</strong> {result.body.policy}</p>
                                    <p><strong>Required:</strong> {JSON.stringify(result.body.required)}</p>
                                    <p><strong>Current:</strong> {JSON.stringify(result.body.current)}</p>
                                </div>
                            ) : (
                                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                                    {JSON.stringify(result.body, null, 2)}
                                </pre>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Audit Logs */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-gray-900 p-6 rounded-xl shadow-md border-t-4 border-gray-700 h-[600px] flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Server className="w-5 h-5" /> Live Audit Logs
                        <RefreshCw className="w-4 h-4 ml-auto cursor-pointer hover:rotate-180 transition-transform" onClick={() => setLogs([])} />
                    </h2>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {logs.length === 0 && <p className="text-gray-500 text-center mt-10">No logs yet...</p>}
                        {logs.map(log => (
                            <div key={log.id} className="bg-gray-800 p-3 rounded border-l-4 border-gray-600 text-xs font-mono">
                                <div className="flex justify-between text-gray-400 mb-1">
                                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    <span className={log.outcome === 'ALLOWED' ? 'text-green-400' : 'text-red-400'}>{log.outcome}</span>
                                </div>
                                <div className="text-white font-bold mb-1">{log.user}</div>
                                <div className="text-blue-300 mb-1">{log.resource}</div>
                                {log.reason && (
                                    <div className="text-red-300 mt-1 pt-1 border-t border-gray-700">
                                        Reason: {log.reason} ({log.policy})
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RBACDemo;
