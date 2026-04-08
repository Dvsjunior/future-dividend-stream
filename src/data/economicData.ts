export interface EconomicIndicator {
  name: string;
  value: number;
  unit: string;
  change: number;
  period: string;
  description: string;
}

export interface Currency {
  code: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  change: number;
  changePercent: number;
  impact: string;
}

export interface RateHistory {
  month: string;
  selic: number;
  cdi: number;
  ipca: number;
}

export const taxaJuros: EconomicIndicator[] = [
  {
    name: "SELIC (Meta)",
    value: 14.25,
    unit: "% a.a.",
    change: 0.50,
    period: "Mar/2026",
    description: "Taxa básica de juros da economia brasileira, definida pelo COPOM. Influencia todas as demais taxas do mercado."
  },
  {
    name: "CDI",
    value: 14.15,
    unit: "% a.a.",
    change: 0.48,
    period: "Abr/2026",
    description: "Certificado de Depósito Interbancário. Referência para investimentos de renda fixa. Acompanha de perto a SELIC."
  },
  {
    name: "DI (Taxa)",
    value: 14.13,
    unit: "% a.a.",
    change: 0.45,
    period: "Abr/2026",
    description: "Taxa DI Over, usada como referência para CDBs, LCIs, LCAs e fundos de renda fixa."
  },
  {
    name: "CDB (Médio)",
    value: 110,
    unit: "% CDI",
    change: 2.0,
    period: "Abr/2026",
    description: "Rendimento médio dos CDBs de bancos médios. Quanto maior o percentual do CDI, melhor o retorno."
  },
  {
    name: "IPCA (12m)",
    value: 5.48,
    unit: "% a.a.",
    change: 0.12,
    period: "Mar/2026",
    description: "Índice de Preços ao Consumidor Amplo. Principal indicador de inflação do Brasil."
  },
  {
    name: "IGP-M (12m)",
    value: 4.85,
    unit: "% a.a.",
    change: -0.32,
    period: "Mar/2026",
    description: "Índice Geral de Preços do Mercado. Usado para reajuste de aluguéis e contratos."
  },
  {
    name: "Juro Real",
    value: 8.32,
    unit: "% a.a.",
    change: 0.38,
    period: "Abr/2026",
    description: "SELIC descontada da inflação. Indica o ganho real do investidor em renda fixa."
  },
  {
    name: "TR (Taxa Referencial)",
    value: 0.18,
    unit: "% a.m.",
    change: 0.02,
    period: "Abr/2026",
    description: "Taxa Referencial. Usada para correção da poupança e do FGTS."
  },
];

export const moedas: Currency[] = [
  {
    code: "USD",
    name: "Dólar Americano",
    buyPrice: 5.72,
    sellPrice: 5.73,
    change: -0.08,
    changePercent: -1.38,
    impact: "A queda do dólar reduz pressão inflacionária sobre importados, barateando combustíveis e eletrônicos. Favorece empresas com receita em real e prejudica exportadoras como VALE3 e SUZB3."
  },
  {
    code: "EUR",
    name: "Euro",
    buyPrice: 6.28,
    sellPrice: 6.30,
    change: 0.05,
    changePercent: 0.80,
    impact: "Euro em alta encarece viagens à Europa e importações europeias. Beneficia exportadores brasileiros para a zona do Euro."
  },
  {
    code: "GBP",
    name: "Libra Esterlina",
    buyPrice: 7.35,
    sellPrice: 7.38,
    change: 0.12,
    changePercent: 1.65,
    impact: "Libra forte reflete estabilidade britânica. Impacto limitado na economia brasileira, mas relevante para comércio bilateral."
  },
  {
    code: "ARS",
    name: "Peso Argentino",
    buyPrice: 0.0052,
    sellPrice: 0.0054,
    change: -0.0003,
    changePercent: -5.45,
    impact: "Peso fraco impacta exportações brasileiras para Argentina, reduzindo competitividade de produtos brasileiros no Mercosul."
  },
  {
    code: "CNY",
    name: "Yuan Chinês",
    buyPrice: 0.79,
    sellPrice: 0.80,
    change: 0.01,
    changePercent: 1.27,
    impact: "China é o maior parceiro comercial do Brasil. Yuan forte valoriza exportações de minério de ferro e soja, beneficiando VALE3, SLCE3 e SUZB3."
  },
  {
    code: "JPY",
    name: "Iene Japonês",
    buyPrice: 0.038,
    sellPrice: 0.039,
    change: -0.001,
    changePercent: -2.56,
    impact: "Iene fraco torna investimentos japoneses no Brasil mais atrativos. Impacto direto no setor automotivo e tecnológico."
  },
  {
    code: "BTC",
    name: "Bitcoin",
    buyPrice: 520000,
    sellPrice: 522000,
    change: 15000,
    changePercent: 2.96,
    impact: "Criptomoeda descorrelacionada da economia tradicional. Alta do Bitcoin atrai capital de risco e pode reduzir fluxo para renda variável brasileira."
  },
];

