/**
 * Money is stored as integer centimes (1 MAD = 100 centimes).
 * Never use floats for money.
 */

/** Format centimes to a human-readable MAD string, e.g. 1050 → "10,50 MAD" */
export function formatMAD(centimes: number): string {
  return `${(centimes / 100).toFixed(2).replace('.', ',')} MAD`;
}

/** Compute VAT amount from a TTC total (VAT included). Default rate: 10% */
export function vatFromTTC(ttcCentimes: number, vatRate = 0.1): number {
  return Math.round(ttcCentimes - ttcCentimes / (1 + vatRate));
}
