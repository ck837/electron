const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { SerialPort } = require("serialport");
const url = require("url");
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "#2e2c29",
    webPreferences: {
      nodeIntegration: true, // to allow require
      contextIsolation: false, // allow use with Electron 12+
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
    frame: false, //关闭原生导航栏
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "ShowAll/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  mainWindow.webContents.insertCSS(
    fs.readFileSync(path.join(__dirname, "style.css"), "utf8")
  );

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit();
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// 监听渲染进程发来的页面跳转请求
ipcMain.on("gotoPagePort", () => {
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "Port/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
});
ipcMain.on("gotoPageShowOne", () => {
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "ShowOne/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
});
ipcMain.on("gotoPageShowAll", () => {
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "ShowAll/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
});
ipcMain.on("gotoPagePosition", () => {
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "Position/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
});
ipcMain.on("gotoPageOutput", () => {
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "Output/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
});

ipcMain.on("getSerialPorts", (event) => {
  SerialPort.list()
    .then((ports) => {
      event.reply("serialPorts", ports);
    })
    .catch((err) => {
      console.error("Error listing serial ports:", err);
    });
});

// 监听来自渲染进程的最小化窗口事件
ipcMain.on("minimizeWindow", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on("minimizeWindow", () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

// 监听来自渲染进程的关闭窗口事件
ipcMain.on("closeWindow", () => {
  if (mainWindow) {
    mainWindow.close();
  }
});
