// Preload script: currently empty but kept for security (contextIsolation)
// You can expose safe APIs here via contextBridge if needed.
const { contextBridge } = require('electron');

// Example: expose an empty API placeholder
contextBridge.exposeInMainWorld('electronAPI', {});
