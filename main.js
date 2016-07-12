'use strict';
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let backgroundPage
let installPage
global.SERVER_URL = 'https://textsecure-service-staging.whispersystems.org';

global.bg = {
  ConversationController: {}
};

global.openInbox = function() {
  backgroundPage.show();
}

function createBackgroundPage () {
  // Create a hidden browser window.
  global.backgroundPage = backgroundPage = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 360,
    show: false
  });


  // and load the index.html of the app.
  backgroundPage.loadURL(`file://${__dirname}/background.html`)
  //backgroundPage.hide();

  // Open the DevTools.
  backgroundPage.webContents.openDevTools()

  backgroundPage.on('ready-to-show', function () {
    backgroundPage.show();
  });
  backgroundPage.on('close', onclose);
  // Emitted when the window is closed.
  backgroundPage.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    global.backgroundPage = backgroundPage = null
  })
}

function onclose(e) {
  e.preventDefault();
  backgroundPage.hide();
}


global.createInstallPage = function () {
  // Create a hidden browser window.
  installPage = new BrowserWindow({
    width: 800,
    height: 600
  });

  installPage.loadURL(`file://${__dirname}/options.html`)

  // Open the DevTools.
  installPage.webContents.openDevTools()

  // Emitted when the window is closed.
  installPage.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    installPage = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createBackgroundPage)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('certificate-error', function (event, webContents, url, error, cert, callback) {
  if (url.startsWith('https://textsecure-service-staging.whispersystems.org/') ||
      url.startsWith('https://textsecure-service.whispersystems.org/')) {
    // TODO Verification logic.
    console.log(url);
    console.log(error);
    console.log(cert.issuerName);
    console.log(cert.data.toString('base64'));
    event.preventDefault();
    if (callback) {
      callback(true);
    }
  } else {
    if (callback) {
      callback(false);
    }
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (backgroundPage === null) {
    createBackgroundPage()
  }
})

const {Menu, Tray} = require('electron')

let tray = null
app.on('ready', () => {
  tray = new Tray('images/icon_128.png')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit', type: 'normal',
      click: function() {
        if (backgroundPage !== null) {
          backgroundPage.removeListener('close', onclose);
          backgroundPage.close();
        }
      }
    }
  ]);
  tray.setToolTip('Signal')
  tray.setContextMenu(contextMenu)

  tray.on('click', function(e) {
    console.log('tray click', e);
    openInbox()
  });

})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
