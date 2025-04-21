//Second Branch

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());



// Configuración de la conexión a SQL Server
const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
  },
};
console.log('DB server:', dbConfig.server);

//Obtener ensayos clnicos (GET)
app.get('/api/EnsayoClinico', async (req, res) => {
    try {
      
      const {
        id_ensayo = null,
        id_med = null,
        med_nombre = null,
        ens_fase = null,
        ens_poblacion_objetivo = null,
        ens_eficacia_observada = null,
        ens_estado = null
      } = req.query;
  
      
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('id_ensayo',              sql.NVarChar(50),  id_ensayo)
        .input('id_med',                 sql.NVarChar(50),  id_med)
        .input('med_nombre',             sql.NVarChar(100), med_nombre)
        .input('ens_fase',               sql.NVarChar(50),  ens_fase)
        .input('ens_poblacion_objetivo', sql.NVarChar(100), ens_poblacion_objetivo)
        .input('ens_eficacia_observada', sql.NVarChar(5),   ens_eficacia_observada)
        .input('ens_estado',             sql.NVarChar(5),   ens_estado)
        .execute('sp_GetEnsClc');
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al ejecutar sp_GetEnsClc:', err);
      res.status(500).send(err.message);
    }
  });


// Obtener entidad reguladora (GET) 
app.get('/api/EntidadReg', async (req, res) => {
    try {
      // Extraemos los parámetros de la query string (si no vienen, quedan null)
      const {
        id_entidadreguladora = null,
        ent_nombre             = null,
        ent_pais               = null
      } = req.query;
  
      // Conexión
      const pool = await sql.connect(dbConfig);
  
      // Llamada al SP con inputs tipados
      const result = await pool.request()
        .input('id_entidadreguladora', sql.Int,               id_entidadreguladora)
        .input('ent_nombre',             sql.NVarChar(150),   ent_nombre)
        .input('ent_pais',               sql.NVarChar(100),   ent_pais)
        .execute('sp_GetEntReguladora');
  
      // Devolvemos el recordset
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al ejecutar sp_GetEntReguladora:', err);
      res.status(500).send(err.message);
    }
  });

// Obtener Evento Adversos 
app.get('/api/EventosAdversos', async (req, res) => {
    try {
        // Tomamos de la query todos los parámetros (null si no vienen)
        const {
          id_evento         = null,
          tipo_evento       = null,
          ev_fecha_reporte  = null,
          gravedad          = null,
          id_ensayo         = null,
          med_nombre        = null,
          ens_fase          = null
        } = req.query;
    
        // Conexión al pool
        const pool = await sql.connect(dbConfig);
    
        // Llamada al SP con los inputs tipados
        const result = await pool.request()
          .input('id_evento',        sql.Int,            id_evento)
          .input('tipo_evento',      sql.NVarChar(100),  tipo_evento)
          .input('ev_fecha_reporte', sql.Date,           ev_fecha_reporte)
          .input('gravedad',         sql.NVarChar(50),   gravedad)
          .input('id_ensayo',        sql.Int,            id_ensayo)
          .input('med_nombre',       sql.NVarChar(100),  med_nombre)
          .input('ens_fase',         sql.NVarChar(50),   ens_fase)
          .execute('sp_getEvtEns');
    
        // Devolvemos el recordset al cliente
        res.json(result.recordset);
      } catch (err) {
        console.error('Error al ejecutar sp_getEvtEns:', err);
        res.status(500).send(err.message);
      }
    });



