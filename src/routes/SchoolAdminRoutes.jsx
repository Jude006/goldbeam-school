import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import StudentsList from "../pages/school-admin/StudentsList";
import AddStudent from "../pages/school-admin/AddStudent";
import StudentDetails from "../pages/school-admin/StudentDetails";
import EditStudent from "../pages/school-admin/EditStudent";
import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/school-admin/AdminDashboard";
import FeeStructure from "../pages/school-admin/FeeStructure";
import Payments from "../pages/school-admin/Payments";
import Settings from "../pages/school-admin/Settings";
import CreateFee from "../pages/school-admin/CreateFee";
import RecordPayment from "../pages/school-admin/RecordPayment";
import ClassesList from "../pages/school-admin/ClassesList";
import SubjectsList from "../pages/school-admin/SubjectsList";
import AcademicSettings from "../pages/school-admin/AcademicSettings";
import ResultsList from "../pages/school-admin/ResultsList";
import EnterScores from "../pages/school-admin/EnterScores";
import PromoteStudents from "../pages/school-admin/PromoteStudent";
import ClassResultsStudents from "../pages/school-admin/ClassResultsStudents";
import ImportStudents from "../pages/school-admin/ImportStudents";
import ReportRouter from "../pages/school-admin/ReportRouter";
import AdmissionsInbox from "../pages/school-admin/AdmissionsInbox";

const SchoolAdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* index → dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="students/add" element={<AddStudent />} />
        <Route path="students/import" element={<ImportStudents />} />
        <Route path="students/promote" element={<PromoteStudents />} />
        <Route path="students/:id" element={<StudentDetails />} />
        <Route path="students/:id/edit" element={<EditStudent />} />
        <Route path="classes" element={<ClassesList />} />
        <Route path="subjects" element={<SubjectsList />} />
        <Route path="results" element={<ResultsList />} />
        <Route path="results/enter" element={<EnterScores />} />
        {/* <Route path="results/report/:studentId" element={<StudentReport />} /> */}
        <Route path="results/report/:studentId" element={<ReportRouter />} />
        <Route
          path="results/class/:classId"
          element={<ClassResultsStudents />}
        />
        <Route path="fees/structure" element={<FeeStructure />} />
        <Route path="fees/payments" element={<Payments />} />
        <Route path="fees/create" element={<CreateFee />} />
        <Route path="fees/record" element={<RecordPayment />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/academic" element={<AcademicSettings />} />
        <Route path="admissions" element={<AdmissionsInbox />} />
      </Route>
    </Routes>
  );
};

export default SchoolAdminRoutes;
