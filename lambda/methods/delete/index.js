'use strict';

const responder = require( '../../responder');
const resources = require( '../../resources');
const auth = require('../../auth');

module.exports = function remove ( event, callback ) {
    const { resource, club, id } = event.pathParameters;
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

            if ( handler && handler.delete ) {
                console.log(`Incoming DELETE request from ${origin} to ${resource}, proceeding...`);
                handler.delete( origin, useragent, {
                    resource,
                    club,
                    id
                }, callback );
            } else {
                console.log(`Resource ${resource} is not valid or does not support DELETE method, aborting...`);
                responder.rejectBadRequest( origin, callback );
            }

        })
        .catch( () => {
            responder.rejectUnauthorized( origin, callback );
            return;
        });
}