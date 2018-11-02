const moment = require('moment');
const CONFIG = require( '../config');
const helpers = require( '../helpers');

function generateToken( email, privileges, encryptedPasswordToCompare ) {
    const tokenDataStringified = JSON.stringify({
        email,
        authorization: helpers.encrypt( encryptedPasswordToCompare, CONFIG.APP_SALT ), //double encrypt
        privileges,
        expiration: moment().add( 5, 'minutes' ) //INCREASE
    });

    const token = helpers.encodeBase64( tokenDataStringified );

    return token;
}

function isPasswordCorrect( providedPassword, accountPassword, salt ) {
    return accountPassword === helpers.encrypt( providedPassword, salt );
}

module.exports = {
    generateToken,
    isPasswordCorrect
};