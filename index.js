//Second Branch

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
};

// Obtener medicamentos con sus fases (GET)
app.get('/api/MedEnsayo', async(req, res) => {
    try {
        // Conexión a la base de datos
        const pool = await sql.connect(dbConfig);
        // Ejecución de la consulta almacenada sp_obtener_listado_medicamentos en la base de datos
        const result = await pool.request().execute('sp_GetEnsayosXMed');
        // Envío de la respuesta en formato JSON
        res.json(result.recordset);

    } catch (err) {
        // En caso de error, se envía un mensaje con el error
        res.status(500).send(err.message);
    }
});

// Obtener entidad reguladora (GET)
app.get('/api/EntidadReg', async(req, res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetEntReguladora');
        res.json(result.recordset);

    }catch(err){
        res.status(500).send(err.message);
    }
});

// Obtener Evento Adversos por Medicamentos
app.get('/api/EvenAdvMed', async(req, res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetEvAdversXMed');
        res.json(result.recordset);
    } catch (err){
        res.status(500).send(err.message);
    }
});

// Obtener inspector por entidad reguladora
app.get('/api/InspcEntd', async(res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetInsXEntReguladora');
        res.json(result.recordset);
    } catch(err){
        res.status(500).send(err.message);
    }

});

// Obtener medicamentos por inspeccion
app.get('/api/MedInsp', async(res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetInsXMed');
        res.json(result.recordset);

    } catch(err){
        res.status(500).send(err.message);
    }
});

// Obtener medicamentos por lotes
app.get('/api/LoteMed', async(res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const  result = await pool.request().execute('sp_GetLotsXMed');
        res.json(result.recordset);
    } catch (err){
        res.status(500).send(err.message);
    }
});

// Obtener medicacmentos
app.get('/api/Meds', async(res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetMed');
        res.json(result.recordset);
    } catch (err){
        res.status(500).send(err.message);
    }
});

// Obtener proveedor de medicamentos
app.get('/api/MedsProv', async(res) =>{
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetMedXProv');
        res.json(result.recordset);
    } catch(err){
        res.status(500).send(err.message);
    }
});

// Obtener listado de proveedores
app.get('/api/Provd', async(res) =>{
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetProv');
        res.json(result.recordset);
    } catch(err){
        res.status(500).send(err.message);
    }
});

