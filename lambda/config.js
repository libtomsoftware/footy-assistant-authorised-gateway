const helpers = require( './helpers');

module.exports = {
    APP_SALT: helpers.generateRandomString( 5, true ),
    CLUB: {
        ABBR: process.env.CLUB_ABBR,
        LOGO: process.env.CLUB_LOGO_URL,
        NAME: process.env.CLUB_NAME,
        EMAIL: process.env.CLUB_EMAIL
    },
    CONSTANTS: {
        HTTP_CODE: {
            OK: 200,
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            CONFLICT: 409,
            INTERNAL_SERVER_ERROR: 500,
            BAD_GATEWAY: 502
        }
    },
    UI_APP_URL: process.env.UI_APP_URL,
    URL: {
        FOOTY_LOGO: process.env.FOOTY_LOGO_URL
    }
}