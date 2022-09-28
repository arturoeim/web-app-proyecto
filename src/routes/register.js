const express = require('express');
const router = express.Router();
const pool = require('../database');
const path = require('path');
const { isLoggedIn, isAdmitPersonal, isAdmitDocumentacion, isAdmitCandidatos } = require('../lib/auth');

router.get('/add', async(req, res) => {

    const provincias = await pool.query("SELECT * FROM PROVINCIAS");
    res.render('register/add', { provincias });
});

router.post('/add', async(req, res) => {
    const { nombre1, nombre2, apellido1, apellido2, cedula, provincia, canton, parroquia, domicilio, celular, telefono, correopersonal, disponibilidad, sexo } = req.body;

    const newPostulante = {
        NOMBRE1: nombre1,
        NOMBRE2: nombre2,
        APELLIDO1: apellido1,
        APELLIDO2: apellido2,
        CEDULA: cedula,
        SEXO: sexo,
        PROVINCIA_DOMI: provincia,
        CANTON_DOMI: canton,
        PARROQUIA_DOMI: parroquia,
        DIRECCION: domicilio,
        CELULAR: celular,
        TELEFONO_FIJO: telefono,
        CORREO_PERSONAL: correopersonal,
        DISPONIBLE: disponibilidad
    };

    
    const confirmacion1 = await pool.query("SELECT * FROM FORMULARIO1 WHERE CEDULA = '" + newPostulante.CEDULA + "'");
            if (confirmacion1.length > 0) {
                req.flash('message', 'El postulante ya se había registrado anteriormente. A continuación complete sus datos generales!');
                res.redirect('/');
            } else {
                await pool.query("INSERT INTO FORMULARIO1 set ?", [newPostulante]);
                req.flash('success', 'Postulación realizada correctamente. A continuación complete sus datos generales!');
                res.redirect('/');
            };        
      

  


});

router.get('/add2', async(req, res) => {

    const provincias = await pool.query("SELECT * FROM PROVINCIAS");
    const titulossup = await pool.query("SELECT * FROM TITULOS_SUPERIOR");

    res.render('register/add2', { provincias, titulossup });
});

router.post('/add2', async(req, res) => {
    var { cedula, experiencia, tiempoexpe, provinciaexpe, titulobachiller, titulosuperior, idioma1, idioma2, idioma3, vacunaantite, vacunafiebreama, vacunafiebretifo, vacunacovid1, vacunacovid2, fechaultimadosis, fechanacimiento } = req.body;
    var destitulosup;
    const codigotitulosup = titulosuperior;
    if (codigotitulosup.length > 0) {
        try {
            const titulo_rec = await pool.query("SELECT * FROM TITULOS_SUPERIOR WHERE COD_TITULO = ?", [codigotitulosup]);
            destitulosup = titulo_rec[0].DES_TITULO;
        } catch (error) {
            destitulosup = "";
        }

    } else {
        destitulosup = "";
    }
    if (experiencia == "0") {
        tiempoexpe = "";
        provinciaexpe = "";
    };

    const newPostulante = {
        CEDULA: cedula,
        FECHA_NACIMIENTO: fechanacimiento,
        EXPE_LEVANTAMIENTO: experiencia,
        TIEMPO_EXPERIENCIA: tiempoexpe,
        PROVINCIA_EXPERIENCIA: provinciaexpe,
        TITULO_BACHILLER: titulobachiller,
        COD_TITULO_SUPERIOR: codigotitulosup,
        DES_TITULO_SUPERIOR: destitulosup,
        IDIOMA1: idioma1,
        IDIOMA2: idioma2,
        IDIOMA3: idioma3,
        VAC_ANTITETACNICA: vacunaantite,
        VAC_FIEBREAMARILLA: vacunafiebreama,
        VAC_ANTIDF: vacunafiebretifo,
        VAC_COVID1: vacunacovid1,
        VAC_COVID2: vacunacovid2,
        FECHA_ULTIMA_DOSIS: fechaultimadosis,

    };
    const confirmacion1 = await pool.query("SELECT * FROM FORMULARIO2 WHERE CEDULA = '" + newPostulante.CEDULA + "'");
    if (confirmacion1.length > 0) {
        req.flash('message', 'Este postulante ya tiene datos generales registrados');
        res.redirect('/');
    } else {
        await pool.query("INSERT INTO FORMULARIO2 set ?", [newPostulante]);
        if (newPostulante.EXPE_LEVANTAMIENTO == "1") {
            var mensaje = "Usted ha postulado para el cargo de Supervisor de Campo!"
        } else {
            var mensaje = "Usted ha postulado para el cargo de Encuestador!"
        }
        req.flash('success', 'Datos generales ingresados correctamente. ' + mensaje);
        res.redirect('/');
    };

});



router.get('/list', isLoggedIn, isAdmitPersonal, async(req, res) => {
    const formularios = await pool.query("SELECT *, (SELECT DES_PROVINCIA FROM PROVINCIAS WHERE PROVINCIAS.COD_PROVINCIA = FORMULARIO1.PROVINCIA_DOMI) AS PROVINCIA_DOMICILIO, " +
        "(SELECT DES_CANTON FROM CANTONES WHERE CANTONES.COD_CANTON = FORMULARIO1.CANTON_DOMI) AS CANTON_DOMICILIO, (SELECT DES_TITULO FROM TITULOS_SUPERIOR WHERE TITULOS_SUPERIOR.COD_TITULO = FORMULARIO1.TITULO_SUPERIOR) AS DES_TITULO FROM FORMULARIO1");
    res.render('registerpersonal/list', { formularios });

});



module.exports = router;