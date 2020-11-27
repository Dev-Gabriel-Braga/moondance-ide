// Importando Bibliotecas
const fs = require('fs');
const path = require('path');
const FileModel = require('./FileModel');
const DirModel = require('./DirModel');

// Definindo Classe
class FileSystemManager {
    // Método Construtor
    constructor() {
        this.currentDir = null;
        this.fileTree = [];
    }

    // Métodos Especiais
    readFile(realPath) { return fs.readFileSync(this.currentDir + "/" + realPath).toString(); }
    buildFileTree(dir = this.currentDir) {
        let tempFT = [];
        let tempFL = fs.readdirSync(dir);

        // Vasculhando lista de elementos do diretório
        tempFL.forEach((v) => {
            let realPath = path.join(dir, v);
            // Verificando se o elemento é um diretório ou um arquivo
            if (fs.lstatSync(realPath).isDirectory()) {
                tempFT.push(new DirModel(v, realPath, this.buildFileTree(realPath)));
            } else {
                tempFT.push(new FileModel(v, realPath));
            }
        });

        return tempFT;
    }
}

// Exportando Classe
module.exports = FileSystemManager;