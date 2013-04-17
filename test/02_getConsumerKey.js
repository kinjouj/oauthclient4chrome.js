"use strict";

describe("OAuthClient.getConsumerKey", function() {

  it("successful test", function() {
    var client = new OAuthClient("dummy", "dummy");
    expect(client).not.to.be.null;
    expect(client.getConsumerKey()).to.be.equal("dummy");
  });

  it("consumerKey is null", function() {
    var client = new OAuthClient();
    expect(client).not.to.be.null;
    expect(
      function() { return client.getConsumerKey(); }
    ).to.be.throw(Error, /^consumerKey isn`t a string$/);
  });

  it("consumerKey isn`t a string", function() {
    var client = new OAuthClient({});
    expect(client).not.to.be.null;
    expect(
      function() { return client.getConsumerKey() }
    ).to.be.throw(Error, /^consumerKey isn`t a string$/);
  });
});
