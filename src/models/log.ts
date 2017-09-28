import * as mongoose from 'mongoose';
import { Document, Model } from 'mongoose';
import { ILog } from '../interfaces/log';
import { logSchema } from '../schemas/log'

export interface ILogModel extends ILog, Document {}

export interface ILogModelStatic extends Model<ILogModel> {}

export const Log = mongoose.model<ILogModel, ILogModelStatic>('Log', logSchema);
