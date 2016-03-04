({
  baseUrl: "https://github.com",
  interval: 1000 * 300,
  notifications: [],

  init: function() {
    this.startPolling();
  },

  startPolling: function() {
    var self = this;
    setInterval(function() {
      self.checkMergeNotifications();
    }, this.interval);
    self.checkMergeNotifications();
  },

  checkMergeNotifications: function() {
    this.notifications = [];
    this.crawlNotifications();
    if (this.notifications.length > 0) {
      chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        chrome.tabs.executeScript(null, {file: "javascripts/jquery-1.12.1.min.js"});
        chrome.tabs.executeScript(null, {file: "javascripts/hanabi.js"});
      });
    }
    console.log("no_hanabi");
  },

  crawlNotifications: function() {
    var self = this;
    $.get(this.notificationUrl(), function(data) {
      $(data).find('#notification-center .notifications .type-icon-state-merged').each(function() {
        var $this = $(this).parents('li');

        var title = $this.find('.js-notification-target').text();
        var user = $this.find('.from-avatar:last-child').attr('alt');
        var icon = $this.find('.from-avatar:last-child').attr('src');

        self.notifications.push({
          title: title,
          user: user,
          icon: icon
        });
      });
    });
  },

  notificationUrl: function() {
    return this.baseUrl + '/notifications';
  }
}).init();
