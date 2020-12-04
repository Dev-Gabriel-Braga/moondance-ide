// Importando Bibliotecas
const fs = require('fs');
const path = require('path');
const FileModel = require('./FileModel');
const DirModel = require('./DirModel');

// Definindo Classe
class FileSystemManager {
    // Métodos de Manipulação de arquivos e pastas
    createFile(fileName, dir) {
        let file = new FileModel(fileName, path.join(dir, fileName));
        while (fs.existsSync(file.realPath)) {
            file = this.addCopyPrefix(file.name, path.dirname(file.realPath));
        }
        fs.writeFileSync(file.realPath, "", { encoding: "utf-8" });
        return file;
    }
    createDir(dirName, dirRoot) {
        let dir = new DirModel(dirName, path.join(dirRoot, dirName));
        while (fs.existsSync(dir.realPath)) {
            dir = this.addCopyPrefix(dir.name, path.dirname(dir.realPath));
        }
        fs.mkdirSync(dir.realPath);
        return dir;
    }
    writeFile(realPath, text) { fs.writeFileSync(realPath, text, { encoding: "utf-8" }); }
    rename(newName, pathOriginal) {
        let info = { name: newName, realPath: path.join(path.dirname(pathOriginal), newName) };
        while (fs.existsSync(info.realPath)) {
            info = this.addCopyPrefix(info.name, path.dirname(info.realPath));
        }
        fs.renameSync(pathOriginal, info.realPath);
        return info;
    }
    readFile(realPath) { return fs.readFileSync(realPath).toString(); }
    deleteFile(realPath) { fs.unlinkSync(realPath) }
    deleteDir(realPath) {
        let sub = fs.readdirSync(realPath);
        for (let i = 0; i < sub.length; i++) {
            let subPath = path.join(realPath, sub[i]);
            if (fs.lstatSync(subPath).isDirectory()) {
                this.deleteDir(subPath);
            } else {
                this.deleteFile(subPath);
            }
        }
        fs.rmdirSync(realPath);
    }
    addCopyPrefix(name, dir) {
        let lio = (name.lastIndexOf('.') <= 0) ? name.length : name.lastIndexOf('.');
        name = name.slice(0, lio).concat('-copy').concat(name.slice(lio));
        return { name: name, realPath: path.join(dir, name) };
    }
    
    // Métodos Formatação
    decompPath(realPath) { return { name: path.basename(realPath), realPath: realPath }; }
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