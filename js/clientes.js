const nombreCliente=document.getElementById("nombreCliente");
const telefonoCliente=document.getElementById("telefonoCliente");
const listaClientes=document.getElementById("listaClientes");
const clienteVenta=document.getElementById("clienteVenta");
const clienteCita=document.getElementById("clienteCita");
const listaDeudas=document.getElementById("listaDeudas");
let clientes=JSON.parse(localStorage.getItem("clientes"))||[];
function agregarCliente(){if(nombreCliente.value.trim()===""||telefonoCliente.value.trim()==="") return alert("Complete todos los campos");clientes.push({nombre:nombreCliente.value,telefono:telefonoCliente.value});localStorage.setItem("clientes",JSON.stringify(clientes));mostrarClientes();cargarClientesVenta();cargarClientesCita();nombreCliente.value="";telefonoCliente.value="";}
function mostrarClientes(){listaClientes.innerHTML="";clientes.forEach((c,i)=>{listaClientes.innerHTML+=`<tr><td>${c.nombre}</td><td>${c.telefono}</td><td><button onclick="eliminarCliente(${i})">X</button></td></tr>`;});}
function eliminarCliente(i){clientes.splice(i,1);localStorage.setItem("clientes",JSON.stringify(clientes));mostrarClientes();cargarClientesVenta();cargarClientesCita();}
function cargarClientesVenta(){clienteVenta.innerHTML="";clientes.forEach(c=>{clienteVenta.innerHTML+=`<option>${c.nombre}</option>`;});}
function cargarClientesCita(){clienteCita.value="";}
mostrarClientes();cargarClientesVenta();cargarClientesCita();