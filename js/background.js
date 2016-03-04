({
  baseUrl: "https://github.com",
  interval: 1000 * 10,
  notifications: [],

  init: function() {
    this.startPolling();
  },

  startPolling: function() {
    var self = this;
    setInterval(function() {
      self.checkMergeNotifications();
    }, self.interval);
    self.checkMergeNotifications();
  },

  checkMergeNotifications: function() {
    var self = this;
    self.notifications = [];
    self.crawlNotifications();
  },

  crawlNotifications: function() {
    var self = this;
    $.get(self.notificationUrl(), function(data) {
      $(data).find('#notification-center .notifications .type-icon-state-merged').each(function() {
        var $this = $(this).closest('li');

        var title = $this.find('.js-notification-target').text();
        var user = $this.find('.from-avatar:last-child').attr('alt');
        var icon = $this.find('.from-avatar:last-child').attr('src');

        self.notifications.push({
          title: title,
          user: user,
          icon: icon
        });
      });
      if (self.notifications.length > 0) {
        console.log("hanabi");
      } else {
        console.log("no_hanabi");
      }
    });
  },

  notificationUrl: function() {
    return this.baseUrl + '/notifications';
  }
}).init();
