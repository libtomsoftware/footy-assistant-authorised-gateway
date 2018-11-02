const CONFIG = require('../../config'),
    FILE_ID = 'setup',
    ENV = process.env,
    dbAddress = ENV.MONGODB_ADDRESS,
    dbAddressTwo = ENV.MONGODB_ADDRESS_TWO,
    dbAddressThree = ENV.MONGODB_ADDRESS_THREE,
    dbName = ENV.MONGODB_NAME,
    dbUser = ENV.MONGODB_USER,
    dbPassword = ENV.MONGODB_PASSWORD,
    dbReplicaSet = ENV.MONGODB_REPLICA_SET;

module.exports = new class dBSetup {
    init(mongodb) {
        if (this.hasAllDbParams()) {
            this.setupDbDetails(mongodb);
            this.testDbConnection();
        } else {
            console.error(`[${FILE_ID}] Missing required DB params, aborting setup...`);
        }
    }

    setupDbDetails(mongodb) {
        let url = `mongodb://${dbUser}:${dbPassword}@${dbAddress}`;

        if ( dbAddressTwo ) {
            url += `,${dbAddressTwo}`;
        }

        if ( dbAddressThree ) {
            url += `,${dbAddressThree}`;
        }

        url += '?ssl=true';

        if ( dbReplicaSet ) {
            url += `&replicaSet=${dbReplicaSet}`;
        }

        CONFIG.DB = Object.assign({}, CONFIG.DB, {
            CLIENT: mongodb.MongoClient,
            //URL: `mongodb://${dbUser}:${dbPassword}@${dbAddress}`,
            URL: `${url}&authSource=admin&retryWrites=true`,
            NAME: dbName
        });
    }

    hasAllDbParams() {
        return [
            dbName,
            dbAddress,
            dbUser,
            dbPassword
        ].filter(entry => entry === undefined).length === 0;
    }

    testDbConnection() {
        console.log(`[${FILE_ID}] Attempting to establish connection with db ...`);

        CONFIG.DB.CLIENT.connect(`${CONFIG.DB.URL}/${CONFIG.DB.NAME}`, {
            useNewUrlParser: true
        }, (error, db) => {
            if (error) {
                console.error(`[${FILE_ID}] Database connection error: ${error}`);
                return;
            }

            console.info(`[${FILE_ID}] Connection with database established successfully.`);
            db.close();
        });
    }
}