// Importanto Bicliotecas
const { remote } = require('electron');
const FileSystemManager = require('../../_model/fsm/FileSystemManager');
const MogeTranspiler = require('../../_model/moge-transpiler/MogeTranspiler');
const EditSession = ace.require('ace/edit_session').EditSession;

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

    // Editor de Código
    static ace_container;
    static ace_editor = null;
    static tabs;
    static lastTab = null;
    static codeSessions = [];
    static codeLine;
    static codeColumn;
    static viewGraphic;
    static transMoge;

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
        this.tabs = document.getElementById('tabs');
        this.ace_container = document.getElementById('ace-container');
        this.codeLine = document.getElementById('line-count');
        this.codeColumn = document.getElementById('column-count');
        this.viewGraphic = document.getElementById('view-graphic');

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

        // Programando evento de visualização gráfica de arquivos moge
        this.viewGraphic.addEventListener('click', this.viewGraphicOnClick);
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
    static btn_openOnClick() {
        // Abrindo Janela Nativa para Abrir Pasta
        remote.dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then((res) => {
            if (res.filePaths[0] != undefined) {
                // Salvando pasta aberta e gerando árvore de arquivos
                C_MainWindow.currentDir = C_MainWindow.fsm.decompPath(res.filePaths[0]);

                // Verificando tamanho do nome da pasta
                if (C_MainWindow.currentDir.name.length < 23) {
                    C_MainWindow.pn_root_folder.innerText = C_MainWindow.currentDir.name;
                } else {
                    C_MainWindow.pn_root_folder.innerText = C_MainWindow.currentDir.name.slice(0, 21).concat('...');
                }
                
                C_MainWindow.pn_folder_tree.innerHTML = '';
                C_MainWindow.loadFileTree(C_MainWindow.fsm.buildFileTree(C_MainWindow.currentDir.realPath)).forEach((node) => {
                    C_MainWindow.pn_folder_tree.appendChild(node);
                });

                // Desbloqueando botões da barra de operações
                if (C_MainWindow.btn_create_file.disabled) {
                    C_MainWindow.btn_create_file.disabled = false;
                    C_MainWindow.btn_create_dir.disabled = false;
                    C_MainWindow.btn_delete.disabled = false;
                }

                // Resetando Painel de edição de código
                if (C_MainWindow.tabs.childElementCount > 0) {
                    C_MainWindow.tabs.innerHTML = '';
                    C_MainWindow.ace_editor.destroy();
                    C_MainWindow.codeSessions = [];
                }
            }
        });
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

                                // Corrigindo paths de subelementos (inclusive em abas abertas)
                                C_MainWindow.updateSubPaths(C_MainWindow.lastFTE, C_MainWindow.lastFTE.getAttribute('real-path'), dir.realPath);

                                // Corrigindo path
                                C_MainWindow.lastFTE.setAttribute('real-path', dir.realPath);
                            }
                            input.replaceWith(dirName);
                            C_MainWindow.verifyMogeView();
                        });
                        C_MainWindow.lastFTE.children[0].replaceWith(input);
                    } else {
                        input.value = C_MainWindow.lastFTE.innerText;
                        input.addEventListener('blur', () => {
                            if (input.value != '' && input.value != C_MainWindow.lastFTE.innerText) {
                                let file = C_MainWindow.fsm.rename(input.value, C_MainWindow.lastFTE.getAttribute('real-path'));
                                
                                // Atualizando nomes e paths de tabs abertas
                                C_MainWindow.updateFileTabFileName(C_MainWindow.lastFTE.innerText, file.name, file.realPath); 
                                
                                C_MainWindow.lastFTE.innerText = file.name;
                                C_MainWindow.lastFTE.setAttribute('real-path', file.realPath);
                            }
                            input.replaceWith(C_MainWindow.lastFTE);
                            C_MainWindow.verifyMogeView();
                        });
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
    static viewGraphicOnClick() {
        if (!C_MainWindow.viewGraphic.classList.contains('selected')) {
            C_MainWindow.viewGraphic.classList.add('selected');
            C_MainWindow.loadMoge();
        } else {
            C_MainWindow.viewGraphic.classList.remove('selected');
            C_MainWindow.ace_container.children[1].remove();
        }
    }

    // Métodos Especiais
    static loadTab(fileName, fileRealPath, sessionIndex) {
        // Definindo estrutura
        let tab = document.createElement('div');
        tab.setAttribute('class', 'tab selected');
        tab.setAttribute('file-real-path', fileRealPath);
        tab.setAttribute('session-index', sessionIndex);
        let x = document.createElement('i');
        x.setAttribute('class', 'x');
        tab.appendChild(C_MainWindow.loadTabName(fileName));
        tab.appendChild(x);

        if (C_MainWindow.lastTab != null) {
            C_MainWindow.lastTab.classList.remove('selected');
        }
        C_MainWindow.lastTab = tab;

        // Definindo eventos
        x.addEventListener('click', () => {
            let tabIndex = Number(x.parentElement.getAttribute('session-index'));
            
            // Verificando se há apenas 1 tab e, se não, se a tab está selectionada
            if (C_MainWindow.tabs.childElementCount == 1) {
                C_MainWindow.ace_editor.destroy();
            } else if (x.parentElement.classList.contains('selected')) {
                // Verificando se a tab selecionada é a primeira
                if (tabIndex == 0) {
                    C_MainWindow.tabs.children[1].classList.add('selected');
                    C_MainWindow.lastTab = C_MainWindow.tabs.children[1];
                    C_MainWindow.ace_editor.setSession(C_MainWindow.codeSessions[1]);
                    C_MainWindow.uptadeTabSessionIndexes(1, C_MainWindow.tabs.childElementCount - 1);
                } else {
                    C_MainWindow.tabs.children[tabIndex - 1].classList.add('selected');
                    C_MainWindow.lastTab = C_MainWindow.tabs.children[tabIndex - 1];
                    C_MainWindow.ace_editor.setSession(C_MainWindow.codeSessions[tabIndex - 1]);
                    C_MainWindow.uptadeTabSessionIndexes(tabIndex + 1, C_MainWindow.tabs.childElementCount - 1);
                }
                C_MainWindow.verifyMogeView();
            } else {
                // Atualizando números de sessão
                C_MainWindow.uptadeTabSessionIndexes(tabIndex + 1, C_MainWindow.tabs.childElementCount - 1);
            }

            // Apagando tab e sessão
            x.parentElement.remove();
            C_MainWindow.codeSessions.splice(tabIndex, 1); 
        });

        return tab;
    }
    static loadTabName(n) {
        // Definindo estrutura
        let name = document.createElement('h4');
        name.setAttribute('class', 'name');
        name.innerText = n;

        // Definindo eventos
        name.addEventListener('click', () => {
            if (!name.parentElement.isSameNode(C_MainWindow.lastTab)) {
                // Definindo seleção
                name.parentElement.classList.add('selected');
                if (C_MainWindow.lastTab != null) {
                    C_MainWindow.lastTab.classList.remove('selected');
                }
                C_MainWindow.lastTab = name.parentElement;

                // Mudando sessão do Ace Editor
                C_MainWindow.ace_editor.setSession(C_MainWindow.codeSessions[name.parentElement.getAttribute('session-index')]);
            
                // Resetando viewGraphic
                C_MainWindow.verifyMogeView();
            }
        });

        return name;
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
        file.addEventListener('dblclick', () => {
            // Verificando se Ace Editor está configurado
            if (C_MainWindow.ace_editor == null || C_MainWindow.ace_editor.$toDestroy == null) {
                C_MainWindow.configureAceEditor();
            }

            // Gerando Tab e sessão do arquivo
            C_MainWindow.tabs.appendChild(C_MainWindow.loadTab(file.innerText, file.getAttribute('real-path'), C_MainWindow.codeSessions.length));
            C_MainWindow.codeSessions.push(new EditSession(C_MainWindow.fsm.readFile(file.getAttribute('real-path'))));
            C_MainWindow.insertCodeSession(file.innerText, C_MainWindow.codeSessions[C_MainWindow.codeSessions.length -1]);
            C_MainWindow.verifyMogeView();
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
    static loadMoge() {
        // Configurando Transpilador
        if (C_MainWindow.transMoge == null) {
            C_MainWindow.transMoge = new MogeTranspiler();
            C_MainWindow.transMoge.css_path = '../../_model/moge-transpiler/res/_css/moge.css';
            C_MainWindow.transMoge.js_path = '../../_model/moge-transpiler/res/_js/moge.js';
        }

        // Criando elemento que conterá a página html de resultado
        let html_result = document.createElement('iframe');
        html_result.srcdoc = C_MainWindow.transMoge.transpile(C_MainWindow.ace_editor.session.getValue());

        C_MainWindow.ace_container.appendChild(html_result);
    }
    static updateSubPaths(dir, oldPath, newPath) {
        for (let i = 0; i < dir.children[1].childElementCount; i++) {
            // Gerando "realPath" atualizado
            let newRealPath = dir.children[1].children[i].getAttribute('real-path').replace(oldPath, newPath);

            // Gerando recursão caso o subelemento seja uma pasta
            if (dir.children[1].children[i].classList.contains('dir')) {
                C_MainWindow.updateSubPaths(dir.children[1].children[i], oldPath, newPath);
            } else {
                // Atualizando paths de abas, se houverem abas abertas
                C_MainWindow.updateFileTabDirPath(dir.children[1].children[i].innerText, newRealPath);
            }

            // Atualizando propriedade "real-path"
            dir.children[1].children[i].setAttribute('real-path', newRealPath);
        }
    }
    static uptadeTabSessionIndexes(start, end) {
        for (let i = start; i <= end; i++) {
            C_MainWindow.tabs.children[i].setAttribute('session-index', i - 1);
        }
    }
    static updateFileTabDirPath(fileName, newPath) {
        for (let i = 0; i < C_MainWindow.tabs.childElementCount; i++) {
            if (C_MainWindow.tabs.children[i].children[0].innerText == fileName) {
                C_MainWindow.tabs.children[i].setAttribute('file-real-path', newPath);
            }
        }
    }
    static updateFileTabFileName(fileName, newFileName, newFilePath) {
        for (let i = 0; i < C_MainWindow.tabs.childElementCount; i++) {
            if (C_MainWindow.tabs.children[i].children[0].innerText == fileName) {
                // Atualizando nome e path
                C_MainWindow.tabs.children[i].children[0].innerText = newFileName;
                C_MainWindow.tabs.children[i].setAttribute('file-real-path', newFilePath);

                // Atualizando modo da sessão
                C_MainWindow.defineSessionMode(newFileName, C_MainWindow.tabs.children[i].getAttribute('session-index'));
            }
        }
    }
    static configureAceEditor() {
        C_MainWindow.ace_editor = ace.edit(document.getElementById('ace-editor'));
        C_MainWindow.ace_editor.setTheme('ace/theme/moon-dark');
        C_MainWindow.ace_editor.commands.addCommand({
            name: 'Save File',
            bindKey: {
                win: 'Ctrl-S',
                mac: 'Command-S'
            },
            exec: C_MainWindow.saveFile,
            readOnly: true
        });
        C_MainWindow.ace_editor.commands.addCommand({
            name: 'Wrap Lines',
            bindKey: {
                win: 'Alt-Z',
                mac: 'Opition-Z'
            },
            exec: C_MainWindow.wrapLines,
            readOnly: true
        });
        C_MainWindow.ace_editor.on('change', C_MainWindow.codeChanged);
    }
    static insertCodeSession(fileName, codeSession) {
        // Colocando sessão no Editor
        C_MainWindow.ace_editor.setSession(codeSession);

        // Verificando a extensão do arquivo
        C_MainWindow.defineSessionMode(fileName);

        // Definindo evento de sessão
        C_MainWindow.ace_editor.session.selection.on("changeCursor", C_MainWindow.cursorChanged);
    }
    static defineSessionMode(fileName, sessionIndex = null) {
        let session = (sessionIndex == null) ? C_MainWindow.ace_editor.session : C_MainWindow.codeSessions[sessionIndex];
        switch (fileName.slice(fileName.lastIndexOf('.'))) {
            case '.moge':
                session.setMode('ace/mode/moge');
                break;
            
            default:
                session.setMode('ace/mode/plain_text');
        }
    }
    static verifyMogeView() {
        if (C_MainWindow.ace_container.childElementCount > 1) {
            C_MainWindow.ace_container.children[1].remove();
            C_MainWindow.viewGraphic.classList.remove('selected');
        }

        // Checando se o novo arquivo aberto é um arquivo moge
        if (C_MainWindow.lastTab.innerText.slice(C_MainWindow.lastTab.innerText.lastIndexOf('.')) == '.moge') {
            if (C_MainWindow.viewGraphic.disabled) {
                C_MainWindow.viewGraphic.disabled = false;
            }
        } else {
            if (!C_MainWindow.viewGraphic.disabled) {
                C_MainWindow.viewGraphic.disabled = true;
            }
        }
    }

    // Eventos do Ace Editor
    static saveFile() {
        C_MainWindow.fsm.writeFile(C_MainWindow.lastTab.getAttribute('file-real-path'), C_MainWindow.ace_editor.session.getValue());
        C_MainWindow.lastTab.children[1].classList.remove('not-saved');
    }
    static codeChanged() {
        C_MainWindow.lastTab.children[1].classList.add('not-saved');
    }
    static cursorChanged() {
        let { row, column } = C_MainWindow.ace_editor.selection.getCursor();
        C_MainWindow.codeLine.innerText = `Row: ${row + 1}`;
        C_MainWindow.codeColumn.innerText = `Col: ${column + 1}`; 
    }
    static wrapLines() {
        C_MainWindow.ace_editor.session.setUseWrapMode(!C_MainWindow.ace_editor.session.getUseWrapMode());
    }
}

// Chamando Método Principal
C_MainWindow.main();