const helpers = require( '../helpers');

function createAccountIndex( email ) {
    return email.replace(/\@/g,'-at-').replace(/\./g,'-')
}

function determineDefaultPrivileges( type ) {
    const privileges = {
        superadmin: 1,
        admin: 2,
        club: 3,
        manager: 4,
        player: 5
    };

    return privileges[ type.toLowerCase() ];
}

function generatePassword( salt ) {
    const passwordDecoded = helpers.generateRandomString( 2 ) + helpers.generateRandomString( 3, true );
    const passwordEncoded = helpers.encodeBase64( passwordDecoded, salt );

    return passwordEncoded;
}

module.exports = class AccountModel {
    constructor( data = {}, type ) {
        const index = data.index || createAccountIndex( data.email ).toLowerCase();
        const _id = data._id || helpers.generateRandomString( 3 ) + helpers.getCurrentTimestamp() + helpers.generateRandomString( 3 );
        const privileges = data.privileges || determineDefaultPrivileges( type );
        const salt = data.salt || helpers.generateRandomString( 5, true );
        const password = data.password || generatePassword( salt );
        const registrationTime = data.registrationTime || ( new Date() ).getTime();

        this._id = _id;
        this.index = index;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.dob = data.dob;
        this.privileges = privileges;
        this.phone = data.phone;
        this.email = data.email.toLowerCase();
        this.password = password;
        this.notes = data.notes;
        this.club = data.club || {};
        this.lastSuccessfulLogin = data.lastSuccessfulLogin || null;
        this.salt = salt;
        this.registrationTime = registrationTime;
        this.membership = data.membership || {
            active: false
        };

        this.loginAttempts = data.loginAttempts || {
            successful: 'unknown',
            failed: 0
        };

    }
}