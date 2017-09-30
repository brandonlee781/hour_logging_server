import { Schema } from 'mongoose';
import * as uuid from 'uuid/v4';
import * as moment from 'moment';

export const logSchema: Schema = new Schema({
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
  date: {
    type: String,
    required: true,
    default: moment().format('YYYY-MM-DD'),
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
  },
  project: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
});

logSchema.pre('save', function (next) {
  const startTime = moment(this.get('startTime'), ['HH:mm']);
  const endTime = moment(this.get('endTime'), ['HH:mm']);
  this.startTime = startTime.format('HH:mm');
  this.endTime = endTime.format('HH:mm');
  this.duration = endTime.diff(startTime, 'hours', true);
  next();
});
