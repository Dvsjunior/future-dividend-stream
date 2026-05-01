import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Zap, Calendar, TrendingUp, Layers } from "lucide-react";
import { fundosImobiliarios, calcularCotasParaAutoSustento, type FundoImobiliario } from "@/data/mockData";
import HelpTip from "@/components/HelpTip";

interface AlocacaoItem {
  fundo: FundoImobiliario;
  cotas: number;
  custo: number;
  dividendoMensal: number;
}

interface Estrategia {
  titulo: string;
  subtitulo: string;
  descricao: string;
  icone: typeof Calendar;
  borderClass: string;
  iconClass: string;
  titleClass: string;
  alocacoes: AlocacaoItem[];
}

function alocarUmFundo(fundo: FundoImobiliario, valor: number): AlocacaoItem {
  const cotas = Math.floor(valor / fundo.price);
  return {
    fundo,
    cotas,
    custo: cotas * fundo.price,
    dividendoMensal: cotas * fundo.lastDividend,
  };
}

function alocarMisto(fundos: FundoImobiliario[], valor: number): AlocacaoItem[] {
  // Distribui o valor proporcionalmente entre n fundos selecionados
  const n = fundos.length;
  const fatia = valor / n;
  return fundos.map(f => alocarUmFundo(f, fatia)).filter(a => a.cotas > 0);
}

