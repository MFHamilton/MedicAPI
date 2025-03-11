const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a SQL Server
const sql = require('mssql');
const dbConfig = {
    user: 'sqladmin',
    password: 'Admin123',
    server: '34.136.224.59',
    database: 'MEDICAMENTOS',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },

}

// Obtener listado de medicamentos (GET)
app.get('/api/Medicamentos', async(req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_obtener_listado_medicamentos');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Obtener listado de medicamentos con tipo, proveedor y nivel de riesgo tipificados (GET)
app.get('api/MedicamentosDetallados', async(req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_obtener_medicamentos_con_detalles');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });