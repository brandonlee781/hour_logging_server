import * as mongoose from 'mongoose';
import { IAuthCode } from '../interfaces/authCode';
import { authCodeSchema } from '../schemas/authCode';

export interface IAuthCodeModel extends IAuthCode, mongoose.Document {}

export interface IAuthCodeModelStatic extends mongoose.Model<IAuthCodeModel> {}

export default mongoose.model<IAuthCodeModel, IAuthCodeModelStatic>(
  'AuthCode', 
  authCodeSchema,
);
