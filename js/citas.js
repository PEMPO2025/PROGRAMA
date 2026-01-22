const fechaCita=document.getElementById("fechaCita");
const listaCitas=document.getElementById("listaCitas");
let citas=JSON.parse(localStorage.getItem("citas"))||[];
function agregarCita(){if(!clienteCita.value||!fechaCita.value) return alert("Complete todos los campos");citas.push({cliente:clienteCita.value,fecha:fechaCita.value});localStorage.setItem("citas",JSON.stringify(citas));mostrarCitas();clienteCita.value="";fechaCita.value="";}
function mostrarCitas(){listaCitas.innerHTML="";citas.forEach(c=>listaCitas.innerHTML+=`<li>${c.cliente} - ${c.fecha}</li>`);}
mostrarCitas();