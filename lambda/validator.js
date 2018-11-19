'use strict';

const REGEX = {
    ALPHABETIC_ONLY: /^[a-zA-Z]+$/i,
    ALPHANUMERIC_ONLY: /^[a-z0-9]+$/i,
    ANY_NUMBERS: /\d/,
    NUMBERS_ONLY: /^\d+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    VALID_EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

module.exports = new class Validator {

    isValidEmail( email ) {
        return REGEX.VALID_EMAIL.test( String( email ).toLowerCase() ) && email.length < 255;
    }

    isValidPhone(phone) {
        return REGEX.NUMBERS_ONLY.test(String(phone).toLowerCase());
    }

    isLongEnough( string, minChars = 2 ) {
        return string && string.length >= minChars;
    }

    isAlphabeticOnly( text ) {
        return REGEX.ALPHABETIC_ONLY.test( text );
    }

    isAlphaNumericOnly( string ) {
        return REGEX.ALPHANUMERIC_ONLY.test( string );
    }

    hasAnyNumbers( string ) {
        return REGEX.ANY_NUMBERS.test( string );
    }

    isPasswordCompliantWithRules( string ) {
        return REGEX.PASSWORD.test( string );
    }

}