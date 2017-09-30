import * as mongoose from 'mongoose';
import { Document, Model } from 'mongoose';
import { IInvoice } from '../interfaces/invoice';
import { invoiceSchema } from '../schemas/invoice';

export interface IInvoiceModel extends IInvoice, Document {}

export interface IInvoiceModelStatic extends Model<IInvoiceModel> {}

export const Log = mongoose.model<IInvoiceModel, IInvoiceModelStatic>('Invoice', invoiceSchema);