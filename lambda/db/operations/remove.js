const CONFIG = require('../../config'),
    STATUS_CODE = CONFIG.CONSTANTS.HTTP_CODE;

function onDelete( error, resCallback ) {
    if ( error ) {
        resCallback( STATUS_CODE.INTERNAL_SERVER_ERROR );
        return;
    }

    resCallback( STATUS_CODE.OK );
}

function onConnect( error, client, collectionId, query, resCallback ) {
    if ( error ) {
        resCallback( STATUS_CODE.INTERNAL_SERVER_ERROR );
        return;
    }

    if (query) {
        const db = client.db( CONFIG.DB.NAME );
        const collection = db.collection( collectionId );

        collection.deleteOne(query, () => {
            onDelete( error, resCallback );
        });

        client.close();
        return;
    }

    resCallback( STATUS_CODE.BAD_REQUEST );
}

module.exports = function( collectionId, query, resCallback ) {
    CONFIG.DB.CLIENT.connect(
        `${CONFIG.DB.URL}/${CONFIG.DB.NAME}`,
        {
            useNewUrlParser: true
        },
        (error, client) => {
            onConnect( error, client, collectionId, query, resCallback );
        }
    );
};