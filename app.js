
let coleccionMonedas = [];

fetch('monedas.json')
    .then(response => response.json())
    .then(data => {
        coleccionMonedas = data;
        mostrarMonedas(coleccionMonedas);
    })
    .catch(error => console.error('Error cargando las monedas:', error));

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
        
        let imgAnverso = m.imagen_anverso || m.imagen || 'https://images.unsplash.com/photo-1604200230978-831343751761?w=150'; // Una foto de moneda genérica
        let imgReverso = m.imagen_reverso || 'https://images.unsplash.com/photo-1604200230978-831343751761?w=150';
        let detalleConmemorativo = m.conmemorativa ? `<p><strong>Motivo:</strong> ${m.motivo || 'Sí'}</p>` : '';
        let enlaceIG = m.link_instagram ? `<a href="${m.link_instagram}" target="_blank" class="instagram-link">Ver en Instagram ↗</a>` : '';

        card.innerHTML = `
            <div style="display: flex; gap: 5px; justify-content: center;">
                <img src="${imgAnverso}" alt="Anverso ${m.valor}" style="width: 48%;" onclick="ampliarImagen('${imgAnverso}')">
                <img src="${imgReverso}" alt="Reverso ${m.valor}" style="width: 48%;" onclick="ampliarImagen('${imgReverso}')">
            </div>
            <h3>${m.pais} - ${m.valor}</h3>
            <div class="coin-info">
                <p><strong>Año:</strong> ${m.ano}</p>
                <p><strong>Composición:</strong> ${m.composicion}</p>
                ${detalleConmemorativo}
            </div>
            ${enlaceIG}
        `;
        grid.appendChild(card);
    });
}

function filtrar(categoriaOPais, subcategoria = null) {
    let titulo = document.getElementById('titulo-seccion');
    
    let filtradas = coleccionMonedas.filter(m => {
        if (subcategoria) {
            titulo.innerText = `${categoriaOPais}: ${subcategoria}`;
            return m.pais === categoriaOPais && m.subcategoria === subcategoria;
        }
        if (categoriaOPais === 'Plata') {
            titulo.innerText = 'Monedas de Plata';
            return m.es_plata === true;
        }
        if (categoriaOPais === 'Exonumia') {
            titulo.innerText = 'Exonumia';
            return m.es_exonumia === true;
        }
        titulo.innerText = categoriaOPais;
        return m.pais === categoriaOPais;
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
