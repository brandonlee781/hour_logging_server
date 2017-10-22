import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import * as multer from 'multer';
import * as fs from 'fs';
import * as csv from 'csvtojson';
import * as moment from 'moment';
import axios, { AxiosResponse } from 'axios';
const upload = multer({ dest: 'uploads/' });
require('dotenv').config();

export class GithubRouter {
  router: Router;
  ghAPI = axios.create({
    baseURL: 'https://api.github.com/users/brandonlee781/',
    headers: {
      Accept: 'Accept: application/vnd.github.v3+json',
    },
  });

  constructor() {
    this.router = Router();
    this.init();

  }

  /**
   * @class GithubRouter
   * @method getAll
   * @argument req Express request object
   * @argument res Express response object
   * @argument next Express next function
   * @description Gets all responses from Github. Needs to be a fat arrow function to avoid
   * losing the scope of 'this' when the init function is called in the global namespace.
   */
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const repoRes: AxiosResponse = await this.ghAPI.get('/repos?sort=created');
    const repos = repoRes.data;

    const filtered = repos.filter(r => !r.fork);

    res.status(200).json({
      count: filtered.length,
      repos: filtered,
    });
  }

  /**
  * Initialize the Github route
  * 
  * @class GithubRouter
  * @method init
  */
  init() {
    this.router.get('/', this.getAll);
  }
}

const githubRouter = new GithubRouter();
githubRouter.init();
export default githubRouter.router;
