import { CompetitionI } from './competition.model';

export interface UserI {
  username: string;
  competition: CompetitionI;
}
