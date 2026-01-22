const estadoFoto=document.getElementById("estadoFoto");
const listaFotos=document.getElementById("listaFotos");
function actualizarEstado(){let venta=ventas.find(v=>v.codigo===ventaFoto.value);if(!venta) return alert("Seleccione una venta válida");venta.estadoFoto=estadoFoto.value;localStorage.setItem("ventas",JSON.stringify(ventas));mostrarEstados();}
function mostrarEstados(){listaFotos.innerHTML="";ventas.forEach(v=>listaFotos.innerHTML+=`<li>${v.codigo} - ${v.cliente} → ${v.estadoFoto}</li>`);}
mostrarEstados();