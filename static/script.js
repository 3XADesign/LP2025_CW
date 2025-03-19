// Variables para la paginación
let currentPage = 1;
const recordsPerPage = 5;
let allRecords = [];

// Función para agregar el historial de encriptaciones
function addToHistory(originalText, encryptedText, salt) {
    const now = new Date();
    const dateString = now.toLocaleString(); // Formato: DD/MM/YYYY, HH:MM:SS

    // Crear una nueva fila para la tabla
    const historyRow = `
        <tr>
            <td title="${originalText}">${originalText}</td>
            <td title="${encryptedText}">${encryptedText}</td>
            <td title="${salt}">${salt}</td>
            <td>${dateString}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary" onclick="copyToClipboard('${encryptedText}')">
                    <i class="fas fa-copy"></i> Copiar Encriptado
                </button>
                <br> <!-- Salto de línea para separar los botones -->
                <button class="btn btn-sm btn-outline-secondary mt-2" onclick="copyToClipboard('${salt}')">
                    <i class="fas fa-copy"></i> Copiar Salt
                </button>
            </td>
        </tr>
    `;

    // Agregar el registro al historial
    allRecords.unshift(historyRow); // Insertar al principio
    renderTable();
}

// Función para renderizar la tabla con paginación
function renderTable() {
    const historyTable = document.getElementById('encryptionHistory');
    const pagination = document.getElementById('pagination');

    // Calcular el índice inicial y final para la página actual
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const recordsToShow = allRecords.slice(startIndex, endIndex);

    // Limpiar la tabla y agregar los registros de la página actual
    historyTable.innerHTML = recordsToShow.join('');

    // Limpiar la paginación y agregar los botones
    pagination.innerHTML = '';
    const totalPages = Math.ceil(allRecords.length / recordsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
        pagination.insertAdjacentHTML('beforeend', pageButton);
    }
}

// Función para cambiar de página
function changePage(page) {
    currentPage = page;
    renderTable();
}

// Función para copiar texto al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Texto copiado al portapapeles: ' + text);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

// Función para encriptar
async function encryptText() {
    const password = document.getElementById('password').value;
    const text = document.getElementById('text').value;

    if (!password || !text) {
        alert("Por favor, ingrese la contraseña y el texto.");
        return;
    }

    const response = await fetch('/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, text })
    });

    const data = await response.json();
    if (data.encrypted_text) {
        document.getElementById('encryptedText').value = data.encrypted_text;
        document.getElementById('salt').value = data.salt; // Guardar el salt en la sección izquierda
        document.getElementById('decryptSalt').value = data.salt; // Copiar el salt a la sección derecha

        // Llamar a la función para agregar al historial
        addToHistory(text, data.encrypted_text, data.salt);
    } else {
        alert("Error al encriptar.");
    }
}

// Función para desencriptar
async function decryptText() {
    const password = document.getElementById('decryptPassword').value;
    const encryptedText = document.getElementById('encryptedTextToDecrypt').value;
    const salt = document.getElementById('decryptSalt').value;

    if (!password || !encryptedText || !salt) {
        alert("Por favor, ingrese la contraseña, el texto encriptado y el salt.");
        return;
    }

    const response = await fetch('/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, encrypted_text: encryptedText, salt })
    });

    const data = await response.json();
    if (data.decrypted_text) {
        document.getElementById('decryptedText').value = data.decrypted_text;
    } else {
        alert("Error al desencriptar. ¿Clave incorrecta?");
    }
}

// Función para evaluar la fortaleza de la contraseña
function evaluatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;

    return strength;
}

// Función para actualizar la barra de seguridad de la contraseña
function updatePasswordStrength(password, strengthIndicator, strengthText) {
    const strength = evaluatePasswordStrength(password);
    const strengthLabels = ["Muy débil", "Débil", "Moderada", "Fuerte", "Muy fuerte"];
    const strengthColors = ["#dc3545", "#ffc107", "#ffc107", "#28a745", "#28a745"];

    strengthIndicator.style.width = `${(strength / 5) * 100}%`;
    strengthIndicator.style.backgroundColor = strengthColors[strength];
    strengthText.textContent = strengthLabels[strength];
    strengthText.style.color = strengthColors[strength];
}

// Event listeners para actualizar la fortaleza de la contraseña
document.getElementById('password').addEventListener('input', function() {
    const password = this.value;
    const strengthIndicator = document.getElementById('passwordStrengthIndicator');
    const strengthText = document.getElementById('passwordStrengthText');
    updatePasswordStrength(password, strengthIndicator, strengthText);
});

document.getElementById('decryptPassword').addEventListener('input', function() {
    const password = this.value;
    const strengthIndicator = document.getElementById('decryptPasswordStrengthIndicator');
    const strengthText = document.getElementById('decryptPasswordStrengthText');
    updatePasswordStrength(password, strengthIndicator, strengthText);
});

// Event listeners para actualizar los contadores de caracteres
document.getElementById('password').addEventListener('input', function() {
    const counter = document.getElementById('passwordCounter');
    counter.textContent = `${this.value.length}/20`;
});

document.getElementById('text').addEventListener('input', function() {
    const counter = document.getElementById('textCounter');
    counter.textContent = `${this.value.length}/500`;
});

document.getElementById('decryptPassword').addEventListener('input', function() {
    const counter = document.getElementById('decryptPasswordCounter');
    counter.textContent = `${this.value.length}/20`;
});

// Función para mostrar/ocultar la contraseña
function togglePasswordVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        button.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Event listeners para los botones de mostrar/ocultar contraseña
document.getElementById('togglePassword').addEventListener('click', function() {
    togglePasswordVisibility('password', 'togglePassword');
});

document.getElementById('toggleDecryptPassword').addEventListener('click', function() {
    togglePasswordVisibility('decryptPassword', 'toggleDecryptPassword');
});

// Función para mostrar/ocultar el Salt
function toggleSaltVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    if (input.style.display === 'none') {
        input.style.display = 'block';
        button.textContent = 'Ocultar Salt';
    } else {
        input.style.display = 'none';
        button.textContent = 'Mostrar Salt';
    }
}

// Event listeners para los botones de mostrar/ocultar Salt
document.getElementById('toggleSalt').addEventListener('click', function() {
    toggleSaltVisibility('salt', 'toggleSalt');
});

document.getElementById('toggleDecryptSalt').addEventListener('click', function() {
    toggleSaltVisibility('decryptSalt', 'toggleDecryptSalt');
});