import { app, BrowserWindow, shell, ipcMain, Menu, dialog } from "electron";
import { release } from "node:os";
import path from "node:path";
import { openFile, readModelFile } from "./gltf/reader";
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

app.on("will-finish-launching", () => {
  app.on("open-file", async (event, modelPath: string) => {
    // 添加到最近访问
    app.addRecentDocument(modelPath);
    const success = await openFile(win, modelPath);
    if (!success) {
      if (app.isReady()) {
        createWindow(modelPath);
      } else {
        openedFile = modelPath;
      }
    }
  });
});

let openedFile: string = null;
async function createWindow(modelPath: string = null) {
  win = new BrowserWindow({
    title: "GlTF Viewer",
    icon: path.join(process.env.PUBLIC, "icon.png"),
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
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

  console.log("isPackaged", app.isPackaged);

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../../dist/index.html"));
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

    ipcMain.on("drop-file", async (event, modelPath: string) => {
      // 添加到最近访问
      app.addRecentDocument(modelPath);
      const success = await openFile(win, modelPath);
      if (!success) {
        if (app.isReady()) {
          createWindow(modelPath);
        } else {
          openedFile = modelPath;
        }
      }
    });
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
