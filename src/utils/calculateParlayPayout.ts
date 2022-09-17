import { convertToDecimalOdds } from './convertToDecimalOdds';

export function calculateParlayPayout(legs: number[], stake: number): number {
  const decimalFracs = legs.map(convertToDecimalOdds);
  const totalOdds = decimalFracs.reduce((acc, curr) => acc * curr);
  return Number((stake * totalOdds).toFixed(2));
}
