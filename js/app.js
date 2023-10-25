//Variables y Selectores
const formulario = document.querySelector("#agregar-gasto"); //Agregamos el fomulario completo
const gastoListado = document.querySelector("#gastos ul")   //El ul vacío donde se irán agregando


//Eventos
eventListeners();
function eventListeners() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto); //Un addEventListener a la función 
    formulario.addEventListener("submit", agregarGasto);
}

//Classes
class Presupuesto {
    constructor(presupuesto){
        //La entrada de datos viene como String, así que hay que poner siempre Number()
        this.presupuesto = Number(presupuesto); //No se modifica 
        this.restante = Number(presupuesto); //Restante si se modifica
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        console.log(this.gastos);
    }
}

class UI {
    insertarPresupuesto( cantidad ){
        const {presupuesto, restante} = cantidad;
        //Agregar al html
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }
    imprimirAlerta(mensaje, tipo){
        //Crear el div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center","alert");
        if(tipo === "error"){
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;
        //Insertar en el HTML
        document.querySelector(".primario").insertBefore(divMensaje, formulario);

        //Quitar mensaje
        setTimeout(() => {
            divMensaje.remove()
        }, 2200);
    }
}

//Instanciar
const ui = new UI();
let presupuesto; //Lo declaramos pero instanciamos en la función preguntarPresupuesto()

//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");

    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){ //Validamos la constante del prompt
        //La función isNaN nos dice que si pone alguna letra retorna false
        // console.log(isNaN(presupuestoUsuario));
        window.location.reload();
    }

    //Presupuesto válido
    presupuesto = new Presupuesto(presupuestoUsuario); //Instancia de presupuesto
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto); //Presupuesto es un objeto

}

//Añade gastos

function agregarGasto(e) {
    e.preventDefault();
    //Leer los datos del formulario
    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);
    
    //Validar
    if(nombre === "" || cantidad === ""){
        ui.imprimirAlerta("Ambos campos son obligatorios", "error");

        return;
    } else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta("Cantidad no válida", "error");

        return; //Para que no se ejecuten las otras líneas de código
    }
    
    //Generar un obj con el gasto
    const gasto = {nombre, cantidad, id: Date.now()}; //Lo contrario a destructuring... unen Nombre y Cantidad a Gasto... es un object literal
    //Object Literal Enhancement
    
    presupuesto.nuevoGasto(gasto); //Añade un nuevo gasto al array de gasto en la class Presupuesto
    //Mensaje de exito
    ui.imprimirAlerta("Correcto, agregando gasto...", "exito");

    //Reinicia el formulario
    formulario.reset();
    
}