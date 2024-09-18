let pedidos = JSON.parse(localStorage.getItem('pedidos'))
if(!pedidos){
    pedidos = []
}

let contenedorPedidos = document.querySelector('#pedidos')
let pedirBtn = document.querySelector('#pedirBtn')

class Pedido{
    constructor(pedido){
        this.nombre = pedido.nombre,
        this.direccion = pedido.direccion,
        this.telefono = pedido.telefono,
        this.pedido = pedido.pedido,
        this.id = pedidos.length ?? this.id++
    }
}


let agregarItems = () => {

    contenedorPedidos.innerHTML = ''

    pedidos.forEach(pedido => {
        let nuevoItem = document.createElement('div')
        nuevoItem.className = "card m-3"
    
        nuevoItem.innerHTML = 
        `<div class='card-header'>
            <p>${pedido.nombre}</p>
        </div>
    
        <div class='card-body'>
            <p>Telefono: ${pedido.telefono}   Direccion: ${pedido.direccion}</p>
            <ul id='items-${pedido.id}'>
                
            </ul>
        </div>`
        contenedorPedidos.appendChild(nuevoItem)
    
        console.log(pedido.id)
    
        let itemsContainer = document.querySelector(`#items-${pedido.id}`)
        pedido.pedido.forEach(item =>{
            let aux = document.createElement('li')
            aux.innerText = item.producto + ' ' + item.cantidad
            itemsContainer.appendChild(aux)
        })
    });
    
}

pedirBtn.addEventListener('click',()=>{
    let datos = document.querySelectorAll('input')
    
    console.log(datos)

    let aux = {
        //nombre
        nombre: datos[0].value,
        //direccion
        direccion: datos[1].value,
        //telefono
        telefono: datos[2].value,
        pedido: [{
            //pizza
            producto: datos[3].id,
            cantidad: datos[3].value
        },
        {
            //hamburguesa
            producto: datos[4].id,
            cantidad: datos[4].value  
        }]
    }
    
    let nuevoPedido = new Pedido(aux)
    pedidos.push(nuevoPedido)
    localStorage.setItem('pedidos',JSON.stringify(pedidos))

    agregarItems()
    }

)



agregarItems()
