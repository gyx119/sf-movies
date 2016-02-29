var assert = require('assert');
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");
var app = require('express');
var request = require('supertest')("http://localhost:3000");

// UNIT test begin

describe("Home page test",function(){

  // #1 should return home page

  it("should return home page",function(done){

    // calling home page api
    server
    .get("/")
    .expect(200) // THis is HTTP response
     done();
    // });
  });
});

describe.only("Search director name API test",function(){

  // #1 should return home page

  it("should return nothing",function(done){

    // calling home page api
    request
    .get("/api/director?name=ss")
    .set('Connection', 'keep-alive')
    .expect("Content-Type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err, res) {
    	console.log(err);

    	//console.log(res);
    	res.status.should.equal(200);
     	done();
    });
  });
});

describe("earch movie name API test",function(){

  // #1 should return home page

  it("should return nothing",function(done){

    server
    .get("/api/movie?name=ss")
    .expect("Content-type",/json/)
    .expect(200) 
     done();

  });
});