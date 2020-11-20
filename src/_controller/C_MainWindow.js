// Importanto Bicliotecas
const { remote } = require('electron');
//const FileSystemManager = require('../_model/fsm/FileSystemManager');

// Definindo Classe
class C_MainWindow {
    // Atributos Estáticos
    // Barra de Título
    static btn_min;
    static btn_max;
    static btn_clo;

    // Painel de Sistemas de Pastas
    static btn_create_doc;
    static btn_create_dir;
    static btn_delete;
    static btn_open;
    //static fsm;

    // Método Principal
    static main() {
        // Instanciando objeto Gerencidador de Sistemas de Arquivos
        //this.fsm = new FileSystemManager();

        // Programando eventos da barra de título
        this.btn_min = document.getElementById('min');
        this.btn_min.addEventListener('click', this.btn_minOnClick);
        this.btn_max = document.getElementById('max');
        this.btn_max.addEventListener('click', this.btn_maxOnClick);
        this.btn_clo = document.getElementById('clo');
        this.btn_clo.addEventListener('click', this.btn_cloOnClick);

        // Programando eventos do Painel de Sistema de Pastas
        this.btn_open = document.getElementById('btn-open');
        this.btn_open.addEventListener('click', this.btn_openOnClick);
    }

    // Métodos de Eventos DOOM
    // Eventos da Barra de título
    static btn_minOnClick() { remote.getCurrentWindow().minimize(); }
    static btn_maxOnClick() { 
        if (remote.getCurrentWindow().isMaximized()) {
            remote.getCurrentWindow().unmaximize();
        } else {
            remote.getCurrentWindow().maximize();
        }
    }
    static btn_cloOnClick() { remote.getCurrentWindow().close(); }

    // Eventos do Painel de Sistema de Pastas
    static btn_openOnClick() {
        // Abrindo Janela Nativa para Abrir Pasta
        remote.dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then((res) => {
            // Precisa Implementar
        });
    }
}

// Chamando Método Principal
C_MainWindow.main();