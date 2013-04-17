"use strict";

(function(undefined) {

  var parseToken = function(tokenString) {
    if (!_.isString(tokenString)) {
      throw new Error("tokenString isn`t a string");
    }

    var token = {};

    _.each(tokenString.split('&'), function(kvString) {
      var kv = kvString.split('=');

      if (kv.length === 2) {
        token[kv[0]] = kv[1];
      }
    });

    return token;
  };

  var twitter = new OAuthClient();

  window.getTwitter = function() {
    return twitter;
  };

  window.claimAuthorization = function() {
    twitter.getResponse(
      "GET",
      "https://api.twitter.com/oauth/request_token",
      function(tokenString) {
        var tokens = parseToken(tokenString);
        var token = tokens.oauth_token;
        var tokenSecret = tokens.oauth_token_secret;

        chrome.runtime.onMessage.addListener(function(req, sender, res) {
          var verifier = req.verifier;

          twitter.getResponse(
            "GET",
            "https://api.twitter.com/oauth/access_token",
            {
              "oauth_token": token,
              "oauth_verifier": verifier,
              "accessor": {
                "tokenSecret": tokenSecret
              }
            },
            function(tokenString) {
              var tokens = parseToken(tokenString);

              for (var key in tokens) {
                localStorage.setItem(key, tokens[key]);
              }

              res(true);
            }
          );

          return true;
        });

        var authorizeUrl = twitter.buildRequestURL(
          "GET",
          "https://api.twitter.com/oauth/authorize",
          {
            "oauth_token": token,
            "accessor": {
              "tokenSecret": tokenSecret
            }
          }
        );

        window.open(authorizeUrl);
      }
    );
  };
})();
