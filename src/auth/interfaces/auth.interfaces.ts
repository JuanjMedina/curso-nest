import { ROLES } from 'src/constants/roles';

export interface PayloadTOken {
  sub: string;
  role: ROLES;
}


export interface AuthBody{
    username: string;
    password: string;
}


export interface AuthTokenResult {
  role: string;
  sub:  string;
  iat:  number;
  exp:  number;
}


export interface IUseToken {
  role: string;
  sub:  string;
  exExpired : boolean
}