// Insertar un Ensayo Clínico (POST)
app.post('/api/EnsayoClinico', async (req, res) => {
    try {
        const { id_med, ens_fase, ens_poblacion_objetivo, ens_eficacia_observada, ens_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_med', sql.Int, id_med)
            .input('ens_fase', sql.NVarChar, ens_fase)
            .input('ens_poblacion_objetivo', sql.NVarChar, ens_poblacion_objetivo)
            .input('ens_eficacia_observada', sql.Decimal(5, 2), ens_eficacia_observada)
            .input('ens_estado', sql.Bit, ens_estado)
            .execute('sp_PostEnsayoClinico');
        res.json({ NewEnsayoClinicoID: result.recordset[0].NewEnsayoClinicoID });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar una Entidad Reguladora (POST)
app.post('/api/EntidadReguladora', async (req, res) => {
    try {
        const { ent_nombre, ent_pais, ent_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('ent_nombre', sql.NVarChar, ent_nombre)
            .input('ent_pais', sql.NVarChar, ent_pais)
            .input('ent_estado', sql.NVarChar, ent_estado)
            .execute('sp_PostEntidadReguladora');
        res.json({ NewEntidadReguladoraID: result.recordset[0].NewEntidadReguladoraID });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Evento-Ensayo (POST)
app.post('/api/EventoEnsayo', async (req, res) => {
    try {
        const { id_evento, id_ensayo } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_evento', sql.Int, id_evento)
            .input('id_ensayo', sql.Int, id_ensayo)
            .execute('sp_PostEvento_Ensayo');
        res.json({ Message: result.recordset[0].Message });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Obtener listado de Ensayo Clínico (GET)
app.get('/api/EnsayoClinico', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetEnsayoClinico');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Obtener listado de Entidad Reguladora (GET)
app.get('/api/EntidadReguladora', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetEntidadReguladora');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Obtener listado de Evento-Ensayo (GET)
app.get('/api/EventoEnsayo', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetEvento_Ensayo');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Obtener listado de Eventos Adversos (GET)
app.get('/api/EventosAdversos', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetEventos_Adversos');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Evento Adverso (POST)
app.post('/api/EventosAdversos', async (req, res) => {
    try {
        const { id_tipo_evento, ev_fecha_reporte, ev_gravedad, ev_resultado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_tipo_evento', sql.Int, id_tipo_evento)
            .input('ev_fecha_reporte', sql.Date, ev_fecha_reporte)
            .input('ev_gravedad', sql.TinyInt, ev_gravedad)
            .input('ev_resultado', sql.Text, ev_resultado)
            .execute('sp_PostEventos_Adversos');
        res.json({ NewEventosAdversosID: result.recordset[0].NewEventosAdversosID });
    } catch (err) {
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
            .execute('sp_PostInspeccion');
        res.json({ NewInspeccionID: result.recordset[0].NewInspeccionID });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Inspección Inspectores (POST)
app.post('/api/InspeccionInspectores', async (req, res) => {
    try {
        const { id_inspeccion, id_inspector } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_inspeccion', sql.Int, id_inspeccion)
            .input('id_inspector', sql.Int, id_inspector)
            .execute('sp_PostInspeccion_Inspectores');
        res.json({ Message: result.recordset[0].Message });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Inspector (POST)
app.post('/api/Inspectores', async (req, res) => {
    try {
        const { id_entidadreguladora, inspec_nombre, inspec_apellido, inspec_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_entidadreguladora', sql.Int, id_entidadreguladora)
            .input('inspec_nombre', sql.NVarChar, inspec_nombre)
            .input('inspec_apellido', sql.NVarChar, inspec_apellido)
            .input('inspec_estado', sql.Bit, inspec_estado)
            .execute('sp_PostInspectores');
        res.json({ NewInspectorID: result.recordset[0].NewInspectorID });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Lote Medicamento (POST)
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
            .execute('sp_PostLoteMedicamento');
        res.json({ NewLoteMedicamentoID: result.recordset[0].NewLoteMedicamentoID });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Medicamento (POST)
app.post('/api/Medicamentos', async (req, res) => {
    try {
        const { id_tipo_medicamento, med_nombre, med_descripcion, med_nivel_riesgo, med_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_tipo_medicamento', sql.Int, id_tipo_medicamento)
            .input('med_nombre', sql.NVarChar, med_nombre)
            .input('med_descripcion', sql.NVarChar, med_descripcion)
            .input('med_nivel_riesgo', sql.TinyInt, med_nivel_riesgo)
            .input('med_estado', sql.Bit, med_estado)
            .execute('sp_PostMedicamentos');
        res.json({ NewMedicamentoID: result.recordset[0].NewMedicamentoID });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Medicamento Evento (POST)
app.post('/api/MedicamentosEvento', async (req, res) => {
    try {
        const { id_medicamento, id_evento } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_medicamento', sql.Int, id_medicamento)
            .input('id_evento', sql.Int, id_evento)
            .execute('sp_Postmedicamentos_evento');
        res.json({ Message: result.recordset[0].Message });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Proveedor (POST)
app.post('/api/Proveedores', async (req, res) => {
    try {
        const { pro_nombre, pro_ubicacion, pro_historial } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('pro_nombre', sql.NVarChar, pro_nombre)
            .input('pro_ubicacion', sql.NVarChar, pro_ubicacion)
            .input('pro_historial', sql.Text, pro_historial)
            .execute('sp_PostProveedores');
        res.json({ NewProveedorID: result.recordset[0].NewProveedorID });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Tipo Evento (POST)
app.post('/api/TipoEvento', async (req, res) => {
    try {
        const { nombre_evento, descripcion_evento } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('nombre_evento', sql.NVarChar, nombre_evento)
            .input('descripcion_evento', sql.NVarChar, descripcion_evento)
            .execute('sp_Posttipo_evento');
        res.json({ NewTipoEventoID: result.recordset[0].NewTipoEventoID });
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
            .execute('sp_Posttipo_medicamento');
        res.json({ NewTipoMedicamentoID: result.recordset[0].NewTipoMedicamentoID });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Ensayo Clínico (POST)
app.post('/api/EnsayoClinico', async (req, res) => {
    try {
        const { id_med, ens_fase, ens_poblacion_objetivo, ens_eficacia_observada, ens_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_med', sql.Int, id_med)
            .input('ens_fase', sql.NVarChar, ens_fase)
            .input('ens_poblacion_objetivo', sql.NVarChar, ens_poblacion_objetivo)
            .input('ens_eficacia_observada', sql.Decimal(5, 2), ens_eficacia_observada)
            .input('ens_estado', sql.Bit, ens_estado)
            .execute('sp_PostEnsClc');
        res.json({ Message: 'Ensayo Clínico inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Entidad Reguladora (POST)
app.post('/api/EntidadReguladora', async (req, res) => {
    try {
        const { ent_nombre, ent_pais, ent_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('ent_nombre', sql.NVarChar, ent_nombre)
            .input('ent_pais', sql.NVarChar, ent_pais)
            .input('ent_estado', sql.Bit, ent_estado)
            .execute('sp_PostEnt');
        res.json({ Message: 'Entidad Reguladora inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Evento Adverso (POST)
app.post('/api/EventosAdversos', async (req, res) => {
    try {
        const { id_tipo_evento, ev_fecha_reporte, id_gravedad, ev_resultado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_tipo_evento', sql.Int, id_tipo_evento)
            .input('ev_fecha_reporte', sql.Date, ev_fecha_reporte)
            .input('id_gravedad', sql.Int, id_gravedad)
            .input('ev_resultado', sql.Text, ev_resultado)
            .execute('sp_PostEvenAd');
        res.json({ Message: 'Evento Adverso inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Gravedad (POST)
app.post('/api/Gravedad', async (req, res) => {
    try {
        const { Nombre, Descripcion, Nivel } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('Nombre', sql.NVarChar, Nombre)
            .input('Descripcion', sql.NVarChar, Descripcion)
            .input('Nivel', sql.TinyInt, Nivel)
            .execute('sp_PostGRA');
        res.json({ Message: 'Gravedad inserted successfully' });
    } catch (err) {
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

// Cambiar estado de Ensayo Clínico (POST)
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

// Cambiar estado de Entidad Reguladora (POST)
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

// Cambiar estado de Inspector (POST)
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

// Cambiar estado de Lote (POST)
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

// Cambiar estado de Medicamento (POST)
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

// Cambiar estado de Proveedor (POST)
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

// Cambiar estado de Tipo Medicamento (POST)
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

