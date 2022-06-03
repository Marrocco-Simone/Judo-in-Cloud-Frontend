import { AthleteI } from './athlete.model';
import { BracketI } from './bracket.model';
import { CategoryI } from './category.model';
import { CompetitionI } from './competition.model';

export interface TournamentI {
  _id: string;
  competition: CompetitionI;
  category: CategoryI;
  tatami_number: number;
  finished: boolean;
  athletes: AthleteI[];
  winners_bracket: BracketI;
  recovered_bracket_1: BracketI;
  recovered_bracket_2: BracketI;
  __v: number;
}
