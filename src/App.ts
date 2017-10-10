import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import errorhandler = require('errorhandler');
import RateLimit = require('express-rate-limit');
import helmet = require('helmet');
require('dotenv').config();


// Routes
import LoginRouter from './routes/LoginRouter';
import AccessRouter from './routes/AccessRouter';
import LogRouter from './routes/LogRouter';
import ProjectRouter from './routes/ProjectRouter';

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
    const MONGODB_CONNECTION: string = 'mongodb://localhost:/hour_logger';
    // `mongodb://${dbUser}:${dbPass}@ds053788.mlab.com:53788/hour_tracker`;
    mongoose.connect(MONGODB_CONNECTION, { useMongoClient: true });
  }

  private middleware(): void {
    const limiter = new RateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
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
      // origin: ['https://www.branlee.me/', process.env.HOME_IP],
      preflightContinue: true,
    };

    this.express.use(cors(corsOpts));
    this.express.use(helmet());
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
      if (err) {
        console.error(err);
      }
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

    this.express.options('/*', (
      req: express.Request, 
      res: express.Response, 
      next: express.NextFunction,
    ) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
      res.header(
        'Access-Control-Allow-Headers', 
        'X-Requested-With,Content-Type,Content-Length,Authorization',
      );
      res.sendStatus(200);
    });

    this.express.use('/', router);
    this.express.use('/api/v1/login', LoginRouter);
    this.express.use('/api/v1/access', AccessRouter);
    this.express.use('/api/v1/logs', auth, LogRouter);
    this.express.use('/api/v1/projects', auth, ProjectRouter);
  }
}
export default new App().express;
