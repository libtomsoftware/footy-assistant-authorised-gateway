'use strict';

const responder = require( '../../responder');
const resources = require( '../../resources');
const auth = require('../../auth');

module.exports = function get ( event, callback ) {
    const resource = event.pathParameters.resource;
    const origin = event.headers.origin;
    const token = event.headers['x-footy-token'];
    const useragent = event.headers['user-agent'];

    if ( !resource || !resources.includes( resource ) ) {
        responder.rejectBadRequest( origin, callback );
        return;
    }

    auth.isAuthorised( token )
        .then( isAuthorised => {
            if ( !isAuthorised ) {
                responder.rejectUnauthorized( origin, callback );
                return;
            }

            const handler = require( '../../resources/' + resource );

            if ( handler && handler.get ) {
                console.log(`Incoming GET request from ${origin} to ${resource}, proceeding...`);
                handler.get( origin, useragent, {
                    resource
                }, callback );
            } else {
                console.log(`Resource ${resource} is not valid or does not support GET method, aborting...`);
                responder.rejectBadRequest( origin, callback );
            }

        })
        .catch( () => {
            responder.rejectUnauthorized( origin, callback );
            return;
        });
}