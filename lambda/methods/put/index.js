'use strict';

const helpers = require( '../../helpers');
const responder = require( '../../responder');
const resources = require( '../../resources');

module.exports = function put ( event, callback ) {
    const resource = event.pathParameters.resource;
    const origin = event.headers.origin;

    if ( !resource || !resources.includes( resource ) ) {
        responder.rejectBadRequest( origin, callback );
        return;
    }

    const handler = require( '../../resources/' + resource );

    if ( handler && handler.put ) {
        console.log(`Incoming PUT request from ${origin} to ${resource}, proceeding...`);
        handler.put( origin, {
            resource,
            data: helpers.parseEventBody( event.body )
        }, callback );
    } else {
        console.log(`Resource ${resource} is not valid or does not support PUT method, aborting...`);
        responder.rejectBadRequest( origin, callback );
    }
}