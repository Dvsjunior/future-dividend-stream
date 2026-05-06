import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Ticket, TrendingUp, TrendingDown, BarChart3, ArrowRightLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fundosImobiliarios, dividendos } from "@/data/mockData";
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
  const [carteira, setCarteira] = useState<AtivoCarteira[]>(loadCarteira);
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

  // Relatório comparativo: Indicações (Ativos Analisados) vs Carteira em vigor
  const comparativo = useMemo(() => {
    const valorCarteira = carteira.reduce((s, a) => s + a.precoAtual * a.quantidade, 0);
    const dyMedioCarteira = valorCarteira > 0
      ? carteira.reduce((s, a) => s + a.dividendYield * a.precoAtual * a.quantidade, 0) / valorCarteira
      : 0;
    const rendaCarteiraAnual = (dyMedioCarteira / 100) * valorCarteira;

    const dyMedioIndicado = indicados.length > 0
      ? indicados.reduce((s, i) => s + i.dividendYield * i.precoAtual, 0) /
        indicados.reduce((s, i) => s + i.precoAtual, 0)
      : 0;
    // Renda projetada caso o mesmo capital da carteira fosse alocado nas indicações
    const rendaIndicadaAnual = (dyMedioIndicado / 100) * valorCarteira;

    const diffValor = rendaIndicadaAnual - rendaCarteiraAnual;
    const diffPct = rendaCarteiraAnual > 0 ? (diffValor / rendaCarteiraAnual) * 100 : 0;

    // Comparativo por ativo: ticker em comum entre indicados e carteira
    const porAtivo = indicados.map(i => {
      const naCarteira = carteira.find(c => c.ticker === i.ticker);
      return {
        ticker: i.ticker,
        dyIndicado: i.dividendYield,
        dyCarteira: naCarteira?.dividendYield ?? null,
        precoIndicado: i.precoIndicado,
        precoMedio: naCarteira?.precoMedio ?? null,
        precoAtual: i.precoAtual,
        quantidade: naCarteira?.quantidade ?? 0,
        ganhoUnit: naCarteira ? i.precoAtual - naCarteira.precoMedio : null,
        ganhoTotal: naCarteira ? (i.precoAtual - naCarteira.precoMedio) * naCarteira.quantidade : null,
      };
    });

    return { valorCarteira, dyMedioCarteira, dyMedioIndicado, rendaCarteiraAnual, rendaIndicadaAnual, diffValor, diffPct, porAtivo };
  }, [indicados, carteira]);

  const handleRecarregarCarteira = () => setCarteira(loadCarteira());

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

      {/* Relatório Comparativo: Indicações x Carteira */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6 border border-primary/30">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">RELATÓRIO: INDICADOS vs CARTEIRA</h2>
          <HelpTip text="Compara o rendimento (DY) médio dos ativos analisados/indicados com o da sua carteira atual. A renda projetada considera o mesmo capital aplicado da sua carteira." />
          <Button size="sm" variant="outline" onClick={handleRecarregarCarteira} className="ml-auto font-display text-xs">
            RECARREGAR CARTEIRA
          </Button>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-4">
          Capital base usado na simulação: <strong>R$ {comparativo.valorCarteira.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong> (valor atual da sua carteira).
        </p>

        {carteira.length === 0 || indicados.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground text-center py-6">
            {carteira.length === 0 ? "Cadastre ativos em MINHA CARTEIRA " : ""}
            {indicados.length === 0 ? "e registre indicações acima " : ""}
            para ver o comparativo.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs font-body text-muted-foreground">DY Médio Carteira</p>
                <p className="font-display font-bold text-foreground">{comparativo.dyMedioCarteira.toFixed(2)}%</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs font-body text-muted-foreground">DY Médio Indicações</p>
                <p className="font-display font-bold text-primary">{comparativo.dyMedioIndicado.toFixed(2)}%</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs font-body text-muted-foreground">Renda Anual Atual</p>
                <p className="font-display font-bold text-foreground">R$ {comparativo.rendaCarteiraAnual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs font-body text-muted-foreground">Renda Anual Indicada</p>
                <p className="font-display font-bold text-primary">R$ {comparativo.rendaIndicadaAnual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className={`rounded-lg p-4 border mb-5 ${comparativo.diffValor >= 0 ? "bg-success/5 border-success/30" : "bg-destructive/5 border-destructive/30"}`}>
              <div className="flex items-center gap-2">
                <ArrowRightLeft className={`w-4 h-4 ${comparativo.diffValor >= 0 ? "text-success" : "text-destructive"}`} />
                <span className="font-display text-sm font-bold text-foreground">DIFERENÇA PROJETADA (ano)</span>
                <span className={`ml-auto font-display text-base font-bold ${comparativo.diffValor >= 0 ? "text-success" : "text-destructive"}`}>
                  {comparativo.diffValor >= 0 ? "+" : ""}R$ {comparativo.diffValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ({comparativo.diffPct >= 0 ? "+" : ""}{comparativo.diffPct.toFixed(2)}%)
                </span>
              </div>
              <p className="text-xs font-body text-muted-foreground mt-1">
                {comparativo.diffValor >= 0
                  ? "As indicações renderiam mais que sua carteira atual no mesmo capital."
                  : "Sua carteira atual rende mais que as indicações no mesmo capital."}
              </p>
            </div>

            <div className="overflow-x-auto">
              <h3 className="font-display text-sm font-bold text-foreground mb-2">📌 Comparativo por Ativo</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">TICKER</th>
                    <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">DY INDIC.</th>
                    <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">DY CARTEIRA</th>
                    <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">PM CARTEIRA</th>
                    <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">PREÇO ATUAL</th>
                    <th className="text-left py-2 px-2 font-display text-xs text-muted-foreground">GANHO/PERDA</th>
                  </tr>
                </thead>
                <tbody>
                  {comparativo.porAtivo.map(p => (
                    <tr key={p.ticker} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="py-2 px-2 font-body font-bold text-primary">{p.ticker}</td>
                      <td className="py-2 px-2 font-body text-success">{p.dyIndicado.toFixed(2)}%</td>
                      <td className="py-2 px-2 font-body">{p.dyCarteira !== null ? `${p.dyCarteira.toFixed(2)}%` : <span className="text-muted-foreground text-xs">não está na carteira</span>}</td>
                      <td className="py-2 px-2 font-body">{p.precoMedio !== null ? `R$ ${p.precoMedio.toFixed(2)}` : "—"}</td>
                      <td className="py-2 px-2 font-body">R$ {p.precoAtual.toFixed(2)}</td>
                      <td className={`py-2 px-2 font-body font-bold ${(p.ganhoTotal ?? 0) >= 0 ? "text-success" : "text-destructive"}`}>
                        {p.ganhoTotal !== null ? (
                          <div className="flex items-center gap-1">
                            {p.ganhoTotal >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            R$ {p.ganhoTotal.toFixed(2)} ({((p.ganhoUnit! / p.precoMedio!) * 100).toFixed(2)}%)
                          </div>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default BilhetePremiado;
