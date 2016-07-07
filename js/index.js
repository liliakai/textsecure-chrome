/*global $, Whisper, Backbone, textsecure, extension*/
/*
 * vim: ts=4:sw=4:expandtab
 */
(function () {
    'use strict';

    var view;

    function render() {
        extension.windows.getBackground(function(bg) {
            bg.ConversationController.updateInbox().then(function() {
                try {
                    if (view) { view.remove(); }
                    var $body = bg.$('body',document).empty();
                    view = new bg.Whisper.InboxView({window: window});
                    view.$el.prependTo($body);
                    window.openConversation = function(conversation) {
                        if (conversation) {
                            view.openConversation(null, conversation);
                        }
                    };
                    openConversation(bg.getOpenConversation());
                } catch (e) {
                    logError(e);
                }
            });
        });
    }

    window.addEventListener('onreload', render);
    render();
}());
