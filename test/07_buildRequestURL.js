"use strict";

describe("OAuthClient.buildRequestURL", function() {

  beforeEach(function() {
    localStorage.setItem("oauth_token", "token");
    localStorage.setItem("oauth_token_secret", "token_secret");
  });

  afterEach(function() {
    localStorage.removeItem("oauth_token");
    localStorage.removeItem("oauth_token_secret");
  });

  it("successful test", function() {
    var client = new OAuthClient("dummy", "dummy");

    var params = {
      "accessor": {
      }
    };

    var url = client.buildRequestURL("GET", "http://localhost", params);
    expect(url).to.be.ok;
    expect(params).not.have.property("accessor");
    expect(params).to.have.property("oauth_consumer_key");
    expect(params).to.have.property("oauth_signature_method");
    expect(params).to.have.property("oauth_nonce");
    expect(params).to.have.property("oauth_timestamp");
    expect(params).to.have.property("oauth_signature");
  });

  it("localStorageにトークンが無い場合のテスト", function() {
    localStorage.removeItem("oauth_token");

    var client = new OAuthClient("dummy", "dummy");
    expect(client.buildRequestURL("GET", "http://localhost")).to.be.ok;
  });

  it("method isn`t a string", function() {
    var client = new OAuthClient();
    expect(
      function() { client.buildRequestURL() }
    ).to.be.throw(Error, /^method isn`t a string$/);
  });

  it("url isn`t a string", function() {
    var client = new OAuthClient();
    expect(
      function() { client.buildRequestURL("GET") }
    ).to.be.throw(Error, /^url isn`t a string$/);
  });
});
