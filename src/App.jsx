import React from "react";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/common/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";

const App = () => {
  return (
    <>
      <HelmetProvider>
        <AuthProvider>
          <AppRoutes />
          <ScrollToTop />
        </AuthProvider>
      </HelmetProvider>
    </>
  );
};

export default App;
