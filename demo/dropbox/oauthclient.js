"use strict";

var OAuthClient = (function(undefined) {

  /**
   * @property consumerKey {String}
   * @private
   */
  var consumerKey = null;

  /**
   * @property consumerSecret {String}
   * @private
   */
  var consumerSecret = null;

  /**
   * @class OAuthClient
   * @constructor
   * @param {String} consumerKey
   * @param {String} consumerSecret
   */
  function OAuthClient(_consumerKey, _consumerSecret) {
    if (!_.isString(_consumerKey)) {
      if ("OAUTH_CONSUMER_KEY" in window) {
        if (_.isString(window.OAUTH_CONSUMER_KEY)) {
          _consumerKey = window.OAUTH_CONSUMER_KEY;
        } else {
          throw new Error("OAUTH_CONSUMER_KEY isn`t a string");
        }
      }
    }

    if (!_.isString(_consumerSecret)) {
      if ("OAUTH_CONSUMER_SECRET" in window) {
        if (_.isString(window.OAUTH_CONSUMER_SECRET)) {
          _consumerSecret = window.OAUTH_CONSUMER_SECRET;
        } else {
          throw new Error("OAUTH_CONSUMER_SECRET isn`t a string");
        }
      }
    }

    consumerKey = _consumerKey;
    consumerSecret = _consumerSecret;
  };

  /**
   * @method getConsumerKey
   * @return {String}
   */
  OAuthClient.prototype.getConsumerKey = function() {
    if (!_.isString(consumerKey)) {
      throw new Error("consumerKey isn`t a string");
    }

    return consumerKey;
  };

  /**
   * @method getConsumerSecret
   * @return {String}
   */
  OAuthClient.prototype.getConsumerSecret = function() {
    if (!_.isString(consumerSecret)) {
      throw new Error("consumerSecret isn`t a string");
    }

    return consumerSecret;
  };

  /**
   * @method getToken
   * @return {String}
   */
  OAuthClient.prototype.getToken = function() {
    var token = localStorage.getItem("oauth_token");

    if (!_.isString(token)) {
      throw new Error("oauth_token isn`t a string");
    }

    return token;
  };

  /**
   * @method getTokenSecret
   * @return {String}
   */
  OAuthClient.prototype.getTokenSecret = function() {
    var tokenSecret = localStorage.getItem("oauth_token_secret");

    if (!_.isString(tokenSecret)) {
      throw new Error("oauth_token_secret isn`t a string");
    }

    return tokenSecret;
  };

  /**
   * @method isAuthenticated
   * @return {boolean}
   */
  OAuthClient.prototype.isAuthenticated = function() {
    try {
      var token = this.getToken();
      var tokenSecret = this.getTokenSecret();

      return _.isString(token) && _.isString(tokenSecret);
    } catch(e) {

      return false;
    }
  };

  /**
   * @method buildRequestURL
   * @param method {String}
   * @param url {String}
   * @param params {Object}
   * @return {String} OAuth Parameterized URL
   */
  OAuthClient.prototype.buildRequestURL = function(method, url, params) {
    if (!_.isString(method)) {
      throw new Error("method isn`t a string");
    }

    if (!_.isString(url)) {
      throw new Error("url isn`t a string");
    }

    if (!_.isObject(params) || _.isArray(params) || _.isFunction(params)) {
      params = {};
    }

    params.oauth_consumer_key = this.getConsumerKey();
    params.oauth_signature_method = "HMAC-SHA1";

    var accessor = { "consumerSecret": this.getConsumerSecret() };

    if ("accessor" in params) {
      if (_.isObject(params.accessor) && !_.isArray(params.accessor) && !_.isFunction(params.accessor)) {
        $.extend(accessor, params.accessor);
      }

      delete params.accessor;
    }

    try {
      if (!("oauth_token" in params)) {
        params.oauth_token = this.getToken();
      }

      if (!("tokenSecret" in accessor)) {
        accessor.tokenSecret = this.getTokenSecret();
      }
    } catch(e) {
      console.debug(e.toString());
    };

    var message = { "method": method, "action": url, "parameters": params };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    return OAuth.addToURL(url, message.parameters);
  };

  /**
   * @method getResponse
   * @param method {String}
   * @param url {String}
   * @param params {Object}
   * @param responseCallback {Fucntion}
   * @param errorCallback {Function}
   */
  OAuthClient.prototype.getResponse = function(method, url, params, responseCallback, errorCallback) {

    if (_.isFunction(params)) {
      responseCallback = params;
      params = {};
    }

    if (!_.isObject(params) || _.isArray(params) || _.isFunction(params)) {
      params = {};
    }

    if (!_.isFunction(responseCallback)) {
      throw new Error("responseCallback isn`t a function");
    }

    if (!_.isFunction(errorCallback)) {
      errorCallback = function(xhr, status, err) {
        throw err;
      };
    }

    var url = this.buildRequestURL(method, url, params);

    $.ajax({
      "type": method,
      "url": url,
      "success": responseCallback,
      "error": errorCallback
    });
  };

  Object.freeze(OAuthClient);

  return OAuthClient;

})();
