export type Params = {
  ipponToWin: number;
  wazaariToWin: number;
  totalTime: number;
  gsTime: number;
  ipponOskTime: number;
  wazaariOskTime: number;
};

type Athlete = {
  _id: string;
  name: string;
  surname: string;
  competition: string;
  club: string;
  gender: string;
  weight: number;
  birth_year: number;
  category: string;
  __v: number;
};

export type MatchData = {
  _id: string;
  white_athlete: Athlete;
  red_athlete: Athlete;
  winner_athlete: string;
  tournament: string;
  category_name: string;
  is_started: boolean;
  is_over: boolean;
  match_type: string;
  __v: number;
  params: {
    match_time: number;
    supplemental_match_time: number;
    ippon_to_win: number;
    wazaari_to_win: number;
    ippon_timer: number;
    wazaari_timer: number;
  };
  match_scores: {
    final_time: number;
    white_ippon: number;
    white_wazaari: number;
    white_penalties: number;
    red_ippon: number;
    red_wazaari: number;
    red_penalties: number;
  };
};
