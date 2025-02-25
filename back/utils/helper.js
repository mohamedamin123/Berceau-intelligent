const bcrypt = require("bcryptjs");

class HelperPassword {

    static checkPassword(pass) {
        return pass > 8;
    }

    static async comparePasswords(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    

}