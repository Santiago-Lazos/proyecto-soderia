const formularioCliente = document.getElementById('clientForm');
let clienteEnEdicion = null; 
const listaCliente = document.getElementById('clientList');
const botonFormulario = document.getElementById('botonFormulario'); 

document.addEventListener('DOMContentLoaded', async () => {
    await cargarClientes();
});

const cargarClientes = async () => {
    try {
        const res = await fetch('http://localhost:4000/clientes');
        if (!res.ok) {
            throw new Error('Error al obtener los clientes');
        }

        const listaClientes = await res.json();
        console.log('Clientes recibidos:', listaClientes); 

        const clientesArray = Array.isArray(listaClientes) ? listaClientes : [listaClientes];

        listaCliente.innerHTML = ''; 

        clientesArray.forEach(cliente => {
            mostrarRegistro(cliente, cliente.idCliente);
        });
    } catch (error) {
        console.error('Error al cargar los clientes:', error.message);
    }
};

formularioCliente.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cliente = {
        nombre: document.getElementById('name').value,
        correo: document.getElementById('email').value,
        telefono: document.getElementById('phone').value,
        direccion: document.getElementById('address').value,
        id_barrio: document.getElementById('barrio').value,
    };

    if (!cliente.nombre || !cliente.correo || !cliente.telefono || !cliente.direccion || !cliente.id_barrio) {
        console.error('Por favor completa todos los campos.');
        return;
    }

    try {
        if (clienteEnEdicion) {
            await actualizarRegistro(cliente, clienteEnEdicion);
            clienteEnEdicion = null;
        } else {
            const idCliente = await registrarCliente(cliente);
            mostrarRegistro(cliente, idCliente);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }

    formularioCliente.reset();
    botonFormulario.textContent = 'Añadir Cliente'; 
});


const registrarCliente = async (cliente) => {
    const res = await fetch('http://localhost:4000/clientes/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al registrar el cliente');
    }

    console.log('Cliente registrado exitosamente');

    const data = await res.json();
    return data.idCliente;  
};

const mostrarRegistro = (cliente, idCliente) => {

    const fila = document.createElement('tr');
    fila.setAttribute('data-id', idCliente);  
    fila.innerHTML = `
        <td>${cliente.nombre}</td>
        <td>${cliente.correo}</td>
        <td>${cliente.telefono}</td>
        <td>${cliente.direccion}</td>
        <td>${cliente.id_barrio}</td> 
        <td>
            <button class="boton-editar" onclick="editarCliente(${idCliente})">Editar</button>
            <button class="boton-eliminar" onclick="eliminarCliente(${idCliente})">Eliminar</button>
        </td>
    `;

    listaCliente.appendChild(fila);
};


const eliminarCliente = async (idCliente) => {
    try {
        const res = await fetch('http://localhost:4000/clientes/eliminar/' + idCliente, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error('Error al eliminar cliente:', errorData);
            throw new Error('Error al eliminar el cliente');
        }

        console.log('Cliente eliminado exitosamente');


        eliminarFilaCliente(idCliente);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const eliminarFilaCliente = (idCliente) => {
    const fila = document.querySelector(`tr[data-id='${idCliente}']`);
    if (fila) {
        fila.remove();
        console.log(`Fila del cliente con ID ${idCliente} eliminada del frontend.`);
    }
};

const actualizarRegistro = async (cliente, idCliente) => {
    const res = await fetch('http://localhost:4000/clientes/editar/' + idCliente, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente), 
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error('Error al actualizar cliente:', errorData);
        throw new Error('Error al actualizar el cliente');
    }

    console.log('Cliente actualizado exitosamente');
    actualizarFilaCliente(cliente, idCliente);
};

const actualizarFilaCliente = (cliente, idCliente) => {
    const fila = document.querySelector(`tr[data-id='${idCliente}']`);
    fila.innerHTML = `
        <td>${cliente.nombre}</td>
        <td>${cliente.correo}</td>
        <td>${cliente.telefono}</td>
        <td>${cliente.direccion}</td>
        <td>${cliente.id_barrio}</td>
        <td>
            <button class="boton-editar" onclick="editarCliente(${idCliente})">Editar</button>
            <button class="boton-eliminar" onclick="eliminarCliente(${idCliente})">Eliminar</button>
        </td>
    `;
};

const editarCliente = (idCliente) => {
    const fila = document.querySelector(`tr[data-id='${idCliente}']`);
    const [nombre, correo, telefono, direccion, id_barrio] = Array.from(fila.children).map((td) => td.textContent);

    document.getElementById('name').value = nombre;
    document.getElementById('email').value = correo;
    document.getElementById('phone').value = telefono;
    document.getElementById('address').value = direccion;
    document.getElementById('barrio').value = id_barrio;

    clienteEnEdicion = idCliente; 
    botonFormulario.textContent = 'Guardar Cambios'; 
};
