if (document.referrer.match(/oauth_consumer_key=([^&]+)/)) {
  if (RegExp.$1 === OAUTH_CONSUMER_KEY) {
    chrome.runtime.sendMessage({}, function(isSuccess) {
      if (isSuccess === true) {
        alert("Authorized, woot!");
      }
    });
  }
}
