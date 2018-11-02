'use strict';

const responder = require( '../../responder');
const resources = require( '../../resources');

module.exports = function remove ( event, callback ) {
    const { resource, club, id } = event.pathParameters;
    const origin = event.headers.origin;

    if ( !resource || !resources.includes( resource ) ) {
        responder.rejectBadRequest( origin, callback );
        return;
    }

    const handler = require( '../../resources/' + resource );

    if ( handler && handler.delete ) {
        console.log(`Incoming DELETE request from ${origin} to ${resource}, proceeding...`);
        handler.delete( origin, {
            resource,
            club,
            id
        }, callback );
    } else {
        console.log(`Resource ${resource} is not valid or does not support DELETE method, aborting...`);
        responder.rejectBadRequest( origin, callback );
    }
}