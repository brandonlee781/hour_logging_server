import { Schema } from 'mongoose';
import * as uuid from 'uuid/v4';
import { taskSchema } from './task';

export const projectSchema: Schema = new Schema({
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
  links: {
    type: [String],
    required: false,
  },
  tasks: {
    type: [taskSchema],
    required: false,
  },
},{
  timestamps: true,
});
