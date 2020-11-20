// Importando Bibliotecas
const fs = require('fs');
const FileModel = require('./FileModel');
const DirModel = require('./DirModel');

// Definindo Classe
class FileSystemManager {
    // Método Construtor
    constructor(currentDir = null) {
        this.currentDir = currentDir;
        this.fileTree = [];
    }
}

// Exportando Classe
module.exports = FileSystemManager;