const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});
/*
Clase pedido mediante la cual se controla el ID y la información de cada producto
*/
class Pedido {
  //obtenemos el id del localStorage en el caso de que haya perdidos cargados de antes
  //caso contrario lo inicializamos en 0
  //de esta manera no tendremos errores al actualizar o cerrar la pagina
  static id = localStorage.getItem("pedidosId") ?? 0;

  constructor(pedido) {
    this.nombre = pedido.nombre,
      this.direccion = pedido.direccion,
      this.telefono = pedido.telefono,
      this.pedido = pedido.pedido,
      this.id = Pedido.id++;
    //cada vez que se crea un pedido automaticamente aumenta el id y se guarda en el localStorage
    localStorage.setItem("pedidosId", Pedido.id);
  }

  totalPedido() {
    //Metodo que retorna el total de todos los productos pedidos
    return this.pedido.reduce((total, actual) => {
      return total + (actual.cantidad * actual.precio)
    }, 0)
  }

}

let containerProductos = document.getElementById('productos')
let productos = []


fetch('./data.JSON')
 .then(response => {
  if(!response.ok){
    throw new Error('Error en la respuesta del servidor')
  }
  return response.json()
 })
 .then(data => {
   productos = data

   if (productos.length <= 1) {
     throw new Error('Hubo un problema al cargar los productos')
   }

   productos.forEach((producto) => {
    const nuevoProducto = document.createElement('div')
    nuevoProducto.className = 'mb-3 input-group w-auto'
    nuevoProducto.innerHTML = `
    <span class="col-4 input-group-text px-2 w-50">${producto.nombre}</span>
      
    <span class="input-group-btn">
      <button class="btn btn-default" id="menos-${producto.nombre}" type="button">
        -
      </button>
    </span>
    
    <input type="text" id="${producto.nombre.toLowerCase()}" class="form-control cantidad" />
      <span class="input-group-btn">
        <button class="btn btn-default" id="mas-${producto.nombre}" type="button">
        +
        </button>
      </span>
    `

    containerProductos.appendChild(nuevoProducto)

    const menosBtn = document.getElementById(`menos-${producto.nombre}`)
    const masBtn = document.getElementById(`mas-${producto.nombre}`)
    const cantidad = document.getElementById(`${producto.nombre.toLowerCase()}`)

    menosBtn.addEventListener('click', () => {
      if (!(cantidad.value <= 0)) {
        cantidad.value--
      }
    })
    masBtn.addEventListener('click', () => {
      cantidad.value++
    })
  })
}).catch(error => {
  Swal.fire({
    title: 'Ocurrio un error :(',
      text: error,
      icon: 'error',
      confirmButtonText: 'Ok'
  })
})




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
    pedido = new Pedido(pedido)
    //creamos el contenedor y le agregamos la clase y el id del pedido para
    //poder trabajarlos despues
    let nuevoItem = document.createElement("div");
    nuevoItem.className = "card m-3";
    nuevoItem.id = "pedido-" + pedido.id;


    //creamos el HTLM de nuestro pedido
    nuevoItem.innerHTML = `
    <div class='card-header'>
      <p class='card-title'>Cliente: ${pedido.nombre}</p>
    </div>
    
    <div class='card-body'>
      <p class='card-subtitle text-body-secondary'>Telefono: ${pedido.telefono}</p>
      <p class='card-subtitle text-body-secondary'>Direccion: ${pedido.direccion}</p>
      <p class='text-body-seconday'>Productos</p>
      <ul id='items-${pedido.id}'>
      </ul>
    </div>
    <div class='card-footer text-end d-flex-block'>
      <p>${pedido.totalPedido()} $</p>
      <button class='btn btn-success mb-lg-2 mb-xxl-0' id='rendir-btn-${pedido.id}'>Rendir pedido</button>
      <button class='btn btn-info'>Imprimir comanda</button>
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

        if (!(contenedorPedidos.hasChildNodes())) {
          contenedorPedidos.innerHTML = '<h4>No hay pedidos</h4>'
        }

      });

    //añadimos cada uno de los productos y la cantidad en la que se pidio
    let itemsContainer = document.querySelector(`#items-${pedido.id}`);
    pedido.pedido.forEach((item) => {

      let aux = document.createElement("li");
      aux.innerText = item.pizzaNombre + ": " + item.cantidad;
      aux.className = ''
      itemsContainer.appendChild(aux);

    });
  });

  if (pedidos.length <= 0) {
    contenedorPedidos.innerHTML = '<h4>No hay pedidos</h4>'
  }
};

//obtenemos los valores del formulario
pedirBtn.addEventListener("click", async () => {
  let nombre = document.getElementById("nombre").value;
  let direccion = document.getElementById("direccion").value;
  let telefono = document.getElementById("telefono").value;
  let pedido = []
  let errorCarga = false

  //verificamos si todos los campos estan llenos
  if (!nombre || !direccion || !telefono || isNaN(Number(telefono))) {
    Swal.fire({
      title: 'Error',
      text: 'Por favor, completa todos los campos correctamente',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
    return;
  }

  let cantidades = document.querySelectorAll('input.cantidad')

  for (const elemento of cantidades) {
    if (elemento.value == 0 || elemento.value == "") {
      continue
    }

    if (isNaN(Number(elemento.value))) {
      Swal.fire({
        title: 'Error',
        text: 'Ingrese una cantidad en numeros',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      errorCarga = true
      break
    }

    pedido.push({
      'pizzaNombre': elemento.id,
      'cantidad': elemento.value,
      'precio': productos.find((producto) => {
        return producto.nombre.toLocaleLowerCase() == elemento.id
      }).precio
    })
  }

  if (errorCarga) return

  if (pedido.length <= 0) {
    Swal.fire({
      title: 'Error',
      text: 'No pidio ningun producto',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
    return
  }

  let aux = {
    nombre,
    direccion,
    telefono,
    pedido
  };

  let resp = await Swal.fire({
    title: '¿Desea confirmar el pedido?',
    text: 'Se enviara a la direccion: ' + direccion,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  })

  if (!(resp.isConfirmed)) {
    Swal.fire({
      title: 'Se cancelo el pedido exitosamente',
      icon: 'info',
    })
    return
  }

  //añadimos el nuevo pedido al array y lo guardamos en el localStorage
  let nuevoPedido = new Pedido(aux);
  pedidos.push(nuevoPedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  //añadimos los items al HTML
  agregarItems();

  Toast.fire({
    icon: "success",
    title: "Pedido cargado exitosamente"
  });

});

//para cuando se entre a la pagina y ya tengamos pedidos de antes
//se muestren en el contenedor
agregarItems();