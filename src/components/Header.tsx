import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="shadow bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-900">
          Admin Dashboard
        </h1>
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm text-gray-600">
                Logged in as {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};