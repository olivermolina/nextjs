import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState } from '../store';

export interface BaseModel {
  betId: string;
  challengerId?: number;
  contest?: string;
  error?: string;
}
export interface BetModel extends BaseModel {
  gameId: number;
  refId: number;
  league: string;
  matchTime: string;
  entity1: string;
  entity2: string;
  line: string;
  stake: number;
  odds: number;
  type: 'total' | 'moneyline' | 'spread';
  team: 'away' | 'home' | 'over' | 'under';
}

export interface ParlayModel extends BaseModel {
  legs: BetModel[];
  stake: number;
}

export interface TeaserModel extends ParlayModel {
  type: 'teaser';
}

const betsAdapter = createEntityAdapter<BetModel | ParlayModel | TeaserModel>({
  selectId: (bet) => bet.betId,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.betId.localeCompare(b.betId),
});

export const addToParlayBet = createAsyncThunk(
  'bets/addToParlayBet',
  (bet: BetInput, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const allBets = selectAllBets(state);
    const parlayBet = allBets.find((bet) => 'legs' in bet) as ParlayModel;
    if (!parlayBet) {
      thunkAPI.dispatch(addParlayBet(bet));
    } else {
      const legs = [...parlayBet.legs];
      if (legs.findIndex((leg) => leg.gameId === bet.gameId) !== -1) {
        toast.error(
          `Already included this a bet from this game in the parlay.`,
        );
      } else {
        legs.push(addIdToBet(bet));
        thunkAPI.dispatch(
          updateBet({
            id: parlayBet.betId,
            changes: {
              contest: bet.contest,
              legs,
            },
          }),
        );
      }
    }
  },
);

export const addToTeaserBet = createAsyncThunk(
  'bets/addToTeaserBet',
  (bet: BetInput, thunkAPI) => {
    if (bet.type === 'moneyline') {
      toast.error(`Unable to bet the moneyline on teaser bets.`);
      return;
    }
    const state = thunkAPI.getState() as RootState;
    const allBets = selectAllBets(state);
    const teaser = allBets.find(
      (bet) => 'legs' in bet && 'type' in bet,
    ) as TeaserModel;
    if (!teaser) {
      thunkAPI.dispatch(addTeaserBet(bet));
    } else {
      const legs = [...teaser.legs];
      if (legs.findIndex((leg) => leg.gameId === bet.gameId) !== -1) {
        toast.error(
          `Already included this a bet from this game in the parlay.`,
        );
      } else if (legs.length > 1) {
        toast.error(`Teasers only support two different game picks.`);
      } else {
        legs.push(addIdToBet(bet));
        thunkAPI.dispatch(
          updateBet({
            id: teaser.betId,
            changes: {
              contest: bet.contest,
              legs,
            },
          }),
        );
      }
    }
  },
);

function addIdToBet(bet: BetInput): BetModel {
  return {
    ...bet,
    betId: bet.gameId.toString(),
  };
}

export type BetInput = Omit<BetModel, 'betId'>;

export const betsSlice = createSlice({
  name: 'bets',
  initialState: betsAdapter.getInitialState(),
  reducers: {
    addBet(state, action: PayloadAction<BetInput>) {
      return betsAdapter.addOne(state, addIdToBet(action.payload));
    },
    addParlayBet(state, action: PayloadAction<BetInput>) {
      const bet: ParlayModel = {
        legs: [addIdToBet(action.payload)],
        betId: Math.floor(Math.random() * 1000).toString(),
        contest: action.payload.contest,
        stake: 0,
      };
      return betsAdapter.addOne(state, bet);
    },
    addTeaserBet(state, action: PayloadAction<BetInput>) {
      const bet: TeaserModel = {
        legs: [addIdToBet(action.payload)],
        betId: Math.floor(Math.random() * 1000).toString(),
        stake: 0,
        contest: action.payload.contest,
        type: 'teaser',
      };
      return betsAdapter.addOne(state, bet);
    },
    removeBet: betsAdapter.removeOne,
    removeAllBets: betsAdapter.removeAll,
    updateBet: betsAdapter.updateOne,
    reset: () => betsAdapter.getInitialState(),
  },
});

export const {
  addBet,
  removeBet,
  removeAllBets,
  updateBet,
  reset,
  addParlayBet,
  addTeaserBet,
} = betsSlice.actions;

// Rename the exports for readability in component usage
export const {
  selectById: selectBetById,
  selectIds: selectBetIds,
  selectEntities: selectBetEntities,
  selectAll: selectAllBets,
  selectTotal: selectTotalBets,
} = betsAdapter.getSelectors((state: RootState) => state.bets);

export default betsSlice.reducer;
