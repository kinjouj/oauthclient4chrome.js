"use strict";

describe("OAuthClient.getToken", function() {

  var client;

  before(function() {
    localStorage.setItem("oauth_token", "dummy");

    client = new OAuthClient("dummy", "dummy");
  });

  after(function() {
    localStorage.removeItem("oauth_token");
  });

  it("取得できるかテスト", function() {
    expect(client.getToken()).to.be.equal("dummy");
  });

  it("localStorageに存在しない場合", function() {
    localStorage.removeItem("oauth_token");

    expect(
      function() { client.getToken() }
    ).to.be.throw(Error, /^oauth_token isn`t a string$/);
  });
});
