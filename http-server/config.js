const ENV = process.env, //eslint-disable-line one-var
    ROOT_PATH = process.cwd(),
    PACKAGE_CONFIG = require(ROOT_PATH + '/package.json'),
    APP_HTTP_PORT = ENV.APP_HTTP_PORT || 5001,
    APP_URL = ENV.APP_IP || 'localhost',
    APP = {
        ADDRESS: {
            HTTP_PORT: APP_HTTP_PORT,
            URL: APP_URL
        },
        NAME: PACKAGE_CONFIG.name,
        TYPE: 'lambda'
    };

module.exports = {
    APP: Object.assign({}, APP, {
        ID: ENV.APP_ID || `${PACKAGE_CONFIG.name}@${APP.ADDRESS.URL}:${APP.ADDRESS.HTTP_PORT}`
    })
};
