import React from "react";
import { Route, Routes } from "react-router-dom";
import StudentLayout from "../components/layout/StudentLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentResults from "../pages/student/StudentResults";
import StudentFees from "../pages/student/StudentFees";
import StudentProfile from "../pages/student/StudentProfile";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/results" element={<StudentResults />} />
        <Route path="/fees" element={<StudentFees />} />
        <Route path="/profile" element={<StudentProfile />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;