({
    baseUrl: "https://github.com",
    iterval: 1000 * 60 * 5,
    notifications: [],

    init: function() {
    },

    startPolling: function() {
        var self = this;
        setInterval(function() {
            self.checkMergeNotifications();
        }, this.interval);
    },

    checkMergeNotifications: function() {
        this.notifications = [];
        this.crawlNotifications();
        if (this.notifications.length() > 0) {
            console.log("hanabi");
        }
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
                )};
            });
        });
    };
}).init();
