/*global $, Whisper, Backbone, textsecure, extension*/
/*
 * vim: ts=4:sw=4:expandtab
 */

// This script should only be included in background.html
(function () {
    'use strict';

    window.Whisper = window.Whisper || {};


    window.isFocused = function() {
        return inboxFocused;
    };
    window.isOpen = function() {
        return inboxOpened;
    };

    window.drawAttention = function() {
        if (inboxOpened && !inboxFocused) {
            extension.windows.drawAttention(inboxWindowId);
        }
    };
    window.clearAttention = function() {
        extension.windows.clearAttention(inboxWindowId);
    };

    /* Inbox window controller */
    var inboxFocused = false;
    var inboxOpened = false;
    var inboxWindowId = 'inbox';
    var appWindow = null;
    var view;
    window.openInbox = function() {
        console.log('open inbox');
        if (inboxOpened === false) {
            inboxOpened = true;
            ConversationController.updateInbox().then(function() {
                try {
                    if (view) { view.remove(); }
                    var $body = $('body',document).empty();
                    view = new Whisper.InboxView({window: window});
                    view.$el.prependTo($body);
                    openConversation(getOpenConversation());
                } catch (e) {
                    logError(e);
                }
            });
        } else if (inboxOpened === true) {
            extension.windows.focus(inboxWindowId, function (error) {
                if (error) {
                    inboxOpened = false;
                    openInbox();
                }
            });
        }
    };

    window.setUnreadCount = function(count) {
        if (count > 0) {
            extension.navigator.setBadgeText(count);
            if (inboxOpened === true && appWindow) {
                appWindow.contentWindow.document.title = "Signal (" + count + ")";
            }
        } else {
            extension.navigator.setBadgeText("");
            if (inboxOpened === true && appWindow) {
                appWindow.contentWindow.document.title = "Signal";
            }
        }
    };

    var open;
    window.openConversation = function(conversation) {
        if (inboxOpened === true) {
            if (conversation) {
                view.openConversation(null, conversation);
            }
        } else {
            open = conversation;
        }
        openInbox();
    };
    window.getOpenConversation = function() {
        var o = open;
        open = null;
        return o;
    };
})();
