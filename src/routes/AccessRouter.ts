import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
require('dotenv').config();

import { AccessCode, IAccessCodeModel } from '../models/accessCode';

/**
 * @class AccessRouter
 */
export class AccessRouter {
  router: Router;
  smtpConfig = {
    service: 'Mailgun',
    auth: {
      user: process.env.MG_DOMAIN,
      pass: process.env.MG_PASS
    }
  }
  transporter: nodemailer.Transporter;
  AccessCode: IAccessCodeModel;

  constructor() {
    this.router = Router();
    this.transporter = nodemailer.createTransport(this.smtpConfig);
    this.init();
  }

  public emailAccessCode(req: Request, res: Response, next: NextFunction) {
    const self = this;
    const accessCode = new AccessCode({ code: this.createAccessCode() });
    let mail = {
      from: '"Hour Logger" <brandonlee781@gmail.com>',
      to: 'brandonlee781@gmail.com',
      subject: 'Link to access Hour Logger',
      html: ''
    };
    accessCode.save()
      .then(result => {
        mail.html = `<a href="http://localhost:8080/login?accessCode=${result.code}">Click to Log in to Log Router</a>`

        this.transporter.sendMail(mail, (error, info) => {
          if (error) {
            res.status(500).send(error);
            return;
          } else {
            res.sendStatus(200);
          }
        })

      })
      .catch(err => {
        console.error(err);
      })
  }

  private createAccessCode() {
    return crypto.randomBytes(40).toString('hex');
  }

  /**
   * Initialize the Log route
   * 
   * @class LogRouter
   * @method init
   */
  init() {
    this.router.get('/', this.emailAccessCode.bind(this));
  }
}
const accessRouter = new AccessRouter();
accessRouter.init();
export default accessRouter.router;