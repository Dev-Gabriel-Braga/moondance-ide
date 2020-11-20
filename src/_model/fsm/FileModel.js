// Definindo Classe
class FileModel {
    // Método Construtor
    constructor(name, realPath) {
        this.name = name;
        this.realPath = realPath;
    }

    // Métodos Especiais
    getExtension() {
        var pl = this.name.lastIndexOf('.');
        return pl != -1 ? this.name.slice(pl + 1) : null;
    }
}

// Exportando Classe
module.exports = FileModel;