// Obtener Inspecciones
app.get('/api/Inspeccion', async (req, res) => {
    try {
      // Extraemos los parámetros de la query (null si no vienen)
      const {
        id_inspeccion         = null,
        med_nombre            = null,
        lot_fecha_fabricacion = null,
        lot_fecha_vencimiento = null,
        lot_estado            = null,
        ent_nombre            = null,
        pro_nombre            = null,
        ins_fecha             = null,
        ins_requisitos        = null,
        ins_observaciones     = null
      } = req.query;
  
      // Conexión al pool
      const pool = await sql.connect(dbConfig);
  
      // Llamada al SP con inputs tipados
      const result = await pool.request()
        .input('id_inspeccion',         sql.Int,              id_inspeccion)
        .input('med_nombre',            sql.NVarChar(100),    med_nombre)
        .input('lot_fecha_fabricacion', sql.Date,             lot_fecha_fabricacion)
        .input('lot_fecha_vencimiento', sql.Date,             lot_fecha_vencimiento)
        .input('lot_estado',            sql.Bit,              lot_estado)
        .input('ent_nombre',            sql.NVarChar(150),    ent_nombre)
        .input('pro_nombre',            sql.NVarChar(100),    pro_nombre)
        .input('ins_fecha',             sql.Date,             ins_fecha)
        .input('ins_requisitos',        sql.NVarChar(sql.MAX), ins_requisitos)
        .input('ins_observaciones',     sql.NVarChar(sql.MAX), ins_observaciones)
        .execute('sp_getInspec');
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al ejecutar sp_getInspec:', err);
      res.status(500).send(err.message);
    }
  });

// Obtener inspectores 
app.get('/api/Inspector', async (req, res) => {
    try {
      // Extraemos los parámetros de la query (si no vienen, quedan null)
      const {
        id_inspector     = null,
        ent_nombre       = null,
        inspec_nombre    = null,
        inspec_apellido  = null,
        inspec_estado    = null
      } = req.query;
  
      // Conexión al pool
      const pool = await sql.connect(dbConfig);
  
      // Llamada al SP con inputs tipados
      const result = await pool.request()
        .input('id_inspector',    sql.Int,             id_inspector)
        .input('ent_nombre',      sql.NVarChar(150),   ent_nombre)
        .input('inspec_nombre',   sql.NVarChar(100),   inspec_nombre)
        .input('inspec_apellido', sql.NVarChar(100),   inspec_apellido)
        .input('inspec_estado',   sql.Bit,             inspec_estado)
        .execute('sp_GetInspector');
  
      // Devolvemos los datos
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al ejecutar sp_GetInspector:', err);
      res.status(500).send(err.message);
    }
  });
  
  app.get('/api/MedFiltered', async (req, res) => {
  try {
    // Extraemos los parámetros de la query string (quedan null si no vienen)
    const {
      id_med            = null,
      pro_nombre        = null,
      tipom_nombre      = null,
      med_nombre        = null,
      med_descripcion   = null,
      med_estado        = null,
      med_controlado    = null,
      med_nivel_riesgos = null
    } = req.query;

    // Conexión al pool
    const pool = await sql.connect(dbConfig);

    // Llamada al SP con inputs tipados
    const result = await pool.request()
      .input('id_med',            sql.Int,              id_med)
      .input('pro_nombre',        sql.NVarChar(100),    pro_nombre)
      .input('tipom_nombre',      sql.NVarChar(100),    tipom_nombre)
      .input('med_nombre',        sql.NVarChar(100),    med_nombre)
      .input('med_descripcion',   sql.NVarChar(255),    med_descripcion)
      .input('med_estado',        sql.Bit,              med_estado)
      .input('med_controlado',    sql.Bit,              med_controlado)
      .input('med_nivel_riesgos', sql.VarChar(10),      med_nivel_riesgos)
      .execute('sp_GetMed');

    // Devolvemos el resultado
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al ejecutar sp_GetMed:', err);
    res.status(500).send(err.message);
  }
});

//Obtener lotes 
app.get('/api/LoteMed', async (req, res) => {
    try {
      // Destructuramos los parámetros de la query (null si no vienen)
      const {
        id_lote                   = null,
        med_nombre                = null,
        lot_fecha_fabricacion     = null,
        lot_fecha_vencimiento     = null,
        lot_cantidad_producida    = null,
        lot_estado                = null
      } = req.query;
  
      // Conexión al pool
      const pool = await sql.connect(dbConfig);
  
      // Llamada al SP con inputs tipados
      const result = await pool.request()
        .input('id_lote',                sql.Int,            id_lote)
        .input('med_nombre',             sql.NVarChar(100),  med_nombre)
        .input('lot_fecha_fabricacion',  sql.Date,           lot_fecha_fabricacion)
        .input('lot_fecha_vencimiento',  sql.Date,           lot_fecha_vencimiento)
        .input('lot_cantidad_producida', sql.Int,            lot_cantidad_producida)
        .input('lot_estado',             sql.Bit,            lot_estado)
        .execute('sp_getLotMed');
  
      // Devolvemos el resultado al cliente
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al ejecutar sp_getLotMed:', err);
      res.status(500).send(err.message);
    }
  });


