const moment = require('moment');
const CONFIG = require( '../config');
const helpers = require( '../helpers');
const dbFind = require('../db/operations/find');

function generateToken( email, clubId ) {
    const tokenData = {
        clubId,
        noise: helpers.generateRandomString( 5, true )
    };

    const token = {
        email,
        expiration: moment().add( 5, 'minutes' ),
        authorisation: helpers.encryptWithCipher( JSON.stringify( tokenData ) )
    };

    const tokenStringified = JSON.stringify( token );

    return helpers.encodeBase64( tokenStringified );
}

function isPasswordCorrect( providedPassword, accountPassword, salt ) {
    return accountPassword === helpers.encrypt( providedPassword, salt );
}

function isAuthorised( token ) {
    return new Promise( ( resolve, reject ) => {
        if ( !token ) {
            reject( 'no access token has been provided' );
            return;
        }

        const tokenDecoded = helpers.decodeBase64( token );
        const tokenParsed = JSON.parse( tokenDecoded );
        const email = tokenParsed.email;
        const expiration = tokenParsed.expiration;

        if ( moment().diff( expiration, 'seconds') > 1 ) {
            reject( 'access token has expired' );
            return;
        }

        const authorisation = helpers.decryptWithDecipher( tokenParsed.authorisation );

        const { clubId } = JSON.parse( authorisation );

        if ( !email || !clubId ) {
            reject( 'provided access token is not valid' );
            return;
        }

        dbFind( `${clubId}_accounts`, {
            email
        }, ( error, accounts ) => {
            if ( error ) {
                reject( 'error during account look up' );
                return;
            };

            const account = accounts.find( item => item.email === email );

            if ( !account || !account.token ) {
                reject( 'account does not exist or has no access token assigned' );
                return;
            }

            if ( account.token !== token ) {
                reject( 'provided access token is not valid' );
                return;
            }

            resolve( true );
        });
    });
}

module.exports = {
    generateToken,
    isPasswordCorrect,
    isAuthorised
};