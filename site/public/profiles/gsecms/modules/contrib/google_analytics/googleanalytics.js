(function($) {

  Drupal.googleanalytics = {};

  $(document).ready(function() {

    // Attach mousedown, keyup, touchstart events to document only and catch
    // clicks on all elements.
    $(document.body).bind("mousedown keyup touchstart", function(event) {

      // Catch the closest surrounding link of a clicked element.
      $(event.target).closest("a,area").each(function() {

        // Is the clicked URL internal?
        if (Drupal.googleanalytics.isInternal(this.href)) {
          // Is the file extension configured for download tracking?
          else if (Drupal.googleanalytics.isDownload(this.href)) {
            // Download link clicked.
            ga("send", {
              "hitType": "event",
              "eventCategory": "Downloads",
              "eventAction": Drupal.googleanalytics.getDownloadExtension(this.href).toUpperCase(),
              "eventLabel": Drupal.googleanalytics.getPageUrl(this.href),
              "transport": "beacon"
            });
          } else if (Drupal.googleanalytics.isInternalSpecial(this.href)) {
            // Keep the internal URL for Google Analytics website overlay intact.
            ga("send", {
              "hitType": "pageview",
              "page": Drupal.googleanalytics.getPageUrl(this.href),
              "transport": "beacon"
            });
          }
        } else {
          if ($(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
            // Mailto link clicked.
            ga("send", {
              "hitType": "event",
              "eventCategory": "Mails",
              "eventAction": "Click",
              "eventLabel": this.href.substring(7),
              "transport": "beacon"
            });
          } else if (this.href.match(/^\w+:\/\//i)) {
            // External link clicked / No top-level cross domain clicked.
            ga("send", {
              "hitType": "event",
              "eventCategory": "Outbound links",
              "eventAction": "Click",
              "eventLabel": this.href,
              "transport": "beacon"
            });
          }
        }
      });
    });
  });

  /**
   * Check whether the hostname is part of the cross domains or not.
   *
   * @param string hostname
   *   The hostname of the clicked URL.
   * @param array crossDomains
   *   All cross domain hostnames as JS array.
   *
   * @return boolean
   */
  Drupal.googleanalytics.isCrossDomain = function(hostname, crossDomains) {
    /**
     * jQuery < 1.6.3 bug: $.inArray crushes IE6 and Chrome if second argument is
     * `null` or `undefined`, http://bugs.jquery.com/ticket/10076,
     * https://github.com/jquery/jquery/commit/a839af034db2bd934e4d4fa6758a3fed8de74174
     *
     * @todo: Remove/Refactor in D8
     */
    if (!crossDomains) {
      return false;
    } else {
      return $.inArray(hostname, crossDomains) > -1 ? true : false;
    }
  };

  /**
   * Check whether this is a download URL or not.
   *
   * @param string url
   *   The web url to check.
   *
   * @return boolean
   */
  Drupal.googleanalytics.isDownload = function(url) {
    var isDownload = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
    return isDownload.test(url);
  };

  /**
   * Check whether this is an absolute internal URL or not.
   *
   * @param string url
   *   The web url to check.
   *
   * @return boolean
   */
  Drupal.googleanalytics.isInternal = function(url) {
    var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
    return isInternal.test(url);
  };

  /**
   * Check whether this is a special URL or not.
   *
   * URL types:
   *  - gotwo.module /go/* links.
   *
   * @param string url
   *   The web url to check.
   *
   * @return boolean
   */
  Drupal.googleanalytics.isInternalSpecial = function(url) {
    var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
    return isInternalSpecial.test(url);
  };

  /**
   * Extract the relative internal URL from an absolute internal URL.
   *
   * Examples:
   * - http://mydomain.com/node/1 -> /node/1
   * - http://example.com/foo/bar -> http://example.com/foo/bar
   *
   * @param string url
   *   The web url to check.
   *
   * @return string
   *   Internal website URL
   */
  Drupal.googleanalytics.getPageUrl = function(url) {
    var extractInternalUrl = new RegExp("^(https?):\/\/" + window.location.host, "i");
    return url.replace(extractInternalUrl, '');
  };

  /**
   * Extract the download file extension from the URL.
   *
   * @param string url
   *   The web url to check.
   *
   * @return string
   *   The file extension of the passed url. e.g. "zip", "txt"
   */
  Drupal.googleanalytics.getDownloadExtension = function(url) {
    var extractDownloadextension = new RegExp("\\.(" + Drupal.settings.googleanalytics.trackDownloadExtensions + ")([\?#].*)?$", "i");
    var extension = extractDownloadextension.exec(url);
    return (extension === null) ? '' : extension[1];
  };

})(jQuery);
