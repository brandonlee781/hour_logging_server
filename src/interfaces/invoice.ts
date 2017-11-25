import { ILog } from './log';

export interface IInvoice {
  id?: string;
  number?: number;
  date?: string;
  logs?: ILog[];
  total?: number;
}
