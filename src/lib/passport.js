const passpoort = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passpoort.use('local.signin', new LocalStrategy({
    usernameField: 'CEDULA',
    passwordField: 'CONTRASENA',
    passReqToCallback: true

}, async(req, CEDULA, CONTRASENA, done) => {
    const rows = await pool.query('SELECT * FROM USUARIOS WHERE CEDULA_USER = ?', [CEDULA]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(CONTRASENA, user.CONTRASENA);
        if (validPassword) {
            done(null, user, req.flash('success', 'Welcome ' + user.NOMBRES));
        } else {
            done(null, false, req.flash('message', 'Incorrect password'));
        }
    } else {
        return done(null, false, req.flash('message', 'The User doesn`t exists'));
    }
}));

passpoort.use('local.signup', new LocalStrategy({
    usernameField: 'CEDULA',
    passwordField: 'CONTRASENA',
    passReqToCallback: true
}, async(req, CEDULA, CONTRASENA, done) => {
    const { NOMBRE1, NOMBRE2, APELLIDO1, APELLIDO2, CORREO, TIPO } = req.body;
    const newUser = {
        NOMBRES: NOMBRE1 + ' ' + NOMBRE2,
        APELLIDOS: APELLIDO1 + ' ' + APELLIDO2,
        CEDULA_USER: CEDULA,
        CORREO,
        CONTRASENA,
        TIPO_USUARIO: TIPO
    };
    newUser.CONTRASENA = await helpers.encryptPassword(CONTRASENA);
    await pool.query('INSERT INTO USUARIOS SET ?', [newUser]);

    return done(null, false, req.flash('success', 'Usuario agregado correctamente'));
}));


passpoort.serializeUser((user, done) => {
    done(null, user.ID);
});

passpoort.deserializeUser(async(ID, done) => {
    const rows = await pool.query('SELECT * FROM USUARIOS WHERE ID = ?', [ID]);
    done(null, rows[0]);
});