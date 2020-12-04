// Version 1.2 (27/07/2020) Gabriel Braga

// Definindo Classe
class MogeTranspiler {
    // Método Construtor
    constructor() {
        this.input_text = '';
        this.output_text = '<!doctype html>\n';
        this.css_path = './_css/moge.css';
        this.js_path = './_js/moge.js';
        this.def_ident = 4;
        this.adic_tab = 0;
        this.hasError = false;
        this.error = null;
        this.isConsoleContext = true;
    }

    // Método de Transpilação
    transpile(moge_code) {
        // Armazenando valores
        this.input_text = moge_code;
        var temp_end;

        // Checando se input é uma Moge
        var sd1 = this.input_text.indexOf('|');
        var sd2 = this.input_text.indexOf('|', sd1 + 1);
        var f = this.input_text.indexOf('|+++|', sd2 + 1);

        // Lançando erro de Sintaxe
        if (sd1 == -1 || sd2 == -1 || f == -1 || sd1 == f || sd2 == f) {
            this.throwErro(1);
            return this.error;
        }

        // CONSTRUINDO ESTRUTURAS
        // Título
        this.buildTitle(this.input_text.slice(sd1 + 1, sd2).trim());

        // Lendo caracteres
        for (let index = sd2 + 1; index < this.input_text.length; index++) {
            switch(this.input_text[index]) {
                // Nota
                case '+':
                    if (this.input_text.slice(index, index + 3) == '+ [') {
                        temp_end = this.input_text.indexOf(']', index + 3);

                        // Checando se a Nota é fechada
                        if (temp_end == -1) {
                            // Lançando erro de Sintaxe
                            this.throwErro(2);
                            return this.error;
                        }
                            
                        this.buildNote(this.input_text.slice(index + 3, temp_end));
                        index = temp_end;
                    }
                    break;
                
                // Mídia
                case '@':
                    temp_end = this.input_text.indexOf(')', index);

                    // Checando se a Media é fechada
                    if (temp_end == -1) {
                        // Lançando erro de Sintaxe
                        this.throwErro(3);
                        return this.error;
                    }
                    
                    // Checando se Media foi criada corretamente
                    if (!this.buildMedia(this.input_text.slice(index, temp_end))) {
                        return this.error;
                    }

                    index = temp_end;
                    break;
        
                // Abertura de Bloco
                case '!':
                    temp_end = this.input_text.indexOf('{', index);
                    // Checando se o Bloco é aberto
                    if (temp_end == -1) {
                        // Lançando erro de Sintaxe
                        this.throwErro(4);
                        return this.error;
                    }

                    this.openBlock(this.input_text.slice(index + 1, temp_end));
                    this.adic_tab += 2;
                    index = temp_end;
                    break;

                // Fechamento de Bloco
                case '}':
                    this.closeBlock();
                    this.adic_tab -= 2;
                    break;
            }
        }

        // Rodapé
        this.buildFooter();

        // Retornando código transpilado
        return this.output_text;
    }

    // Métodos de Construção de Estruturas
    buildTitle(content) {
        this.output_text += `<html>${this.tab(1)}<head>${this.tab(2)}<meta charset="utf-8"/>${this.tab(2)}<title>${content}</title>${this.tab(2)}<link rel="stylesheet" href="${this.css_path}"/>${this.tab(2)}<script defer src="${this.js_path}"></script>${this.tab(1)}</head>${this.tab(1)}<body>${this.tab(2)}<div id="annotation">${this.tab(3)}<header id="title">${this.tab(this.def_ident)}<h1 class="content">${content}</h1>${this.tab(3)}</header>${this.tab(3)}<section id="data-area">`;
    }
    buildNote(content) {
        content = this.buildSubStructures(content);
        this.output_text += `${this.tab(this.def_ident + this.adic_tab)}<div class="note red">${this.tab(this.def_ident + this.adic_tab + 1)}<i class="icon-plus"></i>${this.tab(this.def_ident + this.adic_tab + 1)}<div class="content">${this.tab(this.def_ident + this.adic_tab + 2) + content.trim() + this.tab(this.def_ident + this.adic_tab + 1)}</div>${this.tab(this.def_ident + this.adic_tab)}</div>`;
    }
    buildMedia(content) {
        var ms = content.indexOf('(');

        // Checando se a Media abre
        if (ms == -1) {
            // Lançando erro de Sintaxe
            this.throwErro(5);
            return false;
        }

        var name = content.slice(1, ms).trim();
        var params = content.slice(ms + 1, content.length).split(',');
        var type = params[0].trim();
        var path = params[1].trim();
        this.output_text += `${this.tab(this.def_ident + this.adic_tab)}<div class="media closed">${this.tab(this.def_ident + this.adic_tab + 1)}<div class="content">`;

        switch (type) {
            case 'video':
                this.output_text += `${this.tab(this.def_ident + this.adic_tab + 2)}<video src="${path}" controls></video>`;
                this.output_text += `${this.tab(this.def_ident + this.adic_tab + 1)}</div>${this.tab(this.def_ident + this.adic_tab + 1)}<span class="desc">${this.tab(this.def_ident + this.adic_tab + 2)}<i class="icon-at"></i>${this.tab(this.def_ident + this.adic_tab + 2)}<span class="content">${name}</span>${this.tab(this.def_ident + this.adic_tab + 1)}</span>${this.tab(this.def_ident + this.adic_tab)}</div>`;
                break;
            
            case 'image':
                this.output_text += `${this.tab(this.def_ident + this.adic_tab + 2)}<img src="${path}" />`;
                this.output_text += `${this.tab(this.def_ident + this.adic_tab + 1)}</div>${this.tab(this.def_ident + this.adic_tab + 1)}<span class="desc">${this.tab(this.def_ident + this.adic_tab + 2)}<i class="icon-at"></i>${this.tab(this.def_ident + this.adic_tab + 2)}<span class="content">${name}</span>${this.tab(this.def_ident + this.adic_tab + 1)}</span>${this.tab(this.def_ident + this.adic_tab + 1)}<div class="btn-zoom" id="zoom-plus"></div>${this.tab(this.def_ident + this.adic_tab + 1)}<div class="btn-zoom" id="zoom-minus"></div>${this.tab(this.def_ident + this.adic_tab)}</div>`;
                break;
            default:
                this.throwErro(6);
                return false;
        }
        return true;
    }
    buildFooter() {
        this.output_text += `${this.tab(3)}</section>${this.tab(3)}<footer id="footer"></footer>${this.tab(2)}</div>${this.tab(1)}</body>\n</html>`
    }
    openBlock(name) {
        this.output_text += `${this.tab(this.def_ident + this.adic_tab)}<div class="block closed">${this.tab(this.def_ident + this.adic_tab + 1)}<header class="header">${this.tab(this.def_ident + this.adic_tab + 2)}<i class="icon-exc"></i>${this.tab(this.def_ident + this.adic_tab + 2)}<span class="name">${name}</span>${this.tab(this.def_ident + this.adic_tab + 1)}</header>${this.tab(this.def_ident + this.adic_tab + 1)}<div class="content">`;
    }
    closeBlock() {
        this.output_text += `${this.tab(3 + this.adic_tab)}</div>${this.tab(2 + this.adic_tab)}</div>`;
    }

