import { useEffect, useState } from "react";
import { fundosImobiliarios, topAltas, topBaixas } from "@/data/mockData";

/**
 * Polling leve simulando feed de preços em tempo quase real.
 * Aplica jitter <0.6% sobre os preços base do mockData a cada 15s.
 * Substituível futuramente por um provedor real (B3/Brapi/Yahoo) sem mudar a API.
 */
export interface LivePrice {
  spot: number;
  futuro: number;
  basis: number;          // futuro - spot
  basisPct: number;       // (futuro/spot - 1) * 100
  updatedAt: number;
}

const BASE_PRICES: Record<string, number> = {};
[...fundosImobiliarios, ...topAltas, ...topBaixas].forEach((a: any) => {
  BASE_PRICES[a.ticker] = a.price;
});

function jitter(base: number, pct = 0.006): number {
  const delta = (Math.random() * 2 - 1) * pct;
  return +(base * (1 + delta)).toFixed(2);
}

export function useLivePrices(intervalMs = 15000) {
  const [prices, setPrices] = useState<Record<string, LivePrice>>(() => buildSnapshot());
  const [updatedAt, setUpdatedAt] = useState<number>(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setPrices(buildSnapshot());
      setUpdatedAt(Date.now());
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { prices, updatedAt };
}

function buildSnapshot(): Record<string, LivePrice> {
  const snap: Record<string, LivePrice> = {};
  for (const [ticker, base] of Object.entries(BASE_PRICES)) {
    const spot = jitter(base, 0.005);
    const futuro = jitter(base, 0.008);
    const basis = +(futuro - spot).toFixed(2);
    const basisPct = +((futuro / spot - 1) * 100).toFixed(2);
    snap[ticker] = { spot, futuro, basis, basisPct, updatedAt: Date.now() };
  }
  // Contratos derivados
  ["WDO", "DOL", "WIN", "IND"].forEach(t => {
    const base = t.startsWith("W") ? (t === "WDO" ? 4.93 : 138000) : (t === "DOL" ? 4.93 : 138000);
    const spot = jitter(base, 0.003);
    const futuro = jitter(base * 1.002, 0.004);
    snap[t] = {
      spot, futuro,
      basis: +(futuro - spot).toFixed(2),
      basisPct: +((futuro / spot - 1) * 100).toFixed(2),
      updatedAt: Date.now(),
    };
  });
  return snap;
}
