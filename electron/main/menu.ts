import { app, BrowserWindow, dialog, Menu } from "electron";
import fs from "fs";

export function createMenu() {
  return Menu.buildFromTemplate([
    {
      label: "View",
      submenu: [
        {
          label: "Exit",
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: "File",
      submenu: [
        {
          label: "Open File",
          accelerator: "CmdOrCtrl+O",
          // this is the main bit hijack the click event
          click() {
            // construct the select file dialog
            dialog
              .showOpenDialog({
                properties: ["openFile"],
                filters: [
                  { name: "Models", extensions: ["gltf", "glb", "fbx"] },
                ],
              })
              .then(function (fileObj) {
                // the fileObj has two props
                if (!fileObj.canceled) {
                  // win.webContents.send("FILE_OPEN", fileObj.filePaths);
                  const modelPath = fileObj.filePaths[0];
                  fs.readFile(modelPath, (err, buffer) => {
                    if (err) {
                      console.log(err);
                    }
                    const allWindows = BrowserWindow.getAllWindows();
                    if (allWindows[0]) {
                      allWindows[0].webContents.send("file-opened", buffer);
                    }
                    // app.getWin()[0].webContents.send();
                    // } else {
                    // win.webContents.send("FILE_OPEN", buffer);
                    // }
                  });
                }
              })
              // should always handle the error yourself, later Electron release might crash if you don't
              .catch(function (err) {
                console.error(err);
              });
          },
        },
      ],
    },
    {
      label: "Developer",
      submenu: [
        {
          label: "Open Dev Tools",
          accelerator: "CmdOrCtrl+Option+J",
          click() {
            const allWindows = BrowserWindow.getAllWindows();
            if (allWindows[0]) {
              allWindows[0].webContents.openDevTools();
            }
          },
        },
      ],
    },
  ]);
}
