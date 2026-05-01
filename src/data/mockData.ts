export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface FundoImobiliario {
  ticker: string;
  name: string;
  price: number;
  dividendYield: number;
  lastDividend: number;
  dataCom: string;
  dataPayment: string;
  pvp: number;
  sector: string;
  min52w?: number;
  max52w?: number;
}

export interface Dividend {
  ticker: string;
  type: 'Ação' | 'FII' | 'ETF' | 'Renda Fixa' | 'Tesouro' | 'CDB' | 'CRA' | 'CRI';
  value: number;
  dataCom: string;
  dataPayment: string;
  yieldPercent: number;
}

export const topAltas: Stock[] = [
  { ticker: 'PETR4', name: 'Petrobras PN', price: 38.52, change: 2.15, changePercent: 5.91, volume: 45000000 },
  { ticker: 'VALE3', name: 'Vale ON', price: 62.80, change: 1.98, changePercent: 3.26, volume: 38000000 },
  { ticker: 'ITUB4', name: 'Itaú Unibanco PN', price: 32.15, change: 1.45, changePercent: 4.72, volume: 28000000 },
  { ticker: 'BBDC4', name: 'Bradesco PN', price: 15.22, change: 0.89, changePercent: 6.21, volume: 22000000 },
  { ticker: 'WEGE3', name: 'WEG ON', price: 42.30, change: 0.76, changePercent: 1.83, volume: 12000000 },
  { ticker: 'RENT3', name: 'Localiza ON', price: 58.90, change: 0.65, changePercent: 1.12, volume: 9000000 },
  { ticker: 'ABEV3', name: 'Ambev ON', price: 14.85, change: 0.55, changePercent: 3.84, volume: 18000000 },
  { ticker: 'SUZB3', name: 'Suzano ON', price: 52.40, change: 0.48, changePercent: 0.92, volume: 7500000 },
  { ticker: 'JBSS3', name: 'JBS ON', price: 28.75, change: 0.42, changePercent: 1.48, volume: 11000000 },
  { ticker: 'GGBR4', name: 'Gerdau PN', price: 24.10, change: 0.38, changePercent: 1.60, volume: 8500000 },
];

export const topBaixas: Stock[] = [
  { ticker: 'MGLU3', name: 'Magazine Luiza ON', price: 2.15, change: -0.32, changePercent: -12.96, volume: 55000000 },
  { ticker: 'VIIA3', name: 'Via ON', price: 1.08, change: -0.18, changePercent: -14.29, volume: 42000000 },
  { ticker: 'CVCB3', name: 'CVC ON', price: 3.45, change: -0.28, changePercent: -7.51, volume: 15000000 },
  { ticker: 'AZUL4', name: 'Azul PN', price: 12.30, change: -0.85, changePercent: -6.47, volume: 8000000 },
  { ticker: 'GOLL4', name: 'Gol PN', price: 7.85, change: -0.52, changePercent: -6.21, volume: 6500000 },
  { ticker: 'COGN3', name: 'Cogna ON', price: 2.98, change: -0.15, changePercent: -4.79, volume: 12000000 },
  { ticker: 'IRBR3', name: 'IRB Brasil ON', price: 42.50, change: -1.80, changePercent: -4.06, volume: 5000000 },
  { ticker: 'LWSA3', name: 'Locaweb ON', price: 6.20, change: -0.22, changePercent: -3.43, volume: 4000000 },
  { ticker: 'BRFS3', name: 'BRF ON', price: 22.15, change: -0.65, changePercent: -2.85, volume: 7000000 },
  { ticker: 'HAPV3', name: 'Hapvida ON', price: 4.52, change: -0.12, changePercent: -2.59, volume: 16000000 },
];

export const fundosImobiliarios: FundoImobiliario[] = [
  { ticker: 'MXRF11', name: 'Maxi Renda', price: 10.25, dividendYield: 12.5, lastDividend: 0.10, dataCom: '2026-04-15', dataPayment: '2026-04-25', pvp: 0.98, sector: 'Papel', min52w: 9.50, max52w: 11.20 },
  { ticker: 'HGLG11', name: 'CSHG Logística', price: 162.50, dividendYield: 8.2, lastDividend: 1.10, dataCom: '2026-04-10', dataPayment: '2026-04-18', pvp: 1.02, sector: 'Logística', min52w: 148.00, max52w: 175.00 },
  { ticker: 'KNRI11', name: 'Kinea Renda', price: 135.80, dividendYield: 7.8, lastDividend: 0.85, dataCom: '2026-04-12', dataPayment: '2026-04-22', pvp: 0.95, sector: 'Híbrido', min52w: 125.00, max52w: 145.00 },
  { ticker: 'XPML11', name: 'XP Malls', price: 98.40, dividendYield: 9.1, lastDividend: 0.75, dataCom: '2026-04-08', dataPayment: '2026-04-16', pvp: 1.05, sector: 'Shopping', min52w: 88.00, max52w: 105.00 },
  { ticker: 'VISC11', name: 'Vinci Shopping', price: 105.20, dividendYield: 8.5, lastDividend: 0.72, dataCom: '2026-05-10', dataPayment: '2026-05-20', pvp: 0.97, sector: 'Shopping', min52w: 95.00, max52w: 112.00 },
  { ticker: 'BTLG11', name: 'BTG Logística', price: 98.60, dividendYield: 9.3, lastDividend: 0.76, dataCom: '2026-05-05', dataPayment: '2026-05-15', pvp: 0.99, sector: 'Logística', min52w: 88.00, max52w: 104.00 },
  { ticker: 'PVBI11', name: 'VBI Prime', price: 82.30, dividendYield: 8.8, lastDividend: 0.60, dataCom: '2026-04-20', dataPayment: '2026-04-30', pvp: 0.93, sector: 'Lajes Corporativas', min52w: 75.00, max52w: 89.00 },
  { ticker: 'IRDM11', name: 'Iridium Recebíveis', price: 78.90, dividendYield: 13.2, lastDividend: 0.87, dataCom: '2026-04-14', dataPayment: '2026-04-24', pvp: 1.01, sector: 'Papel', min52w: 70.00, max52w: 85.00 },
  { ticker: 'CPTS11', name: 'Capitânia Securities', price: 86.50, dividendYield: 11.8, lastDividend: 0.85, dataCom: '2026-05-12', dataPayment: '2026-05-22', pvp: 0.96, sector: 'Papel', min52w: 78.00, max52w: 92.00 },
  { ticker: 'RECR11', name: 'REC Recebíveis', price: 82.10, dividendYield: 12.1, lastDividend: 0.82, dataCom: '2026-04-18', dataPayment: '2026-04-28', pvp: 0.94, sector: 'Papel', min52w: 74.00, max52w: 88.00 },
];

export const dividendos: Dividend[] = [
  { ticker: 'PETR4', type: 'Ação', value: 1.25, dataCom: '2026-04-10', dataPayment: '2026-05-15', yieldPercent: 3.24 },
  { ticker: 'VALE3', type: 'Ação', value: 2.10, dataCom: '2026-04-15', dataPayment: '2026-05-20', yieldPercent: 3.34 },
  { ticker: 'ITUB4', type: 'Ação', value: 0.45, dataCom: '2026-04-12', dataPayment: '2026-05-10', yieldPercent: 1.40 },
  { ticker: 'BBAS3', type: 'Ação', value: 0.78, dataCom: '2026-04-20', dataPayment: '2026-05-25', yieldPercent: 2.10 },
  { ticker: 'MXRF11', type: 'FII', value: 0.10, dataCom: '2026-04-15', dataPayment: '2026-04-25', yieldPercent: 0.98 },
  { ticker: 'HGLG11', type: 'FII', value: 1.10, dataCom: '2026-04-10', dataPayment: '2026-04-18', yieldPercent: 0.68 },
  { ticker: 'KNRI11', type: 'FII', value: 0.85, dataCom: '2026-04-12', dataPayment: '2026-04-22', yieldPercent: 0.63 },
  { ticker: 'BOVA11', type: 'ETF', value: 0.55, dataCom: '2026-04-08', dataPayment: '2026-04-20', yieldPercent: 0.45 },
  { ticker: 'IVVB11', type: 'ETF', value: 0.32, dataCom: '2026-04-12', dataPayment: '2026-04-25', yieldPercent: 0.12 },
  { ticker: 'TESOURO SELIC', type: 'Tesouro', value: 0.85, dataCom: '2026-04-01', dataPayment: '2026-04-01', yieldPercent: 1.02 },
  { ticker: 'CDB BANCO X', type: 'CDB', value: 0.92, dataCom: '2026-04-01', dataPayment: '2026-04-01', yieldPercent: 1.15 },
  { ticker: 'CRA AGRO 2026', type: 'CRA', value: 1.05, dataCom: '2026-04-15', dataPayment: '2026-04-30', yieldPercent: 1.20 },
  { ticker: 'CRI IMOB 2026', type: 'CRI', value: 0.98, dataCom: '2026-04-10', dataPayment: '2026-04-28', yieldPercent: 1.10 },
  { ticker: 'XPML11', type: 'FII', value: 0.75, dataCom: '2026-04-08', dataPayment: '2026-04-16', yieldPercent: 0.76 },
  { ticker: 'IRDM11', type: 'FII', value: 0.87, dataCom: '2026-04-14', dataPayment: '2026-04-24', yieldPercent: 1.10 },
];

export const carteira = {
  valorTotal: 15420.50,
  valorDisponivel: 2850.00,
  rendimentoMensal: 185.30,
  totalDividendos: 1250.80,
};

export function calcularCotasParaAutoSustento(fundo: FundoImobiliario): number {
  if (fundo.lastDividend <= 0) return 0;
  return Math.ceil(fundo.price / fundo.lastDividend);
}

export function encontrarProximoFundoParaCompra(fundos: FundoImobiliario[], valorDisponivel: number): FundoImobiliario | null {
  const hoje = new Date();
  const fundosOrdenados = fundos
    .filter(f => new Date(f.dataCom) > hoje && f.price <= valorDisponivel)
    .sort((a, b) => {
      const diasA = (new Date(a.dataCom).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
      const diasB = (new Date(b.dataCom).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
      const scoreA = a.dividendYield / Math.max(diasA, 1);
      const scoreB = b.dividendYield / Math.max(diasB, 1);
      return scoreB - scoreA;
    });
  return fundosOrdenados[0] || null;
}

/** Busca preço de mercado conhecido para um ticker (FIIs/ações). */
export function getAtivoPrice(ticker: string): number | null {
  const fii = fundosImobiliarios.find(f => f.ticker === ticker);
  if (fii) return fii.price;
  const acao = [...topAltas, ...topBaixas].find(s => s.ticker === ticker);
  if (acao) return acao.price;
  return null;
}
