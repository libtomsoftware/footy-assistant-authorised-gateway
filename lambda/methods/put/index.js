'use strict';

const helpers = require( '../../helpers');
const responder = require( '../../responder');
const resources = require( '../../resources');
const auth = require('../../auth');

module.exports = function put ( event, callback ) {
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

            if ( handler && handler.put ) {
                console.log(`Incoming PUT request from ${origin} to ${resource}, proceeding...`);
                handler.put( origin, useragent, {
                    resource,
                    data: helpers.parseEventBody( event.body )
                }, callback );
            } else {
                console.log(`Resource ${resource} is not valid or does not support PUT method, aborting...`);
                responder.rejectBadRequest( origin, callback );
            }

        })
        .catch( () => {
            responder.rejectUnauthorized( origin, callback );
            return;
        });
}