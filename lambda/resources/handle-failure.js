const responder = require( '../responder');

module.exports = ( error, resource, origin, callback ) => {
    console.warn( `Resource ${resource} error`, error );
    responder.rejectBadRequest( origin, callback );
};