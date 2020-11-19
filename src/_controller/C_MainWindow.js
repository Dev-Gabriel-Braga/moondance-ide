// Importanto Bicliotecas
const { remote } = require('electron');

// Definindo Classe
class C_MainWindow {
    // Atributos Estáticos
    static btn_min;
    static btn_max;
    static btn_clo;

    // Método Principal
    static main() {
        this.btn_min = document.getElementById('min');
        this.btn_min.addEventListener('click', this.btn_minOnClick);
        this.btn_max = document.getElementById('max');
        this.btn_max.addEventListener('click', this.btn_maxOnClick);
        this.btn_clo = document.getElementById('clo');
        this.btn_clo.addEventListener('click', this.btn_cloOnClick);
    }

    // Métodos de Eventos DOOM
    static btn_minOnClick() { remote.getCurrentWindow().minimize(); }
    static btn_maxOnClick() { 
        if (remote.getCurrentWindow().isMaximized()) {
            remote.getCurrentWindow().unmaximize();
        } else {
            remote.getCurrentWindow().maximize();
        }
    }
    static btn_cloOnClick() { remote.getCurrentWindow().close(); }
}

// Chamando Método Principal
C_MainWindow.main();