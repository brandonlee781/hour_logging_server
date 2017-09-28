import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
require('dotenv').config();

import { AccessCode, IAccessCodeModel } from '../models/accessCode';
import { AuthCode, IAuthCodeModel } from '../models/authCode';

/**
 * @class LogRouter
 */
export class LoginRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public generateAuthCode(req: Request, res: Response, next: NextFunction) {
    const reqCode = req.query.accessCode;
    AccessCode
      .findOne({code: reqCode})
      .then(access => {
        if (!access) {
          res.sendStatus(401);
          return next();
        }
        const accessCode: IAccessCodeModel = access;
        const now: number = (new Date()).getTime();
        const expires: number = (new Date(accessCode.expiresAt)).getTime();

        if (now <= expires) {
          const code = crypto.randomBytes(20).toString('hex');
          const authCode = new AuthCode({code: code});
          authCode.save().then(result => {
            res.status(200).send(result.toObject());
            return next();
          });
        }
      })
      .catch(err => {
        res.status(500).send({err: err});
        return next();
      })
  }

  init() {
    this.router.get('/', this.generateAuthCode);
  }
}

const loginRouter = new LoginRouter();
loginRouter.init();
export default loginRouter.router;