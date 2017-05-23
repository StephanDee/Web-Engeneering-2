/** This is a testfile to be run wit mocha.
 *  Remember to start your node server before and edit config_for_tests for a proper baseURL.
 *
 *
 *
 *
 *     This test only works for an EMPTY app data store. Restart nodeJS then.
 *
 *
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
describe('Clean /pin REST API with empty store', function() {
    var pinIDsCleanup = []; // will be used as temp-store in test...to cleanup pins at the end
    
    it('should send status 204 and empty body on first request (empty database store)', function (done) {
        request(pinURL)
            .get('/')
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .expect(codes.nocontent)
            .end(function (err, res) {
                should.not.exist(err);
                res.body.should.be.empty('ERR: make sure to run tests on fresh node server restart!');
                done();
            })
    });
    // check header fields
    it('should detect wrong Accept header and give status 406', function (done) {
        request(pinURL)
            .post('/')
            .set('Accept-Version', '1.0')
            .set('Accept', 'text/plain')
            .set('Content-Type', 'application/json')
            .send(pinCorrectMin)
            .expect('Content-Type', /json/)
            .expect(codes.cannotfulfill)
            .end(function (err, res) {
                if (!err && res.body && res.body.id) {
                  pinIDsCleanup.push(res.body.id); // remember for delete at end...
                }
                done();
            })
    });
    it('should detect wrong Content-Type header and give status 415', function (done) {
        request(pinURL)
            .post('/')
            .set('Accept-Version', '1.0')
            .set('Accept', 'application/json')
            .set('Content-Type', 'text/plain')
            .send(JSON.stringify(pinCorrectMin))
            .expect('Content-Type', /json/)
            .expect(codes.wrongmedia)
            .end(function (err, res) {
                if (!err && res.body && res.body.id) {
                    pinIDsCleanup.push(res.body.id); // remember for delete at end...
                }
                done();
            })
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
