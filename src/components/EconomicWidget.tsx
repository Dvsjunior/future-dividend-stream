import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Loader2, DollarSign, BarChart3, Percent } from "lucide-react";
import { useBCBData } from "@/hooks/useBCBData";
import { taxaJuros, moedas } from "@/data/economicData";

const EconomicWidget = () => {
  const { data, isLoading, isError } = useBCBData();

  const indicators = [
    {
      label: "SELIC",
      value: data?.selic ?? taxaJuros.find(t => t.name.includes("SELIC"))?.value ?? null,
      unit: "% a.a.",
      icon: BarChart3,
      live: !!data?.selic,
    },
    {
      label: "CDI",
      value: data?.cdi ?? taxaJuros.find(t => t.name === "CDI")?.value ?? null,
      unit: "% a.a.",
      icon: Percent,
      live: !!data?.cdi,
    },
    {
      label: "IPCA",
      value: data?.ipca ?? taxaJuros.find(t => t.name.includes("IPCA"))?.value ?? null,
      unit: "% mês",
      icon: TrendingUp,
      live: !!data?.ipca,
    },
    {
      label: "USD/BRL",
      value: data?.dolar ?? moedas.find(m => m.code === "USD")?.buyPrice ?? null,
      unit: "",
      icon: DollarSign,
      live: !!data?.dolar,
      prefix: "R$ ",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass rounded-xl p-5 border border-primary/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-bold text-primary">📊 INDICADORES ECONÔMICOS</h3>
        {isLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
        {data && (
          <span className="text-[10px] font-body text-success bg-success/10 px-2 py-0.5 rounded-full">
            ● AO VIVO
          </span>
        )}
        {isError && (
          <span className="text-[10px] font-body text-warning bg-warning/10 px-2 py-0.5 rounded-full">
            OFFLINE
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {indicators.map((ind, i) => (
          <motion.div
            key={ind.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="rounded-lg bg-secondary/50 p-3 border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <ind.icon className="w-3.5 h-3.5 text-primary" />
              <span className="font-display text-[10px] text-muted-foreground">{ind.label}</span>
            </div>
            <p className="font-display text-lg font-bold text-foreground">
              {ind.value !== null
                ? `${ind.prefix ?? ""}${typeof ind.value === "number" ? ind.value.toFixed(2) : ind.value}${ind.unit ? ` ${ind.unit}` : ""}`
                : "—"}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EconomicWidget;
