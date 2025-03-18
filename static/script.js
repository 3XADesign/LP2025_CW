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
                <button class="btn btn-sm btn-outline-secondary" onclick="copyToClipboard('${salt}')">
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