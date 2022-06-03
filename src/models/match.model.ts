import { AthleteI } from './athlete.model';

export interface MatchScoresI{
  final_time: number;
  white_ippon: number;
  white_wazaari: number;
  white_penalties: number;
  red_ippon: number;
  red_wazaari: number;
  red_penalties: number;
}

export interface MatchI {
  _id: string;
  match_scores: MatchScoresI;
  white_athlete: AthleteI | null;
  red_athlete: AthleteI | null;
  winner_athlete: AthleteI | null;
  tournament: string;
  is_started: false;
  is_over: false;
  match_type: number;
  loser_recovered: boolean;
  __v: number;
}
