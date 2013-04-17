(function(undefined) {
  $('#slider-menu').sidr({
    "source": "#sidebar",
    "renaming": false,
    "body": "html"
  });

  chrome.runtime.getBackgroundPage(function(bgPage) {
    var twitter = bgPage.getTwitter();

    if (!twitter.isAuthenticated()) {
      bgPage.claimAuthorization();

      return;
    }

    $("#navbar").css("display", "block");

    var render = function(params) {
      $("#main").html(
        _.template($("#tweets-template").text(), { "tweets": params })
      );
    };

    var load_tweets = function() {
      twitter.getResponse(
        "GET",
        "https://api.twitter.com/1.1/statuses/home_timeline.json",
        function(tweets) {
          render(tweets);

          $.sidr("close");
        }
      );
    };

    $('#main').bind("click", function() {
      $.sidr("close");
    });

    $(".sidr-inner #menu-action-home").bind("click", load_tweets);

    $(".sidr-inner #menu-action-mention").bind("click", function() {
      twitter.getResponse(
        "GET",
        "https://api.twitter.com/1.1/statuses/mentions_timeline.json",
        function(mentions) {
          render(mentions);

          $.sidr("close");
        }
      );
    });

    $(".sidr-inner #menu-action-favo").bind("click", function() {
      twitter.getResponse(
        "GET",
        "https://api.twitter.com/1.1/favorites/list.json",
        function(favs) {
          render(favs);

          $.sidr("close");
        }
      );
    });

    $("#modal-tweet-send-button").bind("click", function() {
      var tweet = $("#tweet-text");
      var text = tweet.val();

      twitter.getResponse(
        "POST",
        "https://api.twitter.com/1.1/statuses/update.json",
        { "status": text },
        function(res) {
          tweet.val("");
        }
      );
    });

    load_tweets();
  });
})();
