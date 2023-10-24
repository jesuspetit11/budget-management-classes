//Variables y Selectores
const formulario = document.querySelector("#agregar-gasto"); //Agregamos el fomulario completo
const gastoListado = document.querySelector("#gastos ul")   //El ul vacío donde se irán agregando


//Eventos
eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto); //Un addEventListener a la función 
}

//Classes

//Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");
    console.log(Number(presupuestoUsuario));

    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){ //Validamos la constante
        //La función isNaN nos dice que si pone alguna letra retorna false
        console.log(isNaN(presupuestoUsuario));
        window.location.reload();
    }
}