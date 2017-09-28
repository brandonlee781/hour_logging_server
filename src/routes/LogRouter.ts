import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
require('dotenv').config();

import { Log, ILogModel } from '../models/log';

/**
 * @class LogRouter
 */
export class LogRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Create a new log entry
   * 
   * @class LogRouter
   * @public
   * @method create
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public create(req: Request, res: Response, next: NextFunction) {
    let log = new Log(req.body);
    log.save().then(log => {
      res.json(log.toObject());
      return next();
    }).catch(next);
  }

  /**
   * GET all log entries
   * 
   * @class LogRouter
   * @public
   * @method getAll
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public getAll(req: Request, res: Response, next: NextFunction) { 
    Log.find().then(logs => {
      res.send(logs.map(log => log.toObject()));
      return next();
    })
  }

  /**
   * GET one log entry
   * 
   * @class LogRouter
   * @public
   * @method getOne
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public getOne(req: Request, res: Response, next: NextFunction) {
    const logID: string = req.params.id;
    Log.findById(logID).then(log => {
      if (!log) {
        res.status(404).send();
        return next();
      } else {
        res.status(200).send(log.toObject());
        return next();
      }
    }).catch(next);
  }

  /**
   * UPDATE one log entry
   * 
   * @class LogRouter
   * @public
   * @method update
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public update(req: Request, res: Response, next: NextFunction) {
    const logID: string = req.params.id;
    Log.findById(logID).then(log => {
      if (!log) {
        res.status(404).send();
        return next();
      } else {
        return Object.assign(log, req.body).save()
          .then((log: ILogModel) => {
            res.send(log.toObject());
            return next();
          })
      }
    })
    .catch(next);
  }
  /**
   * DELETE one log entry
   * 
   * @class LogRouter
   * @public
   * @method delete
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public delete(req: Request, res: Response, next: NextFunction) {
    const logID: string = req.params.id;
    Log.findById(logID).then(log => {
      console.log(log);
      if (!log) {
        res.sendStatus(404);
        return next();
      } else {
        log.remove()
          .then(() => {
            res.sendStatus(204);
            return next();
          });
      }
    })
    .catch(next);
  }

  /**
   * Initialize the Log route
   * 
   * @class LogRouter
   * @method init
   */
  init() {
    this.router.post('/', this.create);
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);
    this.router.put('/:id', this.update);
    this.router.delete('/:id', this.delete);
  }
}

const logRouter = new LogRouter();
logRouter.init();
export default logRouter.router;