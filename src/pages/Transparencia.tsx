import { motion } from "framer-motion";
import { Database, Clock, Calculator, AlertCircle, CheckCircle2 } from "lucide-react";
import { useBCBData } from "@/hooks/useBCBData";
import { useLivePrices } from "@/hooks/useLivePrices";

const Transparencia = () => {
  const { data: bcb, dataUpdatedAt } = useBCBData();
  const { updatedAt: pricesUpdatedAt } = useLivePrices();

  const fontes = [
    { nome: "Banco Central do Brasil (SGS)", uso: "SELIC, CDI, IPCA, Dólar/Euro PTAX", tipo: "real", url: "api.bcb.gov.br" },
    { nome: "Mock interno (B3)", uso: "Cotações de FIIs e ações", tipo: "simulado", url: "src/data/mockData.ts" },
    { nome: "Polling de preços", uso: "Spot/Futuro com jitter ±0.5%/0.8%", tipo: "estimado", url: "useLivePrices (15s)" },
    { nome: "Calendário de dividendos", uso: "Datas COM e Pagamento dos FIIs", tipo: "estimado", url: "mockData.dividendos" },
  ];

  const regras = [
    { regra: "Recomendação de troca de FII", logica: "DY anual < SELIC - 3pp → sugere FII com DY ≥ DY atual + 2pp" },
    { regra: "Alerta de realização de lucro", logica: "Lucro > 30% sobre preço médio" },
    { regra: "Alerta de prejuízo", logica: "Perda > 15% sobre preço médio" },
    { regra: "Auto-sustento (cotas)", logica: "Cotas necessárias = teto(preço / dividendo mensal)" },
    { regra: "Projeção mensal de renda", logica: "Σ (quantidade × preço × DY/12) por ativo" },
    { regra: "Projeção diária", logica: "Renda mensal projetada / 30" },
    { regra: "Basis spot/futuro", logica: "(preço futuro / preço spot − 1) × 100" },
  ];

  const tagFor = (tipo: string) =>
    tipo === "real" ? { c: "bg-success/15 text-success border-success/30", t: "REAL" }
    : tipo === "estimado" ? { c: "bg-warning/15 text-warning border-warning/30", t: "ESTIMADO" }
    : { c: "bg-muted/30 text-muted-foreground border-border", t: "SIMULADO" };

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        className="font-display text-3xl font-bold text-gradient">
        TRANSPARÊNCIA & PREMISSAS
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-primary" /><p className="font-display text-xs text-muted-foreground">ÚLT. ATUALIZAÇÃO BCB</p></div>
          <p className="font-body text-lg font-bold text-foreground">{dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString("pt-BR") : "—"}</p>
        </div>
        <div className="glass rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-primary" /><p className="font-display text-xs text-muted-foreground">ÚLT. POLLING DE PREÇOS</p></div>
          <p className="font-body text-lg font-bold text-foreground">{new Date(pricesUpdatedAt).toLocaleTimeString("pt-BR")}</p>
        </div>
        <div className="glass rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-2"><Calculator className="w-4 h-4 text-primary" /><p className="font-display text-xs text-muted-foreground">SELIC / CDI / IPCA</p></div>
          <p className="font-body text-lg font-bold text-foreground">
            {bcb?.selic?.toFixed(2) ?? "—"}% / {bcb?.cdi?.toFixed(2) ?? "—"}% / {bcb?.ipca?.toFixed(2) ?? "—"}%
          </p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">FONTES DE DADOS</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border">
              {["FONTE", "USO", "ORIGEM", "TIPO"].map(h => <th key={h} className="text-left py-2 px-2 font-display text-xs text-muted-foreground">{h}</th>)}
            </tr></thead>
            <tbody>
              {fontes.map(f => {
                const tag = tagFor(f.tipo);
                return (
                  <tr key={f.nome} className="border-b border-border/50">
                    <td className="py-3 px-2 font-body font-bold text-foreground">{f.nome}</td>
                    <td className="py-3 px-2 font-body text-muted-foreground">{f.uso}</td>
                    <td className="py-3 px-2 font-body text-xs text-muted-foreground">{f.url}</td>
                    <td className="py-3 px-2"><span className={`px-2 py-0.5 rounded text-[10px] font-display border ${tag.c}`}>{tag.t}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">REGRAS DE CÁLCULO</h2>
        </div>
        <div className="space-y-2">
          {regras.map(r => (
            <div key={r.regra} className="p-3 rounded-lg bg-secondary/40 border border-border">
              <p className="font-display text-sm font-bold text-primary">{r.regra}</p>
              <p className="font-body text-sm text-muted-foreground mt-1">{r.logica}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="glass rounded-xl p-5 border border-warning/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <p className="font-display text-sm font-bold text-warning mb-1">AVISO LEGAL</p>
            <p className="font-body text-sm text-muted-foreground">
              Os dados marcados como <span className="text-warning font-bold">ESTIMADO</span> ou{" "}
              <span className="text-muted-foreground font-bold">SIMULADO</span> não devem ser usados
              como recomendação de investimento. Cotações reais devem ser confirmadas em sua corretora.
              As projeções assumem manutenção do DY histórico e periodicidade mensal de dividendos.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-body text-success">
              <CheckCircle2 className="w-4 h-4" />
              SELIC, CDI, IPCA e câmbio são lidos diretamente da API oficial do BCB.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transparencia;
