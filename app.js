const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'actividadxd'
});

con.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

    // Agregar usuario
    app.post('/agregarUsuario', (req, res) => {
        const nombre = req.body.nombre;
        const id = req.body.id;

        if (!nombre || !id) {
            return res.status(400).send("Faltan datos para agregar el usuario.");
        }

        con.query('INSERT INTO musuario (id_usuario, nombre) VALUES (?, ?)', [id, nombre], (err, respuesta) => {
            if (err) {
                console.log("Error al insertar usuario:", err);
                return res.status(500).send("Error al agregar usuario.");
            }

            return res.send(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>Usuario Agregado</title>
                    <link rel="stylesheet" href="/estilo.css">
                    <style>
                        .card {
                            background-color: #1e1e1e;
                            padding: 40px;
                            border-radius: 16px;
                            box-shadow: 0 0 20px rgba(0, 188, 212, 0.4);
                            width: 400px;
                            margin: 100px auto;
                            text-align: center;
                            color: #f1f1f1;
                            animation: fadeIn 0.6s ease-in-out;
                        }
                        .card h1 { color: #00bcd4; margin-bottom: 20px; font-size: 28px; }
                        .card p { font-size: 18px; margin-bottom: 30px; }
                        .card a {
                            background-color: #00bcd4;
                            color: #fff;
                            padding: 10px 20px;
                            border-radius: 6px;
                            text-decoration: none;
                            font-weight: bold;
                            transition: background-color 0.3s ease;
                        }
                        .card a:hover { background-color: #26c6da; }
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>✅ Usuario Agregado</h1>
                        <p><strong>Nombre:</strong> ${nombre}</p>
                        <a href="/">⬅ Volver al inicio</a>
                    </div>
                </body>
                </html>
            `);
        });
    });

    // Obtener usuarios
    app.get('/obtenerUsuario', (req, res) => {
        con.query('SELECT * FROM musuario', (err, resultado) => {
            if (err) return res.status(500).send('Error al obtener usuarios.');

            let userHTML = '';
            let i = 0;
            resultado.forEach(user => {
                i++;
                userHTML += `<tr><td>${i}</td><td>${user.nombre}</td></tr>`;
            });

            res.send(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>Lista de Usuarios</title>
                    <link rel="stylesheet" href="/estilo.css">
                    <style>
                        table {
                            width: 50%;
                            border-collapse: collapse;
                            margin: 20px auto;
                            background-color: #1e1e1e;
                            color: #fff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 0 10px rgba(0,0,0,0.5);
                        }
                        th, td {
                            padding: 12px;
                            text-align: left;
                            border-bottom: 1px solid #333;
                        }
                        th {
                            background-color: #00bcd4;
                        }
                        tr:hover {
                            background-color: #2c2c2c;
                        }
                    </style>
                </head>
                <body>
                    <h1 style="text-align:center">Usuarios Registrados</h1>
                    <table>
                        <tr><th>ID</th><th>Nombre</th></tr>
                        ${userHTML}
                    </table>
                    <div style="text-align:center">
                        <a href="/">Volver al inicio</a>
                    </div>
                </body>
                </html>
            `);
        });
    });

    // Borrar usuario
    app.post('/borrarUsuario', (req, res) => {
        const id = req.body.id;

        con.query('DELETE FROM musuario WHERE id_usuario = ?', [id], (err, resultado) => {
            if (err) {
                console.error('Error al borrar el usuario:', err);
                return res.status(500).send("Error al borrar el usuario");
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).send("Usuario no encontrado");
            }

            return res.send(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>Usuario Eliminado</title>
                    <link rel="stylesheet" href="/estilo.css">
                </head>
                <body>
                    <div class="card">
                        <h1>Usuario eliminado correctamente</h1>
                        <p>El usuario con ID ${id} fue borrado de la base de datos.</p>
                        <a href="/">Volver al inicio</a>
                    </div>
                </body>
                </html>
            `);
        });
    });

    // Modificar usuario
    app.post('/modificarusuario', (req, res) => {
        const id = req.body.id2;
        const nuevoNombre = req.body.nombre2;

        con.query('UPDATE musuario SET nombre = ? WHERE id_usuario = ?', [nuevoNombre, id], (err, resultado) => {
            if (err) {
                console.error('Error al modificar: ', err);
                return res.status(500).send("Error al modificar el usuario");
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).send("Usuario no encontrado");
            }

            return res.send(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>Usuario Modificado</title>
                    <link rel="stylesheet" href="/estilo.css">
                </head>
                <body>
                    <div class="card">
                        <h1>Usuario modificado correctamente</h1>
                        <p>El usuario con ID ${id} fue actualizado a: ${nuevoNombre}</p>
                        <a href="/">Volver al inicio</a>
                    </div>
                </body>
                </html>
            `);
        });
    });

app.listen(10000, () => {
    console.log("Servidor escuchando en el puerto 10000");
});
