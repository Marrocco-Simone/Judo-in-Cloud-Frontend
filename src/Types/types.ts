export type MatchParamsInterface = {
  ipponToWin: number;
  wazaariToWin: number;
  totalTime: number;
  gsTime: number;
  ipponOskTime: number;
  wazaariOskTime: number;
};

type AthleteInterface = {
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

export type MatchInterface = {
  _id: string;
  white_athlete: AthleteInterface;
  red_athlete: AthleteInterface;
  winner_athlete: AthleteInterface;
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

export type TournamentInterface = {
  _id: string;
  competition: string;
  category: {
    _id: string;
    age_class: {
      _id: string;
      max_age: number;
      competition: string;
      name: string;
      closed: boolean;
      __v: 0;
    };
    max_weight: number;
    gender: 'M' | 'F';
    __v: number;
  };
  tatami_number: number;
  finished: boolean;
  athletes: string[];
  winners_bracket: string[][];
  recovered_bracket_1: string[][];
  recovered_bracket_2: string[][];
  __v: number;
};
