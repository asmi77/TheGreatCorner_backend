process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");

var server = require('../test-server/routage');
var Prod = require("../test-server/models/prod");

var should = chai.should();
chai.use(chaiHttp);
   
    describe('Prods', function() {
      Prod.collection.drop();
      
        beforeEach(function(done){
          var newProd = new Prod({
            name: 'Mocha',
          });
          newProd.save(function(err) {
            done();
          });
        });
        afterEach(function(done){
          Prod.collection.drop();
          done();
        });
        it('should list ALL Prod on /prod GET', function(done) {
            chai.request(server)
              .get('/prod')
              .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].name.should.equal('Mocha');
                done();
              });
          });
         
  it('should add a SINGLE prod on /prod POST', function(done) {
    chai.request(server)
      .post('/prod')
      .send({'name': 'Mocha'})
      .end(function(err, res){
        console.log('res.body', res.body)
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('SUCCESS');
        res.body.SUCCESS.should.be.a('object');
        res.body.SUCCESS.should.have.property('name');
        res.body.SUCCESS.should.have.property('_id');
        res.body.SUCCESS.name.should.equal('Mocha');
        done();
      });
  });
  it('should list a SINGLE prod on /prod/<id> GET', function(done) {
    var newProd = new Prod({
      name: 'Mocha'
    });
    newProd.save(function(err, data) {
      chai.request(server)
        .get('/prod/'+data.id)
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('name');
          res.body.name.should.equal('Mocha');
          res.body._id.should.equal(data.id);
          done();
        });
    });
});
it('should update a SINGLE prod on /prod/<id> PUT', function(done) {
    chai.request(server)
      .get('/prod')
      .end(function(err, res){
        chai.request(server)
          .put('/prod/'+res.body[0]._id)
          .send({'name': 'Mocha'})
          .end(function(error, response){
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('UPDATED');
            response.body.UPDATED.should.be.a('object');
            response.body.UPDATED.should.have.property('name');
            response.body.UPDATED.should.have.property('_id');
            response.body.UPDATED.name.should.equal('Mocha');
            done();
        });
      });
  });
  it('should delete a SINGLE prod on /prod/<id> DELETE', function(done) {
    chai.request(server)
      .get('/prod')
      .end(function(err, res){
        chai.request(server)
          .delete('/prod/'+res.body[0]._id)
          .end(function(error, response){
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            response.body.should.have.property('REMOVED');
            response.body.REMOVED.should.be.a('object');
            response.body.REMOVED.should.have.property('name');
            response.body.REMOVED.should.have.property('_id');
            response.body.REMOVED.name.should.equal('Mocha');
            done();
        });
      });
  });
});