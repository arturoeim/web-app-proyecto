const pool = require('../database');

module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');

    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/profile');

    },

    async isAdmin(req, res, next) {
        var idusuario = req.user.ID;

        const datausuario = await pool.query("SELECT * FROM USUARIOS WHERE ID = ?", [idusuario]);

        if (datausuario[0].TIPO_USUARIO == "ADMIN") {
            return next();
        }

        req.flash('message', 'No tiene permisos para agregar usuarios');
        return res.redirect('/profile');

    },

    async isAdmitPersonal(req, res, next) {
        var idusuario = req.user.ID;

        const datausuario = await pool.query("SELECT * FROM USUARIOS WHERE ID = ?", [idusuario]);

        if ((datausuario[0].TIPO_USUARIO == "ADMIN") || (datausuario[0].TIPO_USUARIO == "TH")) {
            return next();
        }

        req.flash('message', 'No tiene permisos para esta opción');
        return res.redirect('/profile');

    },

    async isAdmitDocumentacion(req, res, next) {
        var idusuario = req.user.ID;

        const datausuario = await pool.query("SELECT * FROM USUARIOS WHERE ID = ?", [idusuario]);

        if ((datausuario[0].TIPO_USUARIO == "ADMIN") || (datausuario[0].TIPO_USUARIO == "TH") || (datausuario[0].TIPO_USUARIO == "FINANCIERO")) {
            return next();
        }

        req.flash('message', 'No tiene permisos para esta opción');
        return res.redirect('/profile');

    },

    async isAdmitCandidatos(req, res, next) {
        var idusuario = req.user.ID;

        const datausuario = await pool.query("SELECT * FROM USUARIOS WHERE ID = ?", [idusuario]);

        if ((datausuario[0].TIPO_USUARIO == "ADMIN") || (datausuario[0].TIPO_USUARIO == "TH") || (datausuario[0].TIPO_USUARIO == "GENERAL") || (datausuario[0].TIPO_USUARIO == "TABLETS")) {
            return next();
        }

        req.flash('message', 'No tiene permisos para esta opción');
        return res.redirect('/profile');

    }

};