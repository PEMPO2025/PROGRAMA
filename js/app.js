// CONFIGURACIÓN GOOGLE CALENDAR (Reemplaza con tus credenciales)
const CLIENT_ID = 'TU_CLIENT_ID_DE_GOOGLE';
const API_KEY = 'TU_API_KEY_DE_GOOGLE';
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let tokenClient;
let gapiInited = false;
let gisInited = false;

// BASE DE DATOS LOCAL
let db = JSON.parse(localStorage.getItem('cherchaDB')) || { 
    clientes: [], ventas: [], citas: [], gastos: [] 
};

function guardarDB() {
    localStorage.setItem('cherchaDB', JSON.stringify(db));
    actualizarInterfaz();
}

// NAVEGACIÓN
function mostrarSeccion(id, btn) {
    document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    document.getElementById(id).classList.add('activa');
    btn.classList.add('active');
}

// GOOGLE CALENDAR AUTH
function gapiLoaded() { gapi.load('client', async () => { await gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] }); gapiInited = true; }); }
function gisLoaded() { tokenClient = google.accounts.oauth2.initTokenClient({ client_id: CLIENT_ID, scope: SCOPES, callback: '' }); gisInited = true; }
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) throw (resp);
        document.getElementById('authorize_button').innerText = 'Conectado';
        document.getElementById('signout_button').style.display = 'block';
    };
    if (gapi.client.getToken() === null) tokenClient.requestAccessToken({prompt: 'consent'});
    else tokenClient.requestAccessToken({prompt: ''});
}

// AGREGAR CITA Y SINCRONIZAR
async function agregarCita() {
    const cId = document.getElementById('selectClienteCita').value;
    const fecha = document.getElementById('fechaCita').value;
    const hora = document.getElementById('horaCita').value;
    const cliente = db.clientes.find(c => c.id == cId);

    if(!cliente || !fecha) return alert("Faltan datos");

    const nuevaCita = { id: Date.now(), cliente: cliente.nombre, fecha, hora };
    db.citas.push(nuevaCita);

    // Intentar subir a Google Calendar si hay token
    if (gapi.client.getToken()) {
        const event = {
            'summary': `Sesión Fotos: ${cliente.nombre}`,
            'start': { 'dateTime': `${fecha}T${hora}:00`, 'timeZone': 'America/Santo_Domingo' },
            'end': { 'dateTime': `${fecha}T${parseInt(hora)+1}:00`, 'timeZone': 'America/Santo_Domingo' }
        };
        await gapi.client.calendar.events.insert({ 'calendarId': 'primary', 'resource': event });
        alert("Cita sincronizada con Google Calendar");
    }

    guardarDB();
}

// ACTUALIZAR INTERFAZ
function actualizarInterfaz() {
    // Renderizado de tablas y selects (Clientes, Citas, etc.)
    const listaC = document.getElementById('listaClientes');
    if(listaC) listaC.innerHTML = db.clientes.map(c => `<tr><td>${c.nombre}</td><td>${c.telf}</td><td><button onclick="eliminar('clientes', ${c.id})">🗑️</button></td></tr>`).join('');

    const selectC = document.getElementById('selectClienteCita');
    if(selectC) selectC.innerHTML = db.clientes.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');

    const listaCi = document.getElementById('listaCitas');
    if(listaCi) listaCi.innerHTML = db.citas.map(c => `<tr><td>${c.fecha}</td><td>${c.hora}</td><td>${c.cliente}</td><td>✅</td><td><button>🗑️</button></td></tr>`).join('');

    // Stats
    document.getElementById('stat-clientes').innerText = db.clientes.length;
    document.getElementById('stat-ingresos').innerText = "$" + db.ventas.reduce((acc, v) => acc + v.total, 0);
    document.getElementById('stat-gastos').innerText = "$" + db.gastos.reduce((acc, g) => acc + g.monto, 0);
}

// Funciones CRUD básicas
function agregarCliente() {
    const nombre = document.getElementById('nombreCliente').value;
    const telf = document.getElementById('telefonoCliente').value;
    if(nombre) { db.clientes.push({id: Date.now(), nombre, telf}); guardarDB(); }
}

actualizarInterfaz();