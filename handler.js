'use strict';

require('./lambda/db');

const methods = {
    get: require('./lambda/methods/get'),
    delete: require('./lambda/methods/delete'),
    post: require('./lambda/methods/post'),
    put: require('./lambda/methods/put')
};

module.exports.get = function ( event, context, callback ) {
    methods.get( event, callback );
};

module.exports.post = function ( event, context, callback ) {
    methods.post( event, callback );
};

module.exports.put = function ( event, context, callback ) {
    methods.put( event, callback );
};

module.exports.delete = function ( event, context, callback ) {
    methods.delete( event, callback );
};

process.on('uncaughtException', function ( err ) {
    console.log( 'Uncaught exception detected: ' + err );
});