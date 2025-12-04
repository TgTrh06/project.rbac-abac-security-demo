import React, { useState, useEffect } from 'react';
import { LogIn, User, Lock, Unlock, Zap, Server, ShieldAlert, Clock, Globe, FileWarning, Activity, RefreshCw, Settings, Users } from 'lucide-react';

const SECURE_SERVER_URL = "http://localhost:5001";
const VULNERABLE_SERVER_URL = "http://localhost:4000";

const API_ROUTES = [
  { id: "admin", name: "Admin Resource (RBAC)", secure: "/api/resource/admin", vulnerable: "/api/resource/admin", method: "GET" },
  { id: "dept_it", name: "IT Dept (ABAC-Dept)", secure: "/api/resource/department", vulnerable: "/api/resource/department", method: "GET" },
  { id: "top_secret", name: "Top Secret (ABAC-Clearance)", secure: "/api/resource/top-secret", vulnerable: "/api/resource/top-secret", method: "GET" },
  { id: "secret", name: "Secret (ABAC-Clearance)", secure: "/api/resource/secret", vulnerable: "/api/resource/secret", method: "GET" },
  { id: "work_hours", name: "Work Hours (ABAC-Time)", secure: "/api/resource/work-hours", vulnerable: "/api/resource/work-hours", method: "GET" },
  { id: "office_ip", name: "Office IP (ABAC-IP)", secure: "/api/resource/office-ip", vulnerable: "/api/resource/office-ip", method: "GET" },
];

const USERS = [
  { label: "IT Admin (Top Secret)", username: "admin_it", password: "123456" },
  { label: "IT User (Secret)", username: "user_it", password: "123456" },
  { label: "HR User (Confidential)", username: "user_hr", password: "123456" },
  { label: "Intern (Public)", username: "intern", password: "123456" },
];

async function fetchWithRetry(url, options, retries = 3) {
  const DELAY = 1000;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, DELAY * (2 ** i)));
    }
  }
}

const App = () => {
  const [username, setUsername] = useState(USERS[0].username);
  const [password, setPassword] = useState(USERS[0].password);
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(API_ROUTES[0].id);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [breachLoading, setBreachLoading] = useState(false);
  const [breachResults, setBreachResults] = useState(null);

  // Policy Management State
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [policy, setPolicy] = useState({ workHours: { start: 9, end: 18 }, allowedIPs: [] });
  const [users, setUsers] = useState([]);

  const selectedRoute = API_ROUTES.find(r => r.id === selectedRouteId);

  // Fetch policy and users
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await fetch(`${SECURE_SERVER_URL}/api/policy`);
        if (res.ok) {
          const data = await res.json();
          setPolicy(data);
        }
      } catch (e) { }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${SECURE_SERVER_URL}/api/users`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (e) { }
    };

    fetchPolicy();
    fetchUsers();
    const interval = setInterval(() => {
      fetchPolicy();
      fetchUsers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Poll for logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${SECURE_SERVER_URL}/api/logs`);
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (e) { }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetchWithRetry(`${SECURE_SERVER_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        try {
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          setCurrentUser(payload);
          setResult({ status: response.status, body: { message: 'Login successful.', user: payload } });
        } catch (e) {
          setCurrentUser({ username: 'Unknown' });
        }
      } else {
        setToken(null);
        setCurrentUser(null);
        setResult({ status: response.status, body: data });
      }
    } catch (error) {
      setResult({ status: 'Error', body: { message: 'Could not connect to server.' } });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEndpoint = async (isSecure) => {
    if (!token) {
      setResult({ status: '401', body: { message: 'Please log in first.' } });
      return;
    }

    setLoading(true);
    setResult(null);

    const serverUrl = isSecure ? SECURE_SERVER_URL : VULNERABLE_SERVER_URL;
    const path = isSecure ? selectedRoute.secure : selectedRoute.vulnerable;

    try {
      const response = await fetchWithRetry(`${serverUrl}${path}`, {
        method: selectedRoute.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text }; }

      setResult({
        status: response.status,
        body: data,
        type: isSecure ? 'Secure' : 'Vulnerable'
      });

    } catch (error) {
      setResult({ status: 'Error', body: { message: 'Network error.' } });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateBreach = async () => {
    if (!token) return;
    setBreachLoading(true);
    setBreachResults(null);

    const results = { secureBlocked: 0, secureLeaked: 0, vulnerableBlocked: 0, vulnerableLeaked: 0 };

    for (const route of API_ROUTES) {
      try {
        const resSec = await fetch(`${SECURE_SERVER_URL}${route.secure}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (resSec.status === 200) results.secureLeaked++; else results.secureBlocked++;
      } catch (e) { }

      try {
        const resVuln = await fetch(`${VULNERABLE_SERVER_URL}${route.vulnerable}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (resVuln.status === 200) results.vulnerableLeaked++; else results.vulnerableBlocked++;
      } catch (e) { }
    }

    setBreachResults(results);
    setBreachLoading(false);
  };

  const updatePolicy = async () => {
    try {
      await fetch(`${SECURE_SERVER_URL}/api/policy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy)
      });
      alert('Policy updated successfully!');
    } catch (e) {
      alert('Failed to update policy');
    }
  };

  const updateUserClearance = async (userId, clearance) => {
    try {
      await fetch(`${SECURE_SERVER_URL}/api/users/${userId}/clearance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clearance })
      });
      alert('User clearance updated!');
    } catch (e) {
      alert('Failed to update clearance');
    }
  };

  const statusColor = result?.status ?
    (result.status === 200 || result.status === 201 ? 'bg-green-100 text-green-800 border-green-400' :
      (result.status === 403 || result.status === 401 ? 'bg-red-100 text-red-800 border-red-400' :
        'bg-yellow-100 text-yellow-800 border-yellow-400')) : 'bg-gray-100';

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans flex flex-col gap-6">
      <script src="https://cdn.tailwindcss.com"></script>

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <ShieldAlert className="w-10 h-10 text-blue-600" />
          Security Demo: RBAC vs ABAC
        </h1>
        <button
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          <Settings className="w-5 h-5" />
          {showAdminPanel ? 'Hide' : 'Show'} Admin Panel
        </button>
      </div>

      {/* Admin Panel */}
      {showAdminPanel && (
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-6">

          {/* Authentication */}
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><User className="w-5 h-5" /> User Identity</h2>

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
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><FileWarning className="w-5 h-5" /> Attack Simulation</h2>
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
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Activity className="w-5 h-5" /> Access Test</h2>

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
    </div>
  );
};

export default App;