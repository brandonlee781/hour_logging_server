import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import errorhandler = require('errorhandler');
import RateLimit = require('express-rate-limit');
require('dotenv').config();


// Routes
import LogRouter from './routes/LogRouter';
import LoginRouter from './routes/LoginRouter';
import AccessRouter from './routes/AccessRouter';

// interfaces
import { IUser } from './interfaces/user';
import { ILog } from './interfaces/log';

// models
import { IModel } from './models/Model';
import { IUserModel } from './models/User';
import { ILogModel } from './models/Log';

// schemas
import { userSchema } from './schemas/user';
import { logSchema } from './schemas/log';

// middleware
import auth from './middleware/auth';


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
    const dbUser = process.env.MLAB_USER;
    const dbPass = process.env.MLAB_PASS;
    const MONGODB_CONNECTION: string = 
      `mongodb://${dbUser}:${dbPass}@ds053788.mlab.com:53788/hour_tracker`;
    mongoose.connect(MONGODB_CONNECTION, { useMongoClient: true });
  }

  private middleware(): void {
    const limiter = new RateLimit({
      windowMs: 15 * 60 * 1000,
      max: 15,
      delayMs: 60,
    });
    // CORS options
    const corsOpts = {
      allowedHeaders: [
        'Origins', 
        'X-Requested-With', 
        'Content-Type', 
        'Accept', 
        'X-Access-Token', 
        'Authorization',
      ],
      credentials: true,
      methods: 'GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE',
      origin: 'https://www.branlee.me/',
      preflightContinue: true,
    };

    this.express.use(cors(corsOpts));
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    // catch 404 and forward to error handler
    this.express.use((
      err: any, 
      req: express.Request, 
      res: express.Response, 
      next: express.NextFunction,
    ) => {
      err.status = 404;
      next(err);
    });
    this.express.use(limiter);
    this.express.use(errorhandler());
  }

  private routes(): void {
    const router = express.Router();
    
    
    this.express.get('/', (req, res, next) => {
      res.send('Hello World');
    });

    this.express.use('/', router);
    this.express.use('/api/v1/login', LoginRouter);
    this.express.use('/api/v1/access', AccessRouter);
    this.express.use('/api/v1/logs', auth, LogRouter);
  }
}
export default new App().express;
