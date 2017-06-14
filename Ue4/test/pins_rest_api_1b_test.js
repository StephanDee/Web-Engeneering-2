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
var pinIncorrectNumber = cfg.pinIncorrectNumber;
var pinIncorrectType = cfg.pinIncorrectType;

// start of tests ********************************************************************************
describe('Task 1.b JSON Error data', function() {
    var pinCorrect1Result = null;
    var pinCorrect2Result = null;
    var pinIDsCleanup = [];
    describe('/pins REST API POST', function() {
        // good POSTs
        it('should save a proper POST with required fields and add all missing ones with default-values', function(done) {
            var startDate = new Date();
            request(pinURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinCorrectMin)
                .expect('Content-Type', /json/)
                .expect(codes.created)
                .end(function(err, res) {
                    var stopDate = new Date();
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.properties(Object.getOwnPropertyNames(pinCorrectMin));
                    res.body.should.have.property('id').above(0);
                    res.body.should.have.property('timestamp').within(startDate.getTime()-30000, stopDate.getTime()+30000);
                    res.body.should.have.property('views', 0);
                    res.body.should.have.property('ranking', 0);
                    pinCorrect1Result = res.body;
                    pinIDsCleanup.push(res.body.id);
                    done();
                })
        });
        it('should save a proper POST with all fields', function(done) {
            request(pinURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinCorrectMax)
                .expect('Content-Type', /json/)
                .expect(codes.created)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.properties(Object.getOwnPropertyNames(pinCorrectMax));
                    res.body.should.have.property('id');
                    res.body.id.should.be.above(0);
                    res.body.views.should.equal(pinCorrectMax.views);
                    res.body.ranking.should.equal(pinCorrectMax.ranking);
                    pinCorrect2Result = res.body;
                    pinIDsCleanup.push(res.body.id);
                    done();
                })
        });

        // bad POSTs
        it('should detect a post to wrong URL (/pins/:id) and answer with code 405 and with a JSON error object', function(done) {
            request(pinURL)
                .post('/123')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinCorrectMax)
                .expect('Content-Type', /json/)
                .expect(codes.wrongmethod)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.property('error');
                    res.body.error.should.have.properties('message', 'code');
                    if (res.body.id) { // in case the test failed and POST was saved
                        pinIDsCleanup.push(res.body.id);
                    }
                    done();
                })
        });
        // bad POST, body contains nonsense (not JSON)
        it('should detect a post with bad body and send status 400 and a JSON error object', function(done) {
            request(pinURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send('this is not proper JSON')
                .expect('Content-Type', /json/)
                .expect(codes.wrongrequest)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.property('error');
                    res.body.error.should.have.properties('message', 'code');
                    if (res.body.id) { // in case the test failed and POST was saved
                        pinIDsCleanup.push(res.body.id);
                    }
                    done();
                })
        });
        it('should detect a post with wrong numeric values and answer with code 400 and with a JSON error object', function(done) {
            request(pinURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinIncorrectNumber)
                .expect('Content-Type', /json/)
                .expect(codes.wrongrequest)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.property('error');
                    res.body.error.should.have.properties('message', 'code');
                    if (res.body.id) { // in case the test failed and POST was saved
                        pinIDsCleanup.push(res.body.id);
                    }
                    done();
                })
        });
        it('should detect a POST with wrong type value and answer with code 400 and with a JSON error object', function(done) {
            request(pinURL)
                .post('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinIncorrectType)
                .expect('Content-Type', /json/)
                .expect(codes.wrongrequest)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.property('error');
                    res.body.error.should.have.properties('message', 'code');
                    if (res.body.id) { // in case the test failed and POST was saved
                        pinIDsCleanup.push(res.body.id);
                    }
                    done();
                })
        });
    });
    // *******************************************************
    describe('/pins/:id REST API PUT', function() {
        // good PUTs
        it('should save a proper PUT with required fields and change in .views', function(done) {
            pinCorrect1Result.views = 4*60+2;
            request(pinURL)
                .put('/'+pinCorrect1Result.id)
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinCorrect1Result)
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.properties(Object.getOwnPropertyNames(pinCorrect1Result));
                    res.body.should.have.property('id', pinCorrect1Result.id);
                    res.body.should.have.property('views', pinCorrect1Result.views);
                    done();
                })
        });
        it('should save a proper PUT with all fields and change in .ranking', function(done) {
            pinCorrect2Result.ranking = 13;
            request(pinURL)
                .put('/'+pinCorrect2Result.id)
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinCorrect2Result)
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.properties(Object.getOwnPropertyNames(pinCorrect2Result));
                    res.body.should.have.property('id', pinCorrect2Result.id);
                    res.body.should.have.property('ranking', pinCorrect2Result.ranking);
                    done();
                })
        });

        // bad PUTs
        it('should detect a PUT to wrong URL (/pins/ without id) and answer with code 405 and with a JSON error object', function(done) {
            request(pinURL)
                .put('/')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinCorrect1Result)
                .expect('Content-Type', /json/)
                .expect(codes.wrongmethod)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.property('error');
                    res.body.error.should.have.properties('message', 'code');
                    done();
                })
        });
        // bad PUT, body contains nonsense (not JSON)
        it('should detect a PUT with bad body and send status 400 and with a JSON error object', function(done) {
            request(pinURL)
                .put('/'+pinCorrect1Result.id)
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send('this is not proper JSON')
                .expect('Content-Type', /json/)
                .expect(codes.wrongrequest)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.property('error');
                    res.body.error.should.have.properties('message', 'code');
                    done();
                })
        });
        // bad PUT, body contains nonsense (not JSON)
        it('should detect a PUT with missing id in body and send status 400 and with a JSON error object', function(done) {
            var pinCorr1CopyNoId = JSON.parse(JSON.stringify(pinCorrect1Result));
            delete pinCorr1CopyNoId.id;
            request(pinURL)
                .put('/'+pinCorrect1Result.id)
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(pinCorr1CopyNoId)
                .expect('Content-Type', /json/)
                .expect(codes.wrongrequest)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.property('error');
                    res.body.error.should.have.properties('message', 'code');
                    done();
                })
        });
    });
    // *******************************************************
    describe('/pins/:id REST API DELETE', function() {
        // good DELETEs
        it('should properly delete and answer with code 204', function(done) {
            request(pinURL)
                .delete('/'+pinCorrect1Result.id)
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect(codes.nocontent)
                .end(function(err, res) {
                    should.not.exist(err);
                    done();
                })
        });
        // bad DELETEs
        it('should properly detect if a resource does not exist for delete and answer with code 404 and with a JSON error object', function(done) {
            request(pinURL)
                .delete('/'+pinCorrect1Result.id)
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.notfound)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.property('error');
                    res.body.error.should.have.properties('message', 'code');
                    done();
                })
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
