import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";

interface AppLayoutProps {
  onLogout: () => void;
}

const AppLayout = ({ onLogout }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar onLogout={onLogout} />
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
