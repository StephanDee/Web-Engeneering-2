/** This is a testfile to be run wit mocha.
 *  Remember to start your nodeJS server before and edit config_for_tests for a proper baseURL.
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 */
"use strict";

var should = require('should');
require('should-http');
var request = require('supertest');
var cfg = require('./config_for_tests');

var baseURL = cfg.baseURL; // please change it in file config_for_tests.js
var pinURL = cfg.pinURL;


// some helper objects and function to be send to node ********************************************
var codes = cfg.codes;
var pinCorrectMin = cfg.pinCorrectMin;
var pinCorrectMax = cfg.pinCorrectMax;
var pinCorrect3 = cfg.pinCorrect3;
var pinCorrect4 = cfg.pinCorrect4;

// start of tests ********************************************************************************
describe.skip('Task 2.b Limits and Offset', function() {
    var pinResults = [];
    var totalResults = [];
    var total = 0;
    var pinIDsCleanup = [];
    describe('/pins REST API Filling by POSTS (Preparation...)', function() {
        // ask for correct filters
        it('should again create a pin on POST', function(done) {
            request(pinURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinCorrectMin)
                .expect('Content-Type', /json/)
                .expect(codes.created)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.property('id').above(0);
                    pinResults.push(res.body);
                    pinIDsCleanup.push(res.body.id);
                    done();
                });
        });
        it('should again create a 2. pin on POST', function(done) {
            request(pinURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinCorrectMax)
                .expect('Content-Type', /json/)
                .expect(codes.created)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.property('id').above(0);
                    pinResults.push(res.body);
                    pinIDsCleanup.push(res.body.id);
                    done();
                });
        });
        it('should again create a 3. pin on POST', function(done) {
            request(pinURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinCorrect3)
                .expect('Content-Type', /json/)
                .expect(codes.created)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.property('id').above(0);
                    pinResults.push(res.body);
                    pinIDsCleanup.push(res.body.id);
                    done();
                });
        });
        it('should again create a 4. pin on POST', function(done) {
            request(pinURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinCorrect4)
                .expect('Content-Type', /json/)
                .expect(codes.created)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.property('id').above(0);
                    pinResults.push(res.body);
                    pinIDsCleanup.push(res.body.id);
                    done();
                });
        });
        it('should deliver all pins without any limits or offsets', function(done) {
            request(pinURL)
                .get('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.length.should.be.above(3);
                    total = res.body.length;
                    totalResults = res.body;
                    done();
                });
        });
    });
    // here start the real limit/offset tests with the data inserted above **************
    describe("now testing limit and offset", function() {
        it('should deliver 2 pins less on offset=2', function(done) {
            request(pinURL)
                .get('/?offset=2')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.length.should.be.equal(total - 2);
                    res.body[0].should.containEql(totalResults[2]);
                    done();
                });
        });
        it('should deliver all pins on offset=0', function(done) {
            request(pinURL)
                .get('/?offset=0')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.length.should.be.equal(total);
                    res.body[0].should.containEql(totalResults[0]);
                    res.body[total-1].should.containEql(totalResults[total-1]);
                    done();
                });
        });
        it('should deliver only the first pin on limit=1', function(done) {
            request(pinURL)
                .get('/?limit=1')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.length.should.be.equal(1);
                    res.body[0].should.containEql(totalResults[0]);
                    done();
                });
        });
        it('should deliver the last 2 items on offset=[number of pins - 2]&limit=100', function(done) {
            request(pinURL)
                .get('/?limit=100&offset='+(total-2))
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.length.should.be.equal(2);
                    res.body[0].should.containEql(totalResults[total-2]);
                    res.body[1].should.containEql(totalResults[total-1]);
                    done();
                });
        });
        it('should deliver the 2. and 3. element on offset=1&limit=2', function(done) {
            request(pinURL)
                .get('/?limit=2&offset=1')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.length.should.be.equal(2);
                    res.body[0].should.containEql(totalResults[1]);
                    res.body[1].should.containEql(totalResults[2]);
                    done();
                });
        });
        // bad offset/limit values
        it('should detect a negative number in offset and send status 400', function(done) {
            request(pinURL)
                .get('/?offset=-1')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.wrongrequest)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    done();
                });
        });
        it('should detect a negative number in limit and send status 400', function(done) {
            request(pinURL)
                .get('/?limit=-1')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.wrongrequest)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    done();
                });
        });
        it('should detect a nonsense value in offset and limit and send status 400', function(done) {
            request(pinURL)
                .get('/?limit=no&offset=print')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.wrongrequest)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    done();
                });
        });
        it('should not allow a limit of 0 and send status 400', function(done) {
            request(pinURL)
                .get('/?limit=0&offset=1')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.wrongrequest)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    done();
                });
        });
        it('should not allow an offset equal or beyond the length of list and send status 400', function(done) {
            request(pinURL)
                .get('/?limit=2&offset='+total)
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.wrongrequest)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    done();
                });
        });
    });
    // delete the  posted pins at end if not already deleted...
    after(function(done) {
        var numDone = pinIDsCleanup.length;
        for (var i = 0; i < pinIDsCleanup.length; i++) {
            request(pinURL)
                .delete('/' + pinIDsCleanup[i])
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect(true)
                .end(function() {
                    if (--numDone === 0) {
                        done();
                    }
                });
        };
        if (numDone === 0) {
            done();
        }
    });
});
