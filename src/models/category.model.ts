import { AgeClassI } from './age-class.model';

export interface CategoryI {
  _id: string;
  age_class: AgeClassI;
  max_weight: string;
  gender: string;
  __v: number;
}
