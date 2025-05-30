const formulario = document.getElementById('form');
const mensajeRegistro = document.getElementById('mensaje-registro');
const url = 'http://localhost:3333';

function mostrarMensaje(texto, tipo) {
    mensajeRegistro.textContent = texto;
    mensajeRegistro.className = '';
    mensajeRegistro.classList.add(tipo === 'exito' ? 'mensaje-exito' : 'mensaje-error');
    mensajeRegistro.classList.remove('mensaje-oculto');

    setTimeout(() => {
        mensajeRegistro.classList.add('mensaje-oculto');
    }, 3000);
}

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tl1 = document.getElementById('tl1').value.trim();
    const tl2 = document.getElementById('tl2').value.trim();

    if (!tl1 || !tl2) {
        mostrarMensaje("⚠️ Todos los campos son obligatorios", "error");
        return;
    }

    try {
        const respuesta = await fetch(url + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tl1, tl2 })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            mostrarMensaje("✔️ Bienvenido", "exito");

            setTimeout(() => {
                window.location.href = 'menu.html';
            }, 3000);
        } else {
            mostrarMensaje(`❎ Error: ${datos.error || 'Error desconocido.'}`, "error");
        }

    } catch (error) {
        console.error('Error al enviar solicitud:', error);
        mostrarMensaje("❎ Error de red o servidor.", "error");
    }
});
