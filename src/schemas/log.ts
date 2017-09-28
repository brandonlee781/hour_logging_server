import { Schema } from 'mongoose';
import * as uuid from 'uuid/v4';

export const logSchema: Schema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  _id: {
    type: String,
    required: true,
    default: uuid(),
    unique: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  project: {
    type: String,
    required: true
  }

})