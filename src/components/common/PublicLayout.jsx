import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import Header from './Header';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;