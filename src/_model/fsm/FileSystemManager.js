// Importando Bibliotecas
const fs = require('fs');
const path = require('path');
const FileModel = require('./FileModel');
const DirModel = require('./DirModel');

// Definindo Classe
class FileSystemManager {
    // Métodos Leitura
    decompPath(realPath) { return { name: path.basename(realPath), realPath: realPath }; }
    readFile(realPath) { return fs.readFileSync(realPath).toString(); }
    buildFileTree(dir) {
        let files = [];
        let dirs = [];
        let tempFL = fs.readdirSync(dir);

        // Vasculhando lista de elementos do diretório
        tempFL.forEach((v) => {
            let realPath = path.join(dir, v);
            // Verificando se o elemento é um diretório ou um arquivo
            if (fs.lstatSync(realPath).isDirectory()) {
                dirs.push(new DirModel(v, realPath, this.buildFileTree(realPath)));
            } else {
                files.push(new FileModel(v, realPath));
            }
        });
        return dirs.concat(files);
    }
}

// Exportando Classe
module.exports = FileSystemManager;