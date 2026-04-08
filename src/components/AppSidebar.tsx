import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Coins, CalendarCheck, Calculator, BarChart3, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import { motion } from "framer-motion";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dividendos", icon: Coins, label: "Dividendos" },
  { to: "/data-com", icon: CalendarCheck, label: "Data Com" },
  { to: "/valuation", icon: Calculator, label: "Valuation" },
  { to: "/economia", icon: BarChart3, label: "Economia" },
];

interface AppSidebarProps {
  onLogout: () => void;
}

const AppSidebar = ({ onLogout }: AppSidebarProps) => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <img src={logo} alt="IA Logo" className="w-10 h-10" />
        <div>
          <h1 className="font-display text-sm font-bold text-gradient">INVESTIDOR</h1>
          <p className="font-display text-xs text-primary">AUTOMÁTICO</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink key={item.to} to={item.to}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-body text-lg font-medium ${
                  isActive
                    ? "gradient-primary text-primary-foreground glow-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-destructive hover:bg-secondary transition-all w-full font-body text-lg"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
