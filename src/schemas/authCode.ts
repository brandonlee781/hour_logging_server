import { Schema } from 'mongoose';
import * as uuid from 'uuid/v4';

export const authCodeSchema: Schema = new Schema({
  _id: {
    type: String,
    required: true,
    default: uuid,
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
    default: new Date(+new Date() + (2*7*24*60*60*1000))
  }
})