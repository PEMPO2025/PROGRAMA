const nombreServicio=document.getElementById("nombreServicio");
const precioServicio=document.getElementById("precioServicio");
const listaServicios=document.getElementById("listaServicios");
const servicioVenta=document.getElementById("servicioVenta");
let servicios=JSON.parse(localStorage.getItem("servicios"))||[];
function agregarServicio(){if(nombreServicio.value.trim()===""||precioServicio.value==="") return alert("Complete todos los campos");servicios.push({nombre:nombreServicio.value,precio:Number(precioServicio.value)});localStorage.setItem("servicios",JSON.stringify(servicios));mostrarServicios();cargarServiciosVenta();nombreServicio.value="";precioServicio.value="";}
function mostrarServicios(){listaServicios.innerHTML="";servicios.forEach((s,i)=>{listaServicios.innerHTML+=`<tr><td>${s.nombre}</td><td>RD$ ${s.precio.toFixed(2)}</td><td><button onclick="eliminarServicio(${i})">X</button></td></tr>`;});}
function eliminarServicio(i){servicios.splice(i,1);localStorage.setItem("servicios",JSON.stringify(servicios));mostrarServicios();cargarServiciosVenta();}
function cargarServiciosVenta(){servicioVenta.innerHTML="";servicios.forEach(s=>{servicioVenta.innerHTML+=`<option>${s.nombre}</option>`;});}
mostrarServicios();cargarServiciosVenta();