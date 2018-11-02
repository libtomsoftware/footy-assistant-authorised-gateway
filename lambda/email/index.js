const fileId = '[email]',
    emailjs = require('emailjs'),
    emailServer = emailjs.server.connect({
        user: process.env.FOOTY_EMAIL_SERVER_USER,
        password: process.env.FOOTY_EMAIL_SERVER_PASSWORD,
        host: process.env.FOOTY_EMAIL_SERVER_HOST,
        ssl: false
    });

function emailCallback( error ) {
    if ( error ) {
        let reason;

        switch ( error.code ) {
        case 4:
            reason = 'Timeout';
            break;
        default:
            reason = 'Unknown.';
            break;
        }

        console.log(fileId, 'An attempt to send email failed. Reason:', reason );
    } else {
        console.log(fileId, 'Email sent.');
    }
}

function sendEmail( params ) {
    const emailData = {
        from: params.from || process.env.FOOTY_NOREPLY_EMAIL_ADDRESS || 'No sender details',
        to: params.to || process.env.DEFAULT_EMAIL_VALUES_TO,
        cc: params.cc || process.env.DEFAULT_EMAIL_VALUES_CC || null,
        subject: params.subject || process.env.DEFAULT_EMAIL_VALUES_SUBJECT || 'No subject',
        text: params.message || process.env.DEFAULT_EMAIL_VALUES_MESSAGE || 'No message',
        attachment: params.attachment || null
    };

    try {
        emailServer.send( emailData, emailCallback );
    } catch ( error ) {
        console.error( 'Email error details:', error );
    }
}

exports.send = function send ( params ) {
    sendEmail( params );
    console.log( fileId, 'Email request has been processed.' );
};

