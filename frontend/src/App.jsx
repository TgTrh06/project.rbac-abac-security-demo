import React, { useState } from 'react';
import { LogIn, User, Lock, Unlock, Zap, Server } from 'lucide-react';

const SECURE_SERVER_URL = "http://localhost:5001";
const VULNERABLE_SERVER_URL = "http://localhost:4000"; 
// Lưu ý: Vì bạn sử dụng chung server, chúng ta sẽ giả định các endpoint được thiết lập tương ứng.

const API_ROUTES = [
  { 
    id: "admin", 
    name: "Admin Resource (RBAC)", 
    secure: "/api/resource/admin", 
    vulnerable: "/api/resource/admin", // Endpoint hở trong file app.js cũ
    secure_method: "GET",
    vulnerable_method: "GET"
  },
  { 
    id: "dept_it", 
    name: "IT Department Resource (ABAC)", 
    secure: "/api/resource/department", 
    vulnerable: "/api/resource/department", // Endpoint hở trong file app.js cũ
    secure_method: "GET",
    vulnerable_method: "GET"
  }
];

// Helper cho Exponential Backoff (Cần thiết cho môi trường Canvas/API)
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
  const [username, setUsername] = useState('admin_it');
  const [password, setPassword] = useState('123456');
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(API_ROUTES[0].id);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedRoute = API_ROUTES.find(r => r.id === selectedRouteId);

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
        // Giả sử token là JWT và chúng ta giải mã client-side để hiển thị thông tin
        try {
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          setCurrentUser(payload);
          setResult({ status: response.status, body: { message: 'Login successful. Token acquired.', user: payload } });
        } catch (e) {
          setResult({ status: response.status, body: { message: 'Login successful. Cannot decode token.' } });
          setCurrentUser({ username: 'Unknown' });
        }
      } else {
        setToken(null);
        setCurrentUser(null);
        setResult({ status: response.status, body: data });
      }
    } catch (error) {
      setResult({ status: 'Error', body: { message: 'Could not connect to server or request failed.' } });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEndpoint = async (isSecure) => {
    if (!token) {
      setResult({ status: '401', body: { message: 'Please log in first to get a token.' } });
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    const serverUrl = isSecure ? SECURE_SERVER_URL : VULNERABLE_SERVER_URL;
    const path = isSecure ? selectedRoute.secure : selectedRoute.vulnerable;
    const method = isSecure ? selectedRoute.secure_method : selectedRoute.vulnerable_method;
    
    try {
      const response = await fetchWithRetry(`${serverUrl}${path}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || 'No response body' };
      }

      setResult({ 
        status: response.status, 
        body: data, 
        type: isSecure ? 'Secure' : 'Vulnerable' 
      });

    } catch (error) {
      setResult({ status: 'Error', body: { message: 'Network error or server unreachable.' } });
    } finally {
      setLoading(false);
    }
  };

  const statusColor = result?.status ? 
    (result.status === 200 || result.status === 201 ? 'bg-green-100 text-green-800 border-green-400' :
    (result.status === 403 || result.status === 401 ? 'bg-red-100 text-red-800 border-red-400' : 
    (result.status === 400 ? 'bg-yellow-100 text-yellow-800 border-yellow-400' : 'bg-gray-100 text-gray-800 border-gray-400'))) : 
    'bg-gray-100 text-gray-800 border-gray-400';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 font-sans">
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-900 border-b-4 border-blue-600 pb-2 mb-6 flex items-center gap-3">
          <Lock className="w-8 h-8 text-blue-600"/>
          RBAC/ABAC Security Demo
        </h1>
        
        {/* User Info & Login */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center gap-2"><User className="w-5 h-5"/> User Authentication</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Username (e.g., admin_it)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Password (e.g., 123456)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-150 flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                <LogIn className="w-5 h-5"/> {loading ? 'Logging In...' : 'Log In & Get Token'}
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-white border border-gray-200 rounded-md">
                <h3 className="font-medium text-gray-700">Current User Details:</h3>
                {currentUser ? (
                    <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                        <p><strong>Username:</strong> {currentUser.username}</p>
                        <p><strong>Role:</strong> <span className={`font-bold ${currentUser.role === 'admin' ? 'text-red-500' : 'text-green-600'}`}>{currentUser.role}</span></p>
                        <p><strong>Department:</strong> <span className={`font-bold ${currentUser.department === 'IT' ? 'text-blue-500' : 'text-gray-500'}`}>{currentUser.department}</span></p>
                    </div>
                ) : (
                    <p className="text-sm text-red-500 mt-1">Not Authenticated</p>
                )}
            </div>
          </div>

          {/* Test Controls */}
          <div className="lg:col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2"><Zap className="w-5 h-5"/> API Access Test</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Endpoint:</label>
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                {API_ROUTES.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.name} ({route.secure})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleTestEndpoint(true)}
                disabled={loading || !token}
                className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-150 flex items-center justify-center gap-2 font-bold disabled:bg-gray-400"
              >
                <Lock className="w-5 h-5"/> 
                {loading ? 'Testing...' : 'Test SECURE Endpoint'}
              </button>
              <button
                onClick={() => handleTestEndpoint(false)}
                disabled={loading || !token}
                className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-150 flex items-center justify-center gap-2 font-bold disabled:bg-gray-400"
              >
                <Unlock className="w-5 h-5"/> 
                {loading ? 'Testing...' : 'Test VULNERABLE Endpoint'}
              </button>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-1 flex items-center gap-2">
                    <Server className="w-5 h-5"/> API Response
                </h3>
                {result && (
                    <div className="space-y-3">
                        {result.type && (
                             <p className="text-sm font-medium text-gray-700">Test Type: <span className={`font-bold ${result.type === 'Secure' ? 'text-green-600' : 'text-red-600'}`}>{result.type}</span> Server</p>
                        )}
                        <div className={`p-3 border rounded-lg ${statusColor}`}>
                            <p className="font-bold">HTTP Status: {result.status}</p>
                        </div>
                        <pre className="bg-gray-900 text-green-300 p-4 rounded-lg text-sm overflow-x-auto shadow-md">
                            {JSON.stringify(result.body, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;