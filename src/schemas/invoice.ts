import { Schema } from 'mongoose';
import * as uuid from 'uuid/v4';
import * as moment from 'moment';
import { logSchema } from './log';

export const invoiceSchema: Schema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  _id: {
    type: String,
    required: true,
    default: uuid,
    unique: true,
  },
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  project: {
    type: Object,
    required: true, 
  },
});
