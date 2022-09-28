const bcrypt = require('bcryptjs');
const hbs = require('handlebars');

const helpers = {};

helpers.encryptPassword = async(CONTRASENA) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(CONTRASENA, salt);
    return hash;
};

helpers.matchPassword = async(CONTRASENA, savedPassword) => {
    try {
        return await bcrypt.compare(CONTRASENA, savedPassword);
    } catch (e) {
        console.log(e);
    }
};

hbs.registerHelper('isAdmin', (a, opts) => {
    return a == "ADMIN" ? opts.fn(this) : opts.inverse(this);
});

module.exports = helpers;