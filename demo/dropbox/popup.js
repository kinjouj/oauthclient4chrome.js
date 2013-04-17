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

          var url = dropbox.buildRequestURL(
            "GET",
            "https://api-content.dropbox.com/1/thumbnails/sandbox" + metadata.path,
            { "size": "m" }
          );

          var xhr = new XMLHttpRequest();
          xhr.responseType = "arraybuffer";
          xhr.open("GET", url, true);
          xhr.onload = function() {
            var data = new Uint8Array(this.response);
            var oURL = URL.createObjectURL(
              new Blob(
                [data],
                { type: metadata.mime_type }
              )
            );

            var image = new Image();
            image.onload = function() {
              URL.revokeObjectURL(oURL);
            };
            image.src = oURL;

            $("#images").append(image);
          };
          xhr.send(null);
        });
      }
    );
  });
})();
