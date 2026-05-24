import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-mesh overflow-hidden relative transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-y-auto relative z-10 p-8 no-scrollbar">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Background Blobs for Dashboard */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[80px] animate-pulse delay-700"></div>
      </div>
    </div>
  );
};

export default DashboardLayout;
