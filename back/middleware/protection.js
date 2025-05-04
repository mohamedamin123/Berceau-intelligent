
const { firestoreDb } = require("../config/firebaseConfig");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const usersCollection = firestoreDb.collection("users");
const HelperToken = require("../utils/helperToken");

exports.protectionMW = async (req, res, next) => {
    try {
        let token;
        // 1) bech nthabat ken el user 3andou token or not
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                message: "Vous n'êtes pas connecté !!!",
            });
        }
        // 2) bech nchouf si el token is valid or not
        const verifiedToken = await promisify(jwt.verify)(
            token,
            process.env.SECRET_KEY
        );
        // console.log(verifiedToken);
        // 3) bech nchouf si el user moula el token still exist or not
        const user = await usersCollection.doc(verifiedToken.id).get();
        if (!user) {
            return res.status(404).json({
                message: "Cet utilisateur n'existe plus !!!",
            });
        }
        // 4) si el token tsan3et 9bal ou bien ba3d last password update
        if (!HelperToken.validToken(verifiedToken.iat, user.data().last_password_update._seconds)) {
            return res.status(401).json({
                message: "Ce jeton n'est plus valide !!!",
            });
        }
        req.role = user.data().role;
        return next();
    } catch (error) {
        console.error("Middleware Error:", error);
        res.status(400).json({
            message: "Fail !!!",
            error: error.message || error,
        });

    }
};