const DataCom = () => {
  const [valorInicial, setValorInicial] = useState(2850);
  const [fundoInicial] = useState(fundosImobiliarios.find(f => f.ticker === "MXRF11")!);
  const cotasAutoSustento = calcularCotasParaAutoSustento(fundoInicial);
  const valorNecessario = cotasAutoSustento * fundoInicial.price;

  const estrategias = useMemo<Estrategia[]>(() => {
    const hoje = new Date();
    const futuros = fundosImobiliarios.filter(f => new Date(f.dataCom) >= hoje);

    // 1) Data Com mais próxima
    const maisProx = [...futuros].sort(
      (a, b) => new Date(a.dataCom).getTime() - new Date(b.dataCom).getTime()
    )[0] ?? fundosImobiliarios[0];

    // 2) Maior dividendo absoluto pelo valor (cotas * dividendo)
    const ranking = fundosImobiliarios
      .map(f => alocarUmFundo(f, valorInicial))
      .filter(a => a.cotas > 0)
      .sort((a, b) => b.dividendoMensal - a.dividendoMensal);
    const melhorRetorno = ranking[0];

    // 3) Mesclado: top 3 com melhor relação DY x proximidade Data Com (datas distintas → pagamentos espalhados)
    const scored = fundosImobiliarios
      .map(f => {
        const dias = Math.max(
          1,
          (new Date(f.dataCom).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
        );
        return { f, score: f.dividendYield / Math.sqrt(dias) };
      })
      .sort((a, b) => b.score - a.score);

    // garante datas de pagamento diferentes para diversificar
    const escolhidos: FundoImobiliario[] = [];
    const datasUsadas = new Set<string>();
    for (const { f } of scored) {
      if (escolhidos.length >= 3) break;
      if (!datasUsadas.has(f.dataPayment)) {
        escolhidos.push(f);
        datasUsadas.add(f.dataPayment);
      }
    }
    while (escolhidos.length < 3 && scored.length > escolhidos.length) {
      const extra = scored.find(s => !escolhidos.includes(s.f));
      if (extra) escolhidos.push(extra.f);
      else break;
    }

    return [
      {
        titulo: "OPÇÃO 1 — DATA COM MAIS PRÓXIMA",
        subtitulo: "Receber dividendo o quanto antes",
        descricao: `Compra agora ${maisProx.ticker} para garantir o próximo pagamento em ${new Date(maisProx.dataPayment).toLocaleDateString("pt-BR")}.`,
        icone: Calendar,
        borderClass: "border-primary/30",
        iconClass: "text-primary",
        titleClass: "text-primary",
        alocacoes: [alocarUmFundo(maisProx, valorInicial)],
      },
      {
        titulo: "OPÇÃO 2 — MAIOR RETORNO MENSAL",
        subtitulo: "Maximizar dividendo absoluto",
        descricao: `${melhorRetorno.fundo.ticker} oferece o maior dividendo total para o valor simulado, combinando preço da cota e DY.`,
        icone: TrendingUp,
        borderClass: "border-success/30",
        iconClass: "text-success",
        titleClass: "text-success",
        alocacoes: [melhorRetorno],
      },
      {
        titulo: "OPÇÃO 3 — CARTEIRA DIVERSIFICADA",
        subtitulo: "Receber dividendos em datas diferentes",
        descricao: "Mescla 3 FIIs com datas de pagamento distintas para criar fluxo de caixa quase mensal e reduzir risco.",
        icone: Layers,
        borderClass: "border-accent/30",
        iconClass: "text-accent",
        titleClass: "text-accent",
        alocacoes: alocarMisto(escolhidos, valorInicial),
      },
    ];
  }, [valorInicial]);

  const ativosIndicados = useMemo(() => {
    const map = new Map<string, AlocacaoItem & { origem: string }>();
    estrategias.forEach((est, idx) => {
      est.alocacoes.forEach(a => {
        const key = `${a.fundo.ticker}-${idx}`;
        map.set(key, { ...a, origem: `Opção ${idx + 1}` });
      });
    });
    return Array.from(map.values());
  }, [estrategias]);

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-display text-3xl font-bold text-gradient"
      >
        DATA COM — MOTOR DE INVESTIMENTO
      </motion.h1>

      {/* MXRF11 ponto de partida */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-primary/30 glow-primary"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="w-6 h-6 text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground">
            PONTO DE PARTIDA: {fundoInicial.ticker}
          </h2>
          <HelpTip text="Cálculo do mínimo de cotas para que o dividendo mensal recebido cubra o preço de uma nova cota — ponto onde a 'roda' começa a girar sozinha." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-muted-foreground font-body text-sm flex items-center gap-1">
              Preço da Cota <HelpTip text="Cotação de mercado atual de uma cota deste FII." />
            </p>
            <p className="font-display text-xl font-bold text-foreground">R$ {fundoInicial.price.toFixed(2)}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-muted-foreground font-body text-sm flex items-center gap-1">
              Dividendo/Cota <HelpTip text="Último provento pago por cota neste FII." />
            </p>
            <p className="font-display text-xl font-bold text-success">R$ {fundoInicial.lastDividend.toFixed(2)}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-muted-foreground font-body text-sm flex items-center gap-1">
              Cotas p/ Auto-Sustento <HelpTip text="Quantidade mínima de cotas para que o dividendo mensal compre 1 nova cota automaticamente." />
            </p>
            <p className="font-display text-xl font-bold text-primary">{cotasAutoSustento}</p>
          </div>
        </div>
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <p className="font-body text-lg text-foreground">
            <Zap className="w-5 h-5 text-primary inline mr-2" />
            Com <span className="text-primary font-bold">{cotasAutoSustento} cotas</span> (investimento de{" "}
            <span className="text-primary font-bold">R$ {valorNecessario.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>),
            o dividendo mensal de{" "}
            <span className="text-success font-bold">R$ {(cotasAutoSustento * fundoInicial.lastDividend).toFixed(2)}</span>{" "}
            será suficiente para comprar 1 nova cota automaticamente!
          </p>
        </div>
      </motion.div>

      {/* Valor inicial da simulação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-muted-foreground font-body text-sm block flex items-center gap-1">
              Valor Inicial para Simular (R$)
              <HelpTip text="Valor disponível para investir agora. As 3 estratégias abaixo recalculam automaticamente." />
            </label>
            <input
              type="number"
              value={valorInicial}
              onChange={e => setValorInicial(Number(e.target.value) || 0)}
              className="w-48 px-3 py-2 bg-secondary rounded-lg text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary text-lg"
            />
          </div>
          <p className="font-body text-sm text-muted-foreground max-w-xl">
            A estratégia visa <span className="text-primary font-semibold">aumentar o patrimônio sem perder financeiramente</span>{" "}
            recebendo a maior quantidade possível de dividendos — idealmente em datas diferentes para fluxo quase diário.
          </p>
        </div>
      </motion.div>

      {/* 3 quadros de estratégia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {estrategias.map((est, idx) => {
          const Icon = est.icone;
          const totalCusto = est.alocacoes.reduce((s, a) => s + a.custo, 0);
          const totalDiv = est.alocacoes.reduce((s, a) => s + a.dividendoMensal, 0);
          const sobra = valorInicial - totalCusto;
          return (
            <motion.div
              key={est.titulo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass rounded-xl p-5 border ${est.borderClass} flex flex-col`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-5 h-5 ${est.iconClass}`} />
                <h3 className={`font-display text-sm font-bold ${est.titleClass}`}>{est.titulo}</h3>
              </div>
              <p className="font-body text-sm text-foreground font-semibold mb-1">{est.subtitulo}</p>
              <p className="font-body text-xs text-muted-foreground mb-4">{est.descricao}</p>

              <div className="space-y-2 flex-1">
                {est.alocacoes.map(a => (
                  <div key={a.fundo.ticker} className="bg-secondary/40 rounded-lg p-3 border border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-display font-bold text-primary">{a.fundo.ticker}</span>
                      <span className="text-xs font-body text-muted-foreground">{a.fundo.sector}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-body">
                      <div>
                        <span className="text-muted-foreground">Cotas:</span>{" "}
                        <span className="text-foreground font-bold">{a.cotas}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Preço:</span>{" "}
                        <span className="text-foreground">R$ {a.fundo.price.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Custo:</span>{" "}
                        <span className="text-foreground">R$ {a.custo.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Div/mês:</span>{" "}
                        <span className="text-success font-bold">R$ {a.dividendoMensal.toFixed(2)}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Data Com:</span>{" "}
                        <span className="text-foreground">
                          {new Date(a.fundo.dataCom).toLocaleDateString("pt-BR")}
                        </span>{" "}
                        <span className="text-muted-foreground">| Pgto:</span>{" "}
                        <span className="text-foreground">
                          {new Date(a.fundo.dataPayment).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-border space-y-1 text-xs font-body">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total alocado:</span>
                  <span className="text-foreground font-bold">R$ {totalCusto.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sobra em caixa:</span>
                  <span className="text-foreground">R$ {sobra.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Dividendo mensal estimado:
                    <HelpTip text="Soma do último dividendo pago por cada FII multiplicado pelas cotas alocadas." />
                  </span>
                  <span className="text-success font-bold">R$ {totalDiv.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tabela consolidada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display text-xl font-bold text-foreground">📋 ATIVOS ANALISADOS E INDICADOS</h2>
          <HelpTip text="Tabela consolidada com todos os ativos sugeridos pelas 3 estratégias. Use para comparar com a sua carteira atual em 'Bilhete Premiado'." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">ORIGEM</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">TICKER</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">PREÇO</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">DY</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">COTAS</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">CUSTO</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">DIV/MÊS</th>
                <th className="text-left py-3 px-3 font-display text-xs text-muted-foreground">DATA COM</th>
              </tr>
            </thead>
            <tbody>
              {ativosIndicados.map((a, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-all">
                  <td className="py-3 px-3 font-body text-xs text-muted-foreground">{a.origem}</td>
                  <td className="py-3 px-3 font-body font-bold text-primary">{a.fundo.ticker}</td>
                  <td className="py-3 px-3 font-body">R$ {a.fundo.price.toFixed(2)}</td>
                  <td className="py-3 px-3 font-body text-success font-bold">{a.fundo.dividendYield}%</td>
                  <td className="py-3 px-3 font-body font-bold">{a.cotas}</td>
                  <td className="py-3 px-3 font-body">R$ {a.custo.toFixed(2)}</td>
                  <td className="py-3 px-3 font-body text-success font-bold">R$ {a.dividendoMensal.toFixed(2)}</td>
                  <td className="py-3 px-3 font-body">{new Date(a.fundo.dataCom).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Calendário Data Com (mantido) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-xl font-bold text-foreground mb-4">📅 CALENDÁRIO DATA COM — FIIs</h2>
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
                .map(fii => (
                  <tr key={fii.ticker} className="border-b border-border/50 hover:bg-secondary/30 transition-all">
                    <td className="py-3 px-3 font-body font-bold text-primary">{fii.ticker}</td>
                    <td className="py-3 px-3 font-body text-foreground">{fii.name}</td>
                    <td className="py-3 px-3 font-body">R$ {fii.price.toFixed(2)}</td>
                    <td className="py-3 px-3 font-body text-success font-bold">{fii.dividendYield}%</td>
                    <td className="py-3 px-3 font-body">R$ {fii.lastDividend.toFixed(2)}</td>
                    <td className="py-3 px-3 font-body">{new Date(fii.dataCom).toLocaleDateString("pt-BR")}</td>
                    <td className="py-3 px-3 font-body">{new Date(fii.dataPayment).toLocaleDateString("pt-BR")}</td>
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
