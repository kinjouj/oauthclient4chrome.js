if (document.referrer.match(/oauth_consumer_key=([^&]+)/)) {
  if (RegExp.$1 === OAUTH_CONSUMER_KEY) {
    var pin = prompt("Enter the PIN displayed by Twitter");

    if (_.isString(pin) && !_.isEmpty(pin)) {
      chrome.runtime.sendMessage({ "verifier": pin }, function(isSuccess) {
        if (isSuccess === true) {
          alert("Authorized, woot!");
        }
      });
    }
  }
}
