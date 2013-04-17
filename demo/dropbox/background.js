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

  var ajaxSetup = function() {
    $.ajaxSetup({
      beforeSend: function(xhr) {
        xhr.responseType = "arraybuffer";
        xhr.setRequestHeader("Accept", "application/json");
      }
    });
  };

  var dropbox = new OAuthClient();

  window.getDropbox = function() {
    return dropbox;
  };

  window.claimAuthorization = function() {
    dropbox.getResponse(
      "GET",
      "https://api.dropbox.com/1/oauth/request_token",
      function(tokenString) {
        var tokens = parseToken(tokenString);
        var token = tokens.oauth_token;
        var tokenSecret = tokens.oauth_token_secret;

        chrome.runtime.onMessage.addListener(function(req, sender, res) {
          dropbox.getResponse(
            "POST",
            "https://api.dropbox.com/1/oauth/access_token",
            {
              "oauth_token": token,
              "accessor": {
                "tokenSecret": tokenSecret
              }
            },
            function(tokenString) {
              var tokens = parseToken(tokenString);

              for (var key in tokens) {
                localStorage.setItem(key, tokens[key]);
              }

              ajaxSetup();

              res(true);
            }
          );

          return true;
        });

        var authorizeUrl = dropbox.buildRequestURL(
          "GET",
          "https://api.dropbox.com/1/oauth/authorize",
          {
            "oauth_token": token,
            "accessor": {
              "oauth_token_secret": tokenSecret
            }
          }
        );

        window.open(authorizeUrl);
      }
    );
  };

  if (dropbox.isAuthenticated()) {
    ajaxSetup();
  }
})();
