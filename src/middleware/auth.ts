import { Request, Response, NextFunction } from 'express';
import { AuthCode, IAuthCodeModel } from '../models/authCode';

class AuthMiddleware {
  constructor() {}

  authenticate(req: Request, res: Response, next: NextFunction) {
    const reqCode = req.headers.authorization[0].split(' ')[1];
    AuthCode.findOne({ code: reqCode }).then(result => {
      if (!result) {
        res.sendStatus(401);
        return next();
      }
      
      const authCode: IAuthCodeModel = result;
      const now: number = (new Date()).getTime();
      const expires: number = (new Date(authCode.expiresAt)).getTime();

      if (now <= expires) {
        return next();
      } else {
        result.remove();
        res.status(401).send({ message: 'This authorization code has expires' });
        return next();
      }
    })
  }
}

const auth = new AuthMiddleware();
export default auth.authenticate;