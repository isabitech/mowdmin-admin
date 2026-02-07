export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-indigo-600">1,234</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Active Events</h2>
          <p className="text-3xl font-bold text-green-600">45</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Orders</h2>
          <p className="text-3xl font-bold text-blue-600">789</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Revenue</h2>
          <p className="text-3xl font-bold text-purple-600">$12,345</p>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <p className="text-gray-600">Dashboard overview and recent activities will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}