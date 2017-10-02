import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
require('dotenv').config();

import AccessCode, { IAccessCodeModel } from '../models/AccessCode';
import AuthCode, { IAuthCodeModel } from '../models/AuthCode';

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
      .findOne({ code: reqCode })
      .then((access) => {
        if (!access) {
          res.sendStatus(401);
          return;
        }
        const accessCode: IAccessCodeModel = access;
        const now: number = (new Date()).getTime();
        const expires: number = (new Date(accessCode.expiresAt)).getTime();

        if (now <= expires) {
          const code = crypto.randomBytes(20).toString('hex');
          const authCode = new AuthCode({ code });
          authCode.save().then((result) => {
            // access.remove();
            res.status(200).send(result.toObject());
            return;
          });
        } else {
          // access.remove();
          res.status(400).send({ message: 'Access code is expired' });
          return;
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
        return;
      });
  }

  init() {
    this.router.get('/', this.generateAuthCode);
  }
}

const loginRouter = new LoginRouter();
loginRouter.init();
export default loginRouter.router;
