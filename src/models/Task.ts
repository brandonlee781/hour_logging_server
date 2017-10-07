import * as mongoose from 'mongoose';
import { ITask } from '../interfaces/task';
import { taskSchema } from '../schemas/task';

export interface ITaskModel extends ITask, mongoose.Document {}

export interface ITaskModelStatic extends mongoose.Model<ITaskModel> {}

export default mongoose.model<ITaskModel, ITaskModelStatic>('Project', taskSchema);
