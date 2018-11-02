const http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('./cors'),
    app = express(),
    CONFIG = require('./config'),
    handler = require('../handler'),
    FILE_ID = 'http-server';

function getCallback( response ) {
    return ( error, result ) => {
        if ( error ) {
            console.error('[lambda error]', error);
            response.status( 400 );

            return response.send( error );
        }

        response.status( result.statusCode );
        response.send( result.body );
    }
}

function rejectBadRequest( request, response ) {
    const callback = getCallback( response );

    callback({
        statusText: 'Bad request'
    });
}

function handleGetRequest( request, response ) {
    const callback = getCallback( response );
    const messageBody = {
        headers: request.headers,
        body: request.body
    };

    if ( request.query ) {
        messageBody.queryStringParameters = request.query;
    }

    if ( request.params ) {
        messageBody.pathParameters = request.params;
    }

    handler.get( messageBody, {}, callback );
}

function handlePostRequest( request, response ) {
    const callback = getCallback( response );
    const messageBody = {
        headers: request.headers,
        body: request.body
    };

    if ( request.query ) {
        messageBody.queryStringParameters = request.query;
    }

    if ( request.params ) {
        messageBody.pathParameters = request.params;
    }

    handler.post( messageBody, {}, callback );
}

function handleDeleteRequest( request, response ) {
    const callback = getCallback( response );
    const messageBody = {
        headers: request.headers,
        body: request.body
    };

    if ( request.query ) {
        messageBody.queryStringParameters = request.query;
    }

    if ( request.params ) {
        messageBody.pathParameters = request.params;
    }

    handler.delete( messageBody, {}, callback );
}

function handlePutRequest( request, response ) {
    const callback = getCallback( response );
    const messageBody = {
        headers: request.headers,
        body: request.body
    };

    if ( request.query ) {
        messageBody.queryStringParameters = request.query;
    }

    if ( request.params ) {
        messageBody.pathParameters = request.params;
    }

    handler.put( messageBody, {}, callback );
}

function setupHandlers() {
    app.use(cors);

    app.get('/gateway/:resource', handleGetRequest);
    app.get('/gateway/:resource/:club/:id', handleGetRequest);

    app.put('/gateway/:resource', handlePutRequest);
    app.put('/gateway/:resource/:club/:id', handlePutRequest);

    app.post('/gateway/:resource/:club', handlePostRequest);
    app.post('/gateway/:resource/:club/:id', handlePostRequest);

    app.delete('/gateway/:resource/:club/:id', handleDeleteRequest);
    //app.post('/gateway/:resource/:id', handlePostRequest);
    app.all('/*', rejectBadRequest);
}

module.exports = new class HttpServer {
    boot() {
        console.log(`[${FILE_ID}] Booting ${CONFIG.APP.NAME}...`);

        const server = http.createServer(app),
            port = CONFIG.APP.ADDRESS.HTTP_PORT;

        app.use( bodyParser.json() );
        app.use( bodyParser.urlencoded({
            extended: false
        }));

        setupHandlers();

        server.listen(port, () => {
            console.log(`[${FILE_ID}] ${CONFIG.APP.NAME} running http server on port ${port}`);
        });
    }
}

