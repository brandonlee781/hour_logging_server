export interface IInvoiceProject {
  name?: string;
  hours?: number;
  amount?: number;
}

export interface IInvoice {
  id?: string;
  number?: number;
  date?: string;
  projects?: IInvoiceProject[];
  total?: number;
}
