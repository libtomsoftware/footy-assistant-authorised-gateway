const dbFind = require('../../db/operations/find');
const dbSave = require('../../db/operations/save');
const validator = require( '../../validator');
const responder = require( '../../responder');
const handleFailure = require( '../handle-failure');

function isValidData( body ) {
    const data = body.data;
    const hasRequiredValues = !!body.club &&
        !!body.id &&
        !!data &&
        !!data._id &&
        !!data.firstname &&
        !!data.lastname &&
        !!data.email;

    function checkPhone() {
        let result = true;

        if ( data.phone ) {
            result = validator.isValidPhone( data.phone );
        }

        return result;
    }

    return hasRequiredValues &&
        validator.isAlphabeticOnly( data.firstname ) &&
        validator.isAlphabeticOnly( data.lastname ) &&
        checkPhone() &&
        validator.isValidEmail( data.email );
}

module.exports = function update( origin, useragent, body, callback ) {

    console.log(`Attempting account update for ${body.id}...`);

    if ( !isValidData( body ) ) {
        console.error('Data provided is invalid, aborting...');
        responder.rejectBadRequest( origin, callback );
        return;
    }

    function updateAccount( accounts ) {
        const existingAccount = accounts.find( account => account._id === body.id );

        if ( !accounts.length || !existingAccount ) {
            responder.rejectNotFound( origin, callback );
            return;
        }

        dbSave(
            `${body.club}_accounts`,
            Object.assign( {}, existingAccount, body.data ),
            status => {
                if ( status === 200 ) {
                    console.log(`${existingAccount.email} account updated, proceeding...`);
                    responder.send( origin, callback, {
                        statusText: 'Success! Your account details have been updated!'
                    });
                } else {
                    responder.reject( origin, callback, {
                        status
                    });
                }
            }
        );
    }

    dbFind( `${body.club}_accounts`, null, ( error, accounts ) => {
        if ( error ) {
            handleFailure( error, 'password', origin, callback );
            return;
        };

        updateAccount( accounts );
    });

};