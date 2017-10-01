import { Model } from 'mongoose';
import { IUserModel } from './User';
import { ILogModel } from './Log';
import { IAccessCodeModel } from './AccessCode';
import { IAuthCodeModel } from './AuthCode';
import { IInvoiceModel } from './Invoice';

export interface IModel {
  user: Model<IUserModel>;
  log: Model<ILogModel>;
  accessCode: Model<IAccessCodeModel>;
  authCode: Model<IAuthCodeModel>;
  invoice: Model<IInvoiceModel>;
}
