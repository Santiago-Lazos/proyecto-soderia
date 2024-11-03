const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const database = require('./database.js'); 

const app = express();
app.set('port', 4000);

app.listen(app.get('port'), () => {
    console.log('Escuchando comunicaciones en el puerto ' + app.get('port'));
});

app.use(cors({
    origin: ['http://127.0.0.1:5501', 'http://127.0.0.1:5500']
}));

app.use(morgan('dev'));
app.use(express.json()); 

app.get('/clientes', async (req, res) => {
    try {
        const connection = await database.getConnection(); 
        const clientes = await connection.query('SELECT * FROM cliente'); 
        res.json(clientes); 
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
});

app.post('/clientes/agregar', async (req, res) => {
    let connection;
    try {
        const { nombre, correo, direccion, telefono, id_barrio } = req.body;

        connection = await database.getConnection();
        const query = 'INSERT INTO cliente (nombre, correo, direccion, telefono, id_barrio) VALUES (?, ?, ?, ?, ?)';

        const result = await connection.query(query, [nombre, correo, direccion, telefono, id_barrio]);

        res.status(201).json({ 
            message: 'Cliente agregado exitosamente', 
            idCliente: result.insertId 
        });
    } catch (error) {
        console.error('Error al agregar cliente:', error);
        res.status(500).json({ message: 'Error al agregar cliente', error: error.message });
    }
});

app.put('/clientes/editar/:id', async (req, res) => {
    let connection;
    try { 
        const { id } = req.params; 
        const { nombre, correo, direccion, telefono, id_barrio } = req.body; 

        connection = await database.getConnection();
        const query = `
            UPDATE cliente 
            SET nombre = ?, correo = ?, direccion = ?, telefono = ?, id_barrio = ?
            WHERE idCliente = ?;`;  

        const result = await connection.query(query, [nombre, correo, direccion, telefono, id_barrio, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json({ message: 'Cliente actualizado exitosamente', result });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: 'Error al actualizar cliente', error: error.message });
    } 
});

app.delete('/clientes/eliminar/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params; 

        connection = await database.getConnection();

        const query = 'DELETE FROM cliente WHERE idCliente = ?';
        const result = await connection.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ message: 'Error al eliminar cliente', error: error.message });
    }
});

app.get('/productos', async(req, res) => {       
    try {
        const connection = await database.getConnection(); 
        const productos = await connection.query('SELECT * FROM producto'); 
        res.json(productos); 
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
}); 

app.post('/productos/agregar', async (req, res) => {
    let connection;
    try {
        const { nombreProducto, precio, stock } = req.body; 

        connection = await database.getConnection();
        const query = 'INSERT INTO producto (nombreProducto, precio, stock) VALUES (?, ?, ?)';
        
        const result = await connection.query(query, [nombreProducto, precio, stock]); 

        res.status(201).json({ 
            message: 'Producto agregado exitosamente', 
            idProducto: result.insertId 
        });    
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ message: 'Error al agregar producto', error: error.message });
    }
});

app.put('/productos/editar/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params; 
        const { nombreProducto, precio, stock } = req.body; 

        connection = await database.getConnection();
        const query = `
            UPDATE producto 
            SET nombreProducto = ?, precio = ?, stock = ?
            WHERE idProducto = ?`;

        const result = await connection.query(query, [nombreProducto, precio, stock, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto actualizado exitosamente', result });
    } catch (error) {
        console.error('Error al actualizar Producto:', error);
        res.status(500).json({ message: 'Error al actualizar Producto', error: error.message });
    }
});

app.delete('/productos/eliminar/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params; 
        connection = await database.getConnection();

        const query = 'DELETE FROM producto WHERE idProducto = ?'; 
        const result = await connection.query(query, [id]); 

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
});

app.get('/pedidos', async (req, res) => {
    try {
        const connection = await database.getConnection(); 
        const pedidos = await connection.query('SELECT * FROM pedido'); 
        res.json(pedidos); 
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
});

app.post('/pedidos/agregar', async (req, res) => {
    let connection;
    try {
        const { idCliente, idProducto, cantidad, fechaEntrega, metodoPago, estadoPedido } = req.body;

        connection = await database.getConnection();
        const query = 'INSERT INTO pedido (idCliente, idProducto, cantidad, fechaEntrega, metodoPago, estadoPedido) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await connection.query(query, [idCliente, idProducto, cantidad, fechaEntrega, metodoPago, estadoPedido]);

        res.status(201).json({ 
            message: 'Pedido agregado exitosamente', 
            idPedido: result.insertId 
        });
    } catch (error) {
        console.error('Error al agregar pedido:', error);
        res.status(500).json({ message: 'Error al agregar pedido', error: error.message });
    }
});

app.put('/pedidos/editar/:id', async (req, res) => {
    let connection;
    try { 
        const { id } = req.params; 
        const { idCliente, idProducto, cantidad, fechaEntrega, metodoPago, estadoPedido } = req.body; 

        connection = await database.getConnection();
        const query = `
            UPDATE pedido
            SET idCliente = ?, idProducto = ?, cantidad  = ?, fechaEntrega = ?, metodoPago = ?, estadoPedido = ?
            WHERE idPedido = ?;`;  

        const result = await connection.query(query, [idCliente, idProducto, cantidad, fechaEntrega, metodoPago, estadoPedido, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(200).json({ message: 'Pedido actualizado exitosamente', result });
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        res.status(500).json({ message: 'Error al actualizar pedido', error: error.message });
    } 
});

app.delete('/pedidos/eliminar/:id', async (req, res) => {
    let connection;
    try {
        const { id } = req.params; 

        connection = await database.getConnection();

        const query = 'DELETE FROM pedido WHERE idPedido = ?';
        const result = await connection.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(200).json({ message: 'Pedido eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar pedido:', error);
        res.status(500).json({ message: 'Error al eliminar pedido', error: error.message });
    }
});
