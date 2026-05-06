export interface EconomicIndicator {
  name: string;
  value: number;
  unit: string;
  change: number;
  period: string;
  description: string;
  ativosRelacionados?: { ticker: string; motivo: string }[];
}

export interface Currency {
  code: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  change: number;
  changePercent: number;
  impact: string;
  ativosRelacionados?: { ticker: string; motivo: string }[];
}

export interface RateHistory {
  month: string;
  selic: number;
  cdi: number;
  ipca: number;
}

export interface FuturoContrato {
  code: string;
  name: string;
  vencimento: string;
  spotPrice: number;
  futurePrice: number;
  basis: number; // futuro - spot
  basisPct: number;
  description: string;
  interpretation: string;
}

export const taxaJuros: EconomicIndicator[] = [
  {
    name: "SELIC (Meta)", value: 14.25, unit: "% a.a.", change: 0.50, period: "Mar/2026",
    description: "Taxa básica de juros da economia brasileira, definida pelo COPOM. Influencia todas as demais taxas do mercado.",
    ativosRelacionados: [
      { ticker: "ITUB4", motivo: "Bancos lucram com spread bancário em juros altos" },
      { ticker: "BBDC4", motivo: "Bradesco se beneficia de margens elevadas" },
      { ticker: "BBAS3", motivo: "Banco do Brasil amplia rentabilidade do crédito" },
      { ticker: "SANB11", motivo: "Santander captura spreads maiores" },
      { ticker: "B3SA3", motivo: "B3 ganha com mais volume em renda fixa" },
    ],
  },
  {
    name: "CDI", value: 14.15, unit: "% a.a.", change: 0.48, period: "Abr/2026",
    description: "Certificado de Depósito Interbancário. Referência para investimentos de renda fixa. Acompanha de perto a SELIC.",
    ativosRelacionados: [
      { ticker: "MXRF11", motivo: "FII de papel com receita indexada ao CDI" },
      { ticker: "IRDM11", motivo: "Iridium recebíveis atrelados ao CDI" },
      { ticker: "CPTS11", motivo: "Capitânia se beneficia de CDI alto" },
      { ticker: "RECR11", motivo: "REC Recebíveis com renda CDI+" },
      { ticker: "KNCR11", motivo: "Kinea Crédito Imobiliário 100% CDI" },
    ],
  },
  {
    name: "DI (Taxa)", value: 14.13, unit: "% a.a.", change: 0.45, period: "Abr/2026",
    description: "Taxa DI Over, usada como referência para CDBs, LCIs, LCAs e fundos de renda fixa.",
    ativosRelacionados: [
      { ticker: "ITSA4", motivo: "Holding de bancos beneficiada pelo DI alto" },
      { ticker: "BPAC11", motivo: "BTG Pactual captura spreads de DI" },
      { ticker: "BBSE3", motivo: "BB Seguridade investe reservas em DI" },
      { ticker: "PSSA3", motivo: "Porto Seguro com float em DI" },
      { ticker: "CXSE3", motivo: "Caixa Seguridade aplica reservas técnicas" },
    ],
  },
  {
    name: "CDB (Médio)", value: 110, unit: "% CDI", change: 2.0, period: "Abr/2026",
    description: "Rendimento médio dos CDBs de bancos médios. Quanto maior o percentual do CDI, melhor o retorno.",
    ativosRelacionados: [
      { ticker: "BPAN4", motivo: "Banco Pan emite CDBs competitivos" },
      { ticker: "BMGB4", motivo: "Banco BMG capta via CDB" },
      { ticker: "BRSR6", motivo: "Banrisul ativo no mercado de CDB" },
      { ticker: "BIDI11", motivo: "Inter capta com CDBs e LCIs" },
      { ticker: "MODL11", motivo: "Modal capta via CDBs de longo prazo" },
    ],
  },
  {
    name: "IPCA (12m)", value: 5.48, unit: "% a.a.", change: 0.12, period: "Mar/2026",
    description: "Índice de Preços ao Consumidor Amplo. Principal indicador de inflação do Brasil.",
    ativosRelacionados: [
      { ticker: "TAEE11", motivo: "Taesa tem receita reajustada por IPCA" },
      { ticker: "TRPL4", motivo: "ISA CTEEP indexada a IPCA" },
      { ticker: "ENBR3", motivo: "EDP Brasil tarifas reajustadas pelo IPCA" },
      { ticker: "SBSP3", motivo: "Sabesp tarifa de saneamento indexada" },
      { ticker: "CPLE6", motivo: "Copel reajustes regulatórios IPCA" },
    ],
  },
  {
    name: "IGP-M (12m)", value: 4.85, unit: "% a.a.", change: -0.32, period: "Mar/2026",
    description: "Índice Geral de Preços do Mercado. Usado para reajuste de aluguéis e contratos.",
    ativosRelacionados: [
      { ticker: "HGLG11", motivo: "FII logístico com aluguéis indexados ao IGP-M" },
      { ticker: "BRCR11", motivo: "BTG Corporate reajusta aluguéis pelo IGP-M" },
      { ticker: "KNRI11", motivo: "Kinea Renda Imobiliária com contratos IGP-M" },
      { ticker: "VISC11", motivo: "Vinci Shopping reajustes de luvas" },
      { ticker: "XPML11", motivo: "XP Malls reajusta aluguel de lojas" },
    ],
  },
  {
    name: "Juro Real", value: 8.32, unit: "% a.a.", change: 0.38, period: "Abr/2026",
    description: "SELIC descontada da inflação. Indica o ganho real do investidor em renda fixa.",
    ativosRelacionados: [
      { ticker: "NTN-B 2030", motivo: "Tesouro IPCA+ trava juro real elevado" },
      { ticker: "NTN-B 2045", motivo: "Tesouro IPCA+ longo prazo com juro real alto" },
      { ticker: "B3SA3", motivo: "B3 lucra com volume em Tesouro Direto" },
      { ticker: "ITUB4", motivo: "Bancos com tesouraria em juro real" },
      { ticker: "BBSE3", motivo: "BB Seguridade aloca em IPCA+" },
    ],
  },
  {
    name: "TR (Taxa Referencial)", value: 0.18, unit: "% a.m.", change: 0.02, period: "Abr/2026",
    description: "Taxa Referencial. Usada para correção da poupança e do FGTS.",
    ativosRelacionados: [
      { ticker: "MRVE3", motivo: "MRV depende de financiamento via TR no MCMV" },
      { ticker: "CYRE3", motivo: "Cyrela com vendas atreladas a SBPE/TR" },
      { ticker: "EZTC3", motivo: "EzTec sensível a crédito imobiliário TR" },
      { ticker: "DIRR3", motivo: "Direcional foco baixa renda com TR" },
      { ticker: "TEND3", motivo: "Tenda atua MCMV com TR baixa" },
    ],
  },
];

