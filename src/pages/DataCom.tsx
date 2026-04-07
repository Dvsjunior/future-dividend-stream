import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Zap, ArrowRight, RefreshCw } from "lucide-react";
import { fundosImobiliarios, calcularCotasParaAutoSustento, encontrarProximoFundoParaCompra } from "@/data/mockData";

const DataCom = () => {
  const [valorCarteira, setValorCarteira] = useState(2850);
  const [fundoInicial] = useState(fundosImobiliarios.find(f => f.ticker === 'MXRF11')!);
  const cotasAutoSustento = calcularCotasParaAutoSustento(fundoInicial);
  const valorNecessario = cotasAutoSustento * fundoInicial.price;
  const proximoFundo = encontrarProximoFundoParaCompra(fundosImobiliarios, valorCarteira);

  const [simulacao, setSimulacao] = useState<Array<{mes: number; fundo: string; cotas: number; dividendoAcumulado: number; patrimonio: number}>>([]);

  const simular = () => {
    const resultado = [];
    let dividendoAcumulado = 0;
    let patrimonio = valorNecessario;
    const fundosDisponiveis = [...fundosImobiliarios].sort((a, b) => b.dividendYield - a.dividendYield);
    
    for (let mes = 1; mes <= 12; mes++) {
      const fundoIdx = (mes - 1) % fundosDisponiveis.length;
      const fundo = fundosDisponiveis[fundoIdx];
      const dividendoMes = fundo.lastDividend * Math.ceil(patrimonio / fundo.price);
      dividendoAcumulado += dividendoMes;
      const cotasCompradas = Math.floor(dividendoAcumulado / fundo.price);
      if (cotasCompradas > 0) {
        patrimonio += cotasCompradas * fundo.price;
        dividendoAcumulado -= cotasCompradas * fundo.price;
      }
      resultado.push({
        mes,
        fundo: fundo.ticker,
        cotas: cotasCompradas,
        dividendoAcumulado: parseFloat(dividendoAcumulado.toFixed(2)),
        patrimonio: parseFloat(patrimonio.toFixed(2)),
      });
    }
    setSimulacao(resultado);
  };

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-display text-3xl font-bold text-gradient"
      >
        DATA COM — MOTOR DE INVESTIMENTO
      </motion.h1>

      {/* Explicação MXRF11 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-primary/30 glow-primary"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-6 h-6 text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground">PONTO DE PARTIDA: {fundoInicial.ticker}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-muted-foreground font-body text-sm">Preço da Cota</p>
            <p className="font-display text-xl font-bold text-foreground">R$ {fundoInicial.price.toFixed(2)}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-muted-foreground font-body text-sm">Dividendo/Cota</p>
            <p className="font-display text-xl font-bold text-success">R$ {fundoInicial.lastDividend.toFixed(2)}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-muted-foreground font-body text-sm">Cotas p/ Auto-Sustento</p>
            <p className="font-display text-xl font-bold text-primary">{cotasAutoSustento}</p>
          </div>
        </div>
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <p className="font-body text-lg text-foreground">
            <Zap className="w-5 h-5 text-primary inline mr-2" />
            Com <span className="text-primary font-bold">{cotasAutoSustento} cotas</span> (investimento de{" "}
            <span className="text-primary font-bold">R$ {valorNecessario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            ), o dividendo mensal de{" "}
            <span className="text-success font-bold">R$ {(cotasAutoSustento * fundoInicial.lastDividend).toFixed(2)}</span>{" "}
            será suficiente para comprar 1 nova cota automaticamente!
          </p>
        </div>
      </motion.div>

      {/* Próximo fundo sugerido */}
      {proximoFundo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <ArrowRight className="w-6 h-6 text-accent" />
            <h2 className="font-display text-xl font-bold text-foreground">PRÓXIMO FUNDO SUGERIDO</h2>
          </div>
          <p className="font-body text-lg text-foreground mb-3">
            Baseado na Data Com mais próxima e maior DY, o próximo fundo a comprar é:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-muted-foreground font-body text-xs">Ticker</p>
              <p className="font-display font-bold text-primary text-lg">{proximoFundo.ticker}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-muted-foreground font-body text-xs">Preço</p>
              <p className="font-body font-bold text-foreground">R$ {proximoFundo.price.toFixed(2)}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-muted-foreground font-body text-xs">DY</p>
              <p className="font-body font-bold text-success">{proximoFundo.dividendYield}%</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-muted-foreground font-body text-xs">Data Com</p>
              <p className="font-body font-bold text-foreground">{new Date(proximoFundo.dataCom).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-muted-foreground font-body text-xs">Setor</p>
              <p className="font-body font-bold text-muted-foreground">{proximoFundo.sector}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Simulação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">SIMULAÇÃO DA RODA DE DIVIDENDOS</h2>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <label className="text-muted-foreground font-body text-sm block">Valor Inicial (R$)</label>
              <input
                type="number"
                value={valorCarteira}
                onChange={(e) => setValorCarteira(Number(e.target.value))}
                className="w-32 px-3 py-2 bg-secondary rounded-lg text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={simular}
              className="gradient-primary px-6 py-2 rounded-lg font-display text-sm font-bold text-primary-foreground glow-primary mt-5"
            >
              SIMULAR
            </button>
          </div>
        </div>

        {simulacao.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">MÊS</th>
                  <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">FUNDO</th>
                  <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">COTAS COMPRADAS</th>
                  <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">DIVIDENDO ACUM.</th>
                  <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">PATRIMÔNIO</th>
                </tr>
              </thead>
              <tbody>
                {simulacao.map((row) => (
                  <motion.tr
                    key={row.mes}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: row.mes * 0.05 }}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-all"
                  >
                    <td className="py-3 px-3 font-display font-bold text-primary">{row.mes}</td>
                    <td className="py-3 px-3 font-body font-bold text-foreground">{row.fundo}</td>
                    <td className="py-3 px-3 font-body text-success font-bold">{row.cotas}</td>
                    <td className="py-3 px-3 font-body">R$ {row.dividendoAcumulado.toFixed(2)}</td>
                    <td className="py-3 px-3 font-body font-bold text-foreground">R$ {row.patrimonio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Calendário Data Com */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-xl font-bold text-foreground mb-4">📅 CALENDÁRIO DATA COM — FUNDOS IMOBILIÁRIOS</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">TICKER</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">NOME</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">PREÇO</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">DY</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">DIVIDENDO</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">DATA COM</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">PAGAMENTO</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">COTAS P/ AUTO</th>
              </tr>
            </thead>
            <tbody>
              {fundosImobiliarios
                .sort((a, b) => new Date(a.dataCom).getTime() - new Date(b.dataCom).getTime())
                .map((fii) => (
                  <tr key={fii.ticker} className="border-b border-border/50 hover:bg-secondary/30 transition-all">
                    <td className="py-3 px-3 font-body font-bold text-primary">{fii.ticker}</td>
                    <td className="py-3 px-3 font-body text-foreground">{fii.name}</td>
                    <td className="py-3 px-3 font-body">R$ {fii.price.toFixed(2)}</td>
                    <td className="py-3 px-3 font-body text-success font-bold">{fii.dividendYield}%</td>
                    <td className="py-3 px-3 font-body">R$ {fii.lastDividend.toFixed(2)}</td>
                    <td className="py-3 px-3 font-body">{new Date(fii.dataCom).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-3 font-body">{new Date(fii.dataPayment).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-3 font-display font-bold text-primary">{calcularCotasParaAutoSustento(fii)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DataCom;
