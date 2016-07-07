/*
 * vim: ts=4:sw=4:expandtab
 */
;(function() {
    'use strict';
    extension.windows.getBackground(function(bg) {
        bg.storage.onready(function() {
            $(function() {
                var deviceName = bg.textsecure.storage.user.getDeviceName();
                if (!deviceName) {
                    deviceName = 'Chrome';
                    if (navigator.userAgent.match('Mac OS')) {
                        deviceName += ' on Mac';
                    } else if (navigator.userAgent.match('Linux')) {
                        deviceName += ' on Linux';
                    } else if (navigator.userAgent.match('Windows')) {
                        deviceName += ' on Windows';
                    }
                }
                var view = new Whisper.InstallView({
                    el: $('#install'),
                    deviceName: deviceName
                });
                if (bg.Whisper.Registration.everDone()) {
                    view.selectStep(3);
                }
            }
            var view = new Whisper.InstallView({
                el: $('#install'),
                deviceName: deviceName
            });
            if (textsecure.registration.everDone()) {
                view.selectStep(3);
            }
            view.$el.show();
            var SERVER_URL = require('electron').remote.getGlobal('SERVER_URL');
            var USERNAME = storage.get('number_id');
            var PASSWORD = storage.get('password');
            var accountManager = new textsecure.AccountManager(SERVER_URL, USERNAME, PASSWORD);

            var init = function() {
                view.clearQR();

                accountManager.registerSecondDevice(
                    view.setProvisioningUrl.bind(view),
                    view.confirmNumber.bind(view),
                    view.incrementCounter.bind(view)
                ).then(function() {
                    var launch = function() {
                        bg.openInbox();
                        bg.removeEventListener('textsecure:contactsync', launch);
                        window.close();
                    };
                    bg.addEventListener('textsecure:contactsync', launch);
                    view.showSync();
                }).catch(function(e) {
                    if (e.message === 'websocket closed') {
                        view.showConnectionError();
                        setTimeout(init, 10000);
                    } else if (e.name === 'HTTPError' && e.code == 411) {
                        view.showTooManyDevices();
                    }
                    else {
                        throw e;
                    }
                });
            };
            $('.error-dialog .ok').click(init);
            init();
        });
    });
    storage.fetch();
})();
