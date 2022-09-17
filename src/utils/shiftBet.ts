import { IOffer, IBetLeg } from '~/types';

export default function shiftLine(
  line: number,
  league: IOffer['league'],
  type: IBetLeg['type'],
): number {
  const leagueTeaserShifts: Record<IOffer['league'], number> = {
    NFL: 6,
    NCAAF: 6,
    NBA: 4,
    NCAAB: 4,
  };
  const shifter = leagueTeaserShifts[league.toUpperCase()] || 0;
  switch (type) {
    case 'spreadAwayOdds':
      return line + shifter;
    case 'spreadHomeOdds':
      return line + shifter;
    case 'overOdds':
      return line + shifter;
    case 'underOdds':
      return line - shifter;
    default:
      console.error(line, league, type);
      throw new Error('Unknown bet type.');
  }
}
