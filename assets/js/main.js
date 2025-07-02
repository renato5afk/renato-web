// assets/js/main.js

document.addEventListener('DOMContentLoaded', () => { // Asegurarse de que el DOM esté cargado

    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.textContent = navMenu.classList.contains('active') ? '✕' : '☰'; // Cambiar a 'X' o '☰'
        });
    }

    const contactForm = document.getElementById('contact-form');
    const errorNombre = document.getElementById('errorNombre');
    const errorCorreo = document.getElementById('errorCorreo');
    const errorMensaje = document.getElementById('errorMensaje');
    const successMsg = document.getElementById('successMsg');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // ¡Esto es CRUCIAL para evitar la recarga de la página!

            // Limpiar mensajes anteriores
            errorNombre.textContent = '';
            errorCorreo.textContent = '';
            errorMensaje.textContent = '';
            successMsg.textContent = '';

            const nombreInput = document.getElementById('nombre');
            const correoInput = document.getElementById('correo');
            const mensajeInput = document.getElementById('mensaje');

            let isValid = true;

            // Validación de campos
            if (!nombreInput.value.trim()) {
                errorNombre.textContent = 'El nombre es obligatorio.';
                isValid = false;
            }
            if (!correoInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoInput.value.trim())) {
                errorCorreo.textContent = 'Ingresa un correo electrónico válido.';
                isValid = false;
            }
            if (!mensajeInput.value.trim()) {
                errorMensaje.textContent = 'El mensaje es obligatorio.';
                isValid = false;
            }

            if (!isValid) {
                return; // Detener si la validación falla
            }

            // Si la validación pasa, enviar a Formspree
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // ¡Importante para recibir la respuesta JSON de Formspree!
                    }
                });

                if (response.ok) {
                    // Si Formspree respondió OK (código 200)
                    successMsg.textContent = '¡Mensaje enviado con éxito! Te contactaré pronto.';
                    contactForm.reset(); // Limpiar el formulario
                } else {
                    // Si Formspree respondió con un error (código 4xx, 5xx)
                    const data = await response.json(); // Intentar leer la respuesta JSON de Formspree
                    if (data.errors) {
                        // Formspree puede enviar errores específicos (ej. CAPTCHA, spam)
                        successMsg.textContent = 'Error al enviar el mensaje: ' + data.errors.map(err => err.message).join(', ');
                        console.error('Errores de Formspree:', data.errors);
                    } else {
                        // Error general de Formspree
                        successMsg.textContent = 'Error al enviar el mensaje. Intenta de nuevo. (Error de Formspree)';
                        console.error('Respuesta de Formspree no OK:', response.status, data);
                    }
                }
            } catch (error) {
                // Si hay un error de red (ej. sin internet, URL incorrecta)
                successMsg.textContent = 'Ocurrió un error de conexión. Por favor, inténtalo más tarde.';
                console.error('Error de red al enviar el formulario:', error);
            }
        });
    }
});