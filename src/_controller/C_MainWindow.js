// Importanto Bicliotecas
const { remote } = require('electron');
const FileSystemManager = require('../../_model/fsm/FileSystemManager');

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
    static pn_root_folder;
    static pn_folder_tree;
    static dirs;
    static files;
    static currentDir = null;
    static fsm;

    // Método Principal
    static main() {
        // Instanciando objeto Gerencidador de Sistemas de Arquivos
        this.fsm = new FileSystemManager();

        // Instanciando objetos DOOM
        this.btn_min = document.getElementById('min');
        this.btn_max = document.getElementById('max');
        this.btn_clo = document.getElementById('clo');
        this.pn_root_folder = document.getElementById('root-folder');
        this.pn_folder_tree = document.getElementById('folder-tree');
        this.btn_open = document.getElementById('btn-open');

        // Programando eventos da barra de título
        this.btn_min.addEventListener('click', this.btn_minOnClick);
        this.btn_max.addEventListener('click', this.btn_maxOnClick);
        this.btn_clo.addEventListener('click', this.btn_cloOnClick);

        // Programando eventos do Painel de Sistema de Pastas
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
            // Salvando pasta aberta e gerando árvore de arquivos
            C_MainWindow.currentDir = C_MainWindow.fsm.decompPath(res.filePaths[0]);
            C_MainWindow.pn_root_folder.innerText = C_MainWindow.currentDir.name;
            C_MainWindow.pn_folder_tree.innerHTML = C_MainWindow.loadFileTree(C_MainWindow.fsm.buildFileTree(C_MainWindow.currentDir.realPath));

            // Programando eventos dos elementos da árvore
            C_MainWindow.dirs = C_MainWindow.pn_folder_tree.getElementsByClassName('dir');
            for (let i = 0; i < C_MainWindow.dirs.length; i++) {
                C_MainWindow.dirs[i].children[0].addEventListener('click', () => {
                    if (C_MainWindow.dirs[i].classList.contains('hidden')) {
                        C_MainWindow.dirs[i].classList.remove('hidden');
                    } else {
                        C_MainWindow.dirs[i].classList.add('hidden');
                    }
                });
            }
        });
    }
    static loadFileTree(fileTree) {
        let html_result = '';
        fileTree.forEach((v) => {
            if (v.content == undefined) {
                html_result += `<div class="file" real-path="${v.realPath}">${v.name}</div>`;
            } else {
                html_result += `
                <div class="dir hidden" real-path="${v.realPath}">
                    <h3 class="name">${v.name}</h3>
                    <div class="content">
                        ${C_MainWindow.loadFileTree(v.content)}
                    </div>
                </div>`;
            }
        });
        return html_result;
    }
}

// Chamando Método Principal
C_MainWindow.main();