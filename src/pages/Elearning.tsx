import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, TrendingUp, Shield, Calculator as CalcIcon, Brain, Coins, Building2, Bitcoin, PieChart, Lightbulb, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HelpTip from "@/components/HelpTip";

interface Modulo {
  modulo: number;
  titulo: string;
  parte: "Educação Financeira" | "Investimentos";
  icon: any;
  resumo: string;
  conceitos: { label: string; texto: string }[];
  pratica?: string;
  exemplos?: string[];
  tags: string[];
}

const modulos: Modulo[] = [
  {
    modulo: 1, parte: "Educação Financeira", icon: Brain,
    titulo: "O Algoritmo da Mentalidade Financeira",
    resumo: "Ajustar o mindset para enxergar dinheiro como ferramenta de escala, não consumo.",
    conceitos: [
      { label: "Passivos vs Ativos", texto: "Ativo coloca dinheiro no seu bolso; passivo retira. O carro novo é passivo, o aluguel recebido é ativo." },
      { label: "Regra 50-30-20", texto: "50% essenciais, 30% desejos, 20% investimentos. Base de qualquer orçamento saudável." },
    ],
    pratica: "Monte seu orçamento usando a regra 50-30-20 e classifique cada gasto como ativo ou passivo.",
    tags: ["Mindset", "Orçamento"],
  },
  {
    modulo: 2, parte: "Educação Financeira", icon: Shield,
    titulo: "Gestão de Fluxo e Reserva de Contingência",
    resumo: "Blindagem contra imprevistos antes de buscar risco.",
    conceitos: [
      { label: "Liquidez", texto: "Reserva fica em Tesouro Selic, CDB liquidez diária ou conta remunerada — dinheiro que pode sair amanhã." },
      { label: "Cálculo da reserva", texto: "Custo de vida mensal × 6 meses (autônomo: × 12)." },
    ],
    tags: ["Segurança", "Liquidez"],
  },
  {
    modulo: 3, parte: "Educação Financeira", icon: TrendingUp,
    titulo: "Matemática do Crescimento (Juros Compostos)",
    resumo: "Tempo potencializa capital. Inflação corrói. Entenda os dois lados.",
    conceitos: [
      { label: "Fórmula", texto: "A = P(1 + r)ⁿ — onde P é principal, r taxa por período e n número de períodos." },
      { label: "Inflação (IPCA)", texto: "O ganho real é (1 + nominal) / (1 + inflação) − 1. Sempre compare com o IPCA." },
    ],
    pratica: "Simule R$ 1.000 a 1% a.m. por 30 anos vs poupança. A diferença é exponencial.",
    tags: ["Matemática", "Tempo"],
  },
  {
    modulo: 4, parte: "Educação Financeira", icon: Building2,
    titulo: "Alavancagem com Consórcios (Avançado)",
    resumo: "Autofinanciamento sem juros abusivos — usado para alavancar patrimônio e gerar caixa.",
    conceitos: [
      { label: "Alavancagem patrimonial", texto: "Comprar imóvel via consórcio e usar o aluguel para pagar parcelas. Ao fim, ativo quitado com fração do valor." },
      { label: "Lance embutido", texto: "Usar parte do próprio crédito como lance, acelerando contemplação sem desembolso adicional." },
      { label: "Alavancagem financeira", texto: "Vender carta contemplada com ágio (ex: pagou R$ 20k, vende por R$ 35k uma carta de R$ 100k)." },
      { label: "Custo de oportunidade", texto: "Manter capital aplicado rendendo enquanto consórcio paga o bem em parcelas com taxa menor que o rendimento." },
    ],
    tags: ["Avançado", "Alavancagem"],
  },
  {
    modulo: 5, parte: "Educação Financeira", icon: Brain,
    titulo: "Psicologia do Investidor e Gestão de Risco",
    resumo: "O maior inimigo do investidor é ele mesmo.",
    conceitos: [
      { label: "Vieses cognitivos", texto: "FOMO, ancoragem, manada — reconheça antes de operar." },
      { label: "Stop loss mental", texto: "Defina antes da compra o ponto onde admite o erro e sai." },
      { label: "Rebalanceamento", texto: "Reposicionar a carteira para os pesos-alvo — venda automática do que subiu, compra do que caiu." },
    ],
    tags: ["Psicologia", "Risco"],
  },
  {
    modulo: 6, parte: "Investimentos", icon: Shield,
    titulo: "Renda Fixa (O Porto Seguro)",
    resumo: "Base de qualquer carteira. Previsível, regulada, com proteção FGC nos bancos.",
    conceitos: [
      { label: "Tesouro Direto", texto: "Selic (pós-fixado, liquidez), IPCA+ (proteção inflação), Pré (trava taxa)." },
      { label: "Crédito privado", texto: "CDBs, LCIs, LCAs (isentas de IR), Debêntures incentivadas." },
      { label: "Marcação a mercado", texto: "Em pré-fixados e IPCA+, queda de juros valoriza o título — possível lucro antes do vencimento." },
    ],
    exemplos: ["Tesouro Selic 2029", "CDB 110% CDI Banco Médio", "LCA 95% CDI isenta", "Debênture incentivada Eletrobras"],
    tags: ["Renda Fixa", "Conservador"],
  },
  {
    modulo: 7, parte: "Investimentos", icon: TrendingUp,
    titulo: "Renda Variável e Small Caps",
    resumo: "Empresas com baixa capitalização (R$ 500M – R$ 2B) e alto potencial de crescimento.",
    conceitos: [
      { label: "Análise fundamentalista", texto: "Foco em growth: receita e EBITDA crescendo dois dígitos consistentemente." },
      { label: "Liquidez", texto: "Volume baixo: cuidado ao montar/desmontar posições grandes." },
      { label: "Vias de acesso", texto: "Direta via home broker (tickers) ou ETFs (índice SMLL para diversificação)." },
    ],
    exemplos: ["Tecnologia/SaaS regional", "Varejo especializado em expansão", "Logística de nicho (agro)", "ETF SMLL11"],
    tags: ["Crescimento", "Alto Risco"],
  },
  {
    modulo: 8, parte: "Investimentos", icon: Building2,
    titulo: "Real Estate e Ativos Físicos (FIIs)",
    resumo: "Receba aluguéis mensais sem ter imóvel físico — e sem IR para PF.",
    conceitos: [
      { label: "Tijolo vs Papel", texto: "Tijolo: galpões, shoppings, lajes. Papel: CRIs e LCIs com receita atrelada a CDI/IPCA." },
      { label: "Vantagem fiscal", texto: "Dividendos isentos de IR para pessoa física (regra atual)." },
    ],
    exemplos: ["MXRF11 (Papel)", "HGLG11 (Logística)", "XPML11 (Shopping)", "KNRI11 (Híbrido)", "IRDM11 (Recebíveis)"],
    tags: ["FIIs", "Renda Mensal"],
  },
  {
    modulo: 9, parte: "Investimentos", icon: Bitcoin,
    titulo: "A Fronteira Cripto",
    resumo: "Alta volatilidade, alto potencial. Aloque pequena fração e estude custódia.",
    conceitos: [
      { label: "Bitcoin", texto: "Ouro digital, reserva de valor, oferta limitada em 21 milhões." },
      { label: "Ethereum", texto: "Smart contracts, DeFi, NFTs — base programável da Web3." },
      { label: "Altcoins/Memecoins", texto: "Risco extremo de liquidez e rug pull. Posição pequena, prazo curto." },
      { label: "Custódia", texto: "Exchanges (praticidade) vs Cold Wallets (segurança máxima — Ledger/Trezor)." },
    ],
    exemplos: ["BTC", "ETH", "SOL", "Stablecoins (USDC) para giro"],
    tags: ["Cripto", "Volátil"],
  },
  {
    modulo: 10, parte: "Investimentos", icon: PieChart,
    titulo: "Construção de Portfólio",
    resumo: "Diversificação é o único almoço grátis do mercado.",
    conceitos: [
      { label: "Conservador", texto: "70% RF, 20% FIIs, 10% RV. Foco em preservação." },
      { label: "Moderado", texto: "40% RF, 25% FIIs, 25% RV, 10% internacional/cripto." },
      { label: "Arrojado", texto: "20% RF, 20% FIIs, 40% RV, 15% internacional, 5% cripto." },
      { label: "Monitoramento", texto: "Use a própria plataforma para acompanhar KPIs em tempo real e disparar rebalanceamentos." },
    ],
    tags: ["Portfólio", "Diversificação"],
  },
];

