import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "accent";
}

const DashboardCard = ({ title, value, subtitle, icon: Icon, variant = "default" }: DashboardCardProps) => {
  const borderClass = variant === "success" 
    ? "border-success/30" 
    : variant === "accent" 
    ? "border-primary/30" 
    : "border-border";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`glass rounded-xl p-6 border ${borderClass} transition-all hover:glow-primary`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-muted-foreground font-body text-base">{title}</p>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      {subtitle && (
        <p className="text-muted-foreground font-body text-sm mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default DashboardCard;