export const moedas: Currency[] = [
  {
    code: "USD", name: "Dólar Americano", buyPrice: 5.72, sellPrice: 5.73, change: -0.08, changePercent: -1.38,
    impact: "A queda do dólar reduz pressão inflacionária sobre importados, barateando combustíveis e eletrônicos. Favorece empresas com receita em real e prejudica exportadoras como VALE3 e SUZB3.",
    ativosRelacionados: [
      { ticker: "VALE3", motivo: "Receita em USD — dólar fraco reduz lucro" },
      { ticker: "SUZB3", motivo: "Exportadora de celulose — sensível ao USD" },
      { ticker: "PETR4", motivo: "Petróleo cotado em USD impacta margens" },
      { ticker: "AZUL4", motivo: "Dívidas em USD — dólar fraco beneficia" },
      { ticker: "GOLL4", motivo: "Combustível e leasing em USD" },
    ],
  },
  {
    code: "EUR", name: "Euro", buyPrice: 6.28, sellPrice: 6.30, change: 0.05, changePercent: 0.80,
    impact: "Euro em alta encarece viagens à Europa e importações europeias. Beneficia exportadores brasileiros para a zona do Euro.",
    ativosRelacionados: [
      { ticker: "EMBR3", motivo: "Embraer exporta jatos para Europa" },
      { ticker: "JBSS3", motivo: "JBS vende carnes para zona do Euro" },
      { ticker: "MRFG3", motivo: "Marfrig com exportação para UE" },
      { ticker: "KLBN11", motivo: "Klabin exporta papel para Europa" },
      { ticker: "WEGE3", motivo: "WEG vende motores industriais na Europa" },
    ],
  },
  {
    code: "GBP", name: "Libra Esterlina", buyPrice: 7.35, sellPrice: 7.38, change: 0.12, changePercent: 1.65,
    impact: "Libra forte reflete estabilidade britânica. Impacto limitado na economia brasileira, mas relevante para comércio bilateral.",
    ativosRelacionados: [
      { ticker: "VALE3", motivo: "Vendas de minério para UK" },
      { ticker: "PETR4", motivo: "Operações com refinarias britânicas" },
      { ticker: "JBSS3", motivo: "Exportações de carne para UK pós-Brexit" },
      { ticker: "EMBR3", motivo: "Defesa: contratos com RAF" },
      { ticker: "BRFS3", motivo: "BRF com vendas para mercado britânico" },
    ],
  },
  {
    code: "ARS", name: "Peso Argentino", buyPrice: 0.0052, sellPrice: 0.0054, change: -0.0003, changePercent: -5.45,
    impact: "Peso fraco impacta exportações brasileiras para Argentina, reduzindo competitividade de produtos brasileiros no Mercosul.",
    ativosRelacionados: [
      { ticker: "ARZZ3", motivo: "Arezzo com operações na Argentina" },
      { ticker: "LREN3", motivo: "Renner com lojas em Buenos Aires" },
      { ticker: "AMBP3", motivo: "Ambipar com operações argentinas" },
      { ticker: "ITSA4", motivo: "Itaúsa exposição via Itaú Argentina" },
      { ticker: "VALE3", motivo: "Exportação de minério para Argentina" },
    ],
  },
  {
    code: "CNY", name: "Yuan Chinês", buyPrice: 0.79, sellPrice: 0.80, change: 0.01, changePercent: 1.27,
    impact: "China é o maior parceiro comercial do Brasil. Yuan forte valoriza exportações de minério de ferro e soja, beneficiando VALE3, SLCE3 e SUZB3.",
    ativosRelacionados: [
      { ticker: "VALE3", motivo: "Maior comprador chinês de minério" },
      { ticker: "SLCE3", motivo: "SLC Agrícola exporta soja para China" },
      { ticker: "SUZB3", motivo: "Suzano vende celulose para China" },
      { ticker: "JBSS3", motivo: "JBS exporta proteínas à China" },
      { ticker: "BRAP4", motivo: "Bradespar holding da Vale" },
    ],
  },
  {
    code: "JPY", name: "Iene Japonês", buyPrice: 0.038, sellPrice: 0.039, change: -0.001, changePercent: -2.56,
    impact: "Iene fraco torna investimentos japoneses no Brasil mais atrativos. Impacto direto no setor automotivo e tecnológico.",
    ativosRelacionados: [
      { ticker: "USIM5", motivo: "Usiminas é JV com Nippon Steel" },
      { ticker: "BRKM5", motivo: "Braskem com sócios asiáticos" },
      { ticker: "RAIZ4", motivo: "Raízen com tecnologia japonesa" },
      { ticker: "EMBR3", motivo: "Embraer vende jatos comerciais ao Japão" },
      { ticker: "KLBN11", motivo: "Klabin exporta papel ao Japão" },
    ],
  },
  {
    code: "BTC", name: "Bitcoin", buyPrice: 520000, sellPrice: 522000, change: 15000, changePercent: 2.96,
    impact: "Criptomoeda descorrelacionada da economia tradicional. Alta do Bitcoin atrai capital de risco e pode reduzir fluxo para renda variável brasileira.",
    ativosRelacionados: [
      { ticker: "MGLU3", motivo: "Magalu testa pagamentos cripto" },
      { ticker: "BIDI11", motivo: "Inter oferece compra de cripto no app" },
      { ticker: "MELI34", motivo: "Mercado Livre integra cripto via Mercado Pago" },
      { ticker: "B3SA3", motivo: "B3 estuda futuros e ETFs cripto" },
      { ticker: "HASH11", motivo: "ETF de criptoativos negociado na B3" },
    ],
  },
];

