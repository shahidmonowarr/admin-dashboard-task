import { Outlet } from "react-router-dom";
import { Toast } from "./Toast";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toast />
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