// Obtener medicamentos
app.get('/api/Meds', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetMed');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Obtener proveedor de medicamentos
app.get('/api/Meds', async (req, res) => {
    try {
      // Extraemos los parámetros de la query string (quedan null si no vienen)
      const {
        id_med            = null,
        pro_nombre        = null,
        tipom_nombre      = null,
        med_nombre        = null,
        med_descripcion   = null,
        med_estado        = null,
        med_controlado    = null,
        med_nivel_riesgos = null
      } = req.query;
  
      // Conexión al pool
      const pool = await sql.connect(dbConfig);
  
      // Llamada al SP con inputs tipados
      const result = await pool.request()
        .input('id_med',            sql.Int,              id_med)
        .input('pro_nombre',        sql.NVarChar(100),    pro_nombre)
        .input('tipom_nombre',      sql.NVarChar(100),    tipom_nombre)
        .input('med_nombre',        sql.NVarChar(100),    med_nombre)
        .input('med_descripcion',   sql.NVarChar(255),    med_descripcion)
        .input('med_estado',        sql.Bit,              med_estado)
        .input('med_controlado',    sql.Bit,              med_controlado)
        .input('med_nivel_riesgos', sql.VarChar(10),      med_nivel_riesgos)
        .execute('sp_GetMed');
  
      // Devolvemos el resultado
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al ejecutar sp_GetMed:', err);
      res.status(500).send(err.message);
    }
  });

  // Obtener medicamentos por eventos
  app.get('/api/MedEvt', async (req, res) => {
    try {
      // Destructuramos los parámetros de la query (quedan null si no los envían)
      const {
        id_medicamento     = null,
        med_nombre         = null,
        id_evento          = null,
        ev_fecha_reporte   = null
      } = req.query;
  
      // Conexión al pool
      const pool = await sql.connect(dbConfig);
  
      // Llamada al SP con inputs tipados
      const result = await pool.request()
        .input('id_medicamento',   sql.Int,            id_medicamento)
        .input('med_nombre',       sql.NVarChar(100),  med_nombre)
        .input('id_evento',        sql.Int,            id_evento)
        .input('ev_fecha_reporte', sql.Date,           ev_fecha_reporte)
        .execute('sp_getMedEvt');
  
      // Enviamos el recordset al cliente
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al ejecutar sp_getMedEvt:', err);
      res.status(500).send(err.message);
    }
  });
//Obtener medicamentos por riesgo
  app.get('/api/MedRiesgo', async (req, res) => {
    try {
      // Extraemos parámetros de la query (null si no vienen)
      const {
        id_med_riesgo       = null,
        med_nivel_riesgos   = null
      } = req.query;
  
      // Conexión al pool
      const pool = await sql.connect(dbConfig);
  
      // Llamada al SP con inputs tipados
      const result = await pool.request()
        .input('id_med_riesgo',    sql.Int,           id_med_riesgo)
        .input('med_nivel_riesgos', sql.VarChar(10), med_nivel_riesgos)
        .execute('sp_getMedRiesgo');
  
      // Devolvemos el recordset
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al ejecutar sp_getMedRiesgo:', err);
      res.status(500).send(err.message);
    }
  });
  

// Obtener listado de proveedores
app.get('/api/Provd', async (req, res) => {
    try {
      const {
        id_proveedor   = null,
        pro_nombre     = null,
        pro_ubicacion  = null,
        pro_historial  = null,
        pro_estado     = null
      } = req.query;
  
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('id_proveedor',  sql.Int,             id_proveedor)
        .input('pro_nombre',    sql.NVarChar(100),   pro_nombre)
        .input('pro_ubicacion', sql.NVarChar(255),   pro_ubicacion)
        .input('pro_historial', sql.NVarChar(sql.MAX), pro_historial)
        .input('pro_estado',    sql.Bit,             pro_estado)
        .execute('sp_getProv');
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al ejecutar sp_getProv:', err);
      res.status(500).send(err.message);
    }
  });
  
  //
  // Tipos de Evento
  //
  app.get('/api/TipoEvento', async (req, res) => {
    try {
      const {
        id_tipo_evento     = null,
        nombre_evento      = null,
        descripcion_evento = null
      } = req.query;
  
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('id_tipo_evento',     sql.Int,           id_tipo_evento)
        .input('nombre_evento',      sql.NVarChar(100), nombre_evento)
        .input('descripcion_evento', sql.NVarChar(255), descripcion_evento)
        .execute('sp_getTipoEvt');
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al ejecutar sp_getTipoEvt:', err);
      res.status(500).send(err.message);
    }
  });
  
  //
  // Tipos de Medicamento
  //
  app.get('/api/TipoMedicamento', async (req, res) => {
    try {
      const {
        id_tipo_medicamento   = null,
        tipom_nombre          = null,
        tipom_descripcion     = null,
        tipom_estado          = null
      } = req.query;
  
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('id_tipo_medicamento', sql.Int,           id_tipo_medicamento)
        .input('tipom_nombre',        sql.NVarChar(100), tipom_nombre)
        .input('tipom_descripcion',   sql.NVarChar(255), tipom_descripcion)
        .input('tipom_estado',        sql.Bit,           tipom_estado)
        .execute('sp_getTipoMed');
  
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al ejecutar sp_getTipoMed:', err);
      res.status(500).send(err.message);
    }
  });

// Insertar Inspección (POST)
app.post('/api/Inspeccion', async (req, res) => {
    try {
        const { id_med, id_lote, id_proveedor, id_entidadreguladora, ins_fecha, ins_requisitos, ins_observaciones } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_med', sql.Int, id_med)
            .input('id_lote', sql.Int, id_lote)
            .input('id_proveedor', sql.Int, id_proveedor)
            .input('id_entidadreguladora', sql.Int, id_entidadreguladora)
            .input('ins_fecha', sql.Date, ins_fecha)
            .input('ins_requisitos', sql.Text, ins_requisitos)
            .input('ins_observaciones', sql.Text, ins_observaciones)
            .execute('sp_PostINS');
        res.json({ Message: 'Inspección inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Inspector (POST)
app.post('/api/Inspector', async (req, res) => {
    try {
        const { id_entidadreguladora, inspec_nombre, inspec_apellido, inspec_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_entidadreguladora', sql.Int, id_entidadreguladora)
            .input('inspec_nombre', sql.NVarChar, inspec_nombre)
            .input('inspec_apellido', sql.NVarChar, inspec_apellido)
            .input('inspec_estado', sql.Bit, inspec_estado)
            .execute('sp_PostInspector');
        res.json({ Message: 'Inspector inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Lote de Medicamento (POST)
app.post('/api/LoteMedicamento', async (req, res) => {
    try {
        const { id_med, lot_fecha_fabricacion, lot_fecha_vencimiento, lot_cantidad_producida, lot_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_med', sql.Int, id_med)
            .input('lot_fecha_fabricacion', sql.Date, lot_fecha_fabricacion)
            .input('lot_fecha_vencimiento', sql.Date, lot_fecha_vencimiento)
            .input('lot_cantidad_producida', sql.Int, lot_cantidad_producida)
            .input('lot_estado', sql.Bit, lot_estado)
            .execute('sp_PostLots');
        res.json({ Message: 'Lote de Medicamento inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Medicamento (POST)
app.post('/api/Medicamento', async (req, res) => {
    try {
        const { id_proveedor, id_tipo_medicamento, med_nombre, med_descripcion, med_nivel_riesgo, med_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_proveedor', sql.Int, id_proveedor)
            .input('id_tipo_medicamento', sql.Int, id_tipo_medicamento)
            .input('med_nombre', sql.NVarChar, med_nombre)
            .input('med_descripcion', sql.NVarChar, med_descripcion)
            .input('med_nivel_riesgo', sql.TinyInt, med_nivel_riesgo)
            .input('med_estado', sql.Bit, med_estado)
            .execute('sp_PostMed');
        res.json({ Message: 'Medicamento inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Proveedor (POST)
app.post('/api/Proveedor', async (req, res) => {
    try {
        const { pro_nombre, pro_ubicacion, pro_historial, pro_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('pro_nombre', sql.NVarChar, pro_nombre)
            .input('pro_ubicacion', sql.NVarChar, pro_ubicacion)
            .input('pro_historial', sql.Text, pro_historial)
            .input('pro_estado', sql.Bit, pro_estado)
            .execute('sp_PostProv');
        res.json({ Message: 'Proveedor inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Tipo Medicamento (POST)
app.post('/api/TipoMedicamento', async (req, res) => {
    try {
        const { tipom_nombre, tipom_descripcion, tipom_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('tipom_nombre', sql.NVarChar, tipom_nombre)
            .input('tipom_descripcion', sql.NVarChar, tipom_descripcion)
            .input('tipom_estado', sql.Bit, tipom_estado)
            .execute('sp_PostTpoMed');
        res.json({ Message: 'Tipo Medicamento inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Ensayo Clínico (SET)
app.post('/api/SetEnsayoClinicoEstado', async (req, res) => {
    try {
        const { idEnsayo, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idEnsayo', sql.Int, idEnsayo)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetEnsClcEST');
        res.json({ Message: 'Ensayo Clínico estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Entidad Reguladora (SET)
app.post('/api/SetEntidadReguladoraEstado', async (req, res) => {
    try {
        const { idEntidad, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idEntidad', sql.Int, idEntidad)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetEntReguladoraEST');
        res.json({ Message: 'Entidad Reguladora estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Inspector (SET)
app.post('/api/SetInspectorEstado', async (req, res) => {
    try {
        const { idInspector, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idInspector', sql.Int, idInspector)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetInsEST');
        res.json({ Message: 'Inspector estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Lote (SET)
app.post('/api/SetLoteEstado', async (req, res) => {
    try {
        const { idLote, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idLote', sql.Int, idLote)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetLotEST');
        res.json({ Message: 'Lote estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Medicamento (SET)
app.post('/api/SetMedicamentoEstado', async (req, res) => {
    try {
        const { idMedicamento, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idMedicamento', sql.Int, idMedicamento)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetMedEST');
        res.json({ Message: 'Medicamento estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Proveedor (SET)
app.post('/api/SetProveedorEstado', async (req, res) => {
    try {
        const { idProveedor, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idProveedor', sql.Int, idProveedor)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetProvEST');
        res.json({ Message: 'Proveedor estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Tipo Medicamento (SET)
app.post('/api/SetTipoMedicamentoEstado', async (req, res) => {
    try {
        const { idTipoMedicamento, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idTipoMedicamento', sql.Int, idTipoMedicamento)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetTipoMedEST');
        res.json({ Message: 'Tipo Medicamento estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});



app.post('/api/CreateUser', async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    try {
        const pool = await sql.connect(dbConfig);

        // Generar hash de la contraseña
        SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Llamar al Stored Procedure
        await pool.request()
            .input('Correo', sql.NVarChar, correo)
            .input('Password', sql.NVarChar, hashedPassword)
            .execute('sp_CREATEUSER');

        res.json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error registrando usuario" });
    }
});

app.post('/api/Login', async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    try {
        const pool = await sql.connect(dbConfig);

        // Llamar al Stored Procedure para obtener la contraseña hasheada
        const result = await pool.request()
            .input('Correo', sql.NVarChar, correo)
            .execute('sp_VALIDATEUSER');

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const hashedPassword = result.recordset[0].HashedPassword;

        // Comparar la contraseña ingresada con la hasheada
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        res.json({ message: "Login exitoso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en la autenticación" });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

