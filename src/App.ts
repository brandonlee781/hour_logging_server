import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import errorHandler = require('errorhandler');
require('dotenv').config();


// Routes
import LogRouter from './routes/LogRouter';
import LoginRouter from './routes/LoginRouter';
import AccessRouter from './routes/AccessRouter';

// interfaces
import { IUser } from './interfaces/user';
import { ILog } from './interfaces/Log';

// models
import { IModel } from './models/model';
import { IUserModel } from './models/user';
import { ILogModel } from './models/log';

// schemas
import { userSchema } from './schemas/user';
import { logSchema } from './schemas/log';

// middleware
import Auth from './middleware/auth';


class App {
  public express: express.Application;
  private model: IModel;

  constructor() {
    this.model = Object();
    this.express = express();
    this.config();
    this.middleware();
    this.routes();
  }

  private config(): void {
    const MONGODB_CONNECTION: string = `mongodb://${process.env.MLAB_USER}:${process.env.MLAB_PASS}@ds053788.mlab.com:53788/hour_tracker`;
    mongoose.connect(MONGODB_CONNECTION, { useMongoClient: true });
  }

  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    //catch 404 and forward to error handler
    this.express.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      err.status = 404;
      next(err);
    });
    this.express.use(errorHandler());
  }

  private routes(): void {
    let router = express.Router();
    
    // CORS options
    const corsOpts = {
      allowedHeaders: ['Origins', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
      credentials: true,
      methods: 'GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE',
      origin: 'http://localhost:8080',
      preflightContinue: true
    };
    router.use(cors());

    this.express.use('/', router);
    this.express.use('/login', LoginRouter);
    this.express.use('/access', AccessRouter);
    this.express.use('/api/v1/logs', Auth, LogRouter);
  }
}
export default new App().express;