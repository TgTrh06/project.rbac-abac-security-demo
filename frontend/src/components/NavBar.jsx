export default function NavBar({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center text-white">
      <h1 className="font-bold text-xl">RBAC/ABAC Demo</h1>
      <div className="space-x-4">
        <button
          onClick={() => setActiveTab("secure")}
          className={`px-3 py-1 rounded ${activeTab === "secure" ? "bg-blue-800" : ""}`}
        >
          Secure
        </button>
        <button
          onClick={() => setActiveTab("vulnerable")}
          className={`px-3 py-1 rounded ${activeTab === "vulnerable" ? "bg-red-700" : ""}`}
        >
          Vulnerable
        </button>
      </div>
    </nav>
  );
}