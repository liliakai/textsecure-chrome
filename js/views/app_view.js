(function () {
    'use strict';

    window.Whisper = window.Whisper || {};

    Whisper.AppView = Backbone.View.extend({
        initialize: function(options) {
          this.inboxView = null;
          this.installView = null;
        },
        events: {
            'click .openInstaller': 'openInstaller',
            'click .openStandalone': 'openStandalone',
            'openInbox': 'openInbox',
        },
        openView: function(view) {
          this.el.innerHTML = "";
          this.el.append(view.el);
          this.delegateEvents();
        },
        openInstaller: function() {
          this.closeInstaller();
          this.installView = new Whisper.InstallView();
          if (Whisper.Registration.everDone()) {
              this.installView.selectStep(3);
              this.installView.hideDots();
          }
          this.openView(this.installView);
        },
        openStandalone: function() {
          if (window.config.environment !== 'production') {
            this.closeInstaller();
            this.installView = new Whisper.StandaloneRegistrationView();
            this.openView(this.installView);
          }
        },
        closeInstaller: function() {
          if (this.installView) {
            this.installView.remove();
            this.installView = null;
          }
        },
        openInbox: function() {
          console.log('open inbox');
          this.closeInstaller();

          if (!this.inboxView) {
            return ConversationController.updateInbox().then(function() {
                this.inboxView = new Whisper.InboxView({model: self, window: window});
                this.openView(this.inboxView);
            }.bind(this));
          } else {
            if (!$.contains(this.$el, this.inboxView.$el)) {
                this.openView(this.inboxView);
            }
            window.focus(); // FIXME
            return Promise.resolve();
          }
        },
        openConversation: function(conversation) {
          if (conversation) {
            this.openInbox().then(function() {
              this.inboxView.openConversation(null, conversation);
            }.bind(this));
          }
        },
    });
})();
