import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Gallery from "../pages/public/Gallery";
import Contact from "../pages/public/Contact";
import PublicLayout from "../components/common/PublicLayout";
import AuthRoutes from "./AuthRoutes";
import StudentRoutes from "./StudentRoutes";
import SchoolAdminRoutes from "./SchoolAdminRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFound from "../pages/public/NotFound";
import Admission from "../pages/public/Admission";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admissions" element={<Admission />} />
      </Route>

      {/* Auth Pages */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Protected Student Routes */}
      <Route element={<ProtectedRoutes allowedRoles={["student"]} />}>
        <Route path="/student/*" element={<StudentRoutes />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
        <Route path="/admin/*" element={<SchoolAdminRoutes />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
