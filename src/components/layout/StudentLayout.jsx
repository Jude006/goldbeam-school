import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "../student/StudentSidebar";
import StudentHeader from "../student/StudentHeader";

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden select-none bg-light font-body text-dark">
      {/* Student Sidebar Container */}
      <StudentSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <StudentHeader setSidebarOpen={setSidebarOpen} />

        {/* Dynamic Route Pages */}
        <main className="flex-1 p-4 overflow-y-auto sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;