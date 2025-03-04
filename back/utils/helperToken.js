class HelperToken {

    static validToken = function (JWTDate, last) {
        console.log(JWTDate);
        console.log((last));
        console.log(JWTDate > last);
        return JWTDate > last;
    };
}

module.exports = HelperToken;