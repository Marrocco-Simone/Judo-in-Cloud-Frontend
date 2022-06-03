import React from 'react';
import { UserI } from '../../models/user.model';

export interface AuthContextI {
  user: UserI | null;
  setUser: (user: UserI) => void;
  unsetUser: () => void;
}

export const AuthContext = React.createContext<AuthContextI>({
  user: null,
  setUser: () => {},
  unsetUser: () => {}
});
