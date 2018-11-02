'use strict';
const Base64 = require( 'js-base64' ).Base64;
const crypto = require( 'crypto' );

module.exports = new class Helpers {
    getCurrentTimestamp() {
        return ( new Date() ).getTime();
    }

    isArray( object ) {
        return Object.prototype.toString.call( object ) === '[object Array]';
    }

    decodeBase64( text ) {
        return Base64.decode( text );
    }

    encodeBase64( text ) {
        return Base64.encode( text );
    }

    encrypt( text, secret ) {
        return crypto
            .createHmac( 'sha256', secret )
            .update( text )
            .digest( 'hex' );
    }

    extractIp( request ) {
        return request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
    }

    generateRandomString( max = 5, withNumbers ) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const possible = letters + ( withNumbers ? numbers : '' );
        let text = '';

        for ( let i = 0; i < max; i += 1 ) {
            text += possible.charAt( Math.floor( Math.random() * possible.length ) );
        }

        return text;
    }

    generatePasswordDecoded() {
        return this.generateRandomString( 2 ) + this.generateRandomString( 3, true );
    }

    encodePassword( passwordDecoded, salt ) {
        return this.encrypt( passwordDecoded, salt );
    }

    generatePassword() {
        const salt = this.generateRandomString( 5, true );
        const passwordDecoded = this.generatePasswordDecoded();
        const passwordEncoded = this.encodePassword( passwordDecoded, salt );

        return {
            passwordDecoded,
            passwordEncoded,
            salt
        };
    }

    parseEventBody( eventBody ) {
        let body = eventBody;

        if ( typeof body === 'string' ) {
            body = JSON.parse( body || '{}');
        }

        return body;
    }
}

