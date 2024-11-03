const formularioProducto = document.getElementById('productForm');
const listaProducto = document.getElementById('productList');

let productoEnEdicion = null; 

document.addEventListener('DOMContentLoaded', async () => {
    await cargarProductos();
});

const cargarProductos = async () => {
    try {
        const res = await fetch('http://localhost:4000/productos');
        if (!res.ok) {
            throw new Error('Error al obtener los clientes');
        }

        const listaProductos = await res.json();
        console.log('Productos recibidos:', listaProductos); 

        const productosArray = Array.isArray(listaProductos) ? listaProductos : [listaProductos];

        listaProducto.innerHTML = ''; 

        productosArray.forEach(producto => {
            mostrarRegistro(producto, producto.idProducto);
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error.message);
    }
};

formularioProducto.addEventListener('submit', async (event) => {
    event.preventDefault();

    const producto = {
        nombreProducto: document.getElementById('productName').value,
        precio: document.getElementById('productPrice').value,
        stock: document.getElementById('productStock').value,
    };

    if (!producto.nombreProducto || !producto.precio || !producto.stock) {
        console.error('Por favor completa todos los campos.');
        return;
    }

    try {
        if (productoEnEdicion) {
            await actualizarRegistro(producto, productoEnEdicion);
            productoEnEdicion = null;
        } else {
            const idProducto = await registrarProducto(producto);
            mostrarRegistro(producto, idProducto);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }

    formularioProducto.reset();
    botonFormulario.textContent = 'Añadir Producto'; 
});

const registrarProducto = async (producto) => {
    const res = await fetch('http://localhost:4000/productos/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al registrar el producto');
    }

    console.log('Producto registrado exitosamente');

    const data = await res.json();
    return data.idProducto;  
};

const mostrarRegistro = (producto, idProducto) => {
    const fila = document.createElement('tr');
    fila.setAttribute('data-id', idProducto);  
    fila.innerHTML = `
        <td>${producto.nombreProducto}</td>
        <td>${producto.precio}</td>
        <td>${producto.stock}</td>
        <td>
            <button class="boton-editar" onclick="editarProducto(${idProducto})">Editar</button>
            <button class="boton-eliminar" onclick="eliminarProducto(${idProducto})">Eliminar</button>
        </td>
    `;

    listaProducto.appendChild(fila);
};

const eliminarProducto = async (idProducto) => {
    try {
        const res = await fetch('http://localhost:4000/productos/eliminar/' + idProducto, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error('Error al eliminar producto:', errorData);
            throw new Error('Error al eliminar el producto');
        }

        console.log('Producto eliminado exitosamente');


        eliminarFilaProducto(idProducto);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const eliminarFilaProducto = (idProducto) => {
    const fila = document.querySelector(`tr[data-id='${idProducto}']`);
    if (fila) {
        fila.remove();
        console.log(`Fila del producto con ID ${idProducto} eliminada del frontend.`);
    }
};

const actualizarRegistro = async (producto, idProducto) => {
    const res = await fetch('http://localhost:4000/productos/editar/' + idProducto, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto), 
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error('Error al actualizar producto:', errorData);
        throw new Error('Error al actualizar el producto');
    }

    console.log('Producto actualizado exitosamente');
    actualizarFilaProducto(producto, idProducto);
};

const actualizarFilaProducto = (producto, idProducto) => {
    const fila = document.querySelector(`tr[data-id='${idProducto}']`);
    fila.innerHTML = `
        <td>${producto.nombreProducto}</td>
        <td>${producto.precio}</td>
        <td>${producto.stock}</td>
        <td>
            <button class="boton-editar" onclick="editarProducto(${idProducto})">Editar</button>
            <button class="boton-eliminar" onclick="eliminarProducto(${idProducto})">Eliminar</button>
        </td>
    `;
};

const botonFormulario = document.getElementById('botonFormulario'); 

const editarProducto = (idProducto) => {
    const fila = document.querySelector(`tr[data-id='${idProducto}']`);
    const [nombreProducto, precio, stock] = Array.from(fila.children).map((td) => td.textContent);

    document.getElementById('productName').value = nombreProducto;
    document.getElementById('productPrice').value = precio;
    document.getElementById('productStock').value = stock;

    productoEnEdicion = idProducto; 
    botonFormulario.textContent = 'Guardar Cambios'; 
};
