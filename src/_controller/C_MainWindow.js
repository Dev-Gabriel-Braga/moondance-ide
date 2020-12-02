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
        this.btn_create_dir = document.getElementById('btn-create-dir');
        this.btn_open = document.getElementById('btn-open');
        this.btn_delete = document.getElementById('btn-delete');

        // Programando eventos da barra de título
        this.btn_min.addEventListener('click', this.btn_minOnClick);
        this.btn_max.addEventListener('click', this.btn_maxOnClick);
        this.btn_clo.addEventListener('click', this.btn_cloOnClick);

        // Programando eventos do Painel de Sistema de Pastas
        this.pn_folder_tree.addEventListener('focus', this.pn_folder_treeOnFocus);
        this.pn_folder_tree.addEventListener('keyup', this.pn_folder_treeOnKeyUp);
        this.pn_folder_tree.addEventListener('keypress', this.pn_folder_treeOnKeyPress);
        this.btn_create_file.addEventListener('click', this.btn_create_fileOnClick);
        this.btn_create_dir.addEventListener('click', this.btn_create_dirOnClick);
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
                if (C_MainWindow.btn_create_file.disabled) {
                    C_MainWindow.btn_create_file.disabled = false;
                    C_MainWindow.btn_create_dir.disabled = false;
                    C_MainWindow.btn_delete.disabled = false;
                }
            }
        });
    }
    static loadFileTree(fileTree) {
        let tempNL = [];
        if (fileTree != undefined) {
            fileTree.forEach((v) => {
                if (v.content == undefined) {
                   tempNL.push(C_MainWindow.loadFile(v));
                } else {
                    tempNL.push(C_MainWindow.loadDir(v));
                }
            });
        }
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
        return file; 
    }
    static loadDir(d) {
        // Definindo estrutura
        let dir = document.createElement('div');
        dir.setAttribute('class', 'dir hidden');
        dir.setAttribute('real-path', d.realPath);
        
        // Atribuindo filhos
        dir.appendChild(C_MainWindow.loadDirName(d.name));
        dir.appendChild(C_MainWindow.loadDirContent(d.content));
        
        return dir;
    }
    static loadDirName(n) {
        // Definindo Estrutura
        let name = document.createElement('h3');
        name.setAttribute('class', 'name');
        name.setAttribute('tabindex', '0');
        name.innerText = n;

        // Definindo Eventos
        name.addEventListener('focus', () => {
            // Fazendo seleção
            if (!name.parentElement.isSameNode(C_MainWindow.lastFTE)) {
                C_MainWindow.lastFTE = name.parentElement;
            }
        });
        name.addEventListener('click', () => {
            if (name.parentElement.classList.contains('hidden')) {
                name.parentElement.classList.remove('hidden');
            } else {
                name.parentElement.classList.add('hidden');
            }
        });

        return name;
    }
    static loadDirContent(c) {
        let content = document.createElement('div');
        content.setAttribute('class', 'content');
        C_MainWindow.loadFileTree(c).forEach((node) => {
            content.appendChild(node);
        });

        return content;
    }
    static btn_deleteOnClick() {
        if (C_MainWindow.lastFTE != null && C_MainWindow.lastFTE.id != 'folder-tree') {
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
                });
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
    static pn_folder_treeOnKeyUp(e) {
        switch (e.key) {
            case 'F2':
                if (C_MainWindow.lastFTE != null && C_MainWindow.lastFTE.id != 'folder-tree') {
                    let input = document.createElement('input');
                    input.addEventListener('keyup', (e) => {
                        if (e.key == 'Enter') {
                            input.blur();
                        }
                    });
                    
                    // Verificando o tipo de elemento para adaptar a forma como o input é colocado
                    if (C_MainWindow.lastFTE.classList.contains('dir')) {
                        // Definindo Elemento de nome de diretório reserva;
                        let dirName = C_MainWindow.loadDirName(C_MainWindow.lastFTE.children[0].innerText);

                        input.value = C_MainWindow.lastFTE.children[0].innerText;
                        input.addEventListener('blur', () => {
                            if (input.value != '' && input.value != dirName.innerText) {
                                // Renomeando e corrigindo nome
                                let dir = C_MainWindow.fsm.rename(input.value, C_MainWindow.lastFTE.getAttribute('real-path'));
                                dirName.innerText = dir.name;

                                // Corrigindo paths de subelementos
                                C_MainWindow.updateSubPaths(C_MainWindow.lastFTE, C_MainWindow.lastFTE.getAttribute('real-path'), dir.realPath);

                                // Corrigindo path
                                C_MainWindow.lastFTE.setAttribute('real-path', dir.realPath);
                            }
                            input.replaceWith(dirName);
                        });
                        C_MainWindow.lastFTE.children[0].replaceWith(input);  
                    C_MainWindow.lastFTE.children[0].replaceWith(input);  
                        C_MainWindow.lastFTE.children[0].replaceWith(input);  
                    } else {
                        input.value = C_MainWindow.lastFTE.innerText;
                        input.addEventListener('blur', () => {
                            if (input.value != '' && input.value != C_MainWindow.lastFTE.innerText) {
                                let file = C_MainWindow.fsm.rename(input.value, C_MainWindow.lastFTE.getAttribute('real-path'));
                                C_MainWindow.lastFTE.innerText = file.name;
                                C_MainWindow.lastFTE.setAttribute('real-path', file.realPath);
                            }
                            input.replaceWith(C_MainWindow.lastFTE);
                        });
                        C_MainWindow.lastFTE.replaceWith(input);    
                    C_MainWindow.lastFTE.replaceWith(input);    
                        C_MainWindow.lastFTE.replaceWith(input);    
                    }
                    input.focus();
                }
                break;
        }
    }
    static pn_folder_treeOnKeyPress(e) {
        switch (e.key) {
            case '/': case '\\': case ':': case '*': case '?': case '<': case '>': case '|':
                e.preventDefault();
        }
    }
    static updateSubPaths(dir, oldPath, newPath) {
        for (let i = 0; i < dir.children[1].childElementCount; i++) {
            // Atualizando propriedade "realPath"
            let newRealPath = dir.children[1].children[i].getAttribute('real-path').replace(oldPath, newPath);
            dir.children[1].children[i].setAttribute('real-path', newRealPath);

            // Gerando recursão caso o subelemento seja uma pasta
            if (dir.children[1].children[i].classList.contains('dir')) {
                C_MainWindow.updateSubPaths(dir.children[1].children[i], oldPath, newPath);
            }
        }
    }
    static btn_create_dirOnClick () {
        if (C_MainWindow.lastFTE != null) {
            if (C_MainWindow.lastFTE.classList.contains('dir')) {
                if (C_MainWindow.lastFTE.classList.contains('hidden')) {
                    C_MainWindow.lastFTE.classList.remove('hidden');
                }
                let input = document.createElement('input');
                input.addEventListener('blur', () => {
                    if (input.value != '') {
                        let dir = C_MainWindow.fsm.createDir(input.value, C_MainWindow.lastFTE.getAttribute('real-path'));
                        C_MainWindow.lastFTE.children[1].appendChild(C_MainWindow.loadDir(dir));
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
                        let dir = C_MainWindow.fsm.createDir(input.value, C_MainWindow.currentDir.realPath);
                        C_MainWindow.lastFTE.appendChild(C_MainWindow.loadDir(dir));
                    }
                    input.remove();
                });
                input.addEventListener('keyup', (e) => {
                    if (e.key == 'Enter') {
                        input.blur();
                    }
                });
                C_MainWindow.lastFTE.appendChild(input);
                input.focus();
            }
        }
    }
}

// Chamando Método Principal
C_MainWindow.main();