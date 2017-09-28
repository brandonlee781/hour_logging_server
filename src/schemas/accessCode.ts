import { Schema } from 'mongoose';
import * as uuid from 'uuid/v4';

export const accessCodeSchema: Schema = new Schema({
  _id: {
    type: String,
    required: true,
    default: uuid(),
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    default: new Date(+new Date() + (3*60*1000)) // 3 minutes
  }
})