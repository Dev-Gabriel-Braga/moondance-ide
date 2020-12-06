// Importanto Bibliotecas
const { app, BrowserWindow } = require('electron');

// Declaração de Classe
class C_Main {
    // Atributos Estáticos
    static v_mainWindow;

    // Métodos de Controle
    static startApp() {
        // Programando evento de inicialização
        app.on('ready', this.createWindow);
        
        // Programando eventos de precaução
        app.on('activated', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });
        app.on('window-all-closed', app.quit);
    }
    static createWindow() {
        this.v_mainWindow = new BrowserWindow({
            icon: 'src/_view/_img/md-logo-100x100.ico',
            width: 1280,
            height: 720,
            minWidth: 600,
            minHeight: 400,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            }
        });
        this.v_mainWindow.loadFile('src/_view/_html/V_MainWindow.html');
        this.v_mainWindow.removeMenu();
        this.v_mainWindow.maximize();
    }
}

// Iniciando aplicação
C_Main.startApp();