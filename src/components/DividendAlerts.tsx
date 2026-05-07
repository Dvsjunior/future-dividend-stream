import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { fundosImobiliarios, dividendos } from "@/data/mockData";

interface CarteiraAtivo { ticker: string; quantidade: number; }

const STORAGE_KEY = "investidor-automatico-carteira";
const ALERT_SEEN_KEY = "investidor-automatico-alerts-seen";

function loadCarteira(): CarteiraAtivo[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

export default function DividendAlerts() {
  const [carteira, setCarteira] = useState<CarteiraAtivo[]>(loadCarteira);

  useEffect(() => {
    const onStorage = () => setCarteira(loadCarteira());
    window.addEventListener("storage", onStorage);
    const id = setInterval(() => setCarteira(loadCarteira()), 5000);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(id); };
  }, []);

  const alertas = useMemo(() => {
    const hoje = new Date();
    const limite = new Date(); limite.setDate(hoje.getDate() + 30);
    const tickers = new Set(carteira.map(a => a.ticker));
    const items: { ticker: string; dataCom: string; dataPayment: string; valor: number; total: number; }[] = [];

    for (const a of carteira) {
      const fii = fundosImobiliarios.find(f => f.ticker === a.ticker);
      const div = dividendos.find(d => d.ticker === a.ticker);
      const evento = fii ?? div;
      if (!evento) continue;
      const dCom = new Date((evento as any).dataCom);
      if (dCom >= hoje && dCom <= limite) {
        const valor = (evento as any).lastDividend ?? (evento as any).value ?? 0;
        items.push({
          ticker: a.ticker,
          dataCom: (evento as any).dataCom,
          dataPayment: (evento as any).dataPayment,
          valor,
          total: valor * a.quantidade,
        });
      }
    }
    return items.sort((a, b) => +new Date(a.dataCom) - +new Date(b.dataCom));
  }, [carteira]);

  // Toast only for new alerts (per ticker+date)
  useEffect(() => {
    if (alertas.length === 0) return;
    const seen = new Set<string>(JSON.parse(localStorage.getItem(ALERT_SEEN_KEY) || "[]"));
    const novos = alertas.filter(a => !seen.has(`${a.ticker}-${a.dataCom}`));
    novos.slice(0, 3).forEach(a => {
      toast(`💰 ${a.ticker} — Data Com em ${new Date(a.dataCom).toLocaleDateString("pt-BR")}`, {
        description: `Pagamento ${new Date(a.dataPayment).toLocaleDateString("pt-BR")} • Receberá R$ ${a.total.toFixed(2)}`,
      });
      seen.add(`${a.ticker}-${a.dataCom}`);
    });
    localStorage.setItem(ALERT_SEEN_KEY, JSON.stringify([...seen]));
  }, [alertas]);

  if (alertas.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5 border border-warning/30">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-5 h-5 text-warning" />
        <h3 className="font-display text-lg font-bold text-foreground">ALERTAS DE DIVIDENDOS</h3>
        <span className="ml-auto px-2 py-0.5 rounded text-xs font-display bg-warning/20 text-warning">
          {alertas.length} eventos próximos
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {alertas.slice(0, 6).map(a => (
          <div key={`${a.ticker}-${a.dataCom}`} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 border border-border">
            <CalendarClock className="w-4 h-4 text-warning" />
            <div className="flex-1">
              <p className="font-display text-sm font-bold text-primary">{a.ticker}</p>
              <p className="text-xs font-body text-muted-foreground">
                Com {new Date(a.dataCom).toLocaleDateString("pt-BR")} • Pag {new Date(a.dataPayment).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-body font-bold text-success">R$ {a.total.toFixed(2)}</p>
              <p className="text-[10px] font-body text-muted-foreground">R$ {a.valor.toFixed(2)}/cota</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