export const historicoTaxas: RateHistory[] = [
  { month: "Mai/25", selic: 14.75, cdi: 14.65, ipca: 5.90 },
  { month: "Jun/25", selic: 14.75, cdi: 14.65, ipca: 5.75 },
  { month: "Jul/25", selic: 14.75, cdi: 14.65, ipca: 5.60 },
  { month: "Ago/25", selic: 14.75, cdi: 14.65, ipca: 5.55 },
  { month: "Set/25", selic: 14.50, cdi: 14.40, ipca: 5.50 },
  { month: "Out/25", selic: 14.50, cdi: 14.40, ipca: 5.45 },
  { month: "Nov/25", selic: 14.25, cdi: 14.15, ipca: 5.40 },
  { month: "Dez/25", selic: 14.25, cdi: 14.15, ipca: 5.38 },
  { month: "Jan/26", selic: 14.00, cdi: 13.90, ipca: 5.42 },
  { month: "Fev/26", selic: 13.75, cdi: 13.65, ipca: 5.45 },
  { month: "Mar/26", selic: 14.25, cdi: 14.15, ipca: 5.48 },
  { month: "Abr/26", selic: 14.25, cdi: 14.15, ipca: 5.50 },
];

export interface ImpactAnalysis {
  title: string;
  indicator: string;
  scenario: string;
  effects: string[];
  recommendation: string;
  sentiment: "positive" | "negative" | "neutral";
}

export const impactAnalyses: ImpactAnalysis[] = [
  {
    title: "SELIC em Alta",
    indicator: "SELIC 14.25%",
    scenario: "Taxa Selic elevada para conter inflação",
    effects: [
      "Renda fixa mais atrativa: CDBs, Tesouro Selic e LCIs pagam mais",
      "Crédito mais caro: financiamentos e empréstimos com juros altos",
      "Bolsa de valores tende a cair — investidores migram para renda fixa",
      "FIIs de papel (CRIs) se beneficiam com rendimentos atrelados ao CDI",
      "FIIs de tijolo sofrem com vacância e desvalorização",
    ],
    recommendation: "Priorize renda fixa pós-fixada (Tesouro Selic, CDBs 100%+ CDI). Em FIIs, prefira fundos de papel (MXRF11, IRDM11, CPTS11).",
    sentiment: "neutral",
  },
  {
    title: "Dólar em Queda",
    indicator: "USD R$ 5.72",
    scenario: "Real se fortalecendo frente ao dólar",
    effects: [
      "Importações mais baratas: combustíveis, eletrônicos e insumos",
      "Pressão inflacionária reduzida — pode antecipar corte na Selic",
      "Exportadoras como VALE3 e SUZB3 têm receita em dólar reduzida",
      "Empresas com dívida em dólar se beneficiam (AZUL4, GOLL4)",
      "Turismo internacional fica mais acessível",
    ],
    recommendation: "Reduza exposição a exportadoras. Aumente posição em empresas com receita doméstica e dívida em dólar.",
    sentiment: "positive",
  },
  {
    title: "Inflação Persistente",
    indicator: "IPCA 5.48%",
    scenario: "Inflação acima da meta do Banco Central (3.0%)",
    effects: [
      "Banco Central mantém ou sobe juros — renda fixa favorecida",
      "Poder de compra do consumidor reduzido",
      "Investimentos atrelados ao IPCA (Tesouro IPCA+) protegem patrimônio",
      "Setores de consumo (MGLU3, VIIA3) sofrem com queda na demanda",
      "Aluguéis e FIIs de tijolo podem reajustar acima da inflação",
    ],
    recommendation: "Aloque em Tesouro IPCA+ e FIIs de papel com receita indexada à inflação. Evite varejo e consumo discricionário.",
    sentiment: "negative",
  },
  {
    title: "Yuan Forte",
    indicator: "CNY R$ 0.79",
    scenario: "Moeda chinesa se valorizando",
    effects: [
      "Exportações de commodities brasileiras ficam mais caras para a China",
      "Demanda chinesa por minério e soja pode reduzir no curto prazo",
      "VALE3 e empresas de agronegócio podem ser impactadas",
      "Investimentos chineses no Brasil podem aumentar",
      "Balança comercial brasileira pode ser afetada",
    ],
    recommendation: "Monitore de perto VALE3 e SLCE3. Diversifique em setores menos dependentes da China.",
    sentiment: "neutral",
  },
];
