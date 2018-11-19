'use strict';

const helpers = require( '../../helpers');
const responder = require( '../../responder');
const resources = require( '../../resources');
const auth = require('../../auth');

module.exports = function post ( event, callback ) {
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

            if ( handler && handler.post ) {
                console.log(`Incoming POST request from ${origin} to ${resource}, proceeding...`);
                handler.post( origin, useragent, {
                    resource,
                    club,
                    id,
                    data: helpers.parseEventBody( event.body )
                }, callback );
            } else {
                console.log(`Resource ${resource} is not valid or does not support POST method, aborting...`);
                responder.rejectBadRequest( origin, callback );
            }
        })
        .catch( error => {
            console.warn('Request unauthorised, aborting... Details:', error);
            responder.rejectUnauthorized( origin, callback );
            return;
        });
}