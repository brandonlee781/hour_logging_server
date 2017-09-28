import { Schema } from 'mongoose';

export const userSchema: Schema = new Schema({
  createdAt: {
    type: Date,
    require: true,
    default: Date.now
  },
  email: {
    type: String,
    require: true
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  }
});
