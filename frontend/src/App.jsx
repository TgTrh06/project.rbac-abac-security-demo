import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RBACDemo from './components/RBACDemo';
import AdminPanel from './components/AdminPanel';

const SECURE_SERVER_URL = "http://localhost:5001";
const VULNERABLE_SERVER_URL = "http://localhost:4000";

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
  // Tab state
  const [activeTab, setActiveTab] = useState('demo');

  // Authentication state
  const [username, setUsername] = useState(USERS[0].username);
  const [password, setPassword] = useState(USERS[0].password);
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Testing state
  const [selectedRouteId, setSelectedRouteId] = useState(API_ROUTES[0].id);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Attack simulation state
  const [breachLoading, setBreachLoading] = useState(false);
  const [breachResults, setBreachResults] = useState(null);

  // Logs state
  const [logs, setLogs] = useState([]);

  // Policy Management State
  const [policy, setPolicy] = useState({ workHours: { start: 9, end: 18 }, allowedIPs: [] });
  const [users, setUsers] = useState([]);

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

    const selectedRoute = API_ROUTES.find(r => r.id === selectedRouteId);
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

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <script src="https://cdn.tailwindcss.com"></script>

      {/* Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'demo' && (
          <RBACDemo
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            token={token}
            currentUser={currentUser}
            selectedRouteId={selectedRouteId}
            setSelectedRouteId={setSelectedRouteId}
            result={result}
            loading={loading}
            breachLoading={breachLoading}
            breachResults={breachResults}
            logs={logs}
            setLogs={setLogs}
            handleLogin={handleLogin}
            handleTestEndpoint={handleTestEndpoint}
            handleSimulateBreach={handleSimulateBreach}
          />
        )}

        {activeTab === 'jwt-attack' && <PrivilegeEscalation />}

        {activeTab === 'admin' && (
          <AdminPanel
            policy={policy}
            setPolicy={setPolicy}
            users={users}
            updatePolicy={updatePolicy}
            updateUserClearance={updateUserClearance}
          />
        )}
      </div>
    </div>
  );
};

export default App;