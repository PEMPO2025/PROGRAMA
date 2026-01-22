// ==========================================
// 1. CONFIGURACIÓN DE SEGURIDAD
// ==========================================
// Asegúrate de que este ID NO tenga espacios antes ni después
const CLIENT_ID = '607731300939-nmjbu7q2n0k2i7k9sd93fp8nkibg6qcn.apps.googleusercontent.com'; 

// RECUERDA GENERAR LA API KEY EN LA CONSOLA (Empieza con AIza)
const API_KEY = 'TU_API_KEY_AQUÍ'; 

const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let tokenClient;
let gapiInited = false;
let gisInited = false;

// ==========================================
// 2. BASE DE DATOS Y ELEMENTOS
// ==========================================
// Usamos una base de datos unificada para evitar errores de sincronización
let db = JSON.parse(localStorage.getItem("cherchaDB")) || {
    clientes: [],
    ventas: [],
    gastos: [],
    citas: []
};

// Referencias a los campos de Clientes
const nombreCliente = document.getElementById("nombreCliente");
const telefonoCliente = document.getElementById("telefonoCliente");
const listaClientes = document.getElementById("listaClientes");

// ==========================================
// 3. INICIALIZACIÓN DE GOOGLE CALENDAR
// ==========================================
function gapiLoaded() {
    gapi.load('client', async () => {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
    });
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', 
    });
    gisInited = true;
}

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) throw (resp);
        document.getElementById('authorize_button').innerHTML = '<i class="fas fa-check"></i> Conectado ✅';
        document.getElementById('signout_button').style.display = 'block';
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

// ==========================================
// 4. LÓGICA DE CLIENTES
// ==========================================
function agregarCliente() {
    if (nombreCliente.value.trim() === "" || telefonoCliente.value.trim() === "") {
        return alert("Complete todos los campos del cliente");
    }
    
    db.clientes.push({
        id: Date.now(),
        nombre: nombreCliente.value,
        telefono: telefonoCliente.value
    });
    
    guardarYRefrescar();
    nombreCliente.value = "";
    telefonoCliente.value = "";
}

function eliminarCliente(id) {
    if(confirm("¿Seguro que quieres eliminar este cliente?")) {
        db.clientes = db.clientes.filter(c => c.id !== id);
        guardarYRefrescar();
    }
}

// ==========================================
// 5. LÓGICA DE CITAS Y GOOGLE CALENDAR
// ==========================================
async function agregarCita() {
    const clienteId = document.getElementById("selectClienteCita").value;
    const fecha = document.getElementById("fechaCita").value;
    const hora = document.getElementById("horaCita").value;

    const cliente = db.clientes.find(c => c.id == clienteId);

    if (!cliente || !fecha || !hora) {
        return alert("Selecciona cliente, fecha y hora");
    }

    const nuevaCita = { id: Date.now(), cliente: cliente.nombre, fecha, hora };
    db.citas.push(nuevaCita);

    // ENVIAR A GOOGLE CALENDAR
    if (gapi.client.getToken()) {
        const evento = {
            'summary': `📸 Sesión: ${cliente.nombre}`,
            'description': `Contacto: ${cliente.telefono}`,
            'start': { 'dateTime': `${fecha}T${hora}:00`, 'timeZone': 'America/Santo_Domingo' },
            'end': { 'dateTime': `${fecha}T${parseInt(hora.split(':')[0]) + 1}:00`, 'timeZone': 'America/Santo_Domingo' }
        };

        try {
            await gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': evento
            });
            alert("¡Agendado en el sistema y sincronizado con tu móvil! 📱");
        } catch (err) {
            console.error("Error sincronizando:", err);
            alert("Cita guardada localmente, pero hubo un error con Google.");
        }
    } else {
        alert("Cita guardada. (Conecta Google Calendar para sincronizar con tu móvil)");
    }

    guardarYRefrescar();
}

// ==========================================
// 6. FUNCIONES DE INTERFAZ
// ==========================================
function guardarYRefrescar() {
    localStorage.setItem("cherchaDB", JSON.stringify(db));
    actualizarVistas();
}

function actualizarVistas() {
    // Tabla Clientes
    if(listaClientes) {
        listaClientes.innerHTML = db.clientes.map(c => `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.telefono}</td>
                <td><button onclick="eliminarCliente(${c.id})" class="btn-danger">🗑️</button></td>
            </tr>`).join('');
    }

    // Actualizar Selects de Clientes para Ventas y Citas
    const selects = ["selectClienteVenta", "selectClienteCita"];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.innerHTML = '<option value="">Seleccionar Cliente</option>' + 
                db.clientes.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
        }
    });

    // Tabla de Citas
    const listaCitas = document.getElementById("listaCitas");
    if(listaCitas) {
        listaCitas.innerHTML = db.citas.map(c => `
            <tr>
                <td>${c.fecha}</td>
                <td>${c.hora}</td>
                <td>${c.cliente}</td>
                <td><button onclick="eliminarCita(${c.id})" class="btn-danger">🗑️</button></td>
            </tr>
        `).join('');
    }
}

// Navegación
function mostrarSeccion(id, btn) {
    document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    document.getElementById(id).classList.add('activa');
    btn.classList.add('active');
}

// Carga Inicial
actualizarVistas();

