from flask import Flask, render_template, request, jsonify
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
import base64
import os

app = Flask(__name__)

# Función para derivar una clave a partir de una contraseña
def derive_key(password, salt):
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return key

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/encrypt', methods=['POST'])
def encrypt():
    data = request.json
    password = data.get('password')
    text = data.get('text')

    if not password or not text:
        return jsonify({'error': 'Faltan datos'}), 400

    # Generar un salt aleatorio
    salt = os.urandom(16)
    # Derivar la clave usando la contraseña y el salt
    key = derive_key(password, salt)
    cipher_suite = Fernet(key)

    # Encriptar el texto
    encrypted_text = cipher_suite.encrypt(text.encode()).decode()
    # Devolver el texto encriptado y el salt (necesario para desencriptar)
    return jsonify({
        'encrypted_text': encrypted_text,
        'salt': base64.urlsafe_b64encode(salt).decode()  # Convertir el salt a string
    })

@app.route('/decrypt', methods=['POST'])
def decrypt():
    data = request.json
    password = data.get('password')
    encrypted_text = data.get('encrypted_text')
    salt = data.get('salt')

    if not password or not encrypted_text or not salt:
        return jsonify({'error': 'Faltan datos'}), 400

    try:
        # Convertir el salt de vuelta a bytes
        salt = base64.urlsafe_b64decode(salt.encode())
        # Derivar la clave usando la contraseña y el salt
        key = derive_key(password, salt)
        cipher_suite = Fernet(key)

        # Desencriptar el texto
        decrypted_text = cipher_suite.decrypt(encrypted_text.encode()).decode()
        return jsonify({'decrypted_text': decrypted_text})
    except Exception as e:
        print(f"Error durante la desencriptación: {e}")
        return jsonify({'error': 'Clave incorrecta o texto inválido'}), 400

if __name__ == '__main__':
    app.run(debug=True)