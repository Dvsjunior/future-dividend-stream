import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dividendos, getAtivoPrice, type Dividend } from "@/data/mockData";
import HelpTip from "@/components/HelpTip";

const tabs = [
  { key: "all", label: "Todos" },
  { key: "Ação", label: "Ações" },
  { key: "FII", label: "Fundos Imobiliários" },
  { key: "ETF", label: "ETFs" },
  { key: "Tesouro", label: "Tesouro" },
  { key: "CDB", label: "CDB" },
  { key: "CRA", label: "CRA" },
  { key: "CRI", label: "CRI" },
];

const Dividendos = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filtered: Dividend[] = activeTab === "all"
    ? dividendos
    : dividendos.filter(d => d.type === activeTab);

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-display text-3xl font-bold text-gradient"
      >
        DIVIDENDOS
      </motion.h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-body text-base font-medium transition-all ${
              activeTab === tab.key
                ? "gradient-primary text-primary-foreground glow-primary"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.length === 0 ? (
              <p className="text-muted-foreground font-body text-center py-12 text-lg">
                Nenhum dividendo encontrado para esta categoria.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">TICKER</th>
                      <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">TIPO</th>
                      <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">PREÇO ATIVO <HelpTip text="Cotação atual de mercado da cota do ativo." /></span>
                      </th>
                      <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">DIVIDENDO <HelpTip text="Valor pago por cota neste evento de provento." /></span>
                      </th>
                      <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">DATA COM <HelpTip text="Última data em que é necessário ter o ativo em carteira para receber o provento." /></span>
                      </th>
                      <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">PAGAMENTO</th>
                      <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">YIELD <HelpTip text="Rendimento percentual do provento sobre o preço da cota (mensal)." /></span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((div, i) => {
                      const preco = getAtivoPrice(div.ticker);
                      return (
                        <motion.tr
                          key={`${div.ticker}-${i}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-border/50 hover:bg-secondary/30 transition-all"
                        >
                          <td className="py-3 px-3 font-body font-bold text-primary">{div.ticker}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-body text-sm">
                              {div.type}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-body font-semibold text-foreground">
                            {preco !== null ? `R$ ${preco.toFixed(2)}` : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="py-3 px-3 font-body font-semibold">R$ {div.value.toFixed(2)}</td>
                          <td className="py-3 px-3 font-body">{new Date(div.dataCom).toLocaleDateString('pt-BR')}</td>
                          <td className="py-3 px-3 font-body">{new Date(div.dataPayment).toLocaleDateString('pt-BR')}</td>
                          <td className="py-3 px-3 font-body text-success font-bold">{div.yieldPercent.toFixed(2)}%</td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Dividendos;
