import { suite, test } from "mocha-typescript";
import { ILog } from "../src/interfaces/log";
import chaiHttp = require('chai-http');

let chai = require("chai");
let testID: string;

describe('Log Web API', () => {
  class BaseRouteTest {
    public data: ILog;
    public route = chai.request('http://localhost:3000/api/v1/logs');

    public static before() {
      //require chai and use should() assertions
      chai.should();
      chai.use(chaiHttp);
    }

    constructor() {
      this.data = {
        date: new Date(),
        startTime: '8:00',
        endTime: '12:00',
        duration: 4,
        project: 'Quantogy'
      }
    }
  }

  @suite('POST api/v1/log')
  class CreateLogRoute extends BaseRouteTest {
    @test('should create a new route')
    public create() {
      return this.route
        .post('/')
        .send(this.data)
        .then(result => {
          testID = result.body._id;
          const dateString = (new Date(result.body.date)).toString();
          result.should.have.status(200);
  
          result.body._id.should.exist;
          result.body._id.should.have.lengthOf(36);
          dateString.should.equal(this.data.date.toString());
          result.body.startTime.should.equal(this.data.startTime);
          result.body.endTime.should.equal(this.data.endTime);
          result.body.duration.should.be.an('number');
          result.body.duration.should.equal(this.data.duration);
          result.body.project.should.equal(this.data.project);
        })
    }
  }

  @suite('GET api/v1/log')
  class GetAllLogRoute extends BaseRouteTest {
    @test('should get an array of all log entries')
    public getAll() {
      return this.route
        .get('/')
        .then(result => {
          result.should.have.status(200);
          result.body.should.exist;
          result.body.should.be.an('array');
          result.body.should.satisfy(logs => {
            return logs.every(log => {
              return log instanceof Object;
            })
          })
        })
    }
  }

  @suite('GET api/v1/log/:id')
  class GetOneLogRoute extends BaseRouteTest {
    @test('should get a single, specific log entry')
    public getOne() {
      return this.route
        .get('/'+testID)
        .then(result => {
          result.should.have.status(200);
          result.body.should.exist;
          result.body._id.should.equal(testID);
          result.body.should.have.all.keys('__v', '_id', 'startTime', 'endTime', 'date', 'duration', 'project', 'createdAt');
        })
    }
    @test('should fail to get a route')
    public invalidId() {
      return this.route
        .get('/not-a-real-id')
        .catch(result => {
          result.should.have.status(404);
        })
    }
  }

  @suite('PUT api/v1/log/:id')
  class UpdateLogRoute extends BaseRouteTest {
    @test('should update and return a log entry')
    public update() {
      return this.route
        .put('/'+testID)
        .send({ startTime: '7:00', duration: 5 })
        .then(result => {
          result.should.have.status(200);
          result.body.duration.should.equal(5);
          result.body.startTime.should.equal('7:00');
        })
    }

    @test('should fail to update route')
    public invalidId() {
      return this.route
        .put('/invalid-id')
        .send({ startTime: '7:00', duration: 5 })
        .catch(result => {
          result.should.have.status(404);
        })
    }
  }

  @suite('DELETE api/v1/log/:id')
  class DeleteLogRoute extends BaseRouteTest {
    @test('should delete a log entry and return no data')
    public delete() {
      return this.route
        .delete('/'+testID)
        .then(result => {
          result.should.have.status(204);
          result.body.should.be.empty;
        })
    }

    @test('should fail to delete a log entry')
    public invalidId() {
      return this.route
        .delete('/invalid-id')
        .catch(result => {
          result.should.have.status(404);
        })
    }
  }
});