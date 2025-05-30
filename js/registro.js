const formulario = document.getElementById('form');
const mensajeRegistro = document.getElementById('mensaje-registro');
const url = 'http://localhost:3333';
//const modal = document.getElementById('client-modal'); // Para cerrar el modal si aplica

// 💬 Función para mostrar mensaje
function mostrarMensaje(texto, tipo) {
    mensajeRegistro.textContent = texto;
    mensajeRegistro.className = '';
    mensajeRegistro.classList.add(tipo === 'exito' ? 'mensaje-exito' : 'mensaje-error');
    mensajeRegistro.classList.remove('mensaje-oculto');

    setTimeout(() => {
        mensajeRegistro.classList.add('mensaje-oculto');
    }, 3000);
}

// ✅ Función: Solo letras
function soloLetras(idCampo, maxLength, minLength) {
    const input = document.getElementById(idCampo);
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete', 'Home', 'End', ' '];

    input.addEventListener('keydown', function (e) {
        if (!allowedKeys.includes(e.key) && (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/.test(e.key) || input.value.length >= maxLength)) {
            e.preventDefault();
        }
    });

    input.addEventListener('paste', function (e) {
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;
        if (!regex.test(pasted) || (input.value.length + pasted.length) > maxLength) {
            e.preventDefault();
        }
    });

    input.addEventListener('blur', function () {
        if (input.value.length < minLength) {
            mostrarMensaje(`⚠️ El campo debe tener entre ${minLength} y ${maxLength} caracteres.`, 'error');
        }
    });
}

// ✅ Función: Solo números
function soloNumeros(idCampo, minLength, maxLength) {
    const input = document.getElementById(idCampo);
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

    input.addEventListener('keydown', function (e) {
        if (!allowedKeys.includes(e.key) && (!/^[0-9]$/.test(e.key) || input.value.length >= maxLength)) {
            e.preventDefault();
        }
    });

    input.addEventListener('paste', function (e) {
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        if (!/^\d+$/.test(pasted) || input.value.length + pasted.length > maxLength) {
            e.preventDefault();
        }
    });

    input.addEventListener('blur', function () {
        if (input.value.length < minLength) {
            mostrarMensaje(`⚠️ El campo debe tener al menos ${minLength} dígitos.`, 'error');
        }
    });
}

// ✅ Validaciones al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    soloNumeros('t1', 8, 10);     // ID
    soloNumeros('t3', 10, 10);    // Teléfono
    soloLetras('t2', 100, 3);     // Nombre completo
});

// ✅ Envío del formulario
clientForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const t1 = document.getElementById('t1').value.trim();
    const t2 = document.getElementById('t2').value.trim();
    const t3 = document.getElementById('t3').value.trim();
    const t4 = document.getElementById('t4').value.trim();
    const t5 = document.getElementById('t5').value.trim();

    // Validaciones básicas
    if (!t1 || !t2 || !t3 || !t4 || !t5) {
        mostrarMensaje("⚠️ Todos los campos son obligatorios", "error");
        return;
    }

    if (!/^\d{8,10}$/.test(t1)) {
        mostrarMensaje("⚠️ La identificación debe tener entre 8 y 10 dígitos", "error");
        return;
    }

    if (!/^\d{10}$/.test(t3)) {
        mostrarMensaje("⚠️ El teléfono debe tener exactamente 10 dígitos", "error");
        return;
    }

    if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{3,100}$/.test(t2)) {
        mostrarMensaje("⚠️ Nombres inválidos: solo letras y espacios (3-100 caracteres)", "error");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t4) || t4.length > 200) {
        mostrarMensaje("⚠️ Correo inválido", "error");
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(t5)) {
        mostrarMensaje("⚠️ Contraseña débil: 8+ caracteres, mayúscula, minúscula, número y símbolo", "error");
        return;
    }

    // ✅ Enviar a API
    try {
        const respuesta = await fetch(url + '/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ t1, t2, t3, t4, t5 })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            mostrarMensaje("✔️ Cliente creado exitosamente", "exito");
           // clientForm.reset();

            // ✅ Redirigir al inicio (ajusta si tu inicio es diferente)
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            mostrarMensaje(`❎ Error: ${datos.error || 'No se pudo crear el cliente.'}`, "error");
        }

    } catch (error) {
        console.error('Error al enviar solicitud:', error);
        mostrarMensaje("❎ Error de red o servidor.", "error");
    }
});
