// Script de precarga: actualmente vacío, pero mantenido por seguridad (contextIsolation)
// Puedes exponer APIs seguras aquí a través de contextBridge si es necesario.
const { contextBridge } = require('electron');

// Ejemplo: exponer un marcador de posición de API vacío
contextBridge.exposeInMainWorld('electronAPI', {});
