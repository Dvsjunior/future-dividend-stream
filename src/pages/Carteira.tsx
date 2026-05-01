import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowRightLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { fundosImobiliarios, topAltas, topBaixas } from "@/data/mockData";
import { taxaJuros } from "@/data/economicData";
import HelpTip from "@/components/HelpTip";

/** Lookup automático de dados de mercado por ticker. */
function lookupAtivo(ticker: string): Partial<Ativo> | null {
  const t = ticker.trim().toUpperCase();
  if (!t) return null;
  const fii = fundosImobiliarios.find(f => f.ticker === t);
  if (fii) {
    return {
      tipo: "FII",
      precoAtual: fii.price,
      dividendYield: fii.dividendYield,
      precoMedioSugerido: fii.min52w,
    };
  }
  const acao = [...topAltas, ...topBaixas].find(s => s.ticker === t);
  if (acao) {
    return {
      tipo: "Ação",
      precoAtual: acao.price,
      dividendYield: 0,
    };
  }
  return null;
}

interface Ativo {
  id: string;
  ticker: string;
  tipo: "Ação" | "FII" | "ETF" | "Renda Fixa";
  quantidade: number;
  precoMedio: number;
  precoAtual: number;
  dividendYield: number;
}

interface Recomendacao {
  ativoOrigem: string;
  ativoDestino: string;
  motivo: string;
  tipo: "troca" | "venda" | "manter";
}

const STORAGE_KEY = "investidor-automatico-carteira";

const PIE_COLORS = [
  "hsl(190, 100%, 50%)",  // primary / cyan
  "hsl(150, 70%, 45%)",   // success / green
  "hsl(40, 90%, 55%)",    // warning / gold
  "hsl(270, 60%, 55%)",   // purple
  "hsl(0, 70%, 50%)",     // destructive / red
  "hsl(210, 100%, 60%)",  // blue
];

function loadAtivos(): Ativo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveAtivos(ativos: Ativo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ativos));
}

function gerarRecomendacoes(ativos: Ativo[]): Recomendacao[] {
  const recs: Recomendacao[] = [];
  const selic = taxaJuros.find(t => t.name.includes("SELIC"))?.value ?? 14.25;

  for (const ativo of ativos) {
    const lucro = ((ativo.precoAtual - ativo.precoMedio) / ativo.precoMedio) * 100;
    const dyAnual = ativo.dividendYield;

    if (ativo.tipo === "FII" && dyAnual < selic - 3) {
      const melhorFII = fundosImobiliarios
        .filter(f => f.ticker !== ativo.ticker && f.dividendYield > dyAnual + 2)
        .sort((a, b) => b.dividendYield - a.dividendYield)[0];
      if (melhorFII) {
        recs.push({
          ativoOrigem: ativo.ticker,
          ativoDestino: melhorFII.ticker,
          motivo: `DY de ${dyAnual.toFixed(1)}% está abaixo da SELIC (${selic}%). ${melhorFII.ticker} oferece ${melhorFII.dividendYield}% de DY.`,
          tipo: "troca",
        });
      }
    }

    if (lucro < -15) {
      recs.push({
        ativoOrigem: ativo.ticker, ativoDestino: "",
        motivo: `Prejuízo de ${lucro.toFixed(1)}%. Avalie se os fundamentos mudaram ou se é oportunidade de médio prazo.`,
        tipo: "venda",
      });
    }

    if (lucro > 30) {
      recs.push({
        ativoOrigem: ativo.ticker, ativoDestino: "",
        motivo: `Lucro de ${lucro.toFixed(1)}%. Considere realizar lucro parcial e reinvestir em ativos com melhor DY.`,
        tipo: "venda",
      });
    }

    if (ativo.tipo === "FII" && dyAnual >= selic - 3 && lucro > -10) {
      recs.push({
        ativoOrigem: ativo.ticker, ativoDestino: "",
        motivo: `DY de ${dyAnual.toFixed(1)}% competitivo com a SELIC. Mantenha e continue acumulando.`,
        tipo: "manter",
      });
    }
  }

  return recs;
}

