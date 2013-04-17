"use strict";

describe("OAuthClient.constructor", function() {

  it("successfull test", function() {
    var client = new OAuthClient("dummy", "dummy");
    expect(client).not.to.be.null;
  });

  it("OAUTH_CONSUMER_KEYをwindow変数に定義した場合のテスト", function() {
    window.OAUTH_CONSUMER_KEY = "dummy";

    var client = new OAuthClient();
    expect(client).not.to.be.null;
    expect(client.getConsumerKey()).to.be.equal("dummy");

    window.OAUTH_CONSUMER_KEY = {};

    expect(
      function() { new OAuthClient() }
    ).to.be.throw(Error, /^OAUTH_CONSUMER_KEY isn`t a string$/);

    delete window.OAUTH_CONSUMER_KEY;
  });

  it("OAUTH_CONSUMER_SECRETをwindow変数に定義した場合のテスト", function() {
    window.OAUTH_CONSUMER_SECRET = "dummy";

    var client = new OAuthClient();
    expect(client).not.to.be.null;
    expect(client.getConsumerSecret()).to.be.equal("dummy");

    window.OAUTH_CONSUMER_SECRET = {};

    expect(
      function() { new OAuthClient() }
    ).to.be.throw(Error, /^OAUTH_CONSUMER_SECRET isn`t a string$/);

    delete window.OAUTH_CONSUMER_SECRET;
  });
});
