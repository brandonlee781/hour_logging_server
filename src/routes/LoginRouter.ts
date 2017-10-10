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

  public async generateAuthCode(req: Request, res: Response, next: NextFunction) {
    const reqCode = req.query.accessCode;
    const code = crypto.randomBytes(20).toString('hex');
    const now: number = (new Date()).getTime();
    const access: IAccessCodeModel = await AccessCode.findOne({ code: reqCode });
    if (!access) {
      res.sendStatus(401);
      return;
    }
    const expires: number = (new Date(access.expiresAt)).getTime();
    console.log({ access, expires, now });

    if (now <= expires) {
      const authCode = new AuthCode({ code });
      const auth = await authCode.save();
      res.status(200).send(auth.toObject());
      return;
    } else {
      res.status(400).send({ message: 'Access code is expired' });
      return;
    }
  }

  init() {
    this.router.get('/', this.generateAuthCode);
  }
}

const loginRouter = new LoginRouter();
loginRouter.init();
export default loginRouter.router;
