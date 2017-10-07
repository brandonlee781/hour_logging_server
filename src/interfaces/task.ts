export interface ITask {
  type: 'Task';
  id?: string;
  name: string;
  completed?: Boolean;
  createdAt: Date;
  completedAt: Date;
}
