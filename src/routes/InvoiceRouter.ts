import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import * as moment from 'moment';
require('dotenv').config();

import Invoice, { IInvoiceModel } from '../models/Invoice';

/**
 * @class InvoiceRouter
 */
export class InvoiceRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Create a new log entry
   * 
   * @class InvoiceRouter
   * @public
   * @method create
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoice: IInvoiceModel = new Invoice(req.body);
      const savedInvoice: IInvoiceModel = await invoice.save();
      res.status(201).json(savedInvoice.toObject());
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET all invoice entries
   * 
   * @class InvoiceRouter
   * @public
   * @method getAll
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> { 
    try {
      const invoices: IInvoiceModel[] = await Invoice.find().skip(+req.query.skip || 0);
      res.status(200).send(invoices.map(invoice => invoice.toObject()));
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET one invoice
   * 
   * @class InvoiceRouter
   * @public
   * @method getOne
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoiceID: string = req.params.id;
      const invoice: IInvoiceModel = await Invoice.findById(invoiceID);
      if (invoice) {
        res.status(200).send(invoice.toObject());
      } else {
        res.status(404).send({ message: 'Invoice does not exist' });
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * UPDATE one log entry
   * 
   * @class Invoice
   * @public
   * @method update
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoiceID: string = req.params.id;
      const invoice: IInvoiceModel = await Invoice.findById(invoiceID);
      if (invoice) {
        const updatedInvoice: IInvoiceModel = await Object.assign(invoice, req.body).save();
        res.status(200).send(updatedInvoice.toObject()); 
      } else {
        res.status(404).send({ message: 'Invoice does not exist' });
      }
    } catch (err) {
      if (err.toString().includes('ValidationError: tasks')) {
        res.status(400).send({ message: 'Invalid task(s)' });
        return;
      } else {
        next(err);
      }
    }
  }

  /**
   * DELETE one invoice entry
   * 
   * @class InvoiceRouter
   * @public
   * @method delete
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoiceID: string = req.params.id;
      const invoice: IInvoiceModel = await Invoice.findById(invoiceID);
      if (invoice) {
        const deletedInvoice = await invoice.remove();
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      next(err);
    }
  }

/**
   * Initialize the Log route
   * 
   * @class InvoiceRouter
   * @method init
   */
  init(): void {
    this.router.post('/', this.create);
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);
    this.router.put('/:id', this.update);
    this.router.delete('/:id', this.delete);
  }
}

const invoiceRouter = new InvoiceRouter();
invoiceRouter.init();
export default invoiceRouter.router;
