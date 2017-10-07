import { ITask } from './task';

export interface IProject {
  id?: string;
  name: string;
  links?: [string];
  tasks?: [ITask];
}
