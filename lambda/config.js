module.exports = {
    CRYPTO_KEY: process.env.CRYPTO_KEY,
    CRYPTO_VECTOR: process.env.CRYPTO_VECTOR,
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