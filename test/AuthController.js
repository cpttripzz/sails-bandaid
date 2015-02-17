var request = require("supertest");
var expect = require("chai").expect;
var sails = require("sails");
var should = require('should');
var app;

before(function(done) {
    sails.lift({
        log: {
            level: "error"
        }
    }, function(err, sails) {
        app = sails.hooks.http.app;
        done();
    });
});

describe("AuthController", function() {
    describe("register", function() {
        it("Should create new user and return jwt token", function(done) {
            testUser = {
                "username": "asdfasdf",
                "password": "password",
                "email": "asdf@email.com"
            };
            request(app)
                .post("/auth/register")
                .send(testUser)
                .end(function(err, res) {
                    should.not.exist(err);
                    should.exist(res);
                    should(res).have.property.body;
                    should(res.status).equal(200);
                    should(res.body.user.username).equal(testUser.username);
                done();
            });
        });
        it("Should return error on invalid params", function(done) {
            testUser = {
                "username": "",
                "password": "",
                "email": "asdf@email.com"
            };
            request(app)
                .post("/auth/register")
                .send(testUser)
                .end(function(err, res) {
                    should.not.exist(err);
                    should.exist(res);
                    //should(res).have.property.body;
                    should(res.status).equal(400);
                    should(res.error).be.an.instanceOf(Object)
                        .and.have.property('text','{\n  "err": {\n    "error": "E_VALIDATION",\n    "status": 400,\n    "summary": "2 attributes are invalid",\n    "model": "User",\n    "invalidAttributes": {\n      "username": [\n        {\n          "rule": "required",\n          "message": "\\"required\\" validation rule failed for input: \'\'"\n        },\n        {\n          "rule": "minLength",\n          "message": "\\"minLength\\" validation rule failed for input: \'\'"\n        }\n      ],\n      "password": [\n        {\n          "rule": "required",\n          "message": "\\"required\\" validation rule failed for input: \'\'"\n        }\n      ]\n    }\n  }\n}');
                    done();
                });
        });
    });
    describe("authenticate", function() {
        it("Should authenticate user and return jwt token", function(done) {
            testUser = {
                "username": "asdfasdf",
                "password": "password",
                "email": "asdf@email.com"
            };
            request(app)
                .post("/auth/authenticate")
                .send(testUser)
                .end(function(err, res) {
                    should.not.exist(err);
                    should.exist(res);
                    should(res).have.property.body;
                    should(res.status).equal(200);
                    should(res.body.user.username).equal(testUser.username);
                    should(res.body.user.password).not.be.ok;
                    should(res.unauthorized).be.false;
                    done();
                });
        });
        it("Should fail authentication on nonexistent user and return 401", function(done) {
            testUser = {
                "username": "test",
                "password": "password",
                "email": "asdf@email.com"
            };
            request(app)
                .post("/auth/authenticate")
                .send(testUser)
                .end(function(err, res) {
                    should.exist(res);
                    should.not.exist(err);
                    should(res.status).equal(401);
                    should(res.unauthorized).be.true;
                    should(res.text).equal('{\n  "err": "invalid username or password"\n}');
                    done();
                });
        });
        it("Should fail authentication on bad password and return 401", function(done) {
            testUser = {
                "username": "asdfasdf",
                "password": "1233",
                "email": "asdf@email.com"
            };
            request(app)
                .post("/auth/authenticate")
                .send(testUser)
                .end(function(err, res) {
                    should.exist(res);
                    should.not.exist(err);
                    should(res.status).equal(401);
                    should(res.unauthorized).be.true;
                    should(res.text).equal('{\n  "err": "invalid username or password"\n}');
                    done();
                });
        });
    });
});
