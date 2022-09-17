export const calculateStraightPayout = (bet: { odds: number; stake: number }) =>
  bet.odds > 0
    ? Number(bet.stake * (Math.abs(bet.odds) / 100)).toFixed(2)
    : Number(bet.stake / (Math.abs(bet.odds) / 100)).toFixed(2);
