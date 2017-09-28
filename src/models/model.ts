import { Model } from 'mongoose';
import { IUserModel } from './user';
import { ILogModel } from './log';

export interface IModel {
  user: Model<IUserModel>;
  log: Model<ILogModel>;
}