import { app, BrowserWindow, shell, ipcMain, Menu, dialog } from "electron";
import { release } from "os";
import path from "path";
import fs from "fs";
import { createMenu } from "./menu";

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
process.env.DIST = path.join(__dirname, "../..");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = path.join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = path.join(process.env.DIST, "index.html");

app.on("will-finish-launching", () => {
  app.on("open-file", (event, modelPath) => {
    openFile(modelPath);
  });
});

let openedFile: string = null;
async function createWindow(modelPath: string = null) {
  win = new BrowserWindow({
    title: "GlTF Viewer",
    icon: path.join(process.env.PUBLIC, "favicon.svg"),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.maximize();

  Menu.setApplicationMenu(createMenu());

  const bufferPromise = modelPath
    ? readModelFile(modelPath)
    : Promise.resolve();
  ipcMain.once("init-file-fetch", async () => {
    const buffer = await bufferPromise;
    win.webContents.send("file-opened-once", buffer);
  });

  if (app.isPackaged) {
    win.loadFile(indexHtml);
  } else {
    win.loadURL(url);
    win.webContents.openDevTools();
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  win.setDocumentEdited(false);
}

app.whenReady().then(() => {
  if (BrowserWindow.getAllWindows().length <= 0) {
    createWindow(openedFile);
  }
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

async function openFile(modelPath) {
  app.addRecentDocument(modelPath);
  if (win) {
    const buffer = await readModelFile(modelPath);
    win.webContents.send("file-opened", buffer);
  } else {
    if (app.isReady()) {
      createWindow(modelPath);
    } else {
      openedFile = modelPath;
    }
  }
}

function readModelFile(modelPath: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(modelPath, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}
