
let coleccionMonedas = [];

const URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRu06uTaYrebKpFGsHgpT_ju9Sf5DIkz7lrl9Pb0wcl86beVXKKYxVOc_8QSR3dP7qSEW-PwY4ijdMO/pub?output=csv';

fetch(URL_CSV)
    .then(response => response.text())
    .then(dataText => {
        coleccionMonedas = parsearCSV(dataText);
        console.log("Monedas cargadas desde Google Sheets:", coleccionMonedas.length);
        console.log("Ejemplo de primera moneda:", coleccionMonedas[0]);
        mostrarMonedas(coleccionMonedas);
    })
    .catch(error => console.error('Error cargando las monedas desde Google Sheets:', error));

function parsearCSV(texto) {
    const lineas = texto.split('\n');
    if (lineas.length === 0) return [];
    
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

    if (!monedas || monedas.length === 0) {
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
        let kmValor = m['KM#'] || m['FO#'];
        let kmInfo = kmValor ? `<p><strong>KM#:</strong> ${kmValor}</p>` : '';
        let enlaceIG = m['Enlace a la foto en Instagram'] ? `<a href="${m['Enlace a la foto en Instagram']}" target="_blank" class="instagram-link">Ver en Instagram ↗</a>` : '';

        card.innerHTML = `
            <div style="display: flex; gap: 5px; justify-content: center;">
                <img src="${imgAnverso}" alt="Anverso" style="width: 48%; cursor: pointer;" onclick="ampliarImagen('${imgAnverso}')" onerror="this.src='https://images.unsplash.com/photo-1604200230978-831343751761?w=150'">
                <img src="${imgReverso}" alt="Reverso" style="width: 48%; cursor: pointer;" onclick="ampliarImagen('${imgReverso}')" onerror="this.style.display='none'">
            </div>
            <h3>${m.Pais || 'Moneda'}</h3>
            <div class="coin-info">
                <p><strong>Año:</strong> ${m.Año || ''}</p>
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

function filtrar(paisOpcion, subcategoria = null) {
    let titulo = document.getElementById('titulo-seccion');
    
    let filtradas = coleccionMonedas.filter(m => {
        if (!m.Pais) return false;
        let coincidePais = m.Pais.trim().toLowerCase() === paisOpcion.trim().toLowerCase();
        
        if (subcategoria) {
            titulo.innerText = `${paisOpcion}: ${subcategoria}`;
            // Comprobamos si coincide el país y además la subcategoría (por ejemplo en Estado, Nombre o KM#)
            let textoFila = Object.values(m).join(' ').toLowerCase();
            return coincidePais && textoFila.includes(subcategoria.toLowerCase());
        }
        
        titulo.innerText = paisOpcion;
        return coincidePais;
    });
    
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
