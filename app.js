
let coleccionMonedas = [];

const URL_CSV = 'https://docs.google.com/spreadsheets/d/1qFo6gd08Yc4iekHrG16535LwFa5kGmlmOw-nOlxyqdQ/export?format=csv';

fetch(URL_CSV)
    .then(response => response.text())
    .then(dataText => {
        coleccionMonedas = parsearCSV(dataText);
        mostrarMonedas(coleccionMonedas);
    })
    .catch(error => console.error('Error cargando las monedas desde Google Sheets:', error));

function parsearCSV(texto) {
    const lineas = texto.split('\n');
    const cabeceras = lineas[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    let resultado = [];

    for (let i = 1; i < lineas.length; i++) {
        if (!lineas[i].trim()) continue;
        
        const valores = lineas[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lineas[i].split(',');
        
        let obj = {};
        cabeceras.forEach((cabecera, index) => {
            let valorLimpio = valores[index] ? valores[index].trim().replace(/^"|"$/g, '') : '';
            if (valorLimpio.toLowerCase() === 'true') valorLimpio = true;
            if (valorLimpio.toLowerCase() === 'false') valorLimpio = false;
            
            obj[cabecera] = valorLimpio;
        });
        resultado.push(obj);
    }
    return resultado;
}

function mostrarMonedas(monedas) {
    const grid = document.getElementById('grid-monedas');
    grid.innerHTML = '';

    if(monedas.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay monedas registradas en esta categoría.</p>';
        return;
    }

    monedas.forEach(m => {
        const card = document.createElement('div');
        card.className = 'coin-card';
        
        let imgAnverso, imgReverso;
        const idFoto = m.ID_Foto || m.id_foto;
        
        if (idFoto && idFoto !== "") {
            imgAnverso = `img/${idFoto}_Anv.webp`;
            imgReverso = `img/${idFoto}_Rev.webp`;
        } else {
            imgAnverso = 'https://images.unsplash.com/photo-1604200230978-831343751761?w=150';
            imgReverso = 'https://images.unsplash.com/photo-1604200230978-831343751761?w=150';
        }

        let nombreMotivo = m.Nombre ? `<p><strong>Motivo:</strong> ${m.Nombre}</p>` : '';
        let cecaInfo = m.Ceca ? `<p><strong>Ceca:</strong> ${m.Ceca}</p>` : '';
        let estadoInfo = m.Estado ? `<p><strong>Estado:</strong> ${m.Estado}</p>` : '';
        let kmInfo = m.KM# ? `<p><strong>KM#:</strong> ${m.KM#}</p>` : '';
        
        let enlaceIG = m['Enlace a la foto en Instagram'] ? `<a href="${m['Enlace a la foto en Instagram']}" target="_blank" class="instagram-link">Ver en Instagram ↗</a>` : '';

        card.innerHTML = `
            <div style="display: flex; gap: 5px; justify-content: center;">
                <img src="${imgAnverso}" alt="Anverso ${m.Pais}" style="width: 48%; cursor: pointer;" onclick="ampliarImagen('${imgAnverso}')" onerror="this.src='https://images.unsplash.com/photo-1604200230978-831343751761?w=150'">
                <img src="${imgReverso}" alt="Reverso ${m.Pais}" style="width: 48%; cursor: pointer;" onclick="ampliarImagen('${imgReverso}')" onerror="this.style.display='none'">
            </div>
            <h3>${m.Pais}</h3>
            <div class="coin-info">
                <p><strong>Año:</strong> ${m.Año}</p>
                ${cecaInfo}
                ${estadoInfo}
                ${kmInfo}
                ${nombreMotivo}
            </div>
            ${enlaceIG}
        `;
        grid.appendChild(card);
    });
}

function filtrar(categoriaOPais) {
    let titulo = document.getElementById('titulo-seccion');
    titulo.innerText = categoriaOPais;
    
    let filtradas = coleccionMonedas.filter(m => m.Pais === categoriaOPais);
    mostrarMonedas(filtradas);
}

function mostrarTodas() {
    document.getElementById('titulo-seccion').innerText = 'Todas las monedas';
    mostrarMonedas(coleccionMonedas);
}

function ampliarImagen(src) {
    const modal = document.getElementById('modal');
    const imgModal = document.getElementById('img-modal');
    modal.style.display = "block";
    imgModal.src = src;
}

function cerrarModal() {
    document.getElementById('modal').style.display = "none";
}
