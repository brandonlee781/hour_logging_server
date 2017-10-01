import { Model } from 'mongoose';
import { IUserModel } from './user';
import { ILogModel } from './log';
import { IAccessCodeModel } from './accessCode';
import { IAuthCodeModel } from './authCode';
import { IInvoiceModel } from './invoice';

export interface IModel {
  user: Model<IUserModel>;
  log: Model<ILogModel>;
  accessCode: Model<IAccessCodeModel>;
  authCode: Model<IAuthCodeModel>;
  invoice: Model<IInvoiceModel>;
}
