import {
  AuthTokenResult,
  IUseToken,
} from 'src/auth/interfaces/auth.interfaces';
import * as jwt from 'jsonwebtoken';
export const useToken = (token: string): IUseToken | string => {
  try {
    const decode = jwt.decode(token) as AuthTokenResult;
    const currentDate = new Date();
    const expiresDate = new Date(decode.exp);
    const exExpired = +expiresDate <= +currentDate / 1000
    return { exExpired: exExpired, sub: decode.sub, role: decode.role };
  } catch (error) {}
};
