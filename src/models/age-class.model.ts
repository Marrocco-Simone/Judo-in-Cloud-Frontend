import { CategoryI } from './category.model';

export interface AgeClassI {
  params: {
    match_time: number;
    supplemental_match_time: number;
    ippon_to_win: number;
    wazaari_to_win: number;
    ippon_timer: number;
    wazaari_timer: number;
  };
  _id: string;
  max_age: number;
  competition: string;
  name: string;
  closed: boolean;
  __v: number;
  categories: CategoryI[];
}
