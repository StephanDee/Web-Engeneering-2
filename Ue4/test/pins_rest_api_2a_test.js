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

// start of tests ********************************************************************************
describe.skip('Task 2.a Filter', function() {
    var pinCorrect1Result = null;
    var pinCorrect2Result = null;
    var pinIDsCleanup = [];
    describe('/pins REST API Filtering', function() {
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
                    res.body.should.have.properties(Object.getOwnPropertyNames(pinCorrectMin));
                    res.body.should.have.property('id').above(0);
                    pinCorrect1Result = res.body;
                    pinIDsCleanup.push(res.body.id);
                    done();
                });
        });
        it('should correctly filter pins by given keys title,src', function(done) {
                request(pinURL)
                .get('/'+pinCorrect1Result.id+'?filter=src,title')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(codes.success)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.be.json();
                    res.body.should.have.keys('src', 'title');
                    res.body.should.have.property('title', pinCorrectMin.title);
                    done();
                });
        });
        it('should again create a pin on POST', function(done) {
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
                    res.body.should.have.properties(Object.getOwnPropertyNames(pinCorrectMax));
                    res.body.should.have.property('id').above(0);
                    pinCorrect2Result = res.body;
                    pinIDsCleanup.push(res.body.id);
                    done();
                });
        });
        it('should detect bad filter parameters (not existing) and return status 400', function(done) {
            request(pinURL)
                .get('/'+pinCorrect2Result.id+'?filter=sCR,title')
                .set('Accept-Version', '1.0')
                .set('Accept', 'application/json')
                .expect(codes.wrongrequest)
                .end(function(err, res){
                    should.not.exist(err);
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
