import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import * as multer from 'multer';
import * as fs from 'fs';
import * as csv from 'csvtojson';
import * as moment from 'moment';
const upload = multer({ dest: 'uploads/' });
require('dotenv').config();

import Log, { ILogModel } from '../models/Log';

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
    const log = new Log(req.body);
    log.save().then((result) => {
      res.json(result.toObject());
      return;
    }).catch(next);
  }

  public fileUpload(req: Request, res: Response, next: NextFunction) {
    fs.readFile(req.file.path, (err, data) => {
      if (err) {
        res.status(500).send(err);
      }
      const hourArray = [];
      csv().fromString(data.toString())
        .on('json', (jsonObject, rowIndex) => {
          const hourObj = {
            date: jsonObject.date,
            startTime: jsonObject['start time'],
            endTime: jsonObject['end time'],
            project: jsonObject.project,
            duration: jsonObject['total hours'],
            note: jsonObject.notes,
          };
          hourArray.push(hourObj);
        })
        .on('done', (result) => {
          Log.create(hourArray)
            .then((logs) => {
              res.sendStatus(200);
            })
            .catch((err) => {
              res.status(500).send(err);
            });
        })
        .on('error', (err) => {
          res.status(500).send(err);
        });
    });
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
    const search = { date: { $gte: '01/01/1970', $lte: moment().format('MM/DD/YYYY') } };
    let searchLimit = 20;
    if (req.query.fromDate) {
      search.date['$gte'] = moment(req.query.fromDate, 'YYYY-MM-DD')
                              .startOf('day')
                              .format('MM/DD/YYYY');
      searchLimit = 10000;
    }
    if (req.query.toDate) {
      search.date['$lte'] = moment(req.query.toDate, 'YYYY-MM-DD')
                              .endOf('day')
                              .format('MM/DD/YYYY');
      searchLimit = 10000;
    }
    Log
      .find(search)
      .skip(+req.query.skip || 0)
      .limit(searchLimit)
      .sort({ date: -1, startTime: -1, createdAt: -1 })
      .then((logs) => {
        res.send(logs.map(log => log.toObject()));
        return;
      })
      .catch((err) => {
        res.status(500).send(err);
        return;
      });
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
    Log.findById(logID).then((log) => {
      if (!log) {
        res.status(404).send();
        return;
      } else {
        res.status(200).send(log.toObject());
        return;
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
    Log.findById(logID).then((log) => {
      if (!log) {
        res.status(404).send();
        return;
      } else {
        return Object.assign(log, req.body).save()
          .then((log: ILogModel) => {
            res.send(log.toObject());
            return;
          });
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
    Log.findById(logID).then((log) => {
      if (!log) {
        res.sendStatus(404);
        return;
      } else {
        log.remove()
          .then(() => {
            res.sendStatus(204);
            return;
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
    this.router.post('/upload', upload.single('hour-log'), this.fileUpload);
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);
    this.router.put('/:id', this.update);
    this.router.delete('/:id', this.delete);
  }
}

const logRouter = new LogRouter();
logRouter.init();
export default logRouter.router;