    // Métodos de Construção de Subestruturas
    buildSubStructures(content) {
        var result = content;

        // Checando links externos
        while (result.indexOf('#<') != -1) {
            // Localizando posição dos delimitadores de Sub Estrutura
            let start = content.indexOf('#<');
            let end = content.indexOf('>#', start + 2);

            // Salvando conteúdo sem subestrutura aparente
            result = content.slice(0, start);

            // Construindo Link e Retornando
            result += this.buildLink(content.slice(start + 2, end).split(','));

            // Terminando
            if (content.length > end + 2) {
                result += `${this.tab(this.def_ident + this.adic_tab + 2)}` + content.slice(end + 2);
            }
            content = result;
        }

        // Checando Listas
        while (result.indexOf(':<') != -1) {
            // Localizando posição dos delimitadores de Sub Estrutura
            let start = content.indexOf(':<');
            let end = content.indexOf('>:', start + 2);

            // Salvando conteúdo sem subestrutura aparente
            result = content.slice(0, start);

            // Construindo Lista e Retornando
            result += this.buildList(content.slice(start + 2, end).split(','));

            // Checando se é o fim da linha
            if (content.length > end + 2) {
                result += `${this.tab(this.def_ident + this.adic_tab + 2)}` + content.slice(end + 2).trim();
            }
            content = result;
        }

        return result;
    }
    buildList(list_items) {
        var list = `:${this.tab(this.def_ident + this.adic_tab + 2)}<ul>`;

        // Adicionando list items
        list_items.forEach((li) => {
            list += `${this.tab(this.def_ident + this.adic_tab + 3)}<li>${li.trim()}</li>`;
        });

        list += `${this.tab(this.def_ident + this.adic_tab + 2)}</ul>`;
        return list;
    }
    buildLink(content) {
        var name = content[0].trim();
        var link = content[1].trim();
        return `${this.tab(this.def_ident + this.adic_tab + 2)}<a target="_blank" href="${link}">${name}</a>`
    }

    // Métodos Especiais
    showHelp() {
        console.log('Comandos:\n| -h | -> Exibe ajuda.\n| -v | -> Mostra a versão.\n| -f | -> Converte moge para html. Informe [FILE.moge] [DESTINO].');
    }
    showVersion() {
        console.log('Transpilador Moge - versão 1.2');
    }
    tab(num) {
        return '\n' + '\t'.repeat(num);
    }
    throwErro(index) {
        this.hasError = true;
        var start = 'Erro['+index+']:';
        if (this.isConsoleContext) {
            start = '\u001b[31m Erro['+index+']:\u001b[0m';
        }
        switch(index) {
            case 1:
                this.error = `${start} A entrada não pode ser Transpilada. Erro de sintaxe nas Estruturas de Separação.`;
                break;
            case 2:
                this.error = `${start} A entrada não pode ser Transpilada. Uma Estrutura de Nota não foi fechada.`;
                break;
            case 3:
                this.error = `${start} A entrada não pode ser Transpilada. Uma Estrutura de Mídia não foi fechada.`;
                break;
            case 4:
                this.error = `${start} A entrada não pode ser Transpilada. Uma Estrutura de Bloco foi declarada, mas não foi aberta.`;
                break;
            case 5:
                this.error = `${start} A entrada não pode ser Transpilada. Uma Estrutura de Mídia foi declarada, mas não foi aberta.`;
                break;
            case 6:
                this.error = `${start} A entrada não pode ser Transpilada. Uma Estrutura de Mídia usou um parâmetro inválido`;
                break;
        }
        
    }
}

// Exportando
module.exports = MogeTranspiler;