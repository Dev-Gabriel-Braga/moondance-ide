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
    static btn_create_file;
    static btn_create_dir;
    static btn_delete;
    static btn_open;
    static btn_delete;
    static pn_root_folder;
    static pn_folder_tree;
    static lastFTE = null;
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
        this.btn_create_file = document.getElementById('btn-create-file');
        this.btn_open = document.getElementById('btn-open');
        this.btn_delete = document.getElementById('btn-delete');

        // Programando eventos da barra de título
        this.btn_min.addEventListener('click', this.btn_minOnClick);
        this.btn_max.addEventListener('click', this.btn_maxOnClick);
        this.btn_clo.addEventListener('click', this.btn_cloOnClick);

        // Programando eventos do Painel de Sistema de Pastas
        this.pn_folder_tree.addEventListener('focus', this.pn_folder_treeOnFocus);
        this.btn_create_file.addEventListener('click', this.btn_create_fileOnClick);
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
            if (res.filePaths[0] != undefined) {
                // Salvando pasta aberta e gerando árvore de arquivos
                C_MainWindow.currentDir = C_MainWindow.fsm.decompPath(res.filePaths[0]);
                C_MainWindow.pn_root_folder.innerText = C_MainWindow.currentDir.name;
                C_MainWindow.pn_folder_tree.innerHTML = '';
                C_MainWindow.loadFileTree(C_MainWindow.fsm.buildFileTree(C_MainWindow.currentDir.realPath)).forEach((node) => {
                    C_MainWindow.pn_folder_tree.appendChild(node);
                });
            }
        });
    }
    static loadFileTree(fileTree) {
        let tempNL = [];
        fileTree.forEach((v) => {
            if (v.content == undefined) {
               tempNL.push(C_MainWindow.loadFile(v));
            } else {
                tempNL.push(C_MainWindow.loadDir(v));
            }
        });
        return tempNL;
    }
    static loadFile(f) {
        // Definindo estrutura
        let file = document.createElement('div');
        file.setAttribute('class', 'file');
        file.setAttribute('real-path', f.realPath);
        file.setAttribute('tabindex', '0');
        file.innerText = f.name;

        // Definindo eventos
        file.addEventListener('focus', () => {
            // Fazendo seleção
            if (!file.isSameNode(C_MainWindow.lastFTE)) {
                C_MainWindow.lastFTE = file;
            }
        });
        file.addEventListener('blur', C_MainWindow.sfeOnBlur);
        return file; 
    }
    static loadDir(d) {
        // Definindo estrutura
        let dir = document.createElement('div');
        dir.setAttribute('class', 'dir hidden');
        dir.setAttribute('real-path', d.realPath);
        let name = document.createElement('h3');
        name.setAttribute('class', 'name');
        name.setAttribute('tabindex', '0');
        name.innerText = d.name;
        let content = document.createElement('div');
        content.setAttribute('class', 'content');
        C_MainWindow.loadFileTree(d.content).forEach((node) => {
            content.appendChild(node);
        });
        dir.appendChild(name);
        dir.appendChild(content);

        // Definindo Eventos
        dir.children[0].addEventListener('focus', () => {
            // Fazendo seleção
            if (!dir.isSameNode(C_MainWindow.lastFTE)) {
                console.log('funcional');
                C_MainWindow.lastFTE = dir;
            }
        });
        dir.children[0].addEventListener('click', () => {
            if (dir.classList.contains('hidden')) {
                dir.classList.remove('hidden');
            } else {
                dir.classList.add('hidden');
            }
        });
        
        return dir;
    }
    static btn_deleteOnClick() {
        if (C_MainWindow.lastFTE != null) {
            // Deletando
            if (C_MainWindow.lastFTE.classList.contains('dir')) {
                C_MainWindow.fsm.deleteDir(C_MainWindow.lastFTE.getAttribute('real-path'));
            } else {
                C_MainWindow.fsm.deleteFile(C_MainWindow.lastFTE.getAttribute('real-path'));
            }

            // Removendo elemento gráfico do Painel de Sistema de Pasta
            C_MainWindow.lastFTE.remove();
            C_MainWindow.lastFTE = null;
        }
    }
    static btn_create_fileOnClick() {
        if (C_MainWindow.lastFTE != null) {
            if (C_MainWindow.lastFTE.classList.contains('dir')) {
                if (C_MainWindow.lastFTE.classList.contains('hidden')) {
                    C_MainWindow.lastFTE.classList.remove('hidden');
                }
                let input = document.createElement('input');
                input.addEventListener('blur', () => {
                    if (input.value != '') {
                        let file = C_MainWindow.fsm.createFile(input.value, C_MainWindow.lastFTE.getAttribute('real-path'));
                        C_MainWindow.lastFTE.children[1].appendChild(C_MainWindow.loadFile(file));
                    }
                    input.remove();
                });
                input.addEventListener('keyup', (e) => {
                    if (e.key == 'Enter') {
                        input.blur();
                    }
                })
                C_MainWindow.lastFTE.children[1].appendChild(input);
                input.focus();
            } else if (C_MainWindow.lastFTE.id == 'folder-tree') {
                let input = document.createElement('input');
                input.addEventListener('blur', () => {
                    if (input.value != '') {
                        let file = C_MainWindow.fsm.createFile(input.value, C_MainWindow.currentDir.realPath);
                        C_MainWindow.lastFTE.appendChild(C_MainWindow.loadFile(file));
                    }
                    input.remove();
                });
                input.addEventListener('keyup', (e) => {
                    if (e.key == 'Enter') {
                        input.blur();
                    }
                })
                C_MainWindow.lastFTE.appendChild(input);
                input.focus();
            }
        }
    }
    static pn_folder_treeOnFocus() {
        if (!C_MainWindow.pn_folder_tree.isSameNode(C_MainWindow.lastFTE)) {
            C_MainWindow.lastFTE = C_MainWindow.pn_folder_tree;
        }
    }
    static sfeOnBlur() {
        C_MainWindow.lastFTE = null;
    }
}

// Chamando Método Principal
C_MainWindow.main();