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
        
        // Construimos las rutas dinámicamente usando el ID de la foto si existe, 
        // o recurriendo a las propiedades antiguas si las hubiera.
        let imgAnverso, imgReverso;
        
        if (m.id_foto) {
            imgAnverso = `img/${m.id_foto}_Anv.webp`;
            imgReverso = `img/${m.id_foto}_Rev.webp`;
        } else {
            imgAnverso = m.imagen_anverso || m.imagen || 'https://images.unsplash.com/photo-1604200230978-831343751761?w=150';
            imgReverso = m.imagen_reverso || 'https://images.unsplash.com/photo-1604200230978-831343751761?w=150';
        }

        let detalleConmemorativo = m.conmemorativa ? `<p><strong>Motivo:</strong> ${m.motivo || 'Sí'}</p>` : '';
        let enlaceIG = m.link_instagram ? `<a href="${m.link_instagram}" target="_blank" class="instagram-link">Ver en Instagram ↗</a>` : '';

        card.innerHTML = `
            <div style="display: flex; gap: 5px; justify-content: center;">
                <img src="${imgAnverso}" alt="Anverso ${m.valor}" style="width: 48%; cursor: pointer;" onclick="ampliarImagen('${imgAnverso}')" onerror="this.src='https://images.unsplash.com/photo-1604200230978-831343751761?w=150'">
                <img src="${imgReverso}" alt="Reverso ${m.valor}" style="width: 48%; cursor: pointer;" onclick="ampliarImagen('${imgReverso}')" onerror="this.style.display='none'">
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
