(function(undefined) {
  chrome.runtime.getBackgroundPage(function(bgPage) {
    var dropbox = bgPage.getDropbox();

    if (!dropbox.isAuthenticated()) {
      bgPage.claimAuthorization();

      return;
    }

    dropbox.getResponse(
      "GET",
      "https://api.dropbox.com/1/metadata/sandbox/",
      function(metadata) {
        _.each(metadata.contents, function(metadata) {
          if (!/^image/.test(metadata.mime_type)) {
            return;
          }

          var path = metadata.path.replace(/\s/g, "%20");

          console.log("path: " + path);

          var url = dropbox.buildRequestURL(
            "GET",
            "https://api-content.dropbox.com/1/thumbnails/sandbox" + path,
            { "size": "m" }
          );

          var xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.open("GET", url, true);
          xhr.onload = function() {
            var oURL = URL.createObjectURL(this.response);

            var image = new Image();
            image.onload = function() {
              URL.revokeObjectURL(oURL);
            };
            image.src = oURL;
            image.alt = metadata.path;
            image.title = metadata.path;

            $("#images").append(image);
          };
          xhr.send(null);
        });
      }
    );
  });
})();
