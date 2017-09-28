import * as mongoose from 'mongoose';
import { Document, Model } from 'mongoose';
import { IAccessCode } from '../interfaces/accessCode';
import { accessCodeSchema } from '../schemas/accessCode';

export interface IAccessCodeModel extends IAccessCode, Document {}

export interface IAccessCodeModelStatic extends Model<IAccessCodeModel> {}

export const AccessCode = mongoose.model<IAccessCodeModel, IAccessCodeModelStatic>('AccessCode', accessCodeSchema);