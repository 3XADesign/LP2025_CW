// Función para actualizar el contador de caracteres
function updateCounter(inputElement, counterElement, maxLength) {
    const currentLength = inputElement.value.length;
    counterElement.textContent = `${currentLength}/${maxLength}`;
}

// Contador para el campo de contraseña (encriptar)
document.getElementById('password').addEventListener('input', function () {
    updateCounter(this, document.getElementById('passwordCounter'), 20);
});

// Contador para el campo de texto a encriptar
document.getElementById('text').addEventListener('input', function () {
    updateCounter(this, document.getElementById('textCounter'), 500);
});

// Contador para el campo de contraseña (desencriptar)
document.getElementById('decryptPassword').addEventListener('input', function () {
    updateCounter(this, document.getElementById('decryptPasswordCounter'), 20);
});

// Función para mostrar/ocultar la contraseña en el campo de encriptación
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Función para mostrar/ocultar la contraseña en el campo de desencriptación
document.getElementById('toggleDecryptPassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('decryptPassword');
    const icon = this.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Función para mostrar/ocultar el salt en la sección izquierda
document.getElementById('toggleSalt').addEventListener('click', function () {
    const saltInput = document.getElementById('salt');
    if (saltInput.style.display === 'none') {
        saltInput.style.display = 'block';
        this.textContent = 'Ocultar Salt';
    } else {
        saltInput.style.display = 'none';
        this.textContent = 'Mostrar Salt';
    }
});

// Función para mostrar/ocultar el salt en la sección derecha
document.getElementById('toggleDecryptSalt').addEventListener('click', function () {
    const saltInput = document.getElementById('decryptSalt');
    if (saltInput.style.display === 'none') {
        saltInput.style.display = 'block';
        this.textContent = 'Ocultar Salt';
    } else {
        saltInput.style.display = 'none';
        this.textContent = 'Mostrar Salt';
    }
});

// Función para verificar la fortaleza de la contraseña
function checkPasswordStrength(password) {
    let score = 0;

    // Reglas para calcular la fortaleza
    if (password.length >= 8) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;

    // Determinar el color y el texto según el puntaje
    let color = '';
    let text = '';

    switch (score) {
        case 0:
        case 1:
            color = 'red';
            text = 'Muy poco segura';
            break;
        case 2:
            color = 'orange';
            text = 'Poco segura';
            break;
        case 3:
            color = 'purple';
            text = 'Moderada';
            break;
        case 4:
            color = 'lightgreen';
            text = 'Segura';
            break;
        case 5:
            color = 'green';
            text = 'Muy segura';
            break;
    }

    return { score, color, text };
}

// Actualizar la barra de seguridad para el campo de contraseña (encriptar)
document.getElementById('password').addEventListener('input', function () {
    const password = this.value;
    const strength = checkPasswordStrength(password);

    // Actualizar la barra de progreso y el texto
    const indicator = document.getElementById('passwordStrengthIndicator');
    const text = document.getElementById('passwordStrengthText');
    indicator.style.width = `${strength.score * 20}%`;
    indicator.style.backgroundColor = strength.color;
    text.textContent = strength.text;
    text.style.color = strength.color;
});

// Actualizar la barra de seguridad para el campo de contraseña (desencriptar)
document.getElementById('decryptPassword').addEventListener('input', function () {
    const password = this.value;
    const strength = checkPasswordStrength(password);

    // Actualizar la barra de progreso y el texto
    const indicator = document.getElementById('decryptPasswordStrengthIndicator');
    const text = document.getElementById('decryptPasswordStrengthText');
    indicator.style.width = `${strength.score * 20}%`;
    indicator.style.backgroundColor = strength.color;
    text.textContent = strength.text;
    text.style.color = strength.color;
});

// Función para encriptar
async function encryptText() {
    let password = document.getElementById("password").value;
    let text = document.getElementById("text").value;

    if (!password || !text) {
        alert("Por favor, ingrese la contraseña y el texto.");
        return;
    }

    let response = await fetch('/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, text })
    });

    let data = await response.json();
    if (data.encrypted_text) {
        document.getElementById("encryptedText").value = data.encrypted_text;
        document.getElementById("salt").value = data.salt;  // Guardar el salt en la sección izquierda
        document.getElementById("decryptSalt").value = data.salt;  // Copiar el salt a la sección derecha
    } else {
        alert("Error al encriptar.");
    }
}

// Función para desencriptar
async function decryptText() {
    let password = document.getElementById("decryptPassword").value;
    let encryptedText = document.getElementById("encryptedTextToDecrypt").value;
    let salt = document.getElementById("decryptSalt").value;

    if (!password || !encryptedText || !salt) {
        alert("Por favor, ingrese la contraseña, el texto encriptado y el salt.");
        return;
    }

    let response = await fetch('/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, encrypted_text: encryptedText, salt })
    });

    let data = await response.json();
    if (data.decrypted_text) {
        document.getElementById("decryptedText").value = data.decrypted_text;
    } else {
        alert("Error al desencriptar. ¿Clave incorrecta?");
    }
}
