import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../admin/Sidebar";
import Header from "../admin/Header";


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-light">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;