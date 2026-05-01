import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Wallet, Plus, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
import HelpTip from "@/components/HelpTip";

interface Investidor {
  id: string;
  nome: string;
  aporte: number;
  data: string;
}

interface Snapshot {
  data: string;
  banca: number;
}

const STORAGE_INV = "investidor-automatico-investidores";
const STORAGE_SNAP = "investidor-automatico-banca-historico";

const COLORS = [
  "hsl(190, 100%, 50%)", "hsl(150, 70%, 45%)", "hsl(40, 90%, 55%)",
  "hsl(270, 60%, 55%)", "hsl(0, 70%, 50%)", "hsl(210, 100%, 60%)",
];

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}

const GestaoBanca = () => {
  const [investidores, setInvestidores] = useState<Investidor[]>(() => load(STORAGE_INV, []));
  const [historico, setHistorico] = useState<Snapshot[]>(() => load(STORAGE_SNAP, []));
  const [form, setForm] = useState({ nome: "", aporte: "" });
  const [snapForm, setSnapForm] = useState({ banca: "" });

  useEffect(() => localStorage.setItem(STORAGE_INV, JSON.stringify(investidores)), [investidores]);
  useEffect(() => localStorage.setItem(STORAGE_SNAP, JSON.stringify(historico)), [historico]);

  const totalAporte = useMemo(() => investidores.reduce((s, i) => s + i.aporte, 0), [investidores]);
  const bancaAtual = historico[historico.length - 1]?.banca ?? totalAporte;
  const lucro = bancaAtual - totalAporte;
  const roi = totalAporte > 0 ? (lucro / totalAporte) * 100 : 0;

  const handleAddInv = () => {
    if (!form.nome || !form.aporte) return;
    setInvestidores(p => [...p, { id: crypto.randomUUID(), nome: form.nome, aporte: Number(form.aporte), data: new Date().toISOString() }]);
    setForm({ nome: "", aporte: "" });
  };

  const handleAddSnap = () => {
    if (!snapForm.banca) return;
    setHistorico(p => [...p, { data: new Date().toISOString(), banca: Number(snapForm.banca) }]);
    setSnapForm({ banca: "" });
  };

  const distribuicao = investidores.map(i => ({
    name: i.nome,
    value: i.aporte,
    pct: totalAporte > 0 ? (i.aporte / totalAporte) * 100 : 0,
    lucro: totalAporte > 0 ? (i.aporte / totalAporte) * lucro : 0,
  }));

  const evolucaoData = historico.map(s => ({
    data: new Date(s.data).toLocaleDateString("pt-BR"),
    banca: s.banca,
    aporte: totalAporte,
  }));

  const roiData = historico.map(s => ({
    data: new Date(s.data).toLocaleDateString("pt-BR"),
    roi: totalAporte > 0 ? ((s.banca - totalAporte) / totalAporte) * 100 : 0,
  }));

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="font-display text-3xl font-bold text-gradient">
        💼 GESTÃO DE BANCA
      </motion.h1>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Aportado", value: totalAporte, color: "", help: "Soma dos aportes de todos os investidores cadastrados." },
          { label: "Banca Atual", value: bancaAtual, color: "", help: "Último snapshot registrado da banca." },
          { label: "Lucro/Prejuízo", value: lucro, color: lucro >= 0 ? "text-success" : "text-destructive", help: "Diferença entre banca atual e total aportado." },
          { label: "ROI %", value: null, pct: roi, color: roi >= 0 ? "text-success" : "text-destructive", help: "Retorno sobre investimento percentual desde o primeiro aporte." },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5 border border-border">
            <p className="text-muted-foreground font-body text-sm flex items-center gap-1">
              {c.label} <HelpTip text={c.help} />
            </p>
            <p className={`font-display text-xl font-bold ${c.color || "text-foreground"}`}>
              {c.value !== null ? `R$ ${c.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : `${(c as any).pct.toFixed(2)}%`}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5 border border-border">
          <h3 className="font-display text-sm font-bold text-primary mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" /> NOVO INVESTIDOR
            <HelpTip text="Cadastre quem aportou dinheiro na banca. A participação é calculada automaticamente." />
          </h3>
          <div className="flex flex-wrap gap-2 items-end">
            <Input placeholder="Nome" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="font-body bg-secondary/50 flex-1 min-w-[140px]" />
            <Input placeholder="Aporte (R$)" type="number" step="0.01" value={form.aporte} onChange={e => setForm(f => ({ ...f, aporte: e.target.value }))} className="font-body bg-secondary/50 w-36" />
            <Button onClick={handleAddInv} className="font-display text-xs">ADICIONAR</Button>
          </div>
        </div>

        <div className="glass rounded-xl p-5 border border-border">
          <h3 className="font-display text-sm font-bold text-primary mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> REGISTRAR BANCA ATUAL
            <HelpTip text="Anote periodicamente o valor total da banca para gerar o gráfico de evolução e ROI." />
          </h3>
          <div className="flex flex-wrap gap-2 items-end">
            <Input placeholder="Valor atual da banca (R$)" type="number" step="0.01" value={snapForm.banca} onChange={e => setSnapForm({ banca: e.target.value })} className="font-body bg-secondary/50 flex-1 min-w-[180px]" />
            <Button onClick={handleAddSnap} className="font-display text-xs">SALVAR SNAPSHOT</Button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 border border-border">
          <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            📈 EVOLUÇÃO DA BANCA
            <HelpTip text="Linha azul: banca registrada ao longo do tempo. Linha pontilhada: total aportado pelos investidores." />
          </h2>
          {evolucaoData.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground text-center py-12">Registre snapshots da banca para visualizar a evolução.</p>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucaoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 25%)" />
                  <XAxis dataKey="data" stroke="hsl(210, 20%, 55%)" style={{ fontSize: "11px" }} />
                  <YAxis stroke="hsl(210, 20%, 55%)" style={{ fontSize: "11px" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(216, 45%, 10%)", border: "1px solid hsl(190, 100%, 50%, 0.3)", borderRadius: "8px" }} />
                  <Legend />
                  <Line type="monotone" dataKey="banca" stroke="hsl(190, 100%, 50%)" strokeWidth={2.5} name="Banca" dot={{ fill: "hsl(190, 100%, 50%)" }} />
                  <Line type="monotone" dataKey="aporte" stroke="hsl(40, 90%, 55%)" strokeDasharray="5 5" name="Aporte" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6 border border-border">
          <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            💹 ROI AO LONGO DO TEMPO
            <HelpTip text="Percentual de lucro/prejuízo da banca em relação ao total aportado." />
          </h2>
          {roiData.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground text-center py-12">Sem dados para calcular ROI.</p>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 25%)" />
                  <XAxis dataKey="data" stroke="hsl(210, 20%, 55%)" style={{ fontSize: "11px" }} />
                  <YAxis stroke="hsl(210, 20%, 55%)" style={{ fontSize: "11px" }} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(216, 45%, 10%)", border: "1px solid hsl(190, 100%, 50%, 0.3)", borderRadius: "8px" }} formatter={(v: number) => `${v.toFixed(2)}%`} />
                  <Bar dataKey="roi" fill="hsl(150, 70%, 45%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Distribuição investidores */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 border border-primary/20">
        <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          👥 DISTRIBUIÇÃO DE INVESTIDORES
          <HelpTip text="Mostra a participação de cada investidor com valor aportado, percentual da banca e fatia proporcional do lucro/prejuízo. Fundamental para transparência e segurança." />
        </h2>

        {distribuicao.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground text-center py-8">Cadastre investidores para visualizar a distribuição.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distribuicao} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value"
                    label={({ name, pct }) => `${name} ${pct.toFixed(1)}%`}>
                    {distribuicao.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(216, 45%, 10%)", border: "1px solid hsl(190, 100%, 50%, 0.3)", borderRadius: "8px" }}
                    formatter={(v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">INVESTIDOR</th>
                    <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">APORTE</th>
                    <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">% BANCA</th>
                    <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">LUCRO PROP.</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {investidores.map((inv, idx) => {
                    const pct = totalAporte > 0 ? (inv.aporte / totalAporte) * 100 : 0;
                    const lucroProp = (pct / 100) * lucro;
                    return (
                      <tr key={inv.id} className="border-b border-border/50 hover:bg-secondary/30">
                        <td className="py-2 px-2 font-body font-bold text-foreground flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                          {inv.nome}
                        </td>
                        <td className="py-2 px-2 font-body">R$ {inv.aporte.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 px-2 font-body text-primary font-bold">{pct.toFixed(2)}%</td>
                        <td className={`py-2 px-2 font-body font-bold ${lucroProp >= 0 ? "text-success" : "text-destructive"}`}>
                          R$ {lucroProp.toFixed(2)}
                        </td>
                        <td className="py-2 px-2">
                          <button onClick={() => setInvestidores(p => p.filter(x => x.id !== inv.id))} className="text-destructive hover:opacity-70">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GestaoBanca;
