import * as mongoose from 'mongoose';
import { Document, Model } from 'mongoose';
import { IAuthCode } from '../interfaces/authCode';
import { authCodeSchema } from '../schemas/authCode';

export interface IAuthCodeModel extends IAuthCode, Document {}

export interface IAuthCodeModelStatic extends Model<IAuthCodeModel> {}

export const AuthCode = mongoose.model<IAuthCodeModel, IAuthCodeModelStatic>('AuthCode', authCodeSchema);