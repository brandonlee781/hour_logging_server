import { Schema } from 'mongoose';
import * as uuid from 'uuid/v4';

export const taskSchema: Schema = new Schema({
  _id: {
    type: String,
    required: true,
    default: uuid,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: false,
    default: false,
  },
  completedAt: {
    type: Date,
    required: false,
  },
},{
  timestamps: true,
});