const Carteira = () => {
  const [ativos, setAtivos] = useState<Ativo[]>(loadAtivos);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    ticker: "", tipo: "FII" as Ativo["tipo"], quantidade: "", precoMedio: "", precoAtual: "", dividendYield: "",
  });

  // Persist on every change
  useEffect(() => { saveAtivos(ativos); }, [ativos]);

  const resetForm = () => {
    setForm({ ticker: "", tipo: "FII", quantidade: "", precoMedio: "", precoAtual: "", dividendYield: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!form.ticker || !form.quantidade || !form.precoMedio || !form.precoAtual) return;
    const ativo: Ativo = {
      id: editId ?? crypto.randomUUID(),
      ticker: form.ticker.toUpperCase(),
      tipo: form.tipo,
      quantidade: Number(form.quantidade),
      precoMedio: Number(form.precoMedio),
      precoAtual: Number(form.precoAtual),
      dividendYield: Number(form.dividendYield) || 0,
    };
    if (editId) {
      setAtivos(prev => prev.map(a => (a.id === editId ? ativo : a)));
    } else {
      setAtivos(prev => [...prev, ativo]);
    }
    resetForm();
  };

  const handleEdit = (ativo: Ativo) => {
    setForm({
      ticker: ativo.ticker, tipo: ativo.tipo, quantidade: String(ativo.quantidade),
      precoMedio: String(ativo.precoMedio), precoAtual: String(ativo.precoAtual), dividendYield: String(ativo.dividendYield),
    });
    setEditId(ativo.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => setAtivos(prev => prev.filter(a => a.id !== id));

  const totalInvestido = ativos.reduce((s, a) => s + a.precoMedio * a.quantidade, 0);
  const totalAtual = ativos.reduce((s, a) => s + a.precoAtual * a.quantidade, 0);
  const lucroPrejuizo = totalAtual - totalInvestido;
  const lucroPct = totalInvestido > 0 ? (lucroPrejuizo / totalInvestido) * 100 : 0;
  const recomendacoes = gerarRecomendacoes(ativos);

  // Pie chart data: allocation by tipo
  const alocacaoPorTipo = ativos.reduce<Record<string, number>>((acc, a) => {
    acc[a.tipo] = (acc[a.tipo] || 0) + a.precoAtual * a.quantidade;
    return acc;
  }, {});
  const pieData = Object.entries(alocacaoPorTipo).map(([name, value]) => ({ name, value }));

  // Pie chart data: allocation by ticker (top assets)
  const alocacaoPorTicker = ativos
    .map(a => ({ name: a.ticker, value: a.precoAtual * a.quantidade }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="font-display text-3xl font-bold text-gradient">
        MINHA CARTEIRA
      </motion.h1>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Investido", value: totalInvestido, color: "" },
          { label: "Valor Atual", value: totalAtual, color: "" },
          { label: "Lucro/Prejuízo", value: lucroPrejuizo, color: lucroPrejuizo >= 0 ? "text-success" : "text-destructive" },
          { label: "Rentabilidade", value: null, pct: lucroPct, color: lucroPct >= 0 ? "text-success" : "text-destructive" },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5 border border-border">
            <p className="text-muted-foreground font-body text-sm">{c.label}</p>
            <p className={`font-display text-xl font-bold ${c.color || "text-foreground"}`}>
              {c.value !== null ? `R$ ${c.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : `${c.pct!.toFixed(2)}%`}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {ativos.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6 border border-border">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">📊 ALOCAÇÃO POR TIPO</h2>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: "hsl(210, 20%, 55%)" }}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    contentStyle={{ backgroundColor: "hsl(216, 45%, 10%)", border: "1px solid hsl(190, 100%, 50%, 0.3)", borderRadius: "8px", fontFamily: "Rajdhani" }}
                    labelStyle={{ color: "hsl(200, 100%, 97%)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-xl p-6 border border-border">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">🏆 ALOCAÇÃO POR ATIVO</h2>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={alocacaoPorTicker} cx="50%" cy="50%" outerRadius={100} paddingAngle={2} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: "hsl(210, 20%, 55%)" }}
                  >
                    {alocacaoPorTicker.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    contentStyle={{ backgroundColor: "hsl(216, 45%, 10%)", border: "1px solid hsl(190, 100%, 50%, 0.3)", borderRadius: "8px", fontFamily: "Rajdhani" }}
                    labelStyle={{ color: "hsl(200, 100%, 97%)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {/* Adicionar ativo */}
      <div className="flex gap-2">
        <Button onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }} className="font-display text-xs">
          <Plus className="w-4 h-4 mr-1" /> {showForm ? "CANCELAR" : "ADICIONAR ATIVO"}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="glass rounded-xl p-5 border border-primary/20 overflow-hidden">
            <h3 className="font-display text-sm font-bold text-primary mb-4">{editId ? "EDITAR ATIVO" : "NOVO ATIVO"}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <Input placeholder="Ticker (ex: MXRF11)" value={form.ticker} onChange={e => setForm(f => ({ ...f, ticker: e.target.value }))} className="font-body bg-secondary/50" />
              <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v as Ativo["tipo"] }))}>
                <SelectTrigger className="font-body bg-secondary/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FII">FII</SelectItem>
                  <SelectItem value="Ação">Ação</SelectItem>
                  <SelectItem value="ETF">ETF</SelectItem>
                  <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Quantidade" type="number" value={form.quantidade} onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))} className="font-body bg-secondary/50" />
              <Input placeholder="Preço Médio (R$)" type="number" step="0.01" value={form.precoMedio} onChange={e => setForm(f => ({ ...f, precoMedio: e.target.value }))} className="font-body bg-secondary/50" />
              <Input placeholder="Preço Atual (R$)" type="number" step="0.01" value={form.precoAtual} onChange={e => setForm(f => ({ ...f, precoAtual: e.target.value }))} className="font-body bg-secondary/50" />
              <Input placeholder="DY Anual (%)" type="number" step="0.01" value={form.dividendYield} onChange={e => setForm(f => ({ ...f, dividendYield: e.target.value }))} className="font-body bg-secondary/50" />
            </div>
            <Button onClick={handleSubmit} className="mt-3 font-display text-xs">{editId ? "SALVAR ALTERAÇÕES" : "ADICIONAR"}</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabela de ativos */}
      {ativos.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 border border-border">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">📋 ATIVOS EM CARTEIRA</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["TICKER", "TIPO", "QTD", "PM", "ATUAL", "DY", "LUCRO", "AÇÕES"].map(h => (
                    <th key={h} className="text-left py-3 px-2 font-display text-xs text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ativos.map(a => {
                  const lucro = ((a.precoAtual - a.precoMedio) / a.precoMedio) * 100;
                  return (
                    <tr key={a.id} className="border-b border-border/50 hover:bg-secondary/30 transition-all">
                      <td className="py-3 px-2 font-body font-bold text-primary">{a.ticker}</td>
                      <td className="py-3 px-2 font-body"><span className="px-2 py-0.5 rounded text-xs font-display bg-primary/10 text-primary">{a.tipo}</span></td>
                      <td className="py-3 px-2 font-body">{a.quantidade}</td>
                      <td className="py-3 px-2 font-body">R$ {a.precoMedio.toFixed(2)}</td>
                      <td className="py-3 px-2 font-body">R$ {a.precoAtual.toFixed(2)}</td>
                      <td className="py-3 px-2 font-body text-success font-bold">{a.dividendYield.toFixed(1)}%</td>
                      <td className={`py-3 px-2 font-body font-bold ${lucro >= 0 ? "text-success" : "text-destructive"}`}>
                        <div className="flex items-center gap-1">
                          {lucro >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {lucro >= 0 ? "+" : ""}{lucro.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(a)} className="p-1.5 rounded hover:bg-primary/10 text-primary transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Recomendações */}
      {recomendacoes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-6 border border-primary/20">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">🎯 RECOMENDAÇÕES INTELIGENTES</h2>
          <div className="space-y-3">
            {recomendacoes.map((rec, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`rounded-lg p-4 border transition-all ${rec.tipo === "troca" ? "bg-warning/5 border-warning/30" : rec.tipo === "venda" ? "bg-destructive/5 border-destructive/30" : "bg-success/5 border-success/30"}`}>
                <div className="flex items-center gap-2 mb-1">
                  {rec.tipo === "troca" ? <ArrowRightLeft className="w-4 h-4 text-warning" /> : rec.tipo === "venda" ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <CheckCircle className="w-4 h-4 text-success" />}
                  <span className="font-display text-sm font-bold text-foreground">
                    {rec.ativoOrigem}{rec.ativoDestino && <> → <span className="text-primary">{rec.ativoDestino}</span></>}
                  </span>
                  <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-display font-bold ${rec.tipo === "troca" ? "bg-warning/15 text-warning" : rec.tipo === "venda" ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}`}>
                    {rec.tipo.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-body text-muted-foreground">{rec.motivo}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {ativos.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-10 border border-border text-center">
          <p className="font-display text-lg text-muted-foreground mb-2">Nenhum ativo cadastrado</p>
          <p className="font-body text-sm text-muted-foreground">Clique em "Adicionar Ativo" para inserir seus investimentos e receber recomendações personalizadas.</p>
        </motion.div>
      )}
    </div>
  );
};

export default Carteira;