export const futuros: FuturoContrato[] = [
  {
    code: "WDO", name: "Mini Dólar Futuro", vencimento: "Jun/2026", spotPrice: 5.72, futurePrice: 5.78,
    basis: 0.06, basisPct: 1.05,
    description: "Contrato futuro de dólar reduzido (US$ 10 mil por contrato). Negociado na B3, usado para hedge e especulação de curto prazo.",
    interpretation: "Mercado precifica leve alta do dólar — diferencial de juros (cupom cambial) está positivo. Importadores podem travar custo via WDO.",
  },
  {
    code: "DOL", name: "Dólar Futuro Cheio", vencimento: "Jun/2026", spotPrice: 5.72, futurePrice: 5.78,
    basis: 0.06, basisPct: 1.05,
    description: "Contrato cheio de dólar (US$ 50 mil por contrato). Principal referência institucional do câmbio.",
    interpretation: "Spread futuro/spot mostra expectativa de moeda. Acima do spot = mercado vê real desvalorizando; abaixo = aposta em fortalecimento.",
  },
  {
    code: "BTC-PERP", name: "Bitcoin Perpétuo", vencimento: "Sem vencimento", spotPrice: 520000, futurePrice: 521800,
    basis: 1800, basisPct: 0.35,
    description: "Contrato perpétuo de Bitcoin com funding rate periódico. Não tem data de vencimento — funding ajusta o preço ao spot.",
    interpretation: "Funding positivo indica long pagando short — mercado predominantemente comprado. Útil para medir sentimento cripto.",
  },
  {
    code: "DI1F27", name: "DI Futuro Jan/2027", vencimento: "Jan/2027", spotPrice: 14.15, futurePrice: 13.80,
    basis: -0.35, basisPct: -2.47,
    description: "Contrato futuro de taxa DI. Indica expectativa do mercado para a SELIC no vencimento.",
    interpretation: "DI futuro abaixo da SELIC atual sinaliza expectativa de corte de juros até Jan/27 — favorece renda variável e FIIs de tijolo.",
  },
  {
    code: "IND", name: "Mini Índice (Ibovespa)", vencimento: "Jun/2026", spotPrice: 142500, futurePrice: 143800,
    basis: 1300, basisPct: 0.91,
    description: "Mini contrato futuro do Ibovespa. Usado para hedge de carteira e direcional.",
    interpretation: "Futuro acima do spot mostra otimismo de curto prazo. Combinado com queda do DI, sugere migração de capital para a bolsa.",
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
  ativosImpactados?: { ticker: string; direcao: "alta" | "baixa"; motivo: string }[];
}

export const impactAnalyses: ImpactAnalysis[] = [
  {
    title: "SELIC em Alta", indicator: "SELIC 14.25%", scenario: "Taxa Selic elevada para conter inflação",
    effects: [
      "Renda fixa mais atrativa: CDBs, Tesouro Selic e LCIs pagam mais",
      "Crédito mais caro: financiamentos e empréstimos com juros altos",
      "Bolsa de valores tende a cair — investidores migram para renda fixa",
      "FIIs de papel (CRIs) se beneficiam com rendimentos atrelados ao CDI",
      "FIIs de tijolo sofrem com vacância e desvalorização",
    ],
    recommendation: "Priorize renda fixa pós-fixada (Tesouro Selic, CDBs 100%+ CDI). Em FIIs, prefira fundos de papel (MXRF11, IRDM11, CPTS11).",
    sentiment: "neutral",
    ativosImpactados: [
      { ticker: "ITUB4", direcao: "alta", motivo: "Spread bancário ampliado" },
      { ticker: "MXRF11", direcao: "alta", motivo: "Receita CDI valorizada" },
      { ticker: "MGLU3", direcao: "baixa", motivo: "Crédito caro reduz consumo" },
      { ticker: "MRVE3", direcao: "baixa", motivo: "Financiamento imobiliário encarece" },
      { ticker: "HGLG11", direcao: "baixa", motivo: "Tijolo perde para renda fixa" },
    ],
  },
  {
    title: "Dólar em Queda", indicator: "USD R$ 5.72", scenario: "Real se fortalecendo frente ao dólar",
    effects: [
      "Importações mais baratas: combustíveis, eletrônicos e insumos",
      "Pressão inflacionária reduzida — pode antecipar corte na Selic",
      "Exportadoras como VALE3 e SUZB3 têm receita em dólar reduzida",
      "Empresas com dívida em dólar se beneficiam (AZUL4, GOLL4)",
      "Turismo internacional fica mais acessível",
    ],
    recommendation: "Reduza exposição a exportadoras. Aumente posição em empresas com receita doméstica e dívida em dólar.",
    sentiment: "positive",
    ativosImpactados: [
      { ticker: "AZUL4", direcao: "alta", motivo: "Dívida em USD reduzida" },
      { ticker: "GOLL4", direcao: "alta", motivo: "Leasing aeronaves mais barato" },
      { ticker: "MGLU3", direcao: "alta", motivo: "Eletrônicos importados baratos" },
      { ticker: "VALE3", direcao: "baixa", motivo: "Receita USD vale menos em BRL" },
      { ticker: "SUZB3", direcao: "baixa", motivo: "Exportações menos rentáveis" },
    ],
  },
  {
    title: "Inflação Persistente", indicator: "IPCA 5.48%", scenario: "Inflação acima da meta do Banco Central (3.0%)",
    effects: [
      "Banco Central mantém ou sobe juros — renda fixa favorecida",
      "Poder de compra do consumidor reduzido",
      "Investimentos atrelados ao IPCA (Tesouro IPCA+) protegem patrimônio",
      "Setores de consumo (MGLU3, VIIA3) sofrem com queda na demanda",
      "Aluguéis e FIIs de tijolo podem reajustar acima da inflação",
    ],
    recommendation: "Aloque em Tesouro IPCA+ e FIIs de papel com receita indexada à inflação. Evite varejo e consumo discricionário.",
    sentiment: "negative",
    ativosImpactados: [
      { ticker: "TAEE11", direcao: "alta", motivo: "Receita reajustada por IPCA" },
      { ticker: "TRPL4", direcao: "alta", motivo: "Tarifa indexada à inflação" },
      { ticker: "SBSP3", direcao: "alta", motivo: "Tarifa de saneamento corrigida" },
      { ticker: "MGLU3", direcao: "baixa", motivo: "Consumo discricionário sofre" },
      { ticker: "VIIA3", direcao: "baixa", motivo: "Poder de compra reduzido" },
    ],
  },
  {
    title: "Yuan Forte", indicator: "CNY R$ 0.79", scenario: "Moeda chinesa se valorizando",
    effects: [
      "Exportações de commodities brasileiras ficam mais caras para a China",
      "Demanda chinesa por minério e soja pode reduzir no curto prazo",
      "VALE3 e empresas de agronegócio podem ser impactadas",
      "Investimentos chineses no Brasil podem aumentar",
      "Balança comercial brasileira pode ser afetada",
    ],
    recommendation: "Monitore de perto VALE3 e SLCE3. Diversifique em setores menos dependentes da China.",
    sentiment: "neutral",
    ativosImpactados: [
      { ticker: "VALE3", direcao: "baixa", motivo: "Demanda chinesa pode arrefecer" },
      { ticker: "SLCE3", direcao: "baixa", motivo: "Soja mais cara para China" },
      { ticker: "SUZB3", direcao: "baixa", motivo: "Celulose perde competitividade" },
      { ticker: "JBSS3", direcao: "baixa", motivo: "Exportação de proteína à China" },
      { ticker: "BRAP4", direcao: "baixa", motivo: "Holding com exposição Vale" },
    ],
  },
  {
    title: "Corte de Juros Esperado", indicator: "DI Jan/27: 13.80%", scenario: "Mercado precifica corte da SELIC nos próximos meses",
    effects: [
      "Bolsa antecipa o movimento e tende a subir antes do corte",
      "FIIs de tijolo se valorizam com expectativa de menor desconto",
      "Construtoras se beneficiam de crédito mais barato",
      "Renda fixa pré-fixada pode ser travada antes da queda",
      "Real pode se desvalorizar com diferencial de juros menor",
    ],
    recommendation: "Aumente posição em RV (small caps, FIIs de tijolo) e trave Tesouro Pré antes do corte. Reduza pós-fixados longos.",
    sentiment: "positive",
    ativosImpactados: [
      { ticker: "MRVE3", direcao: "alta", motivo: "Construção civil aquece" },
      { ticker: "CYRE3", direcao: "alta", motivo: "Crédito imobiliário favorável" },
      { ticker: "HGLG11", direcao: "alta", motivo: "Tijolo recupera valor" },
      { ticker: "MGLU3", direcao: "alta", motivo: "Consumo discricionário volta" },
      { ticker: "MXRF11", direcao: "baixa", motivo: "Receita CDI cai com Selic" },
    ],
  },
];
