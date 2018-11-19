const CONFIG = require('./config');
const STATUS_CODE = CONFIG.CONSTANTS.HTTP_CODE;
const allowedOrigins = [
    'http://footy.local:3000',
    'http://localhost:3000',
    'http://localhost:3001'
];

function addHeaders( response, origin ) {
    response.headers = {
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-footy-token',
        'Access-Control-Allow-Credentials': 'true'
    };

    if ( allowedOrigins.includes( origin ) ) {
        console.error(`Origin ${origin} allowed, adding Access-Control-Allow-Origin to response headers...`);
        response.headers = Object.assign( {}, response.headers, {
            'Access-Control-Allow-Origin': origin
        });
    } else {
        console.error(`Origin ${origin} not allowed, hence Access-Control-Allow-Origin not added to response headers...`);
    }
}

class Responder {

    rejectUnauthorized( origin, callback ) {
        const response = {
            statusCode: STATUS_CODE.UNAUTHORIZED,
            body: JSON.stringify({
                error: 'Unauthorized'
            })
        };

        addHeaders( response, origin );

        callback( null, response );
    }

    rejectBadGateway( origin, callback ) {
        const response = {
            statusCode: STATUS_CODE.BAD_GATEWAY,
            body: JSON.stringify({
                error: 'Bad gateway'
            })
        };

        addHeaders( response, origin );

        callback( null, response );
    }

    rejectConflict( origin, callback ) {
        const response = {
            statusCode: STATUS_CODE.CONFLICT,
            body: JSON.stringify({
                error: 'conflict'
            })
        };

        addHeaders( response, origin );

        callback( null, response );
    }

    rejectNotFound( origin, callback ) {
        const response = {
            statusCode: STATUS_CODE.NOT_FOUND,
            body: JSON.stringify({
                error: 'Not found'
            })
        };

        addHeaders( response, origin );

        callback( null, response );
    }

    rejectBadRequest( origin, callback ) {
        const response = {
            statusCode: STATUS_CODE.BAD_REQUEST,
            body: JSON.stringify({
                error: 'Bad request'
            })
        };

        addHeaders( response, origin );

        callback( null, response );
    }

    reject( origin, callback, statusCode ) {
        const response = {
            statusCode
        };

        addHeaders( response, origin );

        callback( null, response );
    }

    send( origin, callback, data, statusCode ) {
        const response = {
            statusCode: statusCode || 200,
            body: JSON.stringify( data )
        }

        addHeaders( response, origin );

        callback( null, response );
    }
}

module.exports = new Responder();