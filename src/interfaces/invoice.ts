import { ILog } from './log';

export interface IInvoice {
  id?: string;
  number?: number;
  date?: string;
  projects?: ILog[];
  total?: number;
}
