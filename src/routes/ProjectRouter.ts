import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import * as moment from 'moment';
require('dotenv').config();

import Project, { IProjectModel } from '../models/Project';
import Task, { ITaskModel } from '../models/Task';

/**
 * @class ProjectRouter
 */
export class ProjectRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Create a new log entry
   * 
   * @class ProjectRouter
   * @public
   * @method create
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const project: IProjectModel = new Project(req.body);
      const savedProject: IProjectModel = await project.save();
      return res.status(201).json(savedProject.toObject());
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET all project entries
   * 
   * @class ProjectRouter
   * @public
   * @method getAll
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public async getAll(req: Request, res: Response, next: NextFunction) { 
    try {
      const projects: IProjectModel[] = await Project.find().skip(+req.query.skip || 0);
      res.status(200).send(projects.map(project => project.toObject()));
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET one project
   * 
   * @class ProjectRouter
   * @public
   * @method getOne
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const projectID: string = req.params.id;
      const project: IProjectModel = await Project.findById(projectID);
      if (project) {
        res.status(200).send(project.toObject());
      } else {
        res.status(404).send({ message: 'Project does not exist' });
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * UPDATE one log entry
   * 
   * @class Project
   * @public
   * @method update
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const projectID: string = req.params.id;
      const project: IProjectModel = await Project.findById(projectID);
      if (project) {
        const updatedProject: IProjectModel = await Object.assign(project, req.body).save();
        res.status(200).send(updatedProject.toObject()); 
      } else {
        res.status(404).send({ message: 'Project does not exist' });
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
   * DELETE one project entry
   * 
   * @class ProjectRouter
   * @public
   * @method delete
   * @param req {Request} The request object
   * @param res {Response} The response object
   * @param next {NextFunction} The next function to continue
   */
  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const logID: string = req.params.id;
      const project: IProjectModel = await Project.findById(logID);
      if (project) {
        const deletedProject = await project.remove();
        return res.sendStatus(204);
      } else {
        return res.sendStatus(404);
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

/**
   * Initialize the Log route
   * 
   * @class ProjectRouter
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

const projectRouter = new ProjectRouter();
projectRouter.init();
export default projectRouter.router;
