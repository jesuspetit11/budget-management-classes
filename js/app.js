//Variables y Selectores
const formulario = document.querySelector("#agregar-gasto"); //Agregamos el fomulario completo
const gastoListado = document.querySelector("#gastos ul");   //El ul vacío donde se irán agregando


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
        this.calcularRestante(); //Lo mandamos a llamar cada vez que agregamos un gasto
    }
    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto)=> total + gasto.cantidad, 0); //Define cuanto dinero hemos gastado
        this.restante = this.presupuesto - gastado; //Esto ya es parte del obj de presupuesto
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
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
    
    mostrarGastos(gastos){
        
        this.limpiarHTML(); //Elimina el HTML previo
        
        //Iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;
            
            //Crear un LI
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
            nuevoGasto.dataset.id = id;
            console.log(nuevoGasto);
            
            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">${cantidad}</span>`;
            
            //Botón para borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.innerHTML = "Borrar &times" //&times nos da una X perfecta
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
            
            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }
    
    //Limpiar HTML
    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    
    actualizarRestante(restante){
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector(".restante");
        if((presupuesto / 4 ) > restante){
            restanteDiv.classList.remove("alert-success", "alert-warning");
            restanteDiv.classList.add("alert-danger");
        } else if ((presupuesto / 2) > restante){
            restanteDiv.classList.remove("alert-success")
                restanteDiv.classList.add("alert-warning")
            
        } else {
            restanteDiv.classList.remove("alert-danger");
            restanteDiv.classList.add("alert-success");
        }

        //Si el total es 0 o menor
        if(restante <=0){
            ui.imprimirAlerta("El presupuesto se ha agotado", "error");
            formulario.querySelector('button[type="submit"]')= disabled = true;
        }
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

    //Imprimir los gastos
    const { gastos, restante } = presupuesto; //Destructuramos del obj instancia presupuesto para pasar solamente gastos
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    
    //Reinicia el formulario
    formulario.reset();
    
}

function eliminarGasto(id) {
    //Elimina del obj
    presupuesto.eliminarGasto(id);
    
    //Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}