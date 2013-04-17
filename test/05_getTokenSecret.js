"use strict";

describe('OAuthClient.getTokenSecret', function() {

  var client;

  before(function() {
    localStorage.setItem("oauth_token_secret", "dummy");

    client = new OAuthClient("dummy", "dummy");
  });

  after(function() {
    localStorage.removeItem("oauth_token_secret");
  });

  it("取得出来るかテスト", function() {
    expect(client.getTokenSecret()).to.be.equal("dummy");
  });

  it("localStorageに存在しない場合", function() {
    localStorage.removeItem("oauth_token_secret");

    expect(
      function() { client.getTokenSecret() }
    ).to.be.throw(Error, /^oauth_token_secret isn`t a string$/);
  });
});
