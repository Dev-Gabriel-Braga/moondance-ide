// Capturando todas as notas
var notes = document.querySelectorAll('div.note');

if (notes.length > 0) {
    // Evento de Clique
    notes.forEach((note) => {
        note.addEventListener('dblclick', () => {
            if (note.classList.contains('red')) {
                note.classList.remove('red');
                note.classList.add('green');
            } else {
                note.classList.remove('green');
                note.classList.add('red');
            }
        });
    });
}

// Capturando todos os blocos
var blocks = document.querySelectorAll('div.block');

if (blocks.length > 0) {
    // Evento de Clique
    blocks.forEach((block, index) => {
        let header = block.children[0];
        let content = block.children[1];

        header.addEventListener('click', () => {
            if (block.classList.contains('closed')) {
                block.classList.remove('closed');
            } else {
                block.classList.add('closed');
            }
        });
    });
}

// Capturando todas mídias
var medias = document.querySelectorAll('div.media');

// Evento de clique
if (medias.length > 0) {
    medias.forEach((media, index) => {
        let content = media.children[0];
        let desc = media.children[1];
        let zplus = media.children[2];
        let zminus = media.children[3];

        if (zplus != null) {
            let img = content.children[0];
            img.zoom = 1;
            zplus.addEventListener('click', () => {
                if (img.zoom < 3) {
                    img.zoom += 0.1;
                    img.style.transform = `scale(${img.zoom})`;
                }
            });
            zminus.addEventListener('click', () => {
                if (img.zoom > 1) {
                    img.zoom -= 0.1;
                    img.style.transform = `scale(${img.zoom})`;
                }
            });
        }
        desc.addEventListener('click', () => {
            if (media.classList.contains('closed')) {
                media.classList.remove('closed')
            } else {
                media.classList.add('closed');
            }
        });
        
    });
}

