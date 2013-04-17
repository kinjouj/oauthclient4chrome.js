"use strict";

describe("OAuthClient.getResponse", function() {

  var client;
  var getResponse;
  var ajax;

  beforeEach(function() {
    ajax = $.ajax;

    client = new OAuthClient("dummy", "dummy");

    localStorage.setItem("oauth_token", "token");
    localStorage.setItem("oauth_token_secret", "token_secret");
  });

  afterEach(function() {
    $.ajax = ajax;

    localStorage.removeItem("oauth_token");
    localStorage.removeItem("oauth_token_secret");
  });

  it("successful test", function(done) {
    $.ajax = function(param) {
      expect(param).to.have.property("type");
      expect(param).to.have.property("url");
      expect(param).to.have.property("success");

      param.success([]);
    };

    client.getResponse("GET", "http://localhost", function(res) {
      expect(res).to.be.ok;

      done();
    });
  });

  it("callbackを指定しない場合", function() {
    expect(
      function() { client.getResponse("GET", "http://localhost", {}) }
    ).to.be.throw(Error, /^responseCallback isn`t a function$/);
  });

  it("paramsがObjectで無い場合", function(done) {
    $.ajax = function(param) {
      param.success([]);
    };

    client.getResponse("GET", "http://localhost", [], function(res) {
      expect(res).to.be.ok;

      done();
    });
  });

  it("server connection error test", function() {
    $.ajax = function(param) {
      param.error(null, 0, new Error());
    };

    expect(
      function() {
        client.getResponse("GET", "http://localhost", {}, function() {});
      }
    ).to.be.throw(Error);
  });
});