const Elearning = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  // Calculadora de alavancagem
  const [calc, setCalc] = useState({ valorCarta: 200000, taxaAdm: 18, prazoMeses: 120, lance: 20000, aluguel: 1500 });
  const calcResult = useMemo(() => {
    const custoTotal = calc.valorCarta * (1 + calc.taxaAdm / 100);
    const parcela = (custoTotal - calc.lance) / calc.prazoMeses;
    const fluxoLiquido = calc.aluguel - parcela; // positivo = aluguel paga parcela
    const cobertura = calc.aluguel > 0 ? (calc.aluguel / parcela) * 100 : 0;
    const roiAnualEstimado = calc.lance > 0 ? ((calc.aluguel * 12) / calc.lance) * 100 : 0;
    const tempoQuitacaoFluxo = fluxoLiquido > 0 ? (custoTotal - calc.lance) / (calc.aluguel * 12) : null;
    return { custoTotal, parcela, fluxoLiquido, cobertura, roiAnualEstimado, tempoQuitacaoFluxo };
  }, [calc]);

  const renderModulos = (parte: Modulo["parte"]) => (
    <div className="space-y-3">
      {modulos.filter(m => m.parte === parte).map((m, i) => {
        const open = openId === m.modulo;
        const Icon = m.icon;
        return (
          <motion.div
            key={m.modulo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-xl border border-border hover:border-primary/30 transition-all"
          >
            <button
              onClick={() => setOpenId(open ? null : m.modulo)}
              className="w-full p-5 flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-display text-xs text-primary">MÓDULO {m.modulo}</p>
                <h3 className="font-display text-lg font-bold text-foreground">{m.titulo}</h3>
                <p className="font-body text-sm text-muted-foreground mt-1">{m.resumo}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {m.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-display">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="px-5 pb-5 border-t border-border"
              >
                <div className="grid md:grid-cols-2 gap-3 mt-4">
                  {m.conceitos.map(c => (
                    <div key={c.label} className="bg-secondary/40 rounded-lg p-3">
                      <p className="font-display text-xs font-bold text-primary mb-1">{c.label}</p>
                      <p className="font-body text-sm text-foreground leading-relaxed">{c.texto}</p>
                    </div>
                  ))}
                </div>
                {m.pratica && (
                  <div className="mt-3 rounded-lg p-3 border border-primary/20 bg-primary/5">
                    <p className="font-display text-xs font-bold text-primary mb-1">🎯 PRÁTICA</p>
                    <p className="font-body text-sm text-foreground">{m.pratica}</p>
                  </div>
                )}
                {m.exemplos && (
                  <div className="mt-3">
                    <p className="font-display text-xs text-muted-foreground mb-2">EXEMPLOS PRÁTICOS</p>
                    <div className="flex flex-wrap gap-2">
                      {m.exemplos.map(e => (
                        <span key={e} className="px-3 py-1 rounded-md bg-secondary border border-border text-sm font-body">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
        <GraduationCap className="w-8 h-8 text-primary" />
        <h1 className="font-display text-3xl font-bold text-gradient">E-LEARNING FINANCEIRO</h1>
      </motion.div>
      <p className="font-body text-muted-foreground -mt-3">
        Trilha modular do básico ao avançado: educação financeira → execução de investimentos.
      </p>

      <Tabs defaultValue="parte1" className="w-full">
        <TabsList className="glass border border-border">
          <TabsTrigger value="parte1" className="font-display text-xs data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="w-4 h-4 mr-1" /> PARTE 1 — EDUCAÇÃO
          </TabsTrigger>
          <TabsTrigger value="parte2" className="font-display text-xs data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <Coins className="w-4 h-4 mr-1" /> PARTE 2 — INVESTIMENTOS
          </TabsTrigger>
          <TabsTrigger value="calc" className="font-display text-xs data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <CalcIcon className="w-4 h-4 mr-1" /> CALCULADORA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parte1" className="mt-4">{renderModulos("Educação Financeira")}</TabsContent>
        <TabsContent value="parte2" className="mt-4">{renderModulos("Investimentos")}</TabsContent>

        <TabsContent value="calc" className="mt-4">
          <div className="glass rounded-xl p-6 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-foreground">CALCULADORA DE ALAVANCAGEM (CONSÓRCIO)</h2>
              <HelpTip text="Simula a viabilidade de comprar um bem via consórcio e usar o aluguel para cobrir parcelas. ROI estimado considera o lance como capital investido." />
            </div>
            <p className="font-body text-sm text-muted-foreground mb-4">
              Avalie se o aluguel cobre a parcela do consórcio e qual o retorno sobre o lance investido.
            </p>

            <div className="grid md:grid-cols-5 gap-3 mb-6">
              {[
                { k: "valorCarta", label: "Valor da Carta (R$)", help: "Valor de crédito do consórcio." },
                { k: "taxaAdm", label: "Taxa Adm. Total (%)", help: "Taxa de administração somada ao longo do contrato." },
                { k: "prazoMeses", label: "Prazo (meses)", help: "Quantidade de parcelas do grupo." },
                { k: "lance", label: "Lance Embutido (R$)", help: "Quanto você dará de lance — entra como capital investido no ROI." },
                { k: "aluguel", label: "Aluguel Mensal (R$)", help: "Receita esperada do imóvel adquirido." },
              ].map(f => (
                <div key={f.k}>
                  <label className="font-body text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    {f.label} <HelpTip text={f.help} />
                  </label>
                  <Input
                    type="number"
                    value={(calc as any)[f.k]}
                    onChange={e => setCalc(c => ({ ...c, [f.k]: parseFloat(e.target.value) || 0 }))}
                    className="font-body bg-secondary/50"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs font-body text-muted-foreground">Custo Total</p>
                <p className="font-display font-bold text-foreground">R$ {calcResult.custoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs font-body text-muted-foreground">Parcela</p>
                <p className="font-display font-bold text-foreground">R$ {calcResult.parcela.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs font-body text-muted-foreground">Cobertura Aluguel</p>
                <p className={`font-display font-bold ${calcResult.cobertura >= 100 ? "text-success" : "text-warning"}`}>
                  {calcResult.cobertura.toFixed(1)}%
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs font-body text-muted-foreground">Fluxo Líquido/mês</p>
                <p className={`font-display font-bold ${calcResult.fluxoLiquido >= 0 ? "text-success" : "text-destructive"}`}>
                  R$ {calcResult.fluxoLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs font-body text-muted-foreground">ROI anual s/ lance</p>
                <p className="font-display font-bold text-primary">{calcResult.roiAnualEstimado.toFixed(2)}%</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg p-4 border border-primary/20 bg-primary/5">
              <p className="font-display text-xs font-bold text-primary mb-1">💡 CONCLUSÃO</p>
              <p className="font-body text-sm text-foreground">
                {calcResult.cobertura >= 100
                  ? `O aluguel cobre integralmente a parcela. Estratégia patrimonial viável: ROI estimado de ${calcResult.roiAnualEstimado.toFixed(2)}% a.a. sobre o lance.`
                  : `O aluguel cobre apenas ${calcResult.cobertura.toFixed(1)}% da parcela. Você precisará desembolsar R$ ${Math.abs(calcResult.fluxoLiquido).toFixed(2)}/mês — avalie se compensa pela formação de patrimônio.`}
                {calcResult.tempoQuitacaoFluxo && ` Tempo aproximado para quitar via fluxo do aluguel: ${calcResult.tempoQuitacaoFluxo.toFixed(1)} anos.`}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Elearning;
