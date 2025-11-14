import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Preload path:", path.join(__dirname, "../electron/preload.js"));

import { app, BrowserWindow, session, ipcMain } from "electron";

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../electron/preload.js"),
    },
  });

  // Handle forced downloads from renderer
  ipcMain.on("electron-download", (event, url) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.webContents.downloadURL(url);
    }
  });

  // Load your renderer
  win.loadFile(path.join(__dirname, "../renderer/dist/index.html"));

  // Download events
  session.defaultSession.on("will-download", (event, item) => {
    const filename = item.getFilename();
    win.webContents.send("download-started", filename);

    item.once("done", (event, state) => {
      if (state === "completed") {
        win.webContents.send("download-complete", filename);
      } else {
        win.webContents.send("download-failed", filename);
      }
    });
  });
}

app.whenReady().then(createWindow);
