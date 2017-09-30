import * as mongoose from 'mongoose';
import { IAccessCode } from '../interfaces/accessCode';
import { accessCodeSchema } from '../schemas/accessCode';

export interface IAccessCodeModel extends IAccessCode, mongoose.Document {}

export interface IAccessCodeModelStatic extends mongoose.Model<IAccessCodeModel> {}

export default mongoose.model<IAccessCodeModel, IAccessCodeModelStatic>(
  'AccessCode', 
  accessCodeSchema,
);
