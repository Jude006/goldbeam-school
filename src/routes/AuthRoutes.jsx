import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/auth/AdminLogin";
import StudentLogin from "../pages/auth/StudentLogin";


const AuthRoutes = () => {
  return (
    <Routes>
      {/* Student Portal Login */}
      <Route path="/student-login" element={<StudentLogin />} />
      
      {/* School Admin Portal Login */}
      <Route path="/admin-login" element={<AdminLogin />} />
    </Routes>
  );
};

export default AuthRoutes;