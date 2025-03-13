Ir a la pagina de python.org e instalar python.

Vete a donde se te ha instalado el archivo que deveria tener esta ruta "C:\Users\TuUsuario\AppData\Local\Programs\Python\Python313" donde TuUsuario es el usuario que estes usando en tu equipo en ese momento y copiala, Si tienes una carpeta de Scrips tambien copia esa ruta, la necesitaras mas adelante.

Abre el menu de configuracion del equipo y busca en el buscador Configuración avanzada del sistema, una vez ahi dentro entra en la casilla llamada "Variables de entorno", y en la seccion variables de sistema busca la opcion path y editala.

Una vez ahi dentro dale a nuevo y pega las rutas de python antes copiadas, y luego aceptas todo para confirmar los cambios.

Una vez lo hagas comprueba en la terminal este comando "python --version" para verificar que la instalacion ha sido correcta.

Si te da problemas con Microsoft Store hay que quitar el alias, que eso se hace en configuracion "Aplicaciones" > "Configuración avanzada de aplicaciones" > "Alias de ejecución de aplicaciones", busca python.exe y python3.exe y desactívalos.

Si el problema persiste vaya al powershell del ordenador y ejecute con administrador, y pegue el siguiente comando con su nombre de usuario  "[System.Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Users\TU_USUARIO\AppData\Local\Programs\Python\Python313;C:\Users\TU_USUARIO\AppData\Local\Programs\Python\Python313\Scripts", [System.EnvironmentVariableTarget]::Machine)", ya puede cerrar el powersell y poner "python --version" para verificar en la terminal.


Ahora para crear el entorno virtual pondremos el siguiente comando "python -m venv venv", y despues vamos a instalar las dependencias con los siguentes comandos "pip install -r requirements.txt" "pip install cryptography" "pip install flask", Solo quedaria activarlo usando el comando "venv\Scripts\activate" Que puede ser que de error porque ya esta activado asique solo queda poner "python app.py" y disfrutar de la aplicacion.