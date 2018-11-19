const fs = require( 'fs' );
const path = require( 'path' );
const dbFind = require('../../db/operations/find');
const dbSave = require('../../db/operations/save');
const email = require( '../../email');
const validator = require( '../../validator');
const responder = require( '../../responder');
const handleFailure = require( '../handle-failure');
const CONFIG = require( '../../config');
const helpers = require( '../../helpers');

function isValidData( body ) {
    return body.club &&
        body.id &&
        body.data &&
        body.data.password && validator.isPasswordCompliantWithRules( body.data.password ) &&
        body.data.passwordPrevious;
}

function sendConfirmationEmail( account, passwordDecoded ) {
    const headerTemplatePath = path.resolve(__dirname, '../../email/templates/header.html');
    const mainTemplatePath = path.resolve(__dirname, '../../email/templates/password-change.html');
    const footerTemplatePath = path.resolve(__dirname, '../../email/templates/footer.html');

    fs.readFile( headerTemplatePath, 'utf8', function( headerError, headerData ) {

        if ( headerError ) {
            console.error( 'Error while reading header template:', headerError );
            return;
        }

        headerData = headerData.replace( '[[CLUB_LOGO]]', account.club.logo || CONFIG.URL.FOOTY_LOGO );
        headerData = headerData.replace( '[[CLUB_NAME]]', account.club.name );

        fs.readFile( footerTemplatePath, 'utf8', function( footerError, footerData ) {

            if ( footerError ) {
                console.error( 'Error while reading footer template:', footerError );
                return;
            }

            footerData = footerData.replace( '[[EMAIL_FROM]]', process.env.FOOTY_NOREPLY_EMAIL_ADDRESS );
            footerData = footerData.replace( '[[EMAIL_TO]]', account.email );

            fs.readFile( mainTemplatePath, 'utf8', function( error, data ) {

                if ( error ) {
                    console.error( 'Error while reading footer template:', error );
                    return;
                }

                data = data.replace( '[[CLUB_NAME]]', account.club.name );
                data = data.replace( '[[ACCOUNT_FIRSTNAME]]', account.firstname );
                data = data.replace( '[[ACCOUNT_LASTNAME]]', account.lastname );
                data = data.replace( '[[ACCOUNT_PASSWORD]]', passwordDecoded );

                email.send( {
                    to: account.email,
                    subject: `${account.club.abbreviation || account.firstname}: Footy Assistant Account - password reset!`,
                    text: 'Footy Assistant Account - password reset',
                    attachment:
                    [
                        {
                            data: headerData + data + footerData,
                            alternative: true
                        }
                    ]
                });
            });
        });
    });
}

module.exports = function update( origin, useragent, body, callback ) {

    body.id = decodeURIComponent( body.id );

    console.log(`Attempting password change for ${body.id}...`);

    if ( !isValidData( body ) ) {
        responder.rejectBadRequest( origin, callback );
        return;
    }

    function handleSuccess( account, passwordDecoded ) {
        responder.send( origin, callback, {
            statusText: 'Success! Your password has been changed!'
        });

        sendConfirmationEmail( account, passwordDecoded );
    }

    function updatePassword( accounts ) {
        const existingAccount = accounts.find( account => account._id === body.id );

        if ( !accounts.length || !existingAccount ) {
            responder.rejectNotFound( origin, callback );
            return;
        }

        const passwordPreviousEncoded = helpers.encodePassword( body.data.passwordPrevious, existingAccount.salt );

        if ( passwordPreviousEncoded !== existingAccount.password ) {
            responder.send( origin, callback, {
                statusText: 'The previous password provided is not valid!'
            }, 401);
            return;
        }

        const newPasswordEncoded = helpers.encodePassword( body.data.password, existingAccount.salt );

        if ( passwordPreviousEncoded === newPasswordEncoded ) {
            responder.send( origin, callback, {
                statusText: 'You cannot change password to the existing one!'
            }, 400);
            return;
        }

        existingAccount.password = newPasswordEncoded;

        dbSave(
            `${body.club}_accounts`,
            existingAccount,
            status => {
                if ( status === 200 ) {
                    console.log(`${existingAccount.email} account loaded, proceeding...`);
                    handleSuccess( existingAccount, body.data.password );
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

        updatePassword( accounts );
    });

};