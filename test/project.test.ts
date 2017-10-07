import { IProjectModel } from '../src/models/Project';
import { suite, test } from 'mocha-typescript';
import { IProject } from '../src/interfaces/project';
import chaiHttp = require('chai-http');

const chai = require('chai');
let testID: string;

describe('Project Web API', () => {
  class BaseRouteTest {
    public data: IProject;
    public route = chai.request('http://localhost:3000/api/v1/projects');

    public static before(done) {
      // require chai and use should() assertions
      chai.should();
      chai.use(chaiHttp);
      done();
    }

    constructor() {
      this.data = {
        name: 'Test Project',
        links: [
          'https://www.google.com/',
          'https://www.reddit.com/',
        ],
      };
    }
  }

  @suite('POST api/v1/project')
  class CreateProjectRoute extends BaseRouteTest {
    @test('should create a new project')
    public create() {
      return this.route
        .post('/')
        .set('Authorization', `Bearer ${process.env.TEST_CODE}`)
        .send(this.data)
        .then((result) => {
          const testProject = result.body;
          testID = testProject._id;
          result.should.have.status(201);
          testProject.should.exist;
          testProject._id.should.exist;
          testProject._id.should.be.an('string');
          testProject._id.should.have.lengthOf(36);
        });
    }
  }

  @suite('GET api/v1/project')
  class GetAllProjectRoute extends BaseRouteTest {
    @test('should get an array of all project entries')
    public getAll() {
      return this.route
        .get('/')
        .set('Authorization', `Bearer ${process.env.TEST_CODE}`)
        .then((result) => {
          result.should.have.status(200);
          result.body.should.exist;
          result.body.should.be.an('array');
          result.body.should.satisfy((projects) => {
            return projects.every((project) => {
              return project instanceof Object;
            });
          });
        });
    }
  }

  @suite('GET api/v1/project/:id')
  class GetOneProjectRoute extends BaseRouteTest {
    @test('should get a single, specific project')
    public getOne() {
      return this.route
        .get('/' + testID)
        .set('Authorization', `Bearer ${process.env.TEST_CODE}`)
        .then((result) => {
          result.should.have.status(200);
          result.body.should.exist;
          result.body._id.should.equal(testID);
          result.body.should.have.all.keys(
            '__v', 
            '_id', 
            'name', 
            'links', 
            'tasks',
            'createdAt',
            'updatedAt',
          );
        });
    }
    @test('should fail to get a project')
    public invalidId() {
      return this.route
        .get('/not-a-real-id')
        .set('Authorization', `Bearer ${process.env.TEST_CODE}`)
        .catch((result) => {
          result.should.have.status(404);
        });
    }
  }

  @suite('PUT api/v1/project/:id')
  class UpdateProjectRoute extends BaseRouteTest {
    @test('should update and return a project')
    public update() {
      return this.route
        .put('/' + testID)
        .set('Authorization', `Bearer ${process.env.TEST_CODE}`)
        .send({ links: ['https://www.google.com'] })
        .then((result) => {
          result.should.have.status(200);
          result.body.links.should.be.an('array');
          result.body.links.should.have.lengthOf(1);
          result.body.name.should.equal('Test Project');
          result.body.updatedAt.should.not.equal(result.body.createdAt);
        });
    }

    @test('should fail to update route')
    public invalidId() {
      return this.route
        .put('/invalid-id')
        .set('Authorization', `Bearer ${process.env.TEST_CODE}`)
        .send({ links: ['https://www.google.com'] })
        .catch((result) => {
          result.should.have.status(404);
        });
    }

    @test('should add a valid task')
    public addValidTask() {
      return this.route
        .put('/' + testID)
        .set('Authorization', `Bearer ${process.env.TEST_CODE}`)
        .send({ 
          tasks: [{ name: 'Work on stuff' }],
        })
        .catch((result) => {
          result.should.have.status(200);
          result.body.tasks.should.have.lengthOf(1);
          result.body.links.should.have.lengthOf(1); // PUT test will have mutated the original data
          result.body.name.should.equal('Test Project');
          result.body.updatedAt.should.not.equal(result.body.createdAt);
        });
    }

    @test('should fail to add an invalid task')
    public addInvalidTask() {
      return this.route
        .put('/' + testID)
        .set('Authorization', `Bearer ${process.env.TEST_CODE}`)
        .send({ 
          tasks: [{ title: 'Work on stuff' }],
        })
        .catch((result) => {
          result.should.have.status(400);
        });
    }
  }

  @suite('DELETE api/v1/project/:id')
  class DeleteLogRoute extends BaseRouteTest {
    @test('should delete a log entry and return no data')
    public delete() {
      return this.route
        .delete('/' + testID)
        .set('Authorization', `Bearer ${process.env.TEST_CODE}`)
        .then((result) => {
          result.should.have.status(204);
          result.body.should.be.empty;
        });
    }

    @test('should fail to delete a log entry')
    public invalidId() {
      return this.route
        .delete('/invalid-id')
        .set('Authorization', `Bearer ${process.env.TEST_CODE}`)
        .catch((result) => {
          result.should.have.status(404);
        });
    }
  }
});
