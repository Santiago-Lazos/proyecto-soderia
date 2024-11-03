const formularioPedido = document.getElementById('orderForm');
const listaPedido = document.getElementById('orderList');
const botonFormulario = document.getElementById('botonFormulario');
const selectCliente = document.getElementById('client');
const selectProducto = document.getElementById('product');
const formularioProducto = document.getElementById('productForm');
const listaProducto = document.getElementById('productList');

const pedidoEnEdicion = null;

document.addEventListener('DOMContentLoaded', async () => {
    await cargarClientes();
    await cargarProductos();
    await cargarPedido();
});

const cargarPedido = async () => {
    try {
        const res = await fetch('http://localhost:4000/pedidos');
        
        if (!res.ok) {
            throw new Error('Error al obtener los pedidos');
        }

        const listaPedidos = await res.json();
        console.log('Pedidos recibidos:', listaPedidos); 

        const pedidosArray = Array.isArray(listaPedidos) ? listaPedidos : [listaPedidos];
        listaPedido.innerHTML = '';

        // Mostrar cada pedido en la lista
        pedidosArray.forEach(pedido => {
            mostrarRegistro(pedido); 
        });
    } catch (error) {
        console.error('Error al cargar los pedidos:', error.message);
    }
};

const cargarClientes = async () => {
    try {
        const res = await fetch('http://localhost:4000/clientes');
        if (!res.ok) {
            throw new Error('Error al obtener los clientes');
        }

        const listaClientes = await res.json();
        console.log('Clientes recibidos:', listaClientes); 

        const clientesArray = Array.isArray(listaClientes) ? listaClientes : [listaClientes];

        // Mostrar cada cliente en el select
        clientesArray.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.idCliente; 
            option.textContent = cliente.nombre; 
            selectCliente.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los clientes:', error.message);
    }
};

const cargarProductos = async () => {
    try {
        const res = await fetch('http://localhost:4000/productos');
        if (!res.ok) {
            throw new Error('Error al obtener los productos');
        }

        const listaProductos = await res.json();
        console.log('Productos recibidos:', listaProductos); 

        const productosArray = Array.isArray(listaProductos) ? listaProductos : [listaProductos];

        productosArray.forEach(producto => {
            console.log(producto); 
            const option = document.createElement('option');
            option.value = producto.idProducto; 
            option.textContent = producto.nombreProducto; 
            selectProducto.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error.message);
    }
};

formularioPedido.addEventListener('submit', async (event) => {
    event.preventDefault();

    const pedido = {
        cliente: document.getElementById('client').value,
        producto: document.getElementById('product').value,
        cantidad: document.getElementById('amount').value,
        fechaEntrega: document.getElementById('deliveryDate').value,
        metodoPago: document.getElementById('paymentMethod').value,
        estadoPedido: document.getElementById('orderStatus').value,
    };

    if (!pedido.cliente || !pedido.producto || !pedido.cantidad || !pedido.fechaEntrega || !pedido.metodoPago || !pedido.estadoPedido) {
        console.error('Por favor completa todos los campos.');
        return;
    }

    try {
        if (pedidoEnEdicion) {
            await actualizarRegistro(pedido, pedidoEnEdicion);
            pedidoEnEdicion = null;
        } else {
            const idPedido = await registrarPedido(pedido);
            await mostrarRegistro(pedido, idPedido);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }

    formularioPedido.reset();
    botonFormulario.textContent = 'Añadir Pedido'; 
});

const registrarPedido = async (pedido) => {
    const res = await fetch('http://localhost:4000/pedidos/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al registrar el pedido');
    }

    console.log('Pedido registrado exitosamente');

    const data = await res.json();
    return data.idPedido;  
};

const mostrarRegistro = async(pedido, idPedido) => {

    const fila = document.createElement('tr');
    fila.setAttribute('data-id', idPedido);  
    fila.innerHTML = `
        <td>${pedido.cliente}</td>
        <td>${pedido.producto}</td>
        <td>${pedido.cantidad}</td>
        <td>${pedido.fechaEntrega}</td>
        <td>${pedido.metodoPago}</td>
        <td>${pedido.estadoPedido}</td>
        <td>
            <button class="boton-editar" onclick="editarPedido(${idPedido})">Editar</button>
            <button class="boton-eliminar" onclick="eliminarPedido(${idPedido})">Eliminar</button>
        </td>
    `;

    listaPedido.appendChild(fila);
};


const eliminarPedido = async (idPedido) => {
    try {
        const res = await fetch('http://localhost:4000/pedidos/eliminar/' + idPedido, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error('Error al eliminar pedido:', errorData);
            throw new Error('Error al eliminar el pedido');
        }

        console.log('Pedido eliminado exitosamente');


        eliminarFilaPedido(idPedido);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const eliminarFilaPedido = (idPedido) => {
    const fila = document.querySelector(`tr[data-id='${idPedido}']`);
    if (fila) {
        fila.remove();
        console.log(`Fila del pedido con ID ${idPedido} eliminada del frontend.`);
    }
};

const actualizarRegistro = async (pedido, idPedido) => {
    const res = await fetch('http://localhost:4000/pedidos/editar/' + idPedido, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido), 
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error('Error al actualizar pedido:', errorData);
        throw new Error('Error al actualizar el pedido');
    }

    console.log('Pedido actualizado exitosamente');
    actualizarFilaPedido(pedido, idPedido);
};

const actualizarFilaPedido = (pedido, idPedido) => {
    const fila = document.querySelector(`tr[data-id='${idPedido}']`);
    fila.innerHTML = `
        <td>${pedido.cliente}</td>
        <td>${pedido.producto}</td>
        <td>${pedido.cantidad}</td>
        <td>${pedido.fechaEntrega}</td>
        <td>${pedido.metodoPago}</td>
        <td>${pedido.estadoPedido}</td>
        <td>
            <button class="boton-editar" onclick="editarPedido(${idPedido})">Editar</button>
            <button class="boton-eliminar" onclick="eliminarPedido(${idPedido})">Eliminar</button>
        </td>
    `;
};

const editarPedido = (idPedido) => {
    const fila = document.querySelector(`tr[data-id='${idPedido}']`);
    const [cliente, producto, cantidad, fechaEntrega, metodoPago, estadoPedido] = Array.from(fila.children).map((td) => td.textContent);

    document.getElementById('client').value = cliente;
    document.getElementById('product').value = producto;
    document.getElementById('amount').value = cantidad;
    document.getElementById('deliveryDate').value = fechaEntrega;
    document.getElementById('paymentMethod').value = metodoPago;
    document.getElementById('orderStatus').value = estadoPedido;

    pedidoEnEdicion = idPedido; 
    botonFormulario.textContent = 'Guardar Cambios'; 
};