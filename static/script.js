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
