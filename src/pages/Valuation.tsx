import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { fundosImobiliarios, FundoImobiliario } from "@/data/mockData";

interface ValuationResult {
  yieldMensal: number;
  yieldAnual: number;
  taxaDescontoMensal: number;
  taxaDescontoFinal: number;
  valorIntrinseco: number;
  upside: number;
}

function calcularValuation(
  rendimentoMensal: number,
  precoAtual: number,
  taxaDesconto: number,
  impostoRenda: number,
  premioRisco: number
): ValuationResult {
  const yieldMensal = rendimentoMensal / precoAtual;
  const taxaDescontoLiquida = taxaDesconto * (1 - impostoRenda / 100);
  const taxaDescontoFinal = taxaDescontoLiquida + premioRisco;
  const taxaDescontoMensal = Math.pow(1 + taxaDescontoFinal / 100, 1 / 12) - 1;
  const yieldAnual = Math.pow(1 + yieldMensal, 12) - 1;
  const valorIntrinseco = taxaDescontoMensal > 0 ? rendimentoMensal / taxaDescontoMensal : 0;
  const upside = (valorIntrinseco - precoAtual) / precoAtual;

  return {
    yieldMensal: yieldMensal * 100,
    yieldAnual: yieldAnual * 100,
    taxaDescontoMensal: taxaDescontoMensal * 100,
    taxaDescontoFinal,
    valorIntrinseco,
    upside: upside * 100,
  };
}

function getSensibilidade(
  rendimentoMensal: number,
  precoBase: number,
  taxaDesconto: number,
  impostoRenda: number,
  premioRisco: number
) {
  const precoVariacoes = [-10, -5, 0, 5, 10];
  const taxaVariacoes = [-1, -0.5, 0, 0.5, 1];

  return precoVariacoes.map((pVar) => {
    const preco = precoBase * (1 + pVar / 100);
    const row = taxaVariacoes.map((tVar) => {
      const res = calcularValuation(rendimentoMensal, preco, taxaDesconto + tVar, impostoRenda, premioRisco);
      return res.upside;
    });
    return { precoVar: pVar, preco, values: row };
  });
}

function getUpsideColor(val: number): string {
  if (val > 20) return "bg-emerald-500/80 text-white";
  if (val > 10) return "bg-emerald-400/60 text-white";
  if (val > 0) return "bg-emerald-300/40 text-foreground";
  if (val > -10) return "bg-amber-400/40 text-foreground";
  if (val > -20) return "bg-red-400/60 text-white";
  return "bg-red-500/80 text-white";
}

