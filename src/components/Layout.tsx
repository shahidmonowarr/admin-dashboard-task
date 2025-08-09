import { Outlet } from "react-router-dom";
import { Toast } from "./Toast";
import { useAuth } from "../context/AuthContext";

export const Layout = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <Toast />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-amber-900 text-center">
            Admin Dashboard
          </h1>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Logged in as {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
