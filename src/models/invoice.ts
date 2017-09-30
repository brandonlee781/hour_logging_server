import * as mongoose from 'mongoose';
import { IInvoice } from '../interfaces/invoice';
import { invoiceSchema } from '../schemas/invoice';

export interface IInvoiceModel extends IInvoice, mongoose.Document {}

export interface IInvoiceModelStatic extends mongoose.Model<IInvoiceModel> {}

export default mongoose.model<IInvoiceModel, IInvoiceModelStatic>('Invoice', invoiceSchema);
