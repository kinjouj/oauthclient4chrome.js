"use strict";

describe('OAuthClient.getConsumerSecret', function() {
  it("successful test", function() {
    var client = new OAuthClient("dummy", "dummy");
    expect(client).not.to.be.null;
    expect(client.getConsumerSecret()).to.be.equal("dummy");
  });

  it("consumerSecret is null", function() {
    var client = new OAuthClient("dummy");
    expect(client).not.to.be.null;
    expect(
      function() { client.getConsumerSecret(); }
    ).to.be.throw(Error, /^consumerSecret isn`t a string$/);
  });

  it("consumerSecert isn`t string", function() {
    var client = new OAuthClient("dummy", {});
    expect(client).not.to.be.null;
    expect(
      function() { client.getConsumerSecret() }
    ).to.be.throw(Error, /^consumerSecret isn`t a string$/);
  });
});
