
let coleccionMonedas = [];

// IMPORTANTE: Si tus hojas están separadas en Google Sheets, asegúrate de que este enlace apunta a la pestaña principal, 
// o unifica todas tus monedas en una sola pestaña de Google Sheets para que se carguen todas de golpe.
const URL_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRu06uTaYrebKpFGsHgpT_ju9Sf5DIkz7lrl9Pb0wcl86beVXKKYxVOc_8QSR3dP7qSEW-PwY4ijdMO/pub?output=csv';

fetch(URL_CSV)
    .then(response => response.text())
    .then(dataText => {
        coleccionMonedas = parsearCSV(dataText);
        console.log("Monedas cargadas correctamente:", coleccionMonedas.length);
        if (coleccionMonedas.length > 0) {
            console.log("Primera moneda procesada:", coleccionMonedas[0]);
        }
        mostrarMonedas(coleccionMonedas);
    })
    .catch(error => console.error('Error cargando las monedas desde Google Sheets:', error));

function parsearCSV(texto) {
    const lineas = texto.split('\n');
    if (lineas.length === 0) return [];
    
    const cabeceras = parsearLineaCSV(lineas[0]).map(h => h.trim().replace(/^"|"$/g, ''));
    let resultado = [];

    for (let i = 1; i < lineas.length; i++) {
        if (!lineas[i].trim()) continue;
        
        const valores = parsearLineaCSV(lineas[i]);
        let obj = {};
        
        cabeceras.forEach((cabecera, index) => {
            let valorLimpio = valores[index] ? valores[index].trim().replace(/^"|"$/g, '') : '';
            obj[cabecera] = valorLimpio;
        });
        resultado.push(obj);
    }
    return resultado;
}

function parsearLineaCSV(linea) {
    let valores = [];
    let enComillas = false;
    let valorActual = '';
    
    for (let i = 0; i < linea.length; i++) {
        let char = linea[i];
        if (char === '"') {
            enComillas = !enComillas;
        } else if (char === ',' && !enComillas) {
            valores.push(valorActual.trim());
            valorActual = '';
        } else {
            valorActual += char;
        }
    }
    valores.push(valorActual.trim());
    return valores;
}

// Función auxiliar robusta para buscar claves sin importar mayúsculas, acentos o espacios
function obtenerValor(moneda, posiblesNombres) {
    for (let nombre of posiblesNombres) {
        let claveReal = Object.keys(moneda).find(k => k.trim().toLowerCase() === nombre.toLowerCase());
        if (claveReal !== undefined && moneda[claveReal] !== "") {
            return moneda[claveReal];
        }
    }
    return "";
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
        
        let idFoto = obtenerValor(m, ['ID_Foto', 'id_foto', 'ID', 'Id', 'Foto']);
        let pais = obtenerValor(m, ['País', 'Pais', 'Country']) || 'Moneda';
        let anio = obtenerValor(m, ['Año', 'Anio', 'Year']);
        let ceca = obtenerValor(m, ['Ceca', 'Mint']);
        let estado = obtenerValor(m, ['Estado', 'Conservacion', 'State']);
        let km = obtenerValor(m, ['KM#', 'FO#', 'Catalog']);
        let nombreMotivo = obtenerValor(m, ['Nombre', 'Motivo', 'Descripcion', 'Title']);
        let instagram = obtenerValor(m, ['Enlace a la foto en Instagram', 'Instagram', 'Link']);

        let imgAnverso, imgReverso;
        if (idFoto && idFoto !== "") {
            imgAnverso = `img/${idFoto}_Anv.webp`;
            imgReverso = `img/${idFoto}_Rev.webp`;
        } else {
            imgAnverso = 'https://images.unsplash.com/photo-1604200230978-831343751761?w=150';
            imgReverso = 'https://images.unsplash.com/photo-1604200230978-831343751761?w=150';
        }

        let htmlMotivo = nombreMotivo ? `<p><strong>Motivo:</strong> ${nombreMotivo}</p>` : '';
        let htmlCeca = ceca ? `<p><strong>Ceca:</strong> ${ceca}</p>` : '';
        let htmlEstado = estado ? `<p><strong>Estado:</strong> ${estado}</p>` : '';
        let htmlKm = km ? `<p><strong>KM#:</strong> ${km}</p>` : '';
        let htmlIg = instagram ? `<a href="${instagram}" target="_blank" class="instagram-link">Ver en Instagram ↗</a>` : '';

        card.innerHTML = `
            <div style="display: flex; gap: 5px; justify-content: center;">
                <img src="${imgAnverso}" alt="Anverso" style="width: 48%; cursor: pointer;" onclick="ampliarImagen('${imgAnverso}')" onerror="this.src='https://images.unsplash.com/photo-1604200230978-831343751761?w=150'">
                <img src="${imgReverso}" alt="Reverso" style="width: 48%; cursor: pointer;" onclick="ampliarImagen('${imgReverso}')" onerror="this.style.display='none'">
            </div>
            <h3>${pais}</h3>
            <div class="coin-info">
                <p><strong>Año:</strong> ${anio}</p>
                ${htmlCeca}
                ${htmlEstado}
                ${htmlKm}
                ${htmlMotivo}
            </div>
            ${htmlIg}
        `;
        grid.appendChild(card);
    });
}

function filtrar(categoriaOpcion, subcategoria = null) {
    let titulo = document.getElementById('titulo-seccion');
    
    let filtradas = coleccionMonedas.filter(m => {
        let textoFilaCompleto = Object.values(m).join(' ').toLowerCase();
        let categoriaBuscada = categoriaOpcion.toLowerCase();
        
        let coincide = textoFilaCompleto.includes(categoriaBuscada);
        
        if (subcategoria) {
            titulo.innerText = `${categoriaOpcion}: ${subcategoria}`;
            let subBuscada = subcategoria.toLowerCase();
            return coincide && textoFilaCompleto.includes(subBuscada);
        }
        
        titulo.innerText = categoriaOpcion;
        return coincide;
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
