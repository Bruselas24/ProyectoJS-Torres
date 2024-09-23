
/*
Clase pedido mediante la cual se controla el ID y la información de cada producto
*/
class Pedido {
  //obtenemos el id del localStorage en el caso de que haya perdidos cargados de antes
  //caso contrario lo inicializamos en 0
  //de esta manera no tendremos errores al actualizar o cerrar la pagina
  static id = localStorage.getItem("pedidosId") ?? 0;

  constructor(pedido) {
    (this.nombre = pedido.nombre),
      (this.direccion = pedido.direccion),
      (this.telefono = pedido.telefono),
      (this.pedido = pedido.pedido),
      (this.id = Pedido.id++);
      //cada vez que se crea un pedido automaticamente aumenta el id y se guarda en el localStorage
    localStorage.setItem("pedidosId", Pedido.id);
  }
}

//Recuperamos los pedidos ya cargados, caso contrario creamos un array vacio
let pedidos = JSON.parse(localStorage.getItem("pedidos")) ?? [];

//obtenemos el contenedor de los pedidos y el boton de pedir
let contenedorPedidos = document.querySelector("#pedidos");
let pedirBtn = document.querySelector("#pedirBtn");


//Funcion principal para agregar items al contenedor y almacenarlos en el localStorage
let agregarItems = () => {
    
  //cada vez que cargamos un nuevo pedido borramos todo el contenido interno
  //para que no se pise la información o se repitan pedidos/ids 
  contenedorPedidos.innerHTML = "";

  //mediante un forEach vamos armando el HTML de cada pedido
  pedidos.forEach((pedido) => {

    //console.log("cargando pedido ID", pedido.id);

    //creamos el contenedor y le agregamos la clase y el id del pedido para
    //poder trabajarlos despues
    let nuevoItem = document.createElement("div");
    nuevoItem.className = "card m-3";
    nuevoItem.id = "pedido-" + pedido.id;


    //creamos el HTLM de nuestro pedido
    nuevoItem.innerHTML = `<div class='card-header'>
            <p class='card-title'>Cliente: ${pedido.nombre}</p>
        </div>
    
        <div class='card-body'>

            <p class='card-subtitle text-body-secondary'>Telefono: ${pedido.telefono}</p>
            <p class='card-subtitle text-body-secondary'>Direccion: ${pedido.direccion}</p>
            <p class='text-body-seconday'>Productos</p>
            <ul id='items-${pedido.id}'>
            </ul>
        </div>
        <div class='card-footer text-end'>
            <button class='btn btn-success' id='rendir-btn-${pedido.id}'>Rendir pedido</button>
        </div>
        `;
    //añadimos nuestro item en el contenedor
    contenedorPedidos.appendChild(nuevoItem);

    //FUNCION: añadir el boton de rendir pedido referente a que el pedido ya fue entregado
    //y que cada uno de estos funcione individualmente para cada pedido
    document
      .getElementById(`rendir-btn-${pedido.id}`)
      .addEventListener("click", () => {
        contenedorPedidos.removeChild(
          document.getElementById(`pedido-${pedido.id}`)
        );

        //obtenemos el objeto y buscamos su indice en el array
        //luego lo eliminamos del array y almacenamos la información en el localStorage
        let pedidoRendir = pedidos.find((x) => x.id == pedido.id);
        let pos = pedidos.indexOf(pedidoRendir);
        pedidos.splice(pos, 1);

        localStorage.setItem("pedidos", JSON.stringify(pedidos));

        Swal.fire({
            title: `Pedido de ${pedido.nombre} rendido`,
            text: 'pedido rendido exitosamente',
            icon: 'success',
            confirmButtonText: 'Ok'
        })
      });

    //añadimos cada uno de los productos y la cantidad en la que se pidio
    //para la entrega final voy a tratar de que los productos a pedir
    //sean cargados desde un array para hacerlo mas escalable pero no
    //iba a llegar con el tiempo :(
    let itemsContainer = document.querySelector(`#items-${pedido.id}`);
    pedido.pedido.forEach((item) => {

      let aux = document.createElement("li");
      aux.innerText = item.producto + " " + item.cantidad;
      itemsContainer.appendChild(aux);

    });
  });
};

//obtenemos los valores del formulario
pedirBtn.addEventListener("click", () => {
  let aux = {
    nombre: document.getElementById("nombre").value,
    direccion: document.getElementById("direccion").value,
    telefono: document.getElementById("telefono").value,

    pedido: [
      {
        //pizza
        producto: "pizza",
        cantidad: document.getElementById("pizza").value,
      },
      {
        //hamburguesa
        producto: "hamburguesa",
        cantidad: document.getElementById("hamburguesa").value,
      },
    ],
  };

  //añadimos el nuevo pedido al array y lo guardamos en el localStorage
  let nuevoPedido = new Pedido(aux);
  pedidos.push(nuevoPedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  //añadimos los items al HTML
  agregarItems();

  //esto es para cuando se recargue la pagina no salte una alerta por cada
  //pedido ya cargado
  if(pedidos.length > 0){
    Swal.fire({
        title: 'Pedido cargado exitosamente',
        icon: 'success',
        confirmButtonText: 'Ok'
    })
  }

});

//para cuando se entre a la pagina y ya tengamos pedidos de antes
//se muestren en el contenedor
agregarItems();