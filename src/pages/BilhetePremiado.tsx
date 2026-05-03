import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Ticket, TrendingUp, TrendingDown, BarChart3, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fundosImobiliarios } from "@/data/mockData";
import HelpTip from "@/components/HelpTip";

interface AtivoCarteira {
  id: string;
  ticker: string;
  tipo: string;
  quantidade: number;
  precoMedio: number;
  precoAtual: number;
  dividendYield: number;
}

const CARTEIRA_KEY = "investidor-automatico-carteira";

function loadCarteira(): AtivoCarteira[] {
  try {
    const raw = localStorage.getItem(CARTEIRA_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

interface Indicado {
  id: string;
  ticker: string;
  precoIndicado: number;
  precoAtual: number;
  dividendYield: number;
  dataIndicacao: string;
  origem: string; // de qual estratégia veio
}

const STORAGE_KEY = "investidor-automatico-bilhete";

function loadIndicados(): Indicado[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveIndicados(list: Indicado[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const BilhetePremiado = () => {
  const [indicados, setIndicados] = useState<Indicado[]>(loadIndicados);
  const [form, setForm] = useState({ ticker: "", origem: "Manual" });

  useEffect(() => saveIndicados(indicados), [indicados]);

  const handleAdd = () => {
    const t = form.ticker.trim().toUpperCase();
    if (!t) return;
    const fii = fundosImobiliarios.find(f => f.ticker === t);
    if (!fii) {
      alert(`Ticker ${t} não encontrado na base.`);
      return;
    }
    setIndicados(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ticker: t,
        precoIndicado: fii.price,
        precoAtual: fii.price,
        dividendYield: fii.dividendYield,
        dataIndicacao: new Date().toISOString(),
        origem: form.origem || "Manual",
      },
    ]);
    setForm({ ticker: "", origem: "Manual" });
  };

  const handleRemove = (id: string) => setIndicados(p => p.filter(i => i.id !== id));

  const handleAtualizarPrecos = () => {
    setIndicados(prev =>
      prev.map(i => {
        const fii = fundosImobiliarios.find(f => f.ticker === i.ticker);
        return fii ? { ...i, precoAtual: fii.price, dividendYield: fii.dividendYield } : i;
      })
    );
  };

  const totais = useMemo(() => {
    const ganhos = indicados.reduce((s, i) => s + (i.precoAtual - i.precoIndicado), 0);
    const investido = indicados.reduce((s, i) => s + i.precoIndicado, 0);
    return {
      ganhos,
      investido,
      pct: investido > 0 ? (ganhos / investido) * 100 : 0,
      ganhadores: indicados.filter(i => i.precoAtual > i.precoIndicado).length,
      perdedores: indicados.filter(i => i.precoAtual < i.precoIndicado).length,
    };
  }, [indicados]);

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="font-display text-3xl font-bold text-gradient">
        🎟️ BILHETE PREMIADO
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 border border-primary/30">
        <div className="flex items-center gap-2 mb-2">
          <Ticket className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">RECOMENDAÇÕES DE COMPRA</h2>
          <HelpTip text="Lista todos os ativos indicados pela plataforma para compra. Use para comparar o rendimento da indicação contra a sua carteira em vigor." />
        </div>
        <p className="font-body text-sm text-muted-foreground mb-4">
          Cada indicação registra o preço no momento da sugestão. Atualize os preços para ver o ganho/prejuízo das recomendações.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs font-body text-muted-foreground">Total Indicado</p>
            <p className="font-display font-bold text-foreground">R$ {totais.investido.toFixed(2)}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs font-body text-muted-foreground flex items-center gap-1">
              Ganho/Prejuízo <HelpTip text="Diferença entre preço atual e preço indicado, somando todas as recomendações." />
            </p>
            <p className={`font-display font-bold ${totais.ganhos >= 0 ? "text-success" : "text-destructive"}`}>
              R$ {totais.ganhos.toFixed(2)} ({totais.pct.toFixed(2)}%)
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs font-body text-muted-foreground">Acertos</p>
            <p className="font-display font-bold text-success">{totais.ganhadores}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs font-body text-muted-foreground">Erros</p>
            <p className="font-display font-bold text-destructive">{totais.perdedores}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-end mb-5">
          <div>
            <label className="font-body text-xs text-muted-foreground block mb-1">Ticker</label>
            <Input value={form.ticker} onChange={e => setForm(f => ({ ...f, ticker: e.target.value }))} placeholder="ex: MXRF11" className="w-40 font-body bg-secondary/50" />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground block mb-1">Origem</label>
            <Input value={form.origem} onChange={e => setForm(f => ({ ...f, origem: e.target.value }))} placeholder="Opção 1 / 2 / 3" className="w-40 font-body bg-secondary/50" />
          </div>
          <Button onClick={handleAdd} className="font-display text-xs">REGISTRAR INDICAÇÃO</Button>
          <Button variant="outline" onClick={handleAtualizarPrecos} className="font-display text-xs">ATUALIZAR PREÇOS</Button>
        </div>

        {indicados.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground text-center py-8">
            Nenhuma indicação registrada. Adicione um ticker recomendado para iniciar o acompanhamento.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">TICKER</th>
                  <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">ORIGEM</th>
                  <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">DATA</th>
                  <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">PREÇO INDIC.</th>
                  <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">PREÇO ATUAL</th>
                  <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">DY</th>
                  <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">RESULTADO</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {indicados.map(i => {
                  const diff = i.precoAtual - i.precoIndicado;
                  const pct = (diff / i.precoIndicado) * 100;
                  return (
                    <tr key={i.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="py-2 px-2 font-body font-bold text-primary">{i.ticker}</td>
                      <td className="py-2 px-2 font-body text-xs text-muted-foreground">{i.origem}</td>
                      <td className="py-2 px-2 font-body text-xs">{new Date(i.dataIndicacao).toLocaleDateString("pt-BR")}</td>
                      <td className="py-2 px-2 font-body">R$ {i.precoIndicado.toFixed(2)}</td>
                      <td className="py-2 px-2 font-body">R$ {i.precoAtual.toFixed(2)}</td>
                      <td className="py-2 px-2 font-body text-success">{i.dividendYield.toFixed(1)}%</td>
                      <td className={`py-2 px-2 font-body font-bold ${diff >= 0 ? "text-success" : "text-destructive"}`}>
                        <div className="flex items-center gap-1">
                          {diff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          R$ {diff.toFixed(2)} ({pct.toFixed(2)}%)
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <button onClick={() => handleRemove(i.id)} className="text-destructive hover:underline text-xs font-display">
                          REMOVER
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BilhetePremiado;
