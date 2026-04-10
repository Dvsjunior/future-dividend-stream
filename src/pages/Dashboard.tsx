import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, Calendar, Target, DollarSign } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import EconomicWidget from "@/components/EconomicWidget";
import {
  topAltas, topBaixas, fundosImobiliarios, carteira,
  encontrarProximoFundoParaCompra, calcularCotasParaAutoSustento
} from "@/data/mockData";

const Dashboard = () => {
  const proximoFundo = encontrarProximoFundoParaCompra(fundosImobiliarios, carteira.valorDisponivel);
  const proximoDividendo = fundosImobiliarios
    .filter(f => new Date(f.dataCom) > new Date())
    .sort((a, b) => new Date(a.dataCom).getTime() - new Date(b.dataCom).getTime())[0];

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-display text-3xl font-bold text-gradient"
      >
        DASHBOARD
      </motion.h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Valor da Carteira"
          value={`R$ ${carteira.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtitle="Total investido"
          icon={Wallet}
          variant="accent"
        />
        <DashboardCard
          title="Disponível p/ Investir"
          value={`R$ ${carteira.valorDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtitle="Saldo livre"
          icon={DollarSign}
        />
        <DashboardCard
          title="Próximo Dividendo"
          value={proximoDividendo ? `${proximoDividendo.ticker}` : "—"}
          subtitle={proximoDividendo ? `R$ ${proximoDividendo.lastDividend.toFixed(2)} em ${new Date(proximoDividendo.dataPayment).toLocaleDateString('pt-BR')}` : ""}
          icon={Calendar}
          variant="success"
        />
        <DashboardCard
          title="Sugestão de Compra"
          value={proximoFundo ? proximoFundo.ticker : "—"}
          subtitle={proximoFundo ? `DY ${proximoFundo.dividendYield}% | R$ ${proximoFundo.price.toFixed(2)}` : "Sem oportunidade"}
          icon={Target}
          variant="accent"
        />
      </div>

      {/* Widget Econômico */}
      <EconomicWidget />

      {/* Análise de auto-sustento */}
      {proximoFundo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6 border border-primary/20 glow-primary"
        >
          <h3 className="font-display text-lg font-bold text-primary mb-2">
            🎯 ANÁLISE INTELIGENTE
          </h3>
          <p className="font-body text-lg text-foreground">
            Com <span className="text-primary font-bold">{calcularCotasParaAutoSustento(proximoFundo)} cotas</span> de{" "}
            <span className="text-primary font-bold">{proximoFundo.ticker}</span>, o dividendo mensal comprará automaticamente 1 nova cota.
            Valor necessário:{" "}
            <span className="text-success font-bold">
              R$ {(calcularCotasParaAutoSustento(proximoFundo) * proximoFundo.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </p>
        </motion.div>
      )}

      {/* Top 10 Altas e Baixas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-success" />
            <h2 className="font-display text-lg font-bold text-foreground">TOP 10 MAIORES ALTAS</h2>
          </div>
          <div className="space-y-2">
            {topAltas.map((stock, i) => (
              <div key={stock.ticker} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-body text-sm w-6">{i + 1}</span>
                  <div>
                    <p className="font-body text-base font-semibold text-foreground">{stock.ticker}</p>
                    <p className="text-muted-foreground text-xs font-body">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-body font-semibold text-foreground">R$ {stock.price.toFixed(2)}</p>
                  <p className="text-success text-sm font-body font-bold">+{stock.changePercent.toFixed(2)}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-destructive" />
            <h2 className="font-display text-lg font-bold text-foreground">TOP 10 MAIORES BAIXAS</h2>
          </div>
          <div className="space-y-2">
            {topBaixas.map((stock, i) => (
              <div key={stock.ticker} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-body text-sm w-6">{i + 1}</span>
                  <div>
                    <p className="font-body text-base font-semibold text-foreground">{stock.ticker}</p>
                    <p className="text-muted-foreground text-xs font-body">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-body font-semibold text-foreground">R$ {stock.price.toFixed(2)}</p>
                  <p className="text-destructive text-sm font-body font-bold">{stock.changePercent.toFixed(2)}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Oportunidades */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-lg font-bold text-foreground mb-4">📊 OPORTUNIDADES — FIIs COM DATA COM PRÓXIMA</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-display text-xs text-muted-foreground">TICKER</th>
                <th className="text-left py-3 px-2 font-display text-xs text-muted-foreground">PREÇO</th>
                <th className="text-left py-3 px-2 font-display text-xs text-muted-foreground">DY</th>
                <th className="text-left py-3 px-2 font-display text-xs text-muted-foreground">DIVIDENDO</th>
                <th className="text-left py-3 px-2 font-display text-xs text-muted-foreground">DATA COM</th>
                <th className="text-left py-3 px-2 font-display text-xs text-muted-foreground">PAGAMENTO</th>
                <th className="text-left py-3 px-2 font-display text-xs text-muted-foreground">SETOR</th>
              </tr>
            </thead>
            <tbody>
              {fundosImobiliarios
                .sort((a, b) => new Date(a.dataCom).getTime() - new Date(b.dataCom).getTime())
                .map((fii) => (
                  <tr key={fii.ticker} className="border-b border-border/50 hover:bg-secondary/30 transition-all">
                    <td className="py-3 px-2 font-body font-bold text-primary">{fii.ticker}</td>
                    <td className="py-3 px-2 font-body">R$ {fii.price.toFixed(2)}</td>
                    <td className="py-3 px-2 font-body text-success font-bold">{fii.dividendYield}%</td>
                    <td className="py-3 px-2 font-body">R$ {fii.lastDividend.toFixed(2)}</td>
                    <td className="py-3 px-2 font-body">{new Date(fii.dataCom).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-2 font-body">{new Date(fii.dataPayment).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-2 font-body text-muted-foreground">{fii.sector}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
