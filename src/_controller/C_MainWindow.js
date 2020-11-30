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
    static btn_delete;
    static pn_root_folder;
    static pn_folder_tree;
    static fileTreeElements;
    static lastFTE = -1;
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
        this.btn_delete = document.getElementById('btn-delete');

        // Programando eventos da barra de título
        this.btn_min.addEventListener('click', this.btn_minOnClick);
        this.btn_max.addEventListener('click', this.btn_maxOnClick);
        this.btn_clo.addEventListener('click', this.btn_cloOnClick);

        // Programando eventos do Painel de Sistema de Pastas
        this.btn_open.addEventListener('click', this.btn_openOnClick);
        this.btn_delete.addEventListener('click', this.btn_deleteOnClick);
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
            C_MainWindow.fileTreeElementsOnClick();
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
    static fileTreeElementsOnClick() {
        C_MainWindow.fileTreeElements = C_MainWindow.pn_folder_tree.querySelectorAll('.dir, .file');
        for (let i = 0; i < C_MainWindow.fileTreeElements.length; i++) {
            // Verificando o tipo do elemento
            if (C_MainWindow.fileTreeElements[i].classList.contains('dir')) {
                C_MainWindow.fileTreeElements[i].children[0].addEventListener('click', () => {
                    // Fazendo seleção
                    if (i != C_MainWindow.lastFTE) {
                        C_MainWindow.fileTreeElements[i].classList.add('selected');
                        if (C_MainWindow.lastFTE != -1) {
                            C_MainWindow.fileTreeElements[C_MainWindow.lastFTE].classList.remove('selected');
                        }
                        C_MainWindow.lastFTE = i;
                    }
                    if (C_MainWindow.fileTreeElements[i].classList.contains('hidden')) {
                        C_MainWindow.fileTreeElements[i].classList.remove('hidden');
                    } else {
                        C_MainWindow.fileTreeElements[i].classList.add('hidden');
                    }
                });
            } else {
                C_MainWindow.fileTreeElements[i].addEventListener('click', () => {
                    // Fazendo seleção
                    if (i != C_MainWindow.lastFTE) {
                        C_MainWindow.fileTreeElements[i].classList.add('selected');
                        if (C_MainWindow.lastFTE != -1) {
                            C_MainWindow.fileTreeElements[C_MainWindow.lastFTE].classList.remove('selected');
                        }
                        C_MainWindow.lastFTE = i;
                    }
                });
            }
        }
    }
    static btn_deleteOnClick() {
        if (C_MainWindow.lastFTE != -1) {
           let tempE = C_MainWindow.fileTreeElements[C_MainWindow.lastFTE];

            // Deletando Arquivo
            if (tempE.classList.contains('dir')) {
                C_MainWindow.fsm.deleteDir(tempE.getAttribute('real-path'));
            } else {
                C_MainWindow.fsm.deleteFile(tempE.getAttribute('real-path'));
            }
            

            // Removendo elemento gráfico do Painel de Sistema de Pasta
            tempE.remove();
        }
    }
}

// Chamando Método Principal
C_MainWindow.main();