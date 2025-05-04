

exports.checkRoleMW = (...roles) => {
    return async (req, res, next) => {
        try {
            //   console.log(req.role);
            
            if (!roles.includes(req.role)) {
                return res.status(401).json({
                    message: "Tu ne peux pas faire ça !!!",
                });
            }

            next();
        } catch (error) {
            res.status(400).json({
                message: "fail",
                err: error,
            });
        }
    };
};