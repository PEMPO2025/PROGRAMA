const abonoVenta=document.getElementById("abonoVenta");
const listaVentas=document.getElementById("listaVentas");
const listaDeudas=document.getElementById("listaDeudas");
const ventaFoto=document.getElementById("ventaFoto");
let ventas=JSON.parse(localStorage.getItem("ventas"))||[];
function registrarVenta(){if(!clienteVenta.value||!servicioVenta.value||abonoVenta.value==="") return alert("Complete todos los campos");let servicio=servicios.find(s=>s.nombre===servicioVenta.value);let total=servicio.precio;let abono=Number(abonoVenta.value);let balance=total-abono;let codigo="V-"+Date.now();ventas.push({codigo,cliente:clienteVenta.value,total,abono,balance,estadoFoto:"A retocar"});localStorage.setItem("ventas",JSON.stringify(ventas));mostrarVentas();cargarVentasFotos();mostrarDeudas();abonoVenta.value="";}
function mostrarVentas(){listaVentas.innerHTML="";ventas.forEach(v=>{listaVentas.innerHTML+=`<tr><td>${v.codigo}</td><td>${v.cliente}</td><td>RD$ ${v.total.toFixed(2)}</td><td>RD$ ${v.abono.toFixed(2)}</td><td>RD$ ${v.balance.toFixed(2)}</td></tr>`;});}
function cargarVentasFotos(){ventaFoto.innerHTML="";ventas.forEach(v=>ventaFoto.innerHTML+=`<option>${v.codigo}</option>`);}
function mostrarDeudas(){listaDeudas.innerHTML="";ventas.filter(v=>v.balance>0).forEach(v=>{listaDeudas.innerHTML+=`<li>${v.cliente} debe RD$ ${v.balance.toFixed(2)}</li>`;});}
mostrarVentas();cargarVentasFotos();mostrarDeudas();