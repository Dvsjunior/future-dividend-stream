import { useQuery } from "@tanstack/react-query";

interface BCBSeriesData {
  data: string;
  valor: string;
}

async function fetchBCBSeries(seriesCode: number, lastN: number = 1): Promise<BCBSeriesData[]> {
  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${seriesCode}/dados/ultimos/${lastN}?formato=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`BCB API error: ${res.status}`);
  return res.json();
}

export interface BCBIndicators {
  selic: number | null;
  cdi: number | null;
  ipca: number | null;
  dolar: number | null;
  euro: number | null;
  selicHistory: { date: string; value: number }[];
  cdiHistory: { date: string; value: number }[];
  ipcaHistory: { date: string; value: number }[];
}

export function useBCBData() {
  return useQuery<BCBIndicators>({
    queryKey: ["bcb-indicators"],
    queryFn: async () => {
      const [selicData, cdiData, ipcaData, dolarData, euroData, selicHist, cdiHist, ipcaHist] = await Promise.allSettled([
        fetchBCBSeries(432, 1),   // SELIC meta
        fetchBCBSeries(4389, 1),  // CDI
        fetchBCBSeries(433, 1),   // IPCA mensal
        fetchBCBSeries(1, 1),     // Dólar PTAX compra
        fetchBCBSeries(21619, 1), // Euro PTAX compra
        fetchBCBSeries(432, 12),  // SELIC 12 meses
        fetchBCBSeries(4389, 12), // CDI 12 meses
        fetchBCBSeries(433, 12),  // IPCA 12 meses
      ]);

      const getValue = (result: PromiseSettledResult<BCBSeriesData[]>) => {
        if (result.status === "fulfilled" && result.value.length > 0) {
          return parseFloat(result.value[result.value.length - 1].valor);
        }
        return null;
      };

      const getHistory = (result: PromiseSettledResult<BCBSeriesData[]>) => {
        if (result.status === "fulfilled") {
          return result.value.map(d => ({ date: d.data, value: parseFloat(d.valor) }));
        }
        return [];
      };

      return {
        selic: getValue(selicData),
        cdi: getValue(cdiData),
        ipca: getValue(ipcaData),
        dolar: getValue(dolarData),
        euro: getValue(euroData),
        selicHistory: getHistory(selicHist),
        cdiHistory: getHistory(cdiHist),
        ipcaHistory: getHistory(ipcaHist),
      };
    },
    staleTime: 1000 * 60 * 30, // 30 min
    retry: 2,
  });
}
