module.exports = function (request, response, next) {
    const origin = request.headers.origin;
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://footy.local:3000'
    ]

    if ( allowedOrigins.includes(origin) ) {
        response.header('Access-Control-Allow-Origin', origin);
    }

    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    response.header('Access-Control-Allow-Credentials', 'true');

    if (request.method.toLowerCase() === 'options') {
        response.sendStatus(200);
    } else {
        next();
    }
};