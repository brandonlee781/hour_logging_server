import * as mongoose from 'mongoose';
import { IProject } from '../interfaces/project';
import { projectSchema } from '../schemas/project';

export interface IProjectModel extends IProject, mongoose.Document {}

export interface IProjectModelStatic extends mongoose.Model<IProjectModel> {}

export default mongoose.model<IProjectModel, IProjectModelStatic>('Project', projectSchema);