const Valuation = () => {
  const [selectedFundo, setSelectedFundo] = useState<FundoImobiliario>(fundosImobiliarios[0]);
  const [rendimentoMensal, setRendimentoMensal] = useState(selectedFundo.lastDividend);
  const [precoAtual, setPrecoAtual] = useState(selectedFundo.price);
  const [taxaDesconto, setTaxaDesconto] = useState(12.48);
  const [impostoRenda, setImpostoRenda] = useState(17.5);
  const [premioRisco, setPremioRisco] = useState(10);

  const handleSelectFundo = (ticker: string) => {
    const fundo = fundosImobiliarios.find((f) => f.ticker === ticker);
    if (fundo) {
      setSelectedFundo(fundo);
      setRendimentoMensal(fundo.lastDividend);
      setPrecoAtual(fundo.price);
    }
  };

  const result = useMemo(
    () => calcularValuation(rendimentoMensal, precoAtual, taxaDesconto, impostoRenda, premioRisco),
    [rendimentoMensal, precoAtual, taxaDesconto, impostoRenda, premioRisco]
  );

  const sensibilidade = useMemo(
    () => getSensibilidade(rendimentoMensal, precoAtual, taxaDesconto, impostoRenda, premioRisco),
    [rendimentoMensal, precoAtual, taxaDesconto, impostoRenda, premioRisco]
  );

  const taxaVariacoes = [-1, -0.5, 0, 0.5, 1];

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-display text-3xl font-bold text-gradient"
      >
        VALUATION — PREÇO JUSTO DOS FIIs
      </motion.h1>

      {/* Seletor de Fundo */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Selecione o Fundo</h2>
        <div className="flex flex-wrap gap-2">
          {fundosImobiliarios.map((f) => (
            <button
              key={f.ticker}
              onClick={() => handleSelectFundo(f.ticker)}
              className={`px-4 py-2 rounded-lg font-display text-sm font-bold transition-all ${
                selectedFundo.ticker === f.ticker
                  ? "gradient-primary text-primary-foreground glow-primary"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              {f.ticker}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Parâmetros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6 border border-primary/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-6 h-6 text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground">1 — Parâmetros de Análise</h2>
        </div>

        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <p className="font-body text-sm text-muted-foreground">Altere os valores abaixo para recalcular o preço justo em tempo real.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <ParamInput label="Rendimento Mensal (R$)" value={rendimentoMensal} onChange={setRendimentoMensal} step={0.01} />
          <ParamInput label="Preço Atual (R$)" value={precoAtual} onChange={setPrecoAtual} step={0.01} />
          <ParamInput label="Taxa de Desconto (%)" value={taxaDesconto} onChange={setTaxaDesconto} step={0.01} sublabel="IDKA-Pré 1 ano" />
          <ParamInput label="Imposto de Renda (%)" value={impostoRenda} onChange={setImpostoRenda} step={0.5} sublabel="15% a 22,5%" />
          <ParamInput label="Prêmio de Risco (%)" value={premioRisco} onChange={setPremioRisco} step={0.5} />
        </div>

        {/* Tabela IR */}
        <div className="mt-4 p-4 rounded-lg bg-secondary/50">
          <p className="font-display text-xs font-bold text-muted-foreground mb-2">TABELA REGRESSIVA IR — RENDA FIXA</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { aliq: "22,50%", periodo: "Antes de 6 meses" },
              { aliq: "20,00%", periodo: "6 meses a 1 ano" },
              { aliq: "17,50%", periodo: "1 a 2 anos" },
              { aliq: "15,00%", periodo: "Após 2 anos" },
            ].map((item) => (
              <div key={item.periodo} className="text-center p-2 rounded bg-background/50">
                <p className="font-display text-sm font-bold text-primary">{item.aliq}</p>
                <p className="font-body text-xs text-muted-foreground">{item.periodo}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Resultados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-xl font-bold text-foreground mb-4">2 — Resultados da Análise</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ResultCard label="Yield Mensal" value={`${result.yieldMensal.toFixed(2)}%`} />
          <ResultCard label="Yield Anual" value={`${result.yieldAnual.toFixed(2)}%`} />
          <ResultCard label="Taxa Desc. Mensal" value={`${result.taxaDescontoMensal.toFixed(2)}%`} />
          <ResultCard label="Taxa Desc. Final" value={`${result.taxaDescontoFinal.toFixed(2)}%`} />
        </div>
      </motion.div>

      {/* Conclusão */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6 border border-primary/30 glow-primary"
      >
        <h2 className="font-display text-xl font-bold text-foreground mb-4">3 — Conclusão</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl bg-secondary/50">
            <p className="font-body text-sm text-muted-foreground mb-1">Valor Atual</p>
            <p className="font-display text-3xl font-bold text-foreground">R$ {precoAtual.toFixed(2)}</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-secondary/50">
            <p className="font-body text-sm text-muted-foreground mb-1">Valor Intrínseco</p>
            <p className="font-display text-3xl font-bold text-primary">R$ {result.valorIntrinseco.toFixed(2)}</p>
          </div>
          <div className={`text-center p-6 rounded-xl ${result.upside >= 0 ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
            <p className="font-body text-sm text-muted-foreground mb-1">Upside/Downside</p>
            <div className="flex items-center justify-center gap-2">
              {result.upside > 0 ? (
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              ) : result.upside < 0 ? (
                <TrendingDown className="w-6 h-6 text-red-400" />
              ) : (
                <Minus className="w-6 h-6 text-muted-foreground" />
              )}
              <p className={`font-display text-3xl font-bold ${result.upside >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {result.upside >= 0 ? "+" : ""}
                {result.upside.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sensibilidade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-xl font-bold text-foreground mb-4">4 — Análise de Sensibilidade</h2>
        <p className="font-body text-sm text-muted-foreground mb-4">
          Variação do upside/downside conforme mudanças no preço e na taxa de desconto.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-3 font-display text-xs text-muted-foreground text-left">Preço ↓ / Taxa →</th>
                {taxaVariacoes.map((tv) => (
                  <th key={tv} className="py-3 px-3 font-display text-xs text-muted-foreground text-center">
                    {tv > 0 ? "+" : ""}
                    {tv.toFixed(2)}%
                    <br />
                    <span className="text-primary">{(taxaDesconto + tv).toFixed(2)}%</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sensibilidade.map((row) => (
                <tr key={row.precoVar} className="border-b border-border/50">
                  <td className="py-3 px-3 font-display text-sm">
                    <span className="text-muted-foreground">{row.precoVar > 0 ? "+" : ""}{row.precoVar}%</span>
                    <span className="ml-2 font-bold text-foreground">R$ {row.preco.toFixed(2)}</span>
                  </td>
                  {row.values.map((val, i) => (
                    <td key={i} className={`py-3 px-3 text-center font-display text-sm font-bold rounded ${getUpsideColor(val)}`}>
                      {val >= 0 ? "+" : ""}
                      {val.toFixed(2)}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legenda */}
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="font-body text-xs text-muted-foreground">Escala:</span>
          {[
            { label: "< -20%", cls: "bg-red-500/80" },
            { label: "-20% a -10%", cls: "bg-red-400/60" },
            { label: "-10% a 0%", cls: "bg-amber-400/40" },
            { label: "0% a 10%", cls: "bg-emerald-300/40" },
            { label: "10% a 20%", cls: "bg-emerald-400/60" },
            { label: "> 20%", cls: "bg-emerald-500/80" },
          ].map((s) => (
            <span key={s.label} className={`px-2 py-1 rounded text-xs font-display ${s.cls}`}>{s.label}</span>
          ))}
        </div>
      </motion.div>

      {/* Todos os FIIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-xl font-bold text-foreground mb-4">📊 VALUATION DE TODOS OS FIIs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">TICKER</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">NOME</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">PREÇO</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">DIVIDENDO</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">YIELD</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">VALOR JUSTO</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">UPSIDE</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">SINAL</th>
              </tr>
            </thead>
            <tbody>
              {fundosImobiliarios.map((fii) => {
                const v = calcularValuation(fii.lastDividend, fii.price, taxaDesconto, impostoRenda, premioRisco);
                return (
                  <tr
                    key={fii.ticker}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-all cursor-pointer"
                    onClick={() => handleSelectFundo(fii.ticker)}
                  >
                    <td className="py-3 px-3 font-body font-bold text-primary">{fii.ticker}</td>
                    <td className="py-3 px-3 font-body text-foreground">{fii.name}</td>
                    <td className="py-3 px-3 font-body">R$ {fii.price.toFixed(2)}</td>
                    <td className="py-3 px-3 font-body">R$ {fii.lastDividend.toFixed(2)}</td>
                    <td className="py-3 px-3 font-body text-success font-bold">{fii.dividendYield}%</td>
                    <td className="py-3 px-3 font-display font-bold text-primary">R$ {v.valorIntrinseco.toFixed(2)}</td>
                    <td className={`py-3 px-3 font-display font-bold ${v.upside >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {v.upside >= 0 ? "+" : ""}{v.upside.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-3 py-1 rounded-full font-display text-xs font-bold ${
                        v.upside > 10 ? "bg-emerald-500/20 text-emerald-400" :
                        v.upside > 0 ? "bg-emerald-300/20 text-emerald-300" :
                        v.upside > -10 ? "bg-amber-400/20 text-amber-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {v.upside > 10 ? "COMPRAR" : v.upside > 0 ? "NEUTRO" : v.upside > -10 ? "CARO" : "EVITAR"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

function ParamInput({ label, value, onChange, step = 1, sublabel }: {
  label: string; value: number; onChange: (v: number) => void; step?: number; sublabel?: string;
}) {
  return (
    <div>
      <label className="font-body text-sm text-muted-foreground block mb-1">{label}</label>
      {sublabel && <p className="font-body text-xs text-primary mb-1">{sublabel}</p>}
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 bg-secondary rounded-lg text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-4 text-center">
      <p className="font-body text-sm text-muted-foreground mb-1">{label}</p>
      <p className="font-display text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default Valuation;
