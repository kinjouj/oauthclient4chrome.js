"use strict";

describe("OAuthClient.isAuthenticated", function() {

  var client;

  before(function() {
    client = new OAuthClient("dummy", "dummy");
  });

  beforeEach(function() {
    localStorage.setItem("oauth_token", "dummy_token");
    localStorage.setItem("oauth_token_secret", "dummy_token_secret");
  });

  afterEach(function() {
    localStorage.removeItem("oauth_token");
    localStorage.removeItem("oauth_token_secret");
  });

  it("認証済みかを検証するテスト", function() {
    expect(client.isAuthenticated()).to.be.true;
  });

  it("localStorageにoauth_tokenが無い場合", function() {
    localStorage.removeItem("oauth_token");

    expect(client.isAuthenticated()).to.be.false;
  });

  it("localStorageにoauth_token_secretが無い場合", function() {
    localStorage.removeItem("oauth_token_secret");

    expect(client.isAuthenticated()).to.be.false;
  });
});
