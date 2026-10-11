import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ParkingDiscoveryPage } from './pages/ParkingDiscoveryPage';
import { MyReservationsPage } from './pages/MyReservationsPage';
import { CitizenReportPage } from './pages/CitizenReportPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { IncidentManagementPage } from './pages/IncidentManagementPage';
import { VehicleSearchPage } from './pages/VehicleSearchPage';
import { ChallanManagementPage } from './pages/ChallanManagementPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // If user navigated to login page
  if (activeTab === 'login') {
    return <AuthPage onSuccess={() => setActiveTab('dashboard')} />;
  }

  // Render current tab
  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'find_parking':
        return <ParkingDiscoveryPage />;
      case 'my_reservations':
        return <MyReservationsPage />;
      case 'report_issue':
        return <CitizenReportPage />;
      case 'my_reports':
        return <MyReportsPage />;
      case 'police_dashboard':
        return <OfficerDashboardPage />;
      case 'incidents':
        return <IncidentManagementPage />;
      case 'vehicle_search':
        return <VehicleSearchPage />;
      case 'echallans':
        return <ChallanManagementPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return (
          <div className="p-12 text-center space-y-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-[#172B45]">Page Not Found</h2>
            <p className="text-xs text-gray-500">
              The requested section could not be located in the Puducherry SmartCity directory.
            </p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="py-2.5 px-5 rounded-xl bg-[#1769E8] text-white text-xs font-bold hover:bg-blue-700"
            >
              Back to Overview
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F4F7FB] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-72 h-full bg-[#071D38]"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
