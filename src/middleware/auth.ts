import { Request, Response, NextFunction } from 'express';
import AuthCode, { IAuthCodeModel } from '../models/AuthCode';

class AuthMiddleware {
  constructor() {}

  authenticate(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      res.status(401).send({ message: 'No Authorization code was send with the request.' });
      return;
    }
    const authHeader: any = req.headers.authorization;
    const reqCode = authHeader.split(' ')[1];
    AuthCode.findOne({ code: reqCode }).then((result) => {
      if (!result) {
        res.status(401).send({ message: 'No authorization code was found in the database.' });
        return;
      }
      
      const authCode: IAuthCodeModel = result;
      console.log(authCode);
      const now: number = (new Date()).getTime();
      const expires: number = (new Date(authCode.expiresAt)).getTime();

      if (now <= expires) {
        next();
        return;
      } else {
        result.remove();
        res.status(401).send({ message: 'This authorization code has expires' });
        return;
      }
    });
  }
}

const auth = new AuthMiddleware();
export default auth.authenticate;
