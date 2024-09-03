let nombre,direccion
let comidas = ['Hamburgesa','Pizza','Empanadas','Papas Fritas']
let resp = true
let carrito = []
let clientes = []

let pedirDatos = () =>{

    nombre = prompt('Ingrese el nombre del cliente')
    direccion = prompt('Ingrese la dirección del cliente')

    if(nombre && direccion){
        return true
    }

    return false
}

let agregarItem = (item) =>{

    carrito.push(item)

    resp = confirm('Desea llevar algo mas?')

    return resp;
}

let mostrarPedido = () =>{

    const mensaje = `el pedido de ${nombre} sera entregado en la direccion ${direccion} \n
                     contiene: ${carrito}`
    alert(mensaje)

}

do{

    if(!pedirDatos()){
        alert('Datos ingresados erroneamente, intente denuevo')
        continue
    }

    do{
        let item = prompt(`Que desea llevar? \n
                            1.${comidas[0]} \n
                            2.${comidas[1]} \n
                            3.${comidas[2]} \n
                            4.${comidas[3]}`)

        if(item !== parseInt(item) || item < 0 || item > 4){
            alert('Datos mal cargados')
            continue
        }

        resp = agregarItem(comidas[item - 1])
        

    }while(resp)


    mostrarPedido()
    let cliente = {
        nombre: nombre,
        direccion: direccion,
        pedido: carrito
    }

    clientes.push(cliente)
    carrito = []
    resp = confirm('Desea agregar otro pedido?')

}while(resp)

console.table(clientes)