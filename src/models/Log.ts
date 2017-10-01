import * as mongoose from 'mongoose';
import { ILog } from '../interfaces/log';
import { logSchema } from '../schemas/log';

export interface ILogModel extends ILog, mongoose.Document {}

export interface ILogModelStatic extends mongoose.Model<ILogModel> {}

export default mongoose.model<ILogModel, ILogModelStatic>('Log', logSchema);
