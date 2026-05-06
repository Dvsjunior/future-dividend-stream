import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, DollarSign, BarChart3, Globe, AlertTriangle, CheckCircle, Info, LineChart as LineIcon } from "lucide-react";
import { taxaJuros, moedas, historicoTaxas, impactAnalyses, futuros } from "@/data/economicData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Economia = () => {
  const sentimentIcon = (s: string) => {
    if (s === "positive") return <CheckCircle className="w-5 h-5 text-success" />;
    if (s === "negative") return <AlertTriangle className="w-5 h-5 text-destructive" />;
    return <Info className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-display text-3xl font-bold text-gradient"
      >
        ECONOMIA & INDICADORES
      </motion.h1>

      <Tabs defaultValue="taxas" className="w-full">
        <TabsList className="glass border border-border mb-4 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="taxas" className="font-display text-xs data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="w-4 h-4 mr-1" /> TAXAS DE JUROS
          </TabsTrigger>
          <TabsTrigger value="moedas" className="font-display text-xs data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <DollarSign className="w-4 h-4 mr-1" /> MOEDAS
          </TabsTrigger>
          <TabsTrigger value="historico" className="font-display text-xs data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="w-4 h-4 mr-1" /> HISTÓRICO
          </TabsTrigger>
          <TabsTrigger value="futuros" className="font-display text-xs data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <LineIcon className="w-4 h-4 mr-1" /> FUTUROS
          </TabsTrigger>
          <TabsTrigger value="impactos" className="font-display text-xs data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <Globe className="w-4 h-4 mr-1" /> IMPACTOS
          </TabsTrigger>
        </TabsList>

        {/* TAXAS */}
        <TabsContent value="taxas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {taxaJuros.slice(0, 4).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass rounded-xl p-5 border border-primary/20 hover:glow-primary transition-all"
              >
                <p className="text-muted-foreground font-body text-sm mb-1">{t.name}</p>
                <p className="font-display text-2xl font-bold text-foreground">
                  {t.value}{t.unit === "% CDI" ? "%" : ""}
                  <span className="text-sm text-muted-foreground ml-1">{t.unit}</span>
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {t.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : t.change < 0 ? (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  ) : (
                    <Minus className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className={`text-sm font-body font-bold ${t.change > 0 ? "text-success" : t.change < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    {t.change > 0 ? "+" : ""}{t.change}{t.unit === "% CDI" ? " p.p." : " p.p."}
                  </span>
                  <span className="text-muted-foreground text-xs font-body ml-1">{t.period}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taxaJuros.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass rounded-xl p-5 border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-display text-sm font-bold text-primary">{t.name}</p>
                    <p className="font-display text-xl font-bold text-foreground mt-1">
                      {t.value} <span className="text-sm text-muted-foreground">{t.unit}</span>
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs font-bold font-body ${t.change > 0 ? "bg-success/15 text-success" : t.change < 0 ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"}`}>
                    {t.change > 0 ? "▲" : t.change < 0 ? "▼" : "—"} {Math.abs(t.change)}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">{t.description}</p>
                {t.ativosRelacionados && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="font-display text-[10px] text-muted-foreground mb-1.5">📌 ATIVOS RELACIONADOS</p>
                    <div className="space-y-1">
                      {t.ativosRelacionados.map(a => (
                        <div key={a.ticker} className="flex items-start gap-2 text-xs">
                          <span className="font-body font-bold text-primary min-w-[60px]">{a.ticker}</span>
                          <span className="font-body text-muted-foreground">{a.motivo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* MOEDAS */}
        <TabsContent value="moedas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {moedas.map((m, i) => (
              <motion.div
                key={m.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass rounded-xl p-5 border border-border hover:border-primary/30 hover:glow-primary transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <span className="font-display text-xs font-bold text-primary-foreground">{m.code}</span>
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-foreground">{m.code}/BRL</p>
                      <p className="text-muted-foreground text-xs font-body">{m.name}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${m.changePercent > 0 ? "text-success" : "text-destructive"}`}>
                    {m.changePercent > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-sm font-body font-bold">{m.changePercent > 0 ? "+" : ""}{m.changePercent.toFixed(2)}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-muted-foreground text-xs font-body">Compra</p>
                    <p className="font-body text-lg font-bold text-foreground">R$ {m.buyPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs font-body">Venda</p>
                    <p className="font-body text-lg font-bold text-foreground">R$ {m.sellPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-muted-foreground text-xs font-body leading-relaxed">
                    <Globe className="w-3 h-3 inline mr-1 text-primary" />
                    {m.impact}
                  </p>
                </div>
                {m.ativosRelacionados && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="font-display text-[10px] text-muted-foreground mb-1.5">📌 ATIVOS RELACIONADOS</p>
                    <div className="space-y-1">
                      {m.ativosRelacionados.map(a => (
                        <div key={a.ticker} className="flex items-start gap-2 text-xs">
                          <span className="font-body font-bold text-primary min-w-[60px]">{a.ticker}</span>
                          <span className="font-body text-muted-foreground">{a.motivo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* HISTÓRICO */}
        <TabsContent value="historico">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6 border border-border"
          >
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              📈 EVOLUÇÃO SELIC × CDI × IPCA (12 MESES)
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicoTaxas}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 30% 18%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(210 20% 55%)", fontSize: 12, fontFamily: "Rajdhani" }} />
                  <YAxis tick={{ fill: "hsl(210 20% 55%)", fontSize: 12, fontFamily: "Rajdhani" }} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(216 45% 10%)",
                      border: "1px solid hsl(190 100% 50% / 0.3)",
                      borderRadius: "8px",
                      fontFamily: "Rajdhani",
                    }}
                    labelStyle={{ color: "hsl(200 100% 97%)" }}
                  />
                  <Legend wrapperStyle={{ fontFamily: "Rajdhani", fontSize: 14 }} />
                  <Line type="monotone" dataKey="selic" stroke="hsl(190 100% 50%)" strokeWidth={3} name="SELIC" dot={{ fill: "hsl(190 100% 50%)", r: 4 }} />
                  <Line type="monotone" dataKey="cdi" stroke="hsl(210 100% 60%)" strokeWidth={3} name="CDI" dot={{ fill: "hsl(210 100% 60%)", r: 4 }} />
                  <Line type="monotone" dataKey="ipca" stroke="hsl(0 70% 50%)" strokeWidth={3} name="IPCA" dot={{ fill: "hsl(0 70% 50%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Tabela */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6 border border-border mt-4"
          >
            <h2 className="font-display text-lg font-bold text-foreground mb-4">📊 DADOS HISTÓRICOS</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">MÊS</th>
                    <th className="text-right py-3 px-3 font-display text-xs text-muted-foreground">SELIC</th>
                    <th className="text-right py-3 px-3 font-display text-xs text-muted-foreground">CDI</th>
                    <th className="text-right py-3 px-3 font-display text-xs text-muted-foreground">IPCA</th>
                    <th className="text-right py-3 px-3 font-display text-xs text-muted-foreground">JURO REAL</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoTaxas.map((h) => {
                    const juroReal = ((1 + h.selic / 100) / (1 + h.ipca / 100) - 1) * 100;
                    return (
                      <tr key={h.month} className="border-b border-border/50 hover:bg-secondary/30 transition-all">
                        <td className="py-3 px-3 font-body font-bold text-primary">{h.month}</td>
                        <td className="py-3 px-3 font-body text-right">{h.selic.toFixed(2)}%</td>
                        <td className="py-3 px-3 font-body text-right">{h.cdi.toFixed(2)}%</td>
                        <td className="py-3 px-3 font-body text-right text-warning">{h.ipca.toFixed(2)}%</td>
                        <td className="py-3 px-3 font-body text-right text-success font-bold">{juroReal.toFixed(2)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </TabsContent>

        {/* FUTUROS */}
        <TabsContent value="futuros">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 border border-primary/20 mb-4">
            <h2 className="font-display text-lg font-bold text-foreground mb-2">📉 CONTRATOS FUTUROS</h2>
            <p className="font-body text-sm text-muted-foreground">
              Compare o preço à vista (spot) com o futuro (mini dólar, dólar cheio, BTC perpétuo, DI futuro, mini índice). O <strong>basis</strong> (diferença futuro − spot) revela a expectativa do mercado.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {futuros.map((f, i) => {
              const isCripto = f.code.includes("BTC");
              const isTaxa = f.code.startsWith("DI");
              const fmt = (v: number) =>
                isTaxa ? `${v.toFixed(2)}%` :
                isCripto ? `R$ ${v.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` :
                v >= 1000 ? v.toLocaleString("pt-BR", { maximumFractionDigits: 0 }) :
                `R$ ${v.toFixed(2)}`;
              return (
                <motion.div
                  key={f.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl p-5 border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-display text-xs text-primary">{f.code}</p>
                      <h3 className="font-display text-lg font-bold text-foreground">{f.name}</h3>
                    </div>
                    <span className="text-xs font-body text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                      Venc: {f.vencimento}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <p className="text-[10px] font-body text-muted-foreground">SPOT</p>
                      <p className="font-display font-bold text-foreground text-sm">{fmt(f.spotPrice)}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <p className="text-[10px] font-body text-muted-foreground">FUTURO</p>
                      <p className="font-display font-bold text-primary text-sm">{fmt(f.futurePrice)}</p>
                    </div>
                    <div className={`rounded-lg p-2 ${f.basis >= 0 ? "bg-success/10" : "bg-destructive/10"}`}>
                      <p className="text-[10px] font-body text-muted-foreground">BASIS</p>
                      <p className={`font-display font-bold text-sm ${f.basis >= 0 ? "text-success" : "text-destructive"}`}>
                        {f.basis >= 0 ? "+" : ""}{f.basisPct.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-body text-muted-foreground leading-relaxed mb-2">{f.description}</p>
                  <div className="border-t border-border pt-2">
                    <p className="font-display text-[10px] text-primary mb-1">🔍 LEITURA DE MERCADO</p>
                    <p className="text-xs font-body text-foreground leading-relaxed">{f.interpretation}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* IMPACTOS */}
        <TabsContent value="impactos">
          <div className="space-y-4">
            {impactAnalyses.map((analysis, i) => (
              <motion.div
                key={analysis.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  {sentimentIcon(analysis.sentiment)}
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">{analysis.title}</h3>
                    <p className="text-muted-foreground text-sm font-body">{analysis.scenario}</p>
                  </div>
                  <span className="ml-auto px-3 py-1 rounded-full bg-primary/15 text-primary text-sm font-display font-bold">
                    {analysis.indicator}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="font-display text-xs text-muted-foreground mb-2">EFEITOS NA ECONOMIA</p>
                  <ul className="space-y-2">
                    {analysis.effects.map((effect, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm font-body text-foreground">
                        <span className="text-primary mt-0.5">▸</span>
                        {effect}
                      </li>
                    ))}
                  </ul>
                </div>

                {analysis.ativosImpactados && (
                  <div className="mb-4">
                    <p className="font-display text-xs text-muted-foreground mb-2">📌 ATIVOS IMPACTADOS</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {analysis.ativosImpactados.map(a => (
                        <div key={a.ticker} className="flex items-start gap-2 bg-secondary/40 rounded-md p-2">
                          {a.direcao === "alta"
                            ? <TrendingUp className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            : <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />}
                          <div className="flex-1">
                            <span className="font-body font-bold text-primary text-sm">{a.ticker}</span>
                            <p className="text-xs font-body text-muted-foreground">{a.motivo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <p className="font-display text-xs text-primary mb-1">💡 RECOMENDAÇÃO</p>
                  <p className="text-sm font-body text-foreground leading-relaxed">{analysis.recommendation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Economia